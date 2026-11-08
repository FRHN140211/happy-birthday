# Implementation Plan — A Little World for Divaaa

## Product approach

Build this as a static, client-side React + TypeScript website with Vite. It will not use a server or database: personal images, camera capture, template composition, and PNG download remain in the browser. This keeps the requested photo workflow local and avoids sending Diva’s photos anywhere. The site is intended for hosted HTTPS, where browser camera access becomes available after Diva explicitly presses **Start Camera**.

The experience has six distinct, sequential scenes rather than one long page: opening letter, birthday greeting, wishes, K-pop corner, memories gallery, and final photobooth. Only the active scene is presented at a time, with a small progress indicator, back/continue controls, and gentle transitions. The opening scene requires opening the envelope before its letter button appears. Scene navigation preserves a sense of discovery while allowing people to revisit earlier scenes.

## Visual direction

- **Design movement:** Korean scrapbook and vintage stationery, shaped with modern editorial composition and two restrained K-pop photobook accents.
- **Core principles:** intimate and personal; layered but legible; pink and cream first; motion is gentle and purposeful.
- **Color philosophy:** use ivory and cream as generous paper-like surfaces, soft/baby pink for celebration, dusty rose and chocolate brown for warmth and readable text, and muted black/silver/denim/cherry only inside relevant K-pop and photobooth treatments.
- **Layout paradigm:** a gift-book sequence with individually composed scene “pages”, asymmetric paper layers, handwritten side notes, and deliberate negative space. Wishes and cards use a varied staggered arrangement rather than a repeated generic card grid.
- **Signature elements:** an illustrated envelope with a heart seal; small washi strips, stamps, flowers and handwritten labels; Polaroid/photo-card framing carried consistently into the K-pop and memory scenes.
- **Interaction philosophy:** every control has a clear purpose and state. Opening a letter reveals the next action; photos are never fabricated; camera activation is user-initiated; template, capture, retake and save states remain visible and understandable.
- **Animation:** restrained envelope flap and letter reveal, low-amplitude float, short fade/slide scene transitions, and subtle photo hover. Respect `prefers-reduced-motion`; no autoplay audio or camera.
- **Typography:** Cormorant Garamond (editorial serif headings), Manrope (clean body/UI), and Caveat (small handwritten annotations), with system fallbacks and a compact hierarchy. By default the fonts are imported from Google Fonts; optional local/offline WOFF2 replacement instructions are in `ASSET_GUIDE.md`.
- **Brand essence:** a small, polished birthday keepsake made specifically for Diva; warm, playful, thoughtful.
- **Brand voice:** affectionate and natural, with short lines such as “A little something for you…” and “Let’s make a little memory together, Diva ♡”.
- **Wordmark/mark:** a custom tiny flower and heart-seal motif beside the “for Diva” wordmark, drawn as original SVG/CSS rather than imitating a K-pop group or album logo.
- **Signature brand color:** Dusty Rose `#C88799`, anchored by Cream `#FFF5E8` and Ivory `#FFFCF7`.

Decorative details are original CSS/inline SVG artwork (envelope, flowers, ribbons, stars, labels and paper effects). No idol likenesses or personal photographs are generated or sourced. Missing personal and official K-pop photos appear as clearly labeled placeholders until the owner adds real assets.

## Scenes and behavior

1. **Open Your Letter:** cream introduction, floating envelope and stationery details, “A Little Something For You...”, the supporting line and “To: Diva ♡”. Clicking the envelope opens it and reveals **Open Your Letter**.
2. **Birthday greeting:** “Happy Birthday, Divaaa!”, the supplied English subheading and the complete warm Indonesian letter, revealed gently on stationery.
3. **Little wishes:** all six supplied Indonesian wishes on layered, varied pink/cream notes, plus the exact English blessing.
4. **Her Little K-Pop World:** separate original LNGSHOT and CORTIS scrapbook treatments. Use official-photo upload slots for group and member assets, captions, and the two exact supplied mini-captions. Accent treatments stay within the site’s pink/cream identity.
5. **Little Moments, Big Memories:** six configurable photo paths and captions, scrapbook/Polaroid styling, hover states and a keyboard-accessible lightbox. Empty photo paths display explicit add-photo placeholders that also open a modal with the caption and replacement path, never false photos.
6. **Diva’s photobooth:** four selectable templates; user-initiated camera permission and live preview; front-facing preference on mobile and camera selection where available; 3-2-1 countdown and four sequential shots; optional local upload fallback; preview, retake, strip or 2×2 layout, PNG download, and change-template/restart actions. Canvas composition will keep faces inside image bounds, apply the selected frame, and include the configured date (default “08 NOVEMBER”), “DIVA’S BIRTHDAY” and “Made with love ♡”. Camera tracks stop after photos are captured and whenever Diva leaves the photobooth scene. Uploads and generated output stay in browser memory and are not sent to a server.

The optional music control is available only when a local track is configured. It is explicit play/pause and never autoplays.

## Implementation structure

- `src/main.tsx`, `src/App.tsx`: app bootstrap and six-scene state/navigation.
- `src/config/content.ts`: editable name, greeting, letter, wishes, birthday date, photo/caption paths, official LNGSHOT/CORTIS assets, and optional music path.
- `src/components/`: shared scene navigation, photo placeholders, optional music control, and scrapbook decorations.
- `src/scenes/`: one component per scene (letter, greeting, wishes, K-pop, gallery, photobooth).
- `src/features/photobooth/`: camera lifecycle, local-upload fallback, countdown/capture state, template definitions, Canvas composition and PNG download.
- `src/styles.css`: palette, global typography, responsive layout, and scene-specific styling.
- `public/assets/photos/`, `public/assets/kpop/cortis/`, `public/assets/kpop/lngshot/`, `public/assets/decorations/`, `public/assets/music/`, `public/assets/fonts/`: organized, owner-replaceable files/placeholders.
- `public/manus-routes.json`: route manifest for the single `/` page.
- `ASSET_GUIDE.md`: instructions for adding Diva’s real photos, official K-pop images, captions, optional music, and optional local fonts.

## Delivery shape

The production artifact is static output (`dist/`) with no backend or photo-upload endpoint. The project includes the content/asset guide, responsive styling, accessible interactions, camera permission/error states, and a local PNG export. The birthday date is configurable and defaults to “08 NOVEMBER”.
