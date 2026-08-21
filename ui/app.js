/**
 * Copyright (c) 2026 Mr-Aurevo-X. All rights reserved.
 * SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
 * Author: Mr-Aurevo-X | https://github.com/Mr-Aurevo-X
 */
/**
 * PixClean — UI (proprietary)
 * © 2026 Mr-Aurevo-X · PixClean · 100% local · free · updates not guaranteed
 * All rights reserved. Do not strip copyright notices.
 */
(() => {
  "use strict";
  // © 2026 Mr-Aurevo-X · PixClean · 100% local · free · updates not guaranteed

  const SUITE_I18N = {
    fr: {
      tagline: "Nettoyeur EXIF · GPS · XMP",
      copyright: "Copyright © 2026 Mr-Aurevo-X — tous droits réservés",
      title: "PixClean",
      subtitle: "Retirez EXIF, GPS et XMP — 100 % local",
      featuresTitle: "Fonctions",
      features: "Glissez des images (JPEG/PNG/WebP), affichez les métadonnées EXIF/GPS/XMP, éditez-les (auteur, copyright, GPS…) ou supprimez tout. Copie _edited ou _clean — l'original reste intact.",
      badgeFree: "100 % gratuit",
      legalFree: "100 % gratuit",
      legalLocal: "100 % local — aucun cloud, aucune télémétrie",
      legalUpdates: "100 % local sauf vérif. optionnelle GitHub Releases (désactivable)",
      privacy:
        "Mr-Aurevo-X ne collecte aucune donnée. Traitement 100 % local (Pillow). Seul appel réseau optionnel : vérif. de version GitHub Releases (désactivable dans À propos).",
      aboutTitle: "À propos — PixClean",
      aboutBody: "Nettoyeur et éditeur de métadonnées d'images Mr-Aurevo-X. 100 % gratuit, 100 % local (Pillow). Affiche, édite (auteur, copyright, GPS…) ou supprime EXIF, GPS, XMP et commentaires. Mise à jour non garantie.",
      aboutRights: "Redistribution, reverse engineering ou suppression du copyright interdits sans accord écrit.",
      btnAbout: "À propos",
      aboutRepoLabel: "Repo GitHub (releases)",
      btnCopyRepo: "Copier",
      aboutCopied: "Lien copié.",

      langSwitchAria: "Langue",
      aboutToggle: "Vérifier les nouvelles versions sur GitHub",
      aboutHintOn: "Quand activé : un appel API GitHub au démarrage (lecture seule, pas de téléchargement).",
      aboutHintOff: "Désactivé : aucune requête GitHub. 100 % local hors actions utilisateur.",
      aboutVersion: "Version {ver}",
      aboutLegalTerms: "CGU",
      aboutLegalPrivacy: "Confidentialité",
      aboutLegalMentions: "Mentions",
      aboutLegalNotices: "Notices",
      btnOpenRelease: "Ouvrir sur GitHub",
      aboutPathsTitle: "Chemins locaux (désinstall / ménage)",
      aboutPathsIntro: "Identifie clairement quoi supprimer. Les préférences partagées Mr-Aurevo-X restent si d’autres apps les utilisent.",
      aboutPathCopied: "Chemin copié.",
      btnCopyPath: "Copier",
      btnDisableUpdateCheck: "Désactiver la vérif. GitHub",
      btnEnableUpdateCheck: "Réactiver la vérif. GitHub",
      aboutNetNote: "100 % local — seule connexion hors machine optionnelle : vérif. de version GitHub Releases.",
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
      btnDetail: "Voir / éditer",
      previewTitle: "Métadonnées présentes",
      previewHint: "Chaque ligne indique le champ, ce qu'il signifie et sa valeur actuelle.",
      previewEmpty: "Aucune métadonnée détectée.",
      editTitle: "Ajouter / éditer les métadonnées",
      editHint: "Renseignez un champ pour l'ajouter, videz-le pour le retirer. L'original n'est jamais modifié.",
      fArtist: "Auteur / Artiste",
      fArtistHint: "Personne créditée comme auteur de l'image.",
      fCopyright: "Copyright",
      fCopyrightHint: "Mention de droits d'auteur.",
      fDescription: "Description",
      fDescriptionHint: "Légende ou description de l'image.",
      fSoftware: "Logiciel",
      fSoftwareHint: "Appareil ou logiciel ayant produit l'image.",
      fDateTime: "Date de prise de vue",
      fDateTimeHint: "Date/heure de prise de vue (format AAAA:MM:JJ HH:MM:SS).",
      fLat: "GPS latitude",
      fLatHint: "Coordonnée nord/sud (−90 à 90).",
      fLon: "GPS longitude",
      fLonHint: "Coordonnée est/ouest (−180 à 180).",
      fClearGps: "Supprimer les coordonnées GPS",
      editNote: "« Enregistrer avec ces métadonnées » crée une copie *_edited (l'original reste intact). « Nettoyer » retire toutes les métadonnées (*_clean).",
      btnSaveEdits: "Enregistrer avec ces métadonnées",
      btnStripHere: "Nettoyer / retirer toutes les métadonnées",
      loadingMeta: "Lecture des métadonnées…",
      editedOk: "Enregistré → {name}",
      editError: "Échec de l'enregistrement : {err}",
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
      tagline: "EXIF · GPS · XMP cleaner",
      copyright: "Copyright © 2026 Mr-Aurevo-X — all rights reserved",
      title: "PixClean",
      subtitle: "Strip EXIF, GPS and XMP — 100% local",
      featuresTitle: "Features",
      features: "Drop images (JPEG/PNG/WebP), view EXIF/GPS/XMP metadata, edit it (author, copyright, GPS…) or strip everything. A _edited or _clean copy is created — the original stays intact.",
      badgeFree: "100% free",
      legalFree: "100% free",
      legalLocal: "100% local — no cloud, no telemetry",
      legalUpdates: "100% local except optional GitHub Releases check (can disable)",
      privacy:
        "Mr-Aurevo-X does not collect your data. 100% local processing (Pillow). Only optional network call: GitHub Releases version check (disable in About).",
      aboutTitle: "About — PixClean",
      aboutBody: "Mr-Aurevo-X image metadata viewer, editor & cleaner. 100% free, 100% local (Pillow). View, edit (author, copyright, GPS…) or remove EXIF, GPS, XMP and comments. Updates not guaranteed.",
      aboutRights: "Redistribution, reverse engineering, or stripping copyright is forbidden without written consent.",
      btnAbout: "About",
      aboutRepoLabel: "GitHub repo (releases)",
      btnCopyRepo: "Copy",
      aboutCopied: "Link copied.",

      langSwitchAria: "Language",
      aboutToggle: "Check for new versions on GitHub",
      aboutHintOn: "When on: one GitHub API call at startup (read-only, no download).",
      aboutHintOff: "Off: no GitHub requests. 100% local except user actions.",
      aboutVersion: "Version {ver}",
      aboutLegalTerms: "Terms",
      aboutLegalPrivacy: "Privacy",
      aboutLegalMentions: "Legal notice",
      aboutLegalNotices: "Notices",
      btnOpenRelease: "Open on GitHub",
      aboutPathsTitle: "Local paths (uninstall / cleanup)",
      aboutPathsIntro: "Clear labels for what to remove. Shared Mr-Aurevo-X prefs stay if other apps use them.",
      aboutPathCopied: "Path copied.",
      btnCopyPath: "Copy",
      btnDisableUpdateCheck: "Disable GitHub update check",
      btnEnableUpdateCheck: "Enable GitHub update check",
      aboutNetNote: "100% local — only optional off-machine call: GitHub Releases version check.",
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
      btnDetail: "View / edit",
      previewTitle: "Metadata present",
      previewHint: "Each line shows the field, what it means and its current value.",
      previewEmpty: "No metadata detected.",
      editTitle: "Add / edit metadata",
      editHint: "Fill a field to add it, clear it to remove it. The original is never modified.",
      fArtist: "Author / Artist",
      fArtistHint: "Person credited as the author of the image.",
      fCopyright: "Copyright",
      fCopyrightHint: "Copyright notice.",
      fDescription: "Description",
      fDescriptionHint: "Caption or description of the image.",
      fSoftware: "Software",
      fSoftwareHint: "Device or software that produced the image.",
      fDateTime: "Capture date",
      fDateTimeHint: "Capture date/time (format YYYY:MM:DD HH:MM:SS).",
      fLat: "GPS latitude",
      fLatHint: "North/south coordinate (−90 to 90).",
      fLon: "GPS longitude",
      fLonHint: "East/west coordinate (−180 to 180).",
      fClearGps: "Remove GPS coordinates",
      editNote: "\"Save with this metadata\" writes a *_edited copy (the original stays intact). \"Clean\" removes all metadata (*_clean).",
      btnSaveEdits: "Save with this metadata",
      btnStripHere: "Clean / remove all metadata",
      loadingMeta: "Reading metadata…",
      editedOk: "Saved → {name}",
      editError: "Save failed: {err}",
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
      card.className = "img-card" + (it.cleaned ? " is-clean" : "") +
        (it.path === activePath ? " is-active" : "");
      card.setAttribute("data-select", it.path);

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
          `<button type="button" class="btn ghost small" data-detail="${it.path}">${t("btnDetail")}</button>` +
          (it.cleaned
            ? `<button type="button" class="btn small" data-folder="${it.outPath || ""}">${t("btnFolder")}</button>`
            : `<button type="button" class="btn accent small" data-clean="${it.path}">${t("btnClean")}</button>`) +
          `<button type="button" class="icon-btn" data-remove="${it.path}" title="×">×</button>` +
        `</div>`;
      wrap.appendChild(card);
    });

    // Selecting a card (thumb / body) opens its inline metadata panel.
    wrap.querySelectorAll("[data-select]").forEach((card) =>
      card.addEventListener("click", (e) => {
        if (e.target && e.target.closest && e.target.closest(".card-actions")) return;
        selectItem(card.getAttribute("data-select"));
      }));
    wrap.querySelectorAll("[data-detail]").forEach((b) =>
      b.addEventListener("click", (e) => { e.stopPropagation(); selectItem(b.getAttribute("data-detail")); }));
    wrap.querySelectorAll("[data-clean]").forEach((b) =>
      b.addEventListener("click", (e) => { e.stopPropagation(); stripOne(b.getAttribute("data-clean")); }));
    wrap.querySelectorAll("[data-remove]").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        const p = b.getAttribute("data-remove");
        items.delete(p);
        if (p === activePath) closeMeta();
        renderCards();
      }));
    wrap.querySelectorAll("[data-folder]").forEach((b) =>
      b.addEventListener("click", async (e) => {
        e.stopPropagation();
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
      let firstPath = null;
      (res.items || []).forEach((it) => {
        if (upsert(it)) { added += 1; if (!firstPath) firstPath = it.path; }
      });
      renderCards();
      if (added) setStatus(fmt("statusAdded", { n: added }));
      if (firstPath) selectItem(firstPath);
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
    let firstPath = null;
    for (const file of Array.from(fileList)) {
      if (!isSupported(file.name)) { setStatus(fmt("statusUnsupported", { name: file.name })); continue; }
      try {
        const dataUrl = await readAsDataURL(file);
        const res = await api.add_dropped(file.name, dataUrl);
        if (res && res.ok && upsert(res.item)) { added += 1; if (!firstPath) firstPath = res.item.path; }
      } catch (_) {}
    }
    renderCards();
    if (added) setStatus(fmt("statusAdded", { n: added }));
    if (firstPath) selectItem(firstPath);
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
    closeMeta();
    renderCards();
    setStatus("");
    if (api && api.clear_temp) { try { await api.clear_temp(); } catch (_) {} }
  }

  /* ---------- Inline metadata panel (present + add/edit) ---------- */
  let activePath = null;

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function renderGroups(groups) {
    const wrap = $("metaGroups");
    wrap.innerHTML = "";
    (groups || []).forEach((g) => {
      const block = document.createElement("div");
      block.className = "meta-group";
      const rows = (g.entries || [])
        .map((e) =>
          `<div class="meta-entry">` +
            `<div class="me-label">${escapeHtml(e.label || e.key)}</div>` +
            (e.hint ? `<div class="me-hint">${escapeHtml(e.hint)}</div>` : "") +
            `<div class="me-value" title="${escapeHtml(e.value)}">${escapeHtml(e.value)}</div>` +
          `</div>`)
        .join("");
      block.innerHTML =
        `<div class="meta-group-title">${escapeHtml(g.title)}</div>` +
        (g.desc ? `<div class="meta-group-desc">${escapeHtml(g.desc)}</div>` : "") +
        `<div class="meta-entries">${rows}</div>`;
      wrap.appendChild(block);
    });
    $("metaEmpty").hidden = (groups || []).length > 0;
  }

  function fillForm(fields) {
    const f = fields || {};
    $("fArtist").value = f.artist || "";
    $("fCopyright").value = f.copyright || "";
    $("fDescription").value = f.description || "";
    $("fSoftware").value = f.software || "";
    $("fDateTime").value = f.dateTime || "";
    $("fLat").value = f.gpsLat || "";
    $("fLon").value = f.gpsLon || "";
    $("fClearGps").checked = false;
  }

  async function selectItem(path) {
    const it = items.get(path);
    if (!it) return;
    activePath = path;
    const panel = $("detailPanel");
    if (panel) panel.hidden = false;
    $("metaName").textContent = it.name || "";
    $("metaFmt").textContent = `${it.format || "?"} · ${it.width}×${it.height} ${t("dimUnit")} · ${it.sizeText || ""}`;
    $("metaThumb").src = it.thumb || "";
    $("metaStatus").textContent = t("loadingMeta");
    $("metaGroups").innerHTML = "";
    $("metaEmpty").hidden = true;
    $("metaFolder").hidden = true;
    fillForm(null);
    renderCards();
    const api = await apiReady();
    if (!api || !api.read_metadata) { $("metaStatus").textContent = ""; return; }
    try {
      const res = await api.read_metadata(path);
      if (activePath !== path) return; // selection changed while loading
      if (res && res.ok) {
        renderGroups(res.groups);
        fillForm(res.fields);
        $("metaStatus").textContent = "";
      } else {
        $("metaStatus").textContent = fmt("statusError", { err: (res && res.error) || "?" });
      }
    } catch (e) {
      $("metaStatus").textContent = fmt("statusError", { err: String((e && e.message) || e) });
    }
  }

  function closeMeta() {
    const panel = $("detailPanel");
    if (panel) panel.hidden = true;
    activePath = null;
    renderCards();
  }

  async function saveEdits() {
    if (!activePath) return;
    const api = await apiReady();
    if (!api || !api.save_with_edits) return;
    const edits = {
      artist: $("fArtist").value,
      copyright: $("fCopyright").value,
      description: $("fDescription").value,
      software: $("fSoftware").value,
      dateTime: $("fDateTime").value,
      gpsLat: $("fLat").value,
      gpsLon: $("fLon").value,
      clearGps: $("fClearGps").checked,
    };
    $("metaSave").disabled = true;
    $("metaStatus").textContent = t("loadingMeta");
    try {
      const res = await api.save_with_edits(activePath, edits);
      if (res && res.ok) {
        $("metaStatus").textContent = fmt("editedOk", { name: res.outName });
        setStatus(fmt("editedOk", { name: res.outName }));
        const folderBtn = $("metaFolder");
        folderBtn.hidden = false;
        folderBtn.onclick = async () => {
          const a = await apiReady();
          if (a && a.reveal) { try { await a.reveal(res.outPath); } catch (_) {} }
        };
      } else {
        $("metaStatus").textContent = fmt("editError", { err: (res && res.error) || "?" });
      }
    } catch (e) {
      $("metaStatus").textContent = fmt("editError", { err: String((e && e.message) || e) });
    } finally {
      $("metaSave").disabled = false;
    }
  }

  async function stripActive() {
    if (!activePath) return;
    await stripOne(activePath);
    const it = items.get(activePath);
    if (it && it.cleaned) {
      $("metaStatus").textContent = it.cleanNote || "";
      const folderBtn = $("metaFolder");
      folderBtn.hidden = !it.outPath;
      if (it.outPath) {
        folderBtn.onclick = async () => {
          const a = await apiReady();
          if (a && a.reveal) { try { await a.reveal(it.outPath); } catch (_) {} }
        };
      }
    }
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
  
  let updateCheckEnabled = true;

  
  
  function aboutLangIsEn() {
    try {
      if (typeof suiteLang === "string") return suiteLang === "en";
      if (typeof state !== "undefined" && state && state.lang === "en") return true;
    } catch (_) {}
    return false;
  }

  async function refreshAboutLocalPaths(api) {
    const list = document.getElementById("aboutPathsList");
    const pathHint = document.getElementById("aboutPathCopyHint");
    const title = document.querySelector("#aboutPaths .about-repo-label");
    const intro = document.querySelector("#aboutPaths > .about-note:not(#aboutPathCopyHint)");
    if (!list) return;
    if (title && typeof t === "function") title.textContent = t("aboutPathsTitle");
    if (intro && typeof t === "function") intro.textContent = t("aboutPathsIntro");
    list.replaceChildren();
    let paths = [];
    try {
      if (api && api.get_about_local_paths) {
        const r = await api.get_about_local_paths();
        if (r && Array.isArray(r.paths)) paths = r.paths;
      }
    } catch (_) {}
    const en = aboutLangIsEn();
    for (const entry of paths) {
      if (!entry || !entry.path) continue;
      const item = document.createElement("div");
      item.className = "about-path-item";
      const label = document.createElement("div");
      label.className = "about-path-label";
      label.textContent = (en && entry.labelEn) ? entry.labelEn : (entry.label || entry.id || "");
      const hint = document.createElement("div");
      hint.className = "about-path-hint";
      hint.textContent = (en && entry.hintEn) ? entry.hintEn : (entry.hint || "");
      const row = document.createElement("div");
      row.className = "about-repo-row";
      const input = document.createElement("input");
      input.type = "text";
      input.className = "about-repo-input";
      input.readOnly = true;
      input.spellcheck = false;
      input.value = entry.path;
      input.addEventListener("focus", () => { try { input.select(); } catch (_) {} });
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn accent";
      btn.textContent = typeof t === "function" ? t("btnCopyPath") : "Copier";
      btn.addEventListener("click", async (ev) => {
        ev.preventDefault();
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(entry.path);
          } else {
            input.focus();
            input.select();
            document.execCommand("copy");
          }
          if (pathHint) {
            pathHint.hidden = false;
            pathHint.textContent = typeof t === "function" ? t("aboutPathCopied") : "Chemin copié.";
            setTimeout(() => { pathHint.hidden = true; }, 1600);
          }
        } catch (_) {}
      });
      row.appendChild(input);
      row.appendChild(btn);
      item.appendChild(label);
      if (hint.textContent) item.appendChild(hint);
      item.appendChild(row);
      list.appendChild(item);
    }
  }

  
  function syncLangSwitch(lang) {
    const root = document.getElementById("langSwitch");
    if (!root) return;
    root.querySelectorAll(".hub-lang-seg").forEach((btn) => {
      const on = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  async function setAppLanguage(lang) {
    const next = lang === "en" ? "en" : "fr";
    try {
      const api = typeof apiReady === "function" ? await apiReady() : (window.pywebview && window.pywebview.api);
      if (api && api.set_suite_language) await api.set_suite_language(next);
    } catch (_) {}
    if (typeof suiteLang !== "undefined") suiteLang = next;
    try { if (typeof state !== "undefined" && state) state.lang = next; } catch (_) {}
    document.documentElement.lang = next;
    syncLangSwitch(next);
    if (typeof applyI18n === "function") applyI18n();
    else if (window.suite && typeof window.suite.applyI18n === "function" && typeof SUITE_I18N !== "undefined") {
      window.suite.applyI18n(next, SUITE_I18N);
    }
    if (typeof refreshLabels === "function") refreshLabels();
    if (typeof applyLabels === "function") applyLabels();
    try {
      const api = typeof apiReady === "function" ? await apiReady() : (window.pywebview && window.pywebview.api);
      await refreshUpdateCheckButton(api);
      await fillAboutRepo(api);
      await refreshAboutLocalPaths(api);
      await refreshAboutVersion(api);
    } catch (_) {}
  }

  async function refreshAboutVersion(api) {
    const el = document.getElementById("aboutVersion");
    if (!el) return;
    let ver = "?";
    try {
      if (api && api.get_version) {
        const r = await api.get_version();
        if (r && r.version) ver = r.version;
      }
    } catch (_) {}
    const tpl = typeof t === "function" ? t("aboutVersion") : "Version {ver}";
    el.textContent = tpl.replace("{ver}", ver);
  }

  async function refreshGithubUpdateToggle(api) {
    const chk = document.getElementById("chkGithubUpdates");
    const hint = document.getElementById("aboutUpdateHint");
    if (!chk) return;
    let enabled = true;
    try {
      if (api && api.get_update_prefs) {
        const prefs = await api.get_update_prefs();
        if (prefs && prefs.ok) enabled = prefs.checkGithubUpdates !== false && prefs.checkUpdates !== false;
      }
    } catch (_) {}
    chk.checked = enabled;
    if (hint && typeof t === "function") hint.textContent = enabled ? t("aboutHintOn") : t("aboutHintOff");
  }

  async function wireRuleshubAbout() {
    const api = typeof apiReady === "function" ? await apiReady() : (window.pywebview && window.pywebview.api);
    await refreshGithubUpdateToggle(api);
    await refreshAboutVersion(api);
    const chk = document.getElementById("chkGithubUpdates");
    if (chk && !chk.dataset.wired) {
      chk.dataset.wired = "1";
      chk.addEventListener("change", async () => {
        const enabled = !!chk.checked;
        try {
          if (api && api.set_update_check_pref) await api.set_update_check_pref(enabled);
          else if (api && api.set_check_updates) await api.set_check_updates(enabled);
        } catch (_) {}
        const hint = document.getElementById("aboutUpdateHint");
        if (hint && typeof t === "function") hint.textContent = enabled ? t("aboutHintOn") : t("aboutHintOff");
      });
    }
    document.querySelectorAll("[data-legal]").forEach((btn) => {
      if (btn.dataset.wired) return;
      btn.dataset.wired = "1";
      btn.addEventListener("click", async (ev) => {
        ev.preventDefault();
        const kind = btn.getAttribute("data-legal");
        const body = document.getElementById("aboutLegalBody");
        if (!kind || !body) return;
        const lang = (typeof suiteLang === "string" && suiteLang === "en") ? "en" : "fr";
        const file = `${kind}.${lang}.md`;
        try {
          const res = await fetch(`legal/${file}`, { cache: "no-store" });
          body.textContent = res.ok ? await res.text() : `Impossible de charger ${file}`;
          body.hidden = false;
        } catch (err) {
          body.textContent = String(err);
          body.hidden = false;
        }
      });
    });
  }

  async function openReleaseInBrowser() {
    const api = typeof apiReady === "function" ? await apiReady() : (window.pywebview && window.pywebview.api);
    let url = "";
    try {
      if (window.__pendingReleaseUrl) url = window.__pendingReleaseUrl;
      else if (api && api.get_update_prefs) {
        const p = await api.get_update_prefs();
        if (p && p.repoUrl) url = p.repoUrl + "/releases/latest";
      }
    } catch (_) {}
    try {
      if (api && api.open_release_page) await api.open_release_page(url || "");
    } catch (_) {}
  }

  async function fillAboutRepo(api) {
    const input = document.getElementById("aboutRepoUrl");
    if (!input) return;
    try {
      let repo = null;
      if (api && api.get_update_prefs) {
        const prefs = await api.get_update_prefs();
        if (prefs && prefs.repoUrl) repo = prefs.repoUrl;
        else if (prefs && prefs.repo) repo = "https://github.com/" + prefs.repo;
      }
      if (!repo && api && api.get_version) {
        const ver = await api.get_version();
        if (ver && ver.repo) repo = "https://github.com/" + ver.repo;
      }
      if (repo) input.value = repo;
    } catch (_) {}
  }

  async function copyAboutRepo() {
    const input = document.getElementById("aboutRepoUrl");
    const hint = document.getElementById("aboutCopyHint");
    const url = (input && input.value || "").trim();
    if (!url) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        input.focus();
        input.select();
        document.execCommand("copy");
      }
      if (hint) {
        hint.hidden = false;
        hint.textContent = typeof t === "function" ? t("aboutCopied") : "Lien copié.";
        setTimeout(() => { hint.hidden = true; }, 1600);
      }
    } catch (_) {}
  }

  async function refreshUpdateCheckButton(api) {
    try { await refreshGithubUpdateToggle(api); } catch (_) {}
    // legacy button (if still present)

    const btn = document.getElementById("btnToggleUpdateCheck");
    const note = document.querySelector(".about-net");
    if (!btn) return;
    try {
      if (api && api.get_update_prefs) {
        const prefs = await api.get_update_prefs();
        if (prefs && prefs.ok) updateCheckEnabled = prefs.checkUpdates !== false;
      }
    } catch (_) {}
    btn.textContent = updateCheckEnabled
      ? (typeof t === "function" ? t("btnDisableUpdateCheck") : "Désactiver la vérif. GitHub")
      : (typeof t === "function" ? t("btnEnableUpdateCheck") : "Réactiver la vérif. GitHub");
    if (note && typeof t === "function") note.textContent = t("aboutNetNote");
    const repoLbl = document.querySelector('label[for="aboutRepoUrl"]');
    const btnCopy = document.getElementById("btnCopyRepo");
    if (repoLbl && typeof t === "function") repoLbl.textContent = t("aboutRepoLabel");
    if (btnCopy && typeof t === "function") btnCopy.textContent = t("btnCopyRepo");
  }

  async function toggleUpdateCheck() {
    const api = typeof apiReady === "function" ? await apiReady() : (window.pywebview && window.pywebview.api);
    if (!api || !api.set_check_updates) return;
    const next = !updateCheckEnabled;
    try {
      const res = await api.set_check_updates(next);
      if (res && res.ok) updateCheckEnabled = res.checkUpdates !== false;
    } catch (_) {}
    await refreshUpdateCheckButton(api);
    await fillAboutRepo(api);
    await refreshAboutLocalPaths(api);
  }

  async function runUpdateCheck(api) {
    if (!api || !api.check_for_update) return;
    try {
      if (api.get_update_prefs) {
        const prefs = await api.get_update_prefs();
        if (prefs && prefs.ok && (prefs.checkGithubUpdates === false || prefs.checkUpdates === false)) return;
      }
    } catch (_) {}

    try {
      const info = await api.check_for_update();
      if (!info || !info.ok || !info.updateAvailable) return;
      window.__pendingReleaseUrl = info.htmlUrl || (info.repo ? `https://github.com/${info.repo}/releases/latest` : "");
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

  document.getElementById("langSwitch")?.addEventListener("click", (ev) => {
    const seg = ev.target.closest(".hub-lang-seg");
    if (!seg) return;
    const lang = seg.getAttribute("data-lang");
    if (lang) setAppLanguage(lang);
  });
  try {
    const bootLang = (typeof suiteLang === "string") ? suiteLang : "fr";
    syncLangSwitch(bootLang);
  } catch (_) {}

  $("btnAbout").addEventListener("click", async () => {
    try {
      const api = window.pywebview && window.pywebview.api;
      await refreshUpdateCheckButton(api);
      await fillAboutRepo(api);
      await refreshAboutLocalPaths(api);
      await wireRuleshubAbout();
    } catch (_) {}
    const d = $("aboutDialog"); if (d && d.showModal) d.showModal();
  });
  $("btnCopyRepo")?.addEventListener("click", (ev) => { ev.preventDefault(); copyAboutRepo(); });
  $("aboutRepoUrl")?.addEventListener("focus", (ev) => { try { ev.target.select(); } catch (_) {} });
  $("btnAdd").addEventListener("click", pickImages);
  $("btnStripAll").addEventListener("click", stripAll);
  $("btnClear").addEventListener("click", clearList);
  if ($("metaSave")) $("metaSave").addEventListener("click", saveEdits);
  if ($("metaStrip")) $("metaStrip").addEventListener("click", stripActive);
  if ($("metaClose")) $("metaClose").addEventListener("click", closeMeta);
  if ($("btnOpenRelease")) $("btnOpenRelease").addEventListener("click", openReleaseInBrowser);
  else if ($("btnUpdateNow")) $("btnUpdateNow").addEventListener("click", openReleaseInBrowser);
  if ($("btnUpdateLater")) $("btnUpdateLater").addEventListener("click", dismissUpdateLater);

  (async () => {
    const api = await apiReady();
    await bootSuite(api);
    try { syncLangSwitch(suiteLang); } catch (_) {}
    refreshLabels();
    wireDropzone();
    renderCards();
    setTimeout(() => runUpdateCheck(api), 900);
  })();
})();
