# AirOps EMEA launch party

Responsive landing page based on the supplied Figma design, with the London event hero, brand logos, AirOps overview, contact CTA, footer, and accessible registration dialog.

## Development

Requires Node.js 20 or later. No third-party build dependencies.

- `npm run dev` serves the page at http://localhost:3000.
- `npm run build` copies the site into `dist` and verifies HTML asset references.
- Vercel builds with `npm run build` and publishes `dist`.

## Registration setup — pending portal verification

The event form ID is `28972c96-9ec5-4744-a757-03212c23ee66`.
Set the verified HubSpot `portalId` and `region` in `public/config.js` to enable the official HubSpot embed. The portal on the AirOps website (21510907) returned HTTP 403 for this form; do not assume it is the right portal.
Until configured, visitors can type in all five modal fields, but Submit remains disabled with a clear notice. Entries stay in the current page only and are not sent or saved. HubSpot controls its actual fields, consent, spam protection, and successful submission behavior once connected.

The lower “Work with us” CTA opens AirOps’ existing book-a-call page with the supplied email; it is separate from event registration.

## Assets and verification

Figma assets are committed locally, with their source URLs in `asset-manifest.json`. The hero uses an optimized WebP; the original export is retained. Saans and Serrif Light are sourced from AirOps’ published website.

Build and JavaScript syntax checks pass. Browser-based desktop/mobile checks and live form submission remain pending because the browser security policy service was unavailable and the HubSpot portal is not yet verified.
