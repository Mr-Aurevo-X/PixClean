# MetaStrip

**Nettoyeur de métadonnées d'images — 100 % local, 100 % gratuit.**
_Image metadata cleaner — 100% local, 100% free._

© 2026 Mr-Aurevo-X · Windows · aucune télémétrie · mises à jour non garanties.

---

## ⬇️ Télécharger / Download

**[➜ Dernière version (MetaStrip.exe)](https://github.com/Mr-Aurevo-X/MetaStrip/releases/latest)**

Téléchargez `MetaStrip.exe`, double-cliquez, c'est prêt. Aucune installation.
_Download `MetaStrip.exe`, double-click, done. No install._

---

## ✨ Fonctions / Features

- **Glisser-déposer** d'images JPEG · PNG · WebP (ou bouton « Ajouter »).
  _Drag & drop JPEG · PNG · WebP images (or "Add" button)._
- **Détection** : présence de métadonnées **EXIF**, **GPS**, **XMP**, commentaires.
  _Detects EXIF / GPS / XMP / comment metadata._
- **Aperçu** : cliquez « Aperçu / Éditer » pour voir **toutes** les métadonnées
  (EXIF détaillé, GPS décodé en lat/lon, XMP, commentaires) **avant** nettoyage.
  _Preview: click "Preview / Edit" to see all metadata (detailed EXIF, GPS decoded to
  lat/lon, XMP, comments) before cleaning._
- **Édition / ajout** : modifiez **Auteur**, **Copyright**, **Description**,
  **Logiciel** et les **coordonnées GPS** (définir ou effacer), puis
  **Enregistrer les modifications** → copie `nom_edited.ext` (sans stripping).
  _Edit / add: change Author, Copyright, Description, Software and GPS coordinates
  (set or clear), then Save changes → `name_edited.ext` copy (no stripping)._
- **Nettoyage** : supprime toutes les métadonnées et enregistre une copie
  `nom_clean.ext`. **L'original n'est jamais modifié.**
  _Strips all metadata and saves a `name_clean.ext` copy. The original is never touched._
- Aperçu miniature, taille, dimensions, format. Interface FR / EN.

100 % hors-ligne (Pillow). _100% offline (Pillow)._

---

## ⚖️ Légal / Legal

- **100 % local** : vos images ne quittent jamais votre PC.
- **100 % gratuit** pour usage personnel.
- **Mises à jour non garanties** (best-effort via GitHub Releases).
- Le nettoyage ré-encode l'image (JPEG/WebP légèrement recompressés) ; l'original
  reste disponible.
- Logiciel propriétaire — voir [`LICENSE`](./LICENSE).

---

## 🔧 Build (dev)

```bat
pip install -r requirements.txt
Build.cmd
```

Produit `MetaStrip.exe` (fenêtré, icône, `ui/` embarqué). Lancement dev : `Lancer.bat`.

---

© 2026 Mr-Aurevo-X — all rights reserved.
