"""PixClean — nettoyeur de métadonnées d'images (100 % local).

© 2026 Mr-Aurevo-X · PixClean · 100% local · free · updates not guaranteed
All rights reserved. Redistribution / reverse engineering without written consent forbidden.

Drag-drop ou sélection d'images (JPEG/PNG/WebP), détection EXIF/GPS, puis
suppression des métadonnées avec sauvegarde d'une copie *_clean (l'original
n'est jamais modifié). Pillow, 100 % hors-ligne.
"""
# © 2026 Mr-Aurevo-X · PixClean · 100% local · free · updates not guaranteed
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
from PIL.ExifTags import GPSTAGS, TAGS
from PIL.PngImagePlugin import PngInfo

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
# EXIF sub-IFD pointer (camera / capture settings).
EXIF_IFD = 0x8769

# Editable EXIF tags (base IFD).
TAG_IMAGE_DESCRIPTION = 0x010E
TAG_SOFTWARE = 0x0131
TAG_DATETIME = 0x0132
TAG_ARTIST = 0x013B
TAG_COPYRIGHT = 0x8298

# EXIF sub-IFD capture date (read-only fallback for the editable "date").
EXIF_DATETIME_ORIGINAL = 0x9003
EXIF_DATETIME_DIGITIZED = 0x9004

# GPS sub-tags.
GPS_VERSION_ID = 0
GPS_LAT_REF = 1
GPS_LAT = 2
GPS_LON_REF = 3
GPS_LON = 4
GPS_ALT_REF = 5
GPS_ALT = 6

# PNG text keys we treat as the editable equivalents of the EXIF fields.
PNG_TEXT_KEYS = {
    "artist": ("Artist", "Author"),
    "copyright": ("Copyright",),
    "description": ("Description", "Comment"),
    "software": ("Software",),
}

SUPPORTED_EXT = {".jpg", ".jpeg", ".png", ".webp"}
FILE_TYPES = ("Images (*.jpg;*.jpeg;*.png;*.webp)", "Tous les fichiers (*.*)")

# Short French description shown under each metadata group heading.
GROUP_INFO = {
    "EXIF": "Informations techniques inscrites par l'appareil ou le logiciel.",
    "GPS": "Localisation géographique de la prise de vue.",
    "XMP": "Métadonnées étendues (Adobe / IPTC) : titre, mots-clés, droits…",
    "Texte / commentaires": "Champs texte libres intégrés dans le fichier.",
    "ICC": "Profil colorimétrique intégré à l'image.",
}

# Per-tag French label + one-line explanation. Keyed by the Pillow tag name.
TAG_INFO: dict[str, tuple[str, str]] = {
    # Base / identity
    "Artist": ("Auteur / Artiste", "Personne créditée comme auteur de l'image."),
    "Copyright": ("Copyright", "Mention de droits d'auteur sur l'image."),
    "ImageDescription": ("Description", "Légende ou description de l'image."),
    "Software": ("Logiciel", "Appareil ou logiciel ayant produit / édité l'image."),
    "DateTime": ("Date de modification", "Date/heure de dernière modification du fichier."),
    "DateTimeOriginal": ("Date de prise de vue", "Date/heure à laquelle la photo a été prise."),
    "DateTimeDigitized": ("Date de numérisation", "Date/heure de numérisation de l'image."),
    "Make": ("Marque de l'appareil", "Fabricant de l'appareil photo."),
    "Model": ("Modèle de l'appareil", "Modèle de l'appareil photo."),
    "LensModel": ("Objectif", "Modèle de l'objectif utilisé."),
    "HostComputer": ("Ordinateur", "Machine ayant traité l'image."),
    "Orientation": ("Orientation", "Sens dans lequel l'image doit être affichée."),
    # Capture settings
    "ExposureTime": ("Temps d'exposition", "Durée d'ouverture de l'obturateur."),
    "FNumber": ("Ouverture (f/)", "Ouverture du diaphragme."),
    "ISOSpeedRatings": ("Sensibilité ISO", "Sensibilité du capteur."),
    "PhotographicSensitivity": ("Sensibilité ISO", "Sensibilité du capteur."),
    "FocalLength": ("Distance focale", "Focale de l'objectif (en mm)."),
    "FocalLengthIn35mmFilm": ("Focale équiv. 35 mm", "Focale ramenée au format 35 mm."),
    "Flash": ("Flash", "État du flash lors de la prise de vue."),
    "ExposureProgram": ("Programme d'exposition", "Mode d'exposition de l'appareil."),
    "MeteringMode": ("Mesure de lumière", "Méthode de mesure de la lumière."),
    "WhiteBalance": ("Balance des blancs", "Réglage de la balance des blancs."),
    "ExposureBiasValue": ("Correction d'expo.", "Correction d'exposition appliquée."),
    # Rendering / resolution
    "XResolution": ("Résolution X", "Densité de points horizontale."),
    "YResolution": ("Résolution Y", "Densité de points verticale."),
    "ResolutionUnit": ("Unité de résolution", "Unité des résolutions (pouce/cm)."),
    "ColorSpace": ("Espace colorimétrique", "Espace de couleurs de l'image."),
    "ExifImageWidth": ("Largeur (EXIF)", "Largeur en pixels notée dans l'EXIF."),
    "ExifImageHeight": ("Hauteur (EXIF)", "Hauteur en pixels notée dans l'EXIF."),
    "ExifOffset": ("Bloc EXIF", "Pointeur interne vers les données EXIF."),
    "YCbCrPositioning": ("Positionnement YCbCr", "Détail technique d'encodage des couleurs."),
    # GPS
    "Latitude": ("Latitude", "Coordonnée nord/sud de la prise de vue."),
    "Longitude": ("Longitude", "Coordonnée est/ouest de la prise de vue."),
    "Altitude": ("Altitude", "Altitude de la prise de vue."),
    "GPSVersionID": ("Version GPS", "Version du format des données GPS."),
    "GPSLatitudeRef": ("Réf. latitude", "Hémisphère nord (N) ou sud (S)."),
    "GPSLongitudeRef": ("Réf. longitude", "Est (E) ou ouest (W)."),
    "GPSAltitudeRef": ("Réf. altitude", "Référence d'altitude (niveau de la mer)."),
    "GPSTimeStamp": ("Heure GPS (UTC)", "Heure UTC fournie par le GPS."),
    "GPSDateStamp": ("Date GPS (UTC)", "Date UTC fournie par le GPS."),
    "GPSProcessingMethod": ("Méthode GPS", "Méthode de localisation utilisée."),
    # Blocks
    "XMP": ("XMP", "Métadonnées étendues (droits, mots-clés, titre…)."),
    "icc_profile": ("Profil ICC", "Profil de couleurs intégré à l'image."),
}

# Group-aware fallback explanation when a tag is not in TAG_INFO.
_GROUP_FALLBACK = {
    "EXIF": "Donnée technique EXIF de l'appareil / du logiciel.",
    "GPS": "Donnée de localisation GPS.",
    "XMP": "Métadonnée étendue XMP.",
    "Texte / commentaires": "Champ texte intégré dans le fichier.",
    "ICC": "Information de profil colorimétrique.",
}


def _label_hint(key: str, group: str) -> tuple[str, str]:
    """Return (FR label, short FR explanation) for a metadata key."""
    info = TAG_INFO.get(key)
    if info:
        return info
    return key, _GROUP_FALLBACK.get(group, "Métadonnée intégrée au fichier.")


def _enrich(entries: list[dict[str, str]], group: str) -> list[dict[str, str]]:
    """Add FR `label` + `hint` to each {key, value} entry."""
    for entry in entries:
        label, hint = _label_hint(entry.get("key", ""), group)
        entry["label"] = label
        entry["hint"] = hint
    return entries


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


def _unique_suffix(path: Path, suffix: str) -> Path:
    """`photo.jpg` -> `photo{suffix}.jpg`, avoiding overwrite of any file."""
    base = path.with_name(f"{path.stem}{suffix}{path.suffix}")
    if not base.exists():
        return base
    i = 2
    while True:
        cand = path.with_name(f"{path.stem}{suffix}_{i}{path.suffix}")
        if not cand.exists():
            return cand
        i += 1


def _rational(value: Any) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        try:
            num, den = value  # type: ignore[misc]
            return float(num) / float(den) if den else 0.0
        except Exception:  # noqa: BLE001
            return 0.0


def _dms_to_deg(dms: Any, ref: Any) -> float | None:
    try:
        deg = _rational(dms[0]) + _rational(dms[1]) / 60 + _rational(dms[2]) / 3600
    except Exception:  # noqa: BLE001
        return None
    if str(ref).strip().upper() in ("S", "W"):
        deg = -deg
    return round(deg, 6)


def _deg_to_dms(value: float) -> tuple[float, float, float]:
    value = abs(float(value))
    deg = int(value)
    minutes_full = (value - deg) * 60
    minutes = int(minutes_full)
    seconds = round((minutes_full - minutes) * 60, 4)
    return (float(deg), float(minutes), float(seconds))


def _fmt_value(value: Any, limit: int = 160) -> str:
    if isinstance(value, bytes):
        try:
            text = value.decode("utf-8", "replace").replace("\x00", "").strip()
        except Exception:  # noqa: BLE001
            text = ""
        if text and all(ch.isprintable() or ch.isspace() for ch in text):
            out = text
        else:
            out = value.hex()
    elif isinstance(value, (tuple, list)):
        out = ", ".join(_fmt_value(v, limit) for v in value)
    else:
        out = str(value).replace("\x00", "").strip()
    out = " ".join(out.split())
    if len(out) > limit:
        out = out[: limit - 1] + "…"
    return out


def _exif_text(exif, tag: int) -> str:
    try:
        value = exif.get(tag)
    except Exception:  # noqa: BLE001
        value = None
    if value in (None, ""):
        return ""
    if isinstance(value, bytes):
        value = value.decode("utf-8", "replace")
    return str(value).replace("\x00", "").strip()


def _info_text(info: dict, keys: tuple[str, ...]) -> str:
    lowered = {str(k).lower(): v for k, v in (info or {}).items()}
    for key in keys:
        val = lowered.get(key.lower())
        if isinstance(val, bytes):
            val = val.decode("utf-8", "replace")
        if isinstance(val, str) and val.strip():
            return val.replace("\x00", "").strip()
    return ""


def _read_metadata(path: Path) -> dict[str, Any]:
    """Read metadata for the preview panel + the editable form fields."""
    with Image.open(path) as im:
        im.load()
        fmt = im.format or _fmt_for_ext(path.suffix)
        info = im.info or {}
        try:
            exif = im.getexif()
        except Exception:  # noqa: BLE001
            exif = None

        groups: list[dict[str, Any]] = []

        # --- Base EXIF tags -------------------------------------------
        exif_entries: list[dict[str, str]] = []
        if exif is not None:
            for tag_id, raw in exif.items():
                if tag_id in (GPS_IFD, EXIF_IFD):
                    continue
                name = TAGS.get(tag_id, f"0x{tag_id:04X}")
                val = _fmt_value(raw)
                if val:
                    exif_entries.append({"key": name, "value": val})
            try:
                sub = exif.get_ifd(EXIF_IFD)
            except Exception:  # noqa: BLE001
                sub = {}
            for tag_id, raw in (sub or {}).items():
                name = TAGS.get(tag_id, f"0x{tag_id:04X}")
                val = _fmt_value(raw)
                if val:
                    exif_entries.append({"key": name, "value": val})
        if exif_entries:
            groups.append({
                "title": "EXIF",
                "desc": GROUP_INFO["EXIF"],
                "entries": _enrich(exif_entries[:60], "EXIF"),
            })

        # --- GPS ------------------------------------------------------
        gps_lat = ""
        gps_lon = ""
        gps_entries: list[dict[str, str]] = []
        try:
            gps = exif.get_ifd(GPS_IFD) if exif is not None else {}
        except Exception:  # noqa: BLE001
            gps = {}
        if gps:
            lat = _dms_to_deg(gps.get(GPS_LAT), gps.get(GPS_LAT_REF, "N"))
            lon = _dms_to_deg(gps.get(GPS_LON), gps.get(GPS_LON_REF, "E"))
            if lat is not None and gps.get(GPS_LAT) is not None:
                gps_lat = f"{lat:.6f}"
                gps_entries.append({"key": "Latitude", "value": gps_lat})
            if lon is not None and gps.get(GPS_LON) is not None:
                gps_lon = f"{lon:.6f}"
                gps_entries.append({"key": "Longitude", "value": gps_lon})
            if GPS_ALT in gps:
                gps_entries.append(
                    {"key": "Altitude", "value": f"{_rational(gps.get(GPS_ALT)):.1f} m"}
                )
            for tag_id, raw in gps.items():
                if tag_id in (GPS_LAT, GPS_LON, GPS_ALT):
                    continue
                name = GPSTAGS.get(tag_id, f"GPS 0x{tag_id:04X}")
                val = _fmt_value(raw)
                if val:
                    gps_entries.append({"key": name, "value": val})
        if gps_entries:
            groups.append({
                "title": "GPS",
                "desc": GROUP_INFO["GPS"],
                "entries": _enrich(gps_entries, "GPS"),
            })

        # --- XMP ------------------------------------------------------
        xmp_raw = info.get("xmp") or info.get("XML:com.adobe.xmp")
        if xmp_raw:
            if isinstance(xmp_raw, bytes):
                xmp_raw = xmp_raw.decode("utf-8", "replace")
            groups.append({
                "title": "XMP",
                "desc": GROUP_INFO["XMP"],
                "entries": _enrich([{"key": "XMP", "value": _fmt_value(xmp_raw, 400)}], "XMP"),
            })

        # --- Text / info chunks (PNG comments, etc.) ------------------
        _harmless = {
            "exif", "xmp", "XML:com.adobe.xmp", "icc_profile",
            "dpi", "transparency", "background", "gamma", "srgb",
            "aspect", "pixel_aspect", "chromaticity",
            "jfif", "jfif_version", "jfif_unit", "jfif_density",
            "progression", "progressive", "adobe", "adobe_transform",
            "bits", "compression", "loop", "duration", "version",
        }
        text_entries: list[dict[str, str]] = []
        for key, raw in (info or {}).items():
            if key in _harmless:
                continue
            if isinstance(raw, (bytes, str)):
                val = _fmt_value(raw)
                if val:
                    text_entries.append({"key": str(key), "value": val})
        if text_entries:
            groups.append({
                "title": "Texte / commentaires",
                "desc": GROUP_INFO["Texte / commentaires"],
                "entries": _enrich(text_entries, "Texte / commentaires"),
            })

        if info.get("icc_profile"):
            groups.append({
                "title": "ICC",
                "desc": GROUP_INFO["ICC"],
                "entries": _enrich(
                    [{"key": "icc_profile", "value": "présent"}], "ICC"
                ),
            })

        # --- Editable fields (EXIF first, PNG text as fallback) -------
        date_time = _exif_text(exif, TAG_DATETIME)
        if not date_time and exif is not None:
            try:
                sub = exif.get_ifd(EXIF_IFD)
            except Exception:  # noqa: BLE001
                sub = {}
            for dt_tag in (EXIF_DATETIME_ORIGINAL, EXIF_DATETIME_DIGITIZED):
                raw = (sub or {}).get(dt_tag)
                if raw:
                    if isinstance(raw, bytes):
                        raw = raw.decode("utf-8", "replace")
                    date_time = str(raw).replace("\x00", "").strip()
                    if date_time:
                        break
        if not date_time:
            date_time = _info_text(info, ("Creation Time", "date:create", "DateTime"))

        fields = {
            "artist": _exif_text(exif, TAG_ARTIST) or _info_text(info, PNG_TEXT_KEYS["artist"]),
            "copyright": _exif_text(exif, TAG_COPYRIGHT)
            or _info_text(info, PNG_TEXT_KEYS["copyright"]),
            "description": _exif_text(exif, TAG_IMAGE_DESCRIPTION)
            or _info_text(info, PNG_TEXT_KEYS["description"]),
            "software": _exif_text(exif, TAG_SOFTWARE)
            or _info_text(info, PNG_TEXT_KEYS["software"]),
            "dateTime": date_time,
            "gpsLat": gps_lat,
            "gpsLon": gps_lon,
        }

    return {
        "ok": True,
        "path": str(path),
        "name": path.name,
        "format": (fmt or "").upper(),
        "groups": groups,
        "fields": fields,
        "hasGps": bool(gps_lat or gps_lon),
        "hasAny": bool(groups),
    }


def _apply_edits_path(
    path: Path, edits: dict[str, Any], out_dir: Path | None = None
) -> dict[str, Any]:
    """Write edited/added metadata into a `*_edited` copy (no stripping)."""
    edits = edits or {}
    artist = str(edits.get("artist") or "").strip()
    copyright_ = str(edits.get("copyright") or "").strip()
    description = str(edits.get("description") or "").strip()
    software = str(edits.get("software") or "").strip()
    date_time = str(edits.get("dateTime") or "").strip()
    lat_s = str(edits.get("gpsLat") or "").strip().replace(",", ".")
    lon_s = str(edits.get("gpsLon") or "").strip().replace(",", ".")
    clear_gps = bool(edits.get("clearGps"))

    with Image.open(path) as im:
        im.load()
        fmt = (im.format or _fmt_for_ext(path.suffix) or "").upper()

        try:
            exif = im.getexif()
        except Exception:  # noqa: BLE001
            exif = Image.Exif()

        def _set_or_clear(tag: int, value: str) -> None:
            if value:
                exif[tag] = value
            elif tag in exif:
                del exif[tag]

        _set_or_clear(TAG_ARTIST, artist)
        _set_or_clear(TAG_COPYRIGHT, copyright_)
        _set_or_clear(TAG_IMAGE_DESCRIPTION, description)
        _set_or_clear(TAG_SOFTWARE, software)
        _set_or_clear(TAG_DATETIME, date_time)

        set_gps = (not clear_gps) and bool(lat_s) and bool(lon_s)
        lat = lon = 0.0
        if set_gps:
            try:
                lat = float(lat_s)
                lon = float(lon_s)
                set_gps = -90.0 <= lat <= 90.0 and -180.0 <= lon <= 180.0
            except ValueError:
                set_gps = False

        if set_gps:
            exif[GPS_IFD] = {
                GPS_VERSION_ID: b"\x02\x03\x00\x00",
                GPS_LAT_REF: "N" if lat >= 0 else "S",
                GPS_LAT: _deg_to_dms(lat),
                GPS_LON_REF: "E" if lon >= 0 else "W",
                GPS_LON: _deg_to_dms(lon),
            }
        else:
            try:
                existing = exif.get_ifd(GPS_IFD)
                if existing:
                    existing.clear()
            except Exception:  # noqa: BLE001
                pass
            if GPS_IFD in exif:
                del exif[GPS_IFD]

        target_dir = out_dir if out_dir else path.parent
        target_dir.mkdir(parents=True, exist_ok=True)
        out = _unique_suffix(target_dir / path.name, "_edited")

        save_kwargs: dict[str, Any] = {}
        if fmt == "JPEG":
            image = im if im.mode in ("RGB", "L", "CMYK") else im.convert("RGB")
            save_kwargs = {"quality": 95, "optimize": True, "exif": exif}
            image.save(out, format="JPEG", **save_kwargs)
        elif fmt == "WEBP":
            save_kwargs = {"quality": 95, "method": 6, "exif": exif}
            im.save(out, format="WEBP", **save_kwargs)
        elif fmt == "PNG":
            meta = PngInfo()
            # Preserve any pre-existing textual chunks we are not editing.
            edited_keys = {
                k.lower() for group in PNG_TEXT_KEYS.values() for k in group
            }
            edited_keys.add("creation time")
            for key, raw in (im.info or {}).items():
                if not isinstance(raw, str) or not isinstance(key, str):
                    continue
                if key.lower() in edited_keys or key in (
                    "exif", "xmp", "icc_profile", "srgb", "gamma", "dpi",
                ):
                    continue
                meta.add_text(key, raw)
            if artist:
                meta.add_text("Artist", artist)
            if copyright_:
                meta.add_text("Copyright", copyright_)
            if description:
                meta.add_text("Description", description)
            if software:
                meta.add_text("Software", software)
            if date_time:
                meta.add_text("Creation Time", date_time)
            save_kwargs = {"optimize": True, "pnginfo": meta}
            # eXIf chunk carries GPS / structured fields for PNG.
            if len(exif):
                save_kwargs["exif"] = exif
            im.save(out, format="PNG", **save_kwargs)
        else:
            im.save(out, format=fmt or None)

    try:
        out_bytes = out.stat().st_size
    except OSError:
        out_bytes = 0

    return {
        "ok": True,
        "source": str(path),
        "outPath": str(out),
        "outName": out.name,
        "outDir": str(out.parent),
        "sizeBytes": out_bytes,
        "sizeText": _human_size(out_bytes),
        "gpsSet": set_gps,
        "gpsCleared": clear_gps or (not set_gps),
    }


class Api(WindowChromeMixin):
    """JS bridge — © 2026 Mr-Aurevo-X · PixClean · all rights reserved."""

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
            tmp = Path(_local_appdata()) / "PixClean-tmp"
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

    def read_metadata(self, path: str | None = None) -> dict:
        """Read the full, human-readable metadata for one image (preview)."""
        try:
            src = Path(path or "")
            if not src.is_file():
                return {"ok": False, "error": "not_found", "path": path}
            return _read_metadata(src)
        except Exception as exc:  # noqa: BLE001
            return {"ok": False, "error": str(exc), "path": path}

    def save_with_edits(self, path: str | None = None,
                        edits: dict | None = None) -> dict:
        """Write edited/added metadata into a *_edited copy (no stripping)."""
        src = Path(path or "")
        if not src.is_file():
            return {"ok": False, "source": path, "error": "not_found"}
        out_dir = _downloads_dir() if str(src) in self._temp_files else None
        try:
            return _apply_edits_path(src, edits or {}, out_dir=out_dir)
        except Exception as exc:  # noqa: BLE001
            return {"ok": False, "source": path, "error": str(exc)}

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
    # © 2026 Mr-Aurevo-X · PixClean · windowed host entry
    ui = ui_dir()
    index = ui / "index.html"
    if not index.is_file():
        raise SystemExit(f"UI missing: {index}")
    api = Api()
    create_tool_window(
        title="PixClean — Mr-Aurevo-X",
        url=index.as_uri(),
        js_api=api,
        width=1120,
        height=800,
        min_size=(940, 640),
        background_color="#0b0b0d",
    )
    webview.start()


if __name__ == "__main__":
    # © 2026 Mr-Aurevo-X · PixClean · 100% local · free · updates not guaranteed
    main()
