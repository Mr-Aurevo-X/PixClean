"""MetaStrip — nettoyeur de métadonnées d'images (100 % local).

© 2026 Mr-Aurevo-X · MetaStrip · 100% local · free · updates not guaranteed
All rights reserved. Redistribution / reverse engineering without written consent forbidden.

Drag-drop ou sélection d'images (JPEG/PNG/WebP), détection EXIF/GPS, puis
suppression des métadonnées avec sauvegarde d'une copie *_clean (l'original
n'est jamais modifié). Pillow, 100 % hors-ligne.
"""
# © 2026 Mr-Aurevo-X · MetaStrip · 100% local · free · updates not guaranteed
from __future__ import annotations

import base64
import io
import json
import os
import sys
import uuid
from pathlib import Path
from typing import Any

from PIL import Image, ImageOps

import webview

_HOST_DIR = Path(__file__).resolve().parent
if str(_HOST_DIR) not in sys.path:
    sys.path.insert(0, str(_HOST_DIR))

import updater as app_updater
from window_chrome import WindowChromeMixin, create_tool_window

DEFAULT_ACCENT = "#14b8a6"
ENV_ACCENT = "MRAUREVOX_ACCENT"
ENV_LANG = "MRAUREVOX_LANG"

# EXIF IFD tag for GPS block.
GPS_IFD = 0x8825

SUPPORTED_EXT = {".jpg", ".jpeg", ".png", ".webp"}
FILE_TYPES = ("Images (*.jpg;*.jpeg;*.png;*.webp)", "Tous les fichiers (*.*)")


def _local_appdata() -> Path:
    local = os.environ.get("LOCALAPPDATA") or str(Path.home() / "AppData" / "Local")
    return Path(local) / "Mr-Aurevo-X"


def _read_suite_setting(key: str) -> str | None:
    path = _local_appdata() / "user-settings.json"
    if path.is_file():
        try:
            loaded = json.loads(path.read_text(encoding="utf-8-sig"))
            val = str((loaded or {}).get(key) or "").strip()
            return val or None
        except (OSError, json.JSONDecodeError, TypeError):
            pass
    return None


def resolve_suite_accent(default: str = DEFAULT_ACCENT) -> str:
    env = (os.environ.get(ENV_ACCENT) or "").strip()
    if env.startswith("#") and len(env) in (4, 7):
        return env
    val = _read_suite_setting("accent")
    if val and val.startswith("#") and len(val) in (4, 7):
        return val
    return default


def resolve_suite_language(default: str = "fr") -> str:
    env = (os.environ.get(ENV_LANG) or "").strip().lower()
    if env in ("fr", "en"):
        return env
    val = (_read_suite_setting("language") or "").lower()
    return val if val in ("fr", "en") else default


def resolve_suite_theme(default: str = "dark") -> str:
    val = (_read_suite_setting("theme") or "").lower()
    return val if val in ("dark", "light") else default


def app_dir() -> Path:
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parent.parent


def ui_dir() -> Path:
    external = app_dir() / "ui"
    if (external / "index.html").is_file():
        return external
    if getattr(sys, "frozen", False):
        base = Path(getattr(sys, "_MEIPASS", app_dir()))
        nested = base / "ui"
        return nested if nested.is_dir() else base
    return app_dir() / "ui"


def _downloads_dir() -> Path:
    d = Path.home() / "Downloads"
    return d if d.is_dir() else Path.home()


def _human_size(num: int) -> str:
    size = float(num)
    for unit in ("o", "Ko", "Mo", "Go"):
        if size < 1024 or unit == "Go":
            if unit == "o":
                return f"{int(size)} {unit}"
            return f"{size:.1f} {unit}"
        size /= 1024
    return f"{num} o"


def _fmt_for_ext(suffix: str) -> str:
    s = suffix.lower()
    if s in (".jpg", ".jpeg"):
        return "JPEG"
    if s == ".png":
        return "PNG"
    if s == ".webp":
        return "WEBP"
    return ""


def _has_gps(exif) -> bool:
    try:
        gps = exif.get_ifd(GPS_IFD)
        return bool(gps)
    except Exception:  # noqa: BLE001
        try:
            return GPS_IFD in exif
        except Exception:  # noqa: BLE001
            return False


def _meta_report(im: Image.Image) -> dict[str, Any]:
    """Summarize metadata presence without leaking values."""
    exif_count = 0
    has_gps = False
    try:
        exif = im.getexif()
        exif_count = len(exif)
        has_gps = _has_gps(exif)
    except Exception:  # noqa: BLE001
        exif = None

    info = im.info or {}
    has_exif_bytes = bool(info.get("exif"))
    has_xmp = bool(info.get("xmp") or info.get("XML:com.adobe.xmp"))
    has_icc = bool(info.get("icc_profile"))
    # Standard container / rendering fields that carry no identifying metadata.
    _harmless = {
        "exif", "xmp", "XML:com.adobe.xmp", "icc_profile",
        "dpi", "transparency", "background", "gamma", "srgb",
        "aspect", "pixel_aspect", "chromaticity",
        "jfif", "jfif_version", "jfif_unit", "jfif_density",
        "progression", "progressive", "adobe", "adobe_transform",
        "bits", "compression", "loop", "duration", "version",
    }
    # PNG/text chunks, comments, author, etc. — the identifying leftovers.
    text_keys = [k for k in info.keys() if k not in _harmless]
    has_text = bool(text_keys)

    has_exif = bool(exif_count) or has_exif_bytes
    total = (
        exif_count
        + (1 if has_exif_bytes and not exif_count else 0)
        + (1 if has_xmp else 0)
        + len(text_keys)
    )
    return {
        "hasExif": has_exif,
        "hasGps": has_gps,
        "hasXmp": has_xmp,
        "hasIcc": has_icc,
        "hasText": has_text,
        "exifCount": exif_count,
        "metaCount": total,
        "hasAny": has_exif or has_gps or has_xmp or has_text,
    }


def _thumb_b64(im: Image.Image, box: int = 240) -> str:
    try:
        thumb = ImageOps.exif_transpose(im).copy()
    except Exception:  # noqa: BLE001
        thumb = im.copy()
    thumb.thumbnail((box, box))
    if thumb.mode not in ("RGB", "RGBA"):
        thumb = thumb.convert("RGBA")
    buf = io.BytesIO()
    thumb.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


def _analyze_path(path: Path) -> dict[str, Any]:
    try:
        size_bytes = path.stat().st_size
    except OSError:
        size_bytes = 0
    with Image.open(path) as im:
        im.load()
        fmt = im.format or _fmt_for_ext(path.suffix)
        w, h = im.size
        report = _meta_report(im)
        thumb = _thumb_b64(im)
    item = {
        "ok": True,
        "name": path.name,
        "path": str(path),
        "format": fmt,
        "width": w,
        "height": h,
        "sizeBytes": size_bytes,
        "sizeText": _human_size(size_bytes),
        "thumb": thumb,
    }
    item.update(report)
    return item


def _unique_out(path: Path) -> Path:
    """`photo.jpg` -> `photo_clean.jpg`, avoiding overwrite of any existing file."""
    base = path.with_name(f"{path.stem}_clean{path.suffix}")
    if not base.exists():
        return base
    i = 2
    while True:
        cand = path.with_name(f"{path.stem}_clean_{i}{path.suffix}")
        if not cand.exists():
            return cand
        i += 1


def _strip_path(path: Path, out_dir: Path | None = None) -> dict[str, Any]:
    with Image.open(path) as im:
        im.load()
        fmt = (im.format or _fmt_for_ext(path.suffix) or "").upper()
        before = _meta_report(im)

        # Rebuild a brand-new image from raw pixels: a fresh Image carries no
        # EXIF/GPS/XMP/text metadata whatsoever (proven more reliable than
        # clearing .info, which can leave a cached EXIF block on JPEG).
        source = im
        if im.mode == "P":
            source = im.convert("RGBA" if "transparency" in im.info else "RGB")
        clean = Image.new(source.mode, source.size)
        clean.putdata(list(source.getdata()))

        target_dir = out_dir if out_dir else path.parent
        target_dir.mkdir(parents=True, exist_ok=True)
        out = _unique_out(target_dir / path.name)

        save_kwargs: dict[str, Any] = {}
        if fmt == "JPEG":
            save_kwargs = {"quality": 95, "optimize": True}
            if clean.mode not in ("RGB", "L", "CMYK"):
                clean = clean.convert("RGB")
        elif fmt == "PNG":
            save_kwargs = {"optimize": True}
        elif fmt == "WEBP":
            save_kwargs = {"quality": 95, "method": 6}
        clean.save(out, format=fmt or None, **save_kwargs)

    try:
        after_bytes = out.stat().st_size
    except OSError:
        after_bytes = 0
    with Image.open(out) as verify:
        verify.load()
        after = _meta_report(verify)

    return {
        "ok": True,
        "source": str(path),
        "outPath": str(out),
        "outName": out.name,
        "outDir": str(out.parent),
        "removedExif": bool(before.get("hasExif")),
        "removedGps": bool(before.get("hasGps")),
        "removedXmp": bool(before.get("hasXmp")),
        "beforeMeta": before.get("metaCount", 0),
        "afterMeta": after.get("metaCount", 0),
        "afterHasAny": after.get("hasAny", False),
        "sizeBytes": after_bytes,
        "sizeText": _human_size(after_bytes),
    }


class Api(WindowChromeMixin):
    """JS bridge — © 2026 Mr-Aurevo-X · MetaStrip · all rights reserved."""

    def __init__(self) -> None:
        self._window = None
        self._maximized = False
        # Temp files created from drag-drop bytes (cleaned up on clear/exit).
        self._temp_files: dict[str, Path] = {}

    def set_window(self, window) -> None:
        WindowChromeMixin.set_window(self, window)

    # ---- suite settings / updates -------------------------------------

    def get_suite_settings(self) -> dict:
        return {
            "ok": True,
            "accent": resolve_suite_accent(),
            "language": resolve_suite_language(),
            "theme": resolve_suite_theme(),
        }

    def get_suite_accent(self) -> dict:
        return {"ok": True, "accent": resolve_suite_accent()}

    def get_suite_language(self) -> dict:
        return {"ok": True, "language": resolve_suite_language()}

    def get_suite_theme(self) -> dict:
        return {"ok": True, "theme": resolve_suite_theme()}

    def get_version(self) -> dict:
        return {
            "ok": True,
            "version": app_updater.read_local_version(),
            "repo": app_updater.RELEASE_REPO,
        }

    def check_for_update(self) -> dict:
        return app_updater.check_for_update()

    def apply_update(self) -> dict:
        return app_updater.apply_update()

    def dismiss_update(self, version: str | None = None) -> dict:
        return app_updater.dismiss_update(version)

    def set_auto_update(self, enabled: bool = False) -> dict:
        return app_updater.set_auto_update(bool(enabled))

    # ---- core: pick / analyze / strip ---------------------------------

    def pick_images(self) -> dict:
        """Open a native multi-select dialog and analyze each image."""
        try:
            paths = None
            if self._window is not None:
                paths = self._window.create_file_dialog(
                    webview.OPEN_DIALOG,
                    allow_multiple=True,
                    directory=str(Path.home() / "Pictures")
                    if (Path.home() / "Pictures").is_dir()
                    else str(Path.home()),
                    file_types=FILE_TYPES,
                )
            if not paths:
                return {"ok": False, "error": "cancelled", "items": []}
            if isinstance(paths, str):
                paths = [paths]
            return {"ok": True, "items": self._analyze_many(paths)}
        except Exception as exc:  # noqa: BLE001
            return {"ok": False, "error": str(exc), "items": []}

    def analyze_paths(self, paths: list[str] | None = None) -> dict:
        return {"ok": True, "items": self._analyze_many(paths or [])}

    def add_dropped(self, name: str, data_url: str) -> dict:
        """Accept a file dropped in the UI (base64) → temp file → analyze.

        Cleaned copies for dropped files are written to the Downloads folder.
        """
        try:
            raw = (data_url or "").split(",", 1)[-1]
            blob = base64.b64decode(raw)
            suffix = Path(name or "image").suffix.lower()
            if suffix not in SUPPORTED_EXT:
                return {"ok": False, "error": "unsupported", "name": name}
            token = uuid.uuid4().hex
            tmp = Path(_local_appdata()) / "MetaStrip-tmp"
            tmp.mkdir(parents=True, exist_ok=True)
            tmp_path = tmp / f"{token}{suffix}"
            tmp_path.write_bytes(blob)
            self._temp_files[str(tmp_path)] = tmp_path
            item = _analyze_path(tmp_path)
            # Preserve the friendly name and mark as dropped (out -> Downloads).
            item["name"] = name or tmp_path.name
            item["dropped"] = True
            return {"ok": True, "item": item}
        except Exception as exc:  # noqa: BLE001
            return {"ok": False, "error": str(exc), "name": name}

    def strip(self, paths: list[str] | None = None) -> dict:
        """Strip metadata from each path, writing *_clean copies."""
        results: list[dict] = []
        for p in paths or []:
            src = Path(p)
            if not src.is_file():
                results.append({"ok": False, "source": p, "error": "not_found"})
                continue
            out_dir = None
            # Dropped temp files are saved into Downloads with their real name.
            if str(src) in self._temp_files:
                out_dir = _downloads_dir()
            try:
                res = _strip_path(src, out_dir=out_dir)
                results.append(res)
            except Exception as exc:  # noqa: BLE001
                results.append({"ok": False, "source": p, "error": str(exc)})
        ok_count = sum(1 for r in results if r.get("ok"))
        return {"ok": True, "results": results, "cleaned": ok_count}

    def reveal(self, path: str) -> dict:
        """Open the containing folder and select the file in Explorer."""
        try:
            target = Path(path)
            if target.exists():
                os.startfile(str(target.parent))  # noqa: S606
                return {"ok": True}
            return {"ok": False, "error": "not_found"}
        except Exception as exc:  # noqa: BLE001
            return {"ok": False, "error": str(exc)}

    def clear_temp(self) -> dict:
        for p in list(self._temp_files.values()):
            try:
                p.unlink(missing_ok=True)
            except OSError:
                pass
        self._temp_files.clear()
        return {"ok": True}

    def copy_text(self, text: str) -> dict:
        text = text if isinstance(text, str) else str(text or "")
        try:
            import tkinter as tk

            root = tk.Tk()
            root.withdraw()
            root.clipboard_clear()
            root.clipboard_append(text)
            root.update()
            root.destroy()
            return {"ok": True}
        except Exception as exc:  # noqa: BLE001
            return {"ok": False, "error": str(exc)}

    # ---- helpers ------------------------------------------------------

    def _analyze_many(self, paths: list[str]) -> list[dict]:
        items: list[dict] = []
        for p in paths:
            try:
                path = Path(p)
                if path.suffix.lower() not in SUPPORTED_EXT:
                    items.append({"ok": False, "name": path.name, "path": p,
                                  "error": "unsupported"})
                    continue
                items.append(_analyze_path(path))
            except Exception as exc:  # noqa: BLE001
                items.append({"ok": False, "name": Path(p).name, "path": p,
                              "error": str(exc)})
        return items


def main() -> None:
    # © 2026 Mr-Aurevo-X · MetaStrip · windowed host entry
    ui = ui_dir()
    index = ui / "index.html"
    if not index.is_file():
        raise SystemExit(f"UI missing: {index}")
    api = Api()
    create_tool_window(
        title="MetaStrip — Mr-Aurevo-X",
        url=index.as_uri(),
        js_api=api,
        width=1120,
        height=800,
        min_size=(940, 640),
        background_color="#0b0b0d",
    )
    webview.start()


if __name__ == "__main__":
    # © 2026 Mr-Aurevo-X · MetaStrip · 100% local · free · updates not guaranteed
    main()
