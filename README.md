# AirOps EMEA launch party

Responsive landing page based on the supplied Figma design, with the London event hero, brand logos, AirOps overview, contact CTA, footer, and accessible registration dialog.

## Development

Requires Node.js 20 or later. No third-party build dependencies.

- `npm run dev` serves the page at http://localhost:3000.
- `npm run build` copies the site into `dist` and verifies HTML asset references.
- Vercel builds with `npm run build` and publishes `dist`.

## Registration

The registration dialog uses the owner-provided HubSpot updated-form embed for portal `21510907`, region `na1`, and form `28972c96-9ec5-4744-a757-03212c23ee66`. It loads once, when the dialog is opened, using `https://js.hsforms.net/forms/embed/21510907.js` and an `hs-form-frame` container.

HubSpot controls the live fields, styling inside the embedded form, consent, spam protection, submission, and thank-you behavior. The page listens for the matching form's ready and successful-submission events. Loading failures display a notice, and no placeholder fields collect unsent entries.

The lower “Work with us” CTA opens AirOps’ existing book-a-call page with the supplied email; it is separate from event registration.

## Assets and verification

Figma assets are committed locally, with their source URLs in `asset-manifest.json`. The hero uses an optimized WebP; the original export is retained. Saans and Serrif Light are sourced from AirOps’ published website.

Build and JavaScript syntax checks pass. Browser-based desktop/mobile checks and live form submission remain pending because the browser security policy service was unavailable during verification. No test registration has been submitted.
