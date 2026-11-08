# Replacing Diva’s photos, fonts, and music

This site does not include generated personal photos or idol images. Replace placeholders only with photos you own or official images you are allowed to use.

## Gallery

Copy real photos into `public/assets/photos/` using the existing names `photo-01.jpg` through `photo-06.jpg`. Update the matching `caption` in `src/config/content.ts` if desired. The gallery will show the real image instead of its filename placeholder. Until then, each placeholder opens a modal with its caption and the exact replacement path; no fabricated photo is shown.

## K-pop photos

Place official or owner-provided LNGSHOT images at `public/assets/kpop/lngshot/group.jpg` and `member-01.jpg` through `member-04.jpg`. Place CORTIS images at `public/assets/kpop/cortis/group.jpg` and `member-01.jpg` through `member-04.jpg`. Update the `groupPhoto` or `members` paths and labels in `src/config/content.ts` if your files use different names. Do not add AI-generated or randomly sourced idol photos.

## Birthday date and text

Edit `name`, `birthdayDate`, the greeting, letter, wishes, and captions in `src/config/content.ts`. The photobooth renders the configured name and date on the image.

## Optional music

Put an audio file you may use in `public/assets/music/`, then set `music.src` in `src/config/content.ts`, for example `/assets/music/birthday-song.mp3`. The player is hidden until a local path is configured and never plays automatically.

## Fonts

The default Cormorant Garamond, Manrope, and Caveat fonts are loaded from Google Fonts in `src/styles.css`; an internet connection is needed for those exact typefaces, with CSS fallbacks available. For local/offline fonts, add licensed `.woff2` files under `public/assets/fonts/`, register them with `@font-face` in `src/styles.css`, and update the font-family names/tokens there. The rest of the website does not depend on a third-party font service.

The photobooth camera and local uploads are processed in the browser. They are not uploaded to a server.
