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
- **Panneau « Métadonnées présentes »** : dès qu'une image est sélectionnée, un
  panneau liste **chaque champ** avec son **nom en clair**, une **courte
  explication** (« GPS = localisation », « Artist = auteur »…) et sa **valeur
  actuelle**. État vide explicite : « Aucune métadonnée détectée ».
  _"Metadata present" panel: on selection, lists every field with a plain-language
  name, a short explanation and its current value; explicit empty state._
- **Ajout / édition** : formulaire toujours visible pour **ajouter ou modifier**
  **Auteur**, **Copyright**, **Description**, **Logiciel**, **Date de prise de vue**
  et les **coordonnées GPS** — même sur une image sans métadonnées. Puis
  **Enregistrer avec ces métadonnées** → copie `nom_edited.ext` (sans stripping).
  _Add / edit: always-visible form to add or change Author, Copyright, Description,
  Software, Capture date and GPS coordinates — even on a bare image. Save with this
  metadata → `name_edited.ext` copy (no stripping)._
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

## Soutien / Support

Coups de pouce volontaires · optional tips (app remains free) :

[![PayPal](https://img.shields.io/badge/PayPal-Donate-39ff14?style=for-the-badge&logo=paypal&logoColor=00f0ff&labelColor=050807)](https://www.paypal.com/paypalme/aurevo1)
[![Revolut](https://img.shields.io/badge/Revolut-mr__aurevo__x-00f0ff?style=for-the-badge&logo=revolut&logoColor=39ff14&labelColor=050807)](https://revolut.me/mr_aurevo_x)

---

© 2026 Mr-Aurevo-X — all rights reserved.
