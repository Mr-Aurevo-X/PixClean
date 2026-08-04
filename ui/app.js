/**
 * MetaStrip — UI (proprietary)
 * © 2026 Mr-Aurevo-X · MetaStrip · 100% local · free · updates not guaranteed
 * All rights reserved. Do not strip copyright notices.
 */
(() => {
  "use strict";
  // © 2026 Mr-Aurevo-X · MetaStrip · 100% local · free · updates not guaranteed

  const SUITE_I18N = {
    fr: {
      tagline: "Nettoyeur de métadonnées",
      copyright: "Copyright © 2026 Mr-Aurevo-X — tous droits réservés",
      title: "MetaStrip",
      subtitle: "Supprimez EXIF, GPS et métadonnées — 100 % local",
      featuresTitle: "Fonctions",
      features: "Glissez des images (JPEG/PNG/WebP), voyez la présence EXIF/GPS, supprimez les métadonnées. Une copie _clean est créée — l'original reste intact.",
      badgeFree: "100 % gratuit",
      legalFree: "100 % gratuit",
      legalLocal: "100 % local — aucun cloud, aucune télémétrie",
      legalUpdates: "Mise à jour non garantie — vérif. optionnelle GitHub",
      aboutTitle: "À propos — MetaStrip",
      aboutBody: "Nettoyeur de métadonnées d'images Mr-Aurevo-X. 100 % gratuit, 100 % local (Pillow). Supprime EXIF, GPS, XMP et commentaires. Mise à jour non garantie.",
      aboutRights: "Redistribution, reverse engineering ou suppression du copyright interdits sans accord écrit.",
      btnAbout: "À propos",
      btnClose: "Fermer",
      updateTitle: "Nouvelle version disponible",
      updateDetail: "v{local} → v{remote}",
      btnUpdate: "Mettre à jour",
      btnLater: "Plus tard",
      updateApplying: "Mise à jour des sources…",
      updateDone: "Sources à jour — relancez Lancer.bat",
      updateFail: "Mise à jour impossible",
      ready: "Prêt",
      dropTitle: "Glissez vos images ici",
      dropSub: "ou cliquez pour parcourir — JPEG · PNG · WebP",
      btnAdd: "Ajouter",
      btnStripAll: "Nettoyer tout",
      btnClear: "Vider la liste",
      btnClean: "Nettoyer",
      btnFolder: "Dossier",
      disclaimer: "Une copie nettoyée *_clean est enregistrée à côté de l'original (les fichiers glissés vont dans Téléchargements). L'original n'est jamais modifié. Le ré-encodage JPEG/WebP peut légèrement recompresser l'image.",
      badgeExif: "EXIF",
      badgeGps: "GPS",
      badgeXmp: "XMP",
      badgeText: "Texte",
      badgeClean: "Sans métadonnées",
      cleanedOk: "Nettoyé → {name}",
      cleanedNone: "Aucune métadonnée à retirer — copie créée : {name}",
      statusAdded: "{n} image(s) ajoutée(s)",
      statusCleaned: "{n} image(s) nettoyée(s)",
      statusUnsupported: "Format non supporté ignoré : {name}",
      statusError: "Erreur : {err}",
      dimUnit: "px",
      metaFound: "{n} métadonnée(s)",
      metaNone: "Aucune métadonnée",
      confirmClearNone: "Liste vide.",
    },
    en: {
      tagline: "Metadata cleaner",
      copyright: "Copyright © 2026 Mr-Aurevo-X — all rights reserved",
      title: "MetaStrip",
      subtitle: "Remove EXIF, GPS and metadata — 100% local",
      featuresTitle: "Features",
      features: "Drop images (JPEG/PNG/WebP), see EXIF/GPS presence, strip metadata. A _clean copy is created — the original stays intact.",
      badgeFree: "100% free",
      legalFree: "100% free",
      legalLocal: "100% local — no cloud, no telemetry",
      legalUpdates: "Updates not guaranteed — optional GitHub check",
      aboutTitle: "About — MetaStrip",
      aboutBody: "Mr-Aurevo-X image metadata cleaner. 100% free, 100% local (Pillow). Removes EXIF, GPS, XMP and comments. Updates not guaranteed.",
      aboutRights: "Redistribution, reverse engineering, or stripping copyright is forbidden without written consent.",
      btnAbout: "About",
      btnClose: "Close",
      updateTitle: "New version available",
      updateDetail: "v{local} → v{remote}",
      btnUpdate: "Update",
      btnLater: "Later",
      updateApplying: "Updating sources…",
      updateDone: "Sources updated — relaunch Lancer.bat",
      updateFail: "Update failed",
      ready: "Ready",
      dropTitle: "Drop your images here",
      dropSub: "or click to browse — JPEG · PNG · WebP",
      btnAdd: "Add",
      btnStripAll: "Clean all",
      btnClear: "Clear list",
      btnClean: "Clean",
      btnFolder: "Folder",
      disclaimer: "A cleaned *_clean copy is saved next to the original (dropped files go to Downloads). The original is never modified. JPEG/WebP re-encoding may slightly recompress the image.",
      badgeExif: "EXIF",
      badgeGps: "GPS",
      badgeXmp: "XMP",
      badgeText: "Text",
      badgeClean: "No metadata",
      cleanedOk: "Cleaned → {name}",
      cleanedNone: "No metadata to remove — copy created: {name}",
      statusAdded: "{n} image(s) added",
      statusCleaned: "{n} image(s) cleaned",
      statusUnsupported: "Unsupported format skipped: {name}",
      statusError: "Error: {err}",
      dimUnit: "px",
      metaFound: "{n} metadata item(s)",
      metaNone: "No metadata",
      confirmClearNone: "List is empty.",
    },
  };

  let suiteLang = "fr";
  const t = (key) => (SUITE_I18N[suiteLang] && SUITE_I18N[suiteLang][key]) || SUITE_I18N.fr[key] || key;
  const fmt = (key, vars) => {
    let s = t(key);
    Object.keys(vars || {}).forEach((k) => { s = s.replace("{" + k + "}", vars[k]); });
    return s;
  };

  const $ = (id) => document.getElementById(id);
  const setStatus = (m) => { $("status").textContent = m || ""; };

  function apiReady() {
    return new Promise((resolve) => {
      if (window.pywebview && window.pywebview.api) return resolve(window.pywebview.api);
      window.addEventListener("pywebviewready", () => resolve(window.pywebview.api), { once: true });
      setTimeout(() => resolve(window.pywebview && window.pywebview.api), 2500);
    });
  }

  const SUPPORTED = [".jpg", ".jpeg", ".png", ".webp"];
  const isSupported = (name) => SUPPORTED.some((e) => (name || "").toLowerCase().endsWith(e));

  /* ---------- List state ---------- */
  const items = new Map(); // key(path) -> item

  function upsert(item) {
    if (!item || !item.ok || !item.path) return false;
    items.set(item.path, Object.assign({ cleaned: false }, items.get(item.path), item));
    return true;
  }

  function badge(cls, label) {
    return `<span class="tag ${cls}">${label}</span>`;
  }

  function renderCards() {
    const wrap = $("cards");
    wrap.innerHTML = "";
    const arr = Array.from(items.values());
    $("listToolbar").hidden = arr.length === 0;
    $("countPill").textContent = arr.length ? String(arr.length) : "";
    arr.forEach((it) => {
      const card = document.createElement("div");
      card.className = "img-card" + (it.cleaned ? " is-clean" : "");

      const tags = [];
      if (it.hasExif) tags.push(badge("warn", t("badgeExif")));
      if (it.hasGps) tags.push(badge("danger", t("badgeGps")));
      if (it.hasXmp) tags.push(badge("warn", t("badgeXmp")));
      if (it.hasText) tags.push(badge("warn", t("badgeText")));
      if (!it.hasAny) tags.push(badge("ok", t("badgeClean")));

      const metaLine = it.hasAny
        ? fmt("metaFound", { n: it.metaCount || tags.length })
        : t("metaNone");

      card.innerHTML =
        `<div class="thumb"><img src="${it.thumb}" alt="" loading="lazy" /></div>` +
        `<div class="card-body">` +
          `<div class="card-name" title="${it.name}">${it.name}</div>` +
          `<div class="card-meta">${it.format || "?"} · ${it.width}×${it.height} ${t("dimUnit")} · ${it.sizeText || ""}</div>` +
          `<div class="tags">${tags.join("")}</div>` +
          `<div class="meta-line">${metaLine}</div>` +
          (it.cleaned
            ? `<div class="clean-line">${it.cleanNote || ""}</div>`
            : "") +
        `</div>` +
        `<div class="card-actions">` +
          (it.cleaned
            ? `<button type="button" class="btn small" data-folder="${it.outPath || ""}">${t("btnFolder")}</button>`
            : `<button type="button" class="btn accent small" data-clean="${it.path}">${t("btnClean")}</button>`) +
          `<button type="button" class="icon-btn" data-remove="${it.path}" title="×">×</button>` +
        `</div>`;
      wrap.appendChild(card);
    });

    wrap.querySelectorAll("[data-clean]").forEach((b) =>
      b.addEventListener("click", () => stripOne(b.getAttribute("data-clean"))));
    wrap.querySelectorAll("[data-remove]").forEach((b) =>
      b.addEventListener("click", () => { items.delete(b.getAttribute("data-remove")); renderCards(); }));
    wrap.querySelectorAll("[data-folder]").forEach((b) =>
      b.addEventListener("click", async () => {
        const api = await apiReady();
        if (api && api.reveal) { try { await api.reveal(b.getAttribute("data-folder")); } catch (_) {} }
      }));
  }

  /* ---------- Add via picker / drop ---------- */
  async function pickImages() {
    const api = await apiReady();
    if (!api || !api.pick_images) return;
    try {
      const res = await api.pick_images();
      if (!res || !res.ok) return;
      let added = 0;
      (res.items || []).forEach((it) => { if (upsert(it)) added += 1; });
      renderCards();
      if (added) setStatus(fmt("statusAdded", { n: added }));
    } catch (e) { setStatus(fmt("statusError", { err: String((e && e.message) || e) })); }
  }

  function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  async function addDroppedFiles(fileList) {
    const api = await apiReady();
    if (!api || !api.add_dropped) return;
    let added = 0;
    for (const file of Array.from(fileList)) {
      if (!isSupported(file.name)) { setStatus(fmt("statusUnsupported", { name: file.name })); continue; }
      try {
        const dataUrl = await readAsDataURL(file);
        const res = await api.add_dropped(file.name, dataUrl);
        if (res && res.ok && upsert(res.item)) added += 1;
      } catch (_) {}
    }
    renderCards();
    if (added) setStatus(fmt("statusAdded", { n: added }));
  }

  /* ---------- Strip ---------- */
  function applyResult(res) {
    if (!res || !res.ok) return;
    const it = items.get(res.source);
    if (!it) return;
    it.cleaned = true;
    it.outPath = res.outPath;
    it.cleanNote = (res.beforeMeta > 0)
      ? fmt("cleanedOk", { name: res.outName })
      : fmt("cleanedNone", { name: res.outName });
  }

  async function stripOne(path) {
    const api = await apiReady();
    if (!api || !api.strip) return;
    try {
      const res = await api.strip([path]);
      (res.results || []).forEach(applyResult);
      renderCards();
      if (res.cleaned) setStatus(fmt("statusCleaned", { n: res.cleaned }));
    } catch (e) { setStatus(fmt("statusError", { err: String((e && e.message) || e) })); }
  }

  async function stripAll() {
    const api = await apiReady();
    if (!api || !api.strip) return;
    const paths = Array.from(items.values()).filter((i) => !i.cleaned).map((i) => i.path);
    if (!paths.length) return;
    $("btnStripAll").disabled = true;
    try {
      const res = await api.strip(paths);
      (res.results || []).forEach(applyResult);
      renderCards();
      setStatus(fmt("statusCleaned", { n: res.cleaned || 0 }));
    } catch (e) { setStatus(fmt("statusError", { err: String((e && e.message) || e) })); }
    finally { $("btnStripAll").disabled = false; }
  }

  async function clearList() {
    const api = await apiReady();
    items.clear();
    renderCards();
    setStatus("");
    if (api && api.clear_temp) { try { await api.clear_temp(); } catch (_) {} }
  }

  /* ---------- Dropzone wiring ---------- */
  function wireDropzone() {
    const dz = $("dropzone");
    dz.addEventListener("click", pickImages);
    dz.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickImages(); } });
    ["dragenter", "dragover"].forEach((ev) =>
      dz.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); dz.classList.add("drag"); }));
    ["dragleave", "dragend"].forEach((ev) =>
      dz.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); dz.classList.remove("drag"); }));
    dz.addEventListener("drop", (e) => {
      e.preventDefault(); e.stopPropagation(); dz.classList.remove("drag");
      const files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length) addDroppedFiles(files);
    });
    // Accept drops anywhere on the window too.
    window.addEventListener("dragover", (e) => e.preventDefault());
    window.addEventListener("drop", (e) => {
      if (e.target && e.target.closest && e.target.closest("#dropzone")) return;
      e.preventDefault();
      const files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length) addDroppedFiles(files);
    });
  }

  /* ---------- Suite / chrome ---------- */
  let pendingRemoteVersion = null;
  function applyAccent(hex) {
    const accent = String(hex || "#14b8a6").trim();
    if (!(accent.startsWith("#") && (accent.length === 4 || accent.length === 7))) return;
    let h = accent.slice(1);
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    const root = document.documentElement;
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-dim", `rgba(${r}, ${g}, ${b}, 0.2)`);
    root.style.setProperty("--accent-glow", `rgba(${r}, ${g}, ${b}, 0.4)`);
  }
  async function bootSuite(api) {
    const suite = window.MrAurevoXSuite;
    if (suite) {
      const settings = await suite.loadSuiteSettings(api);
      suiteLang = settings.language === "en" ? "en" : "fr";
      suite.applyAccent(settings.accent);
      suite.applyI18n(suiteLang, SUITE_I18N);
      return;
    }
    if (api && api.get_suite_settings) {
      try {
        const s = await api.get_suite_settings();
        if (s && s.accent) applyAccent(s.accent);
        if (s && s.language === "en") suiteLang = "en";
      } catch (_) {}
    }
  }
  function refreshLabels() {
    $("btnAbout").textContent = t("btnAbout");
    $("btnAdd").textContent = t("btnAdd");
    $("btnStripAll").textContent = t("btnStripAll");
    $("btnClear").textContent = t("btnClear");
    if ($("updateTitle")) $("updateTitle").textContent = t("updateTitle");
    if ($("btnUpdateNow")) $("btnUpdateNow").textContent = t("btnUpdate");
    if ($("btnUpdateLater")) $("btnUpdateLater").textContent = t("btnLater");
  }
  function showUpdateBanner(info) {
    if (!$("updateBanner") || !info) return;
    pendingRemoteVersion = info.remote || null;
    $("updateDetail").textContent = t("updateDetail").replace("{local}", info.local || "?").replace("{remote}", info.remote || "?");
    $("updateBanner").hidden = false;
  }
  function hideUpdateBanner() { if ($("updateBanner")) $("updateBanner").hidden = true; }
  async function runUpdateCheck(api) {
    if (!api || !api.check_for_update) return;
    try {
      const info = await api.check_for_update();
      if (!info || !info.ok || !info.updateAvailable) return;
      if (info.autoUpdate && api.apply_update) {
        setStatus(t("updateApplying"));
        const res = await api.apply_update();
        if (res && res.ok && res.applied) { setStatus(t("updateDone")); return; }
      }
      showUpdateBanner(info);
    } catch (_) {}
  }
  async function applyUpdateNow() {
    const api = await apiReady();
    if (!api || !api.apply_update) return;
    $("btnUpdateNow").disabled = true; setStatus(t("updateApplying"));
    try {
      const res = await api.apply_update();
      if (res && res.ok && res.applied) { setStatus(t("updateDone")); hideUpdateBanner(); return; }
      setStatus((res && res.error) || t("updateFail"));
    } catch (e) { setStatus(String((e && e.message) || e) || t("updateFail")); }
    finally { $("btnUpdateNow").disabled = false; }
  }
  async function dismissUpdateLater() {
    const api = await apiReady(); hideUpdateBanner();
    try { if (api && api.dismiss_update) await api.dismiss_update(pendingRemoteVersion || ""); } catch (_) {}
  }

  /* ---------- Wire ---------- */
  $("btnAbout").addEventListener("click", () => { const d = $("aboutDialog"); if (d && d.showModal) d.showModal(); });
  $("btnAdd").addEventListener("click", pickImages);
  $("btnStripAll").addEventListener("click", stripAll);
  $("btnClear").addEventListener("click", clearList);
  if ($("btnUpdateNow")) $("btnUpdateNow").addEventListener("click", applyUpdateNow);
  if ($("btnUpdateLater")) $("btnUpdateLater").addEventListener("click", dismissUpdateLater);

  (async () => {
    const api = await apiReady();
    await bootSuite(api);
    refreshLabels();
    wireDropzone();
    renderCards();
    setTimeout(() => runUpdateCheck(api), 900);
  })();
})();
