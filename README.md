# AirOps EMEA launch party

Responsive landing page based on the supplied Figma design, with the London event hero, brand logos, AirOps overview, contact CTA, footer, and accessible registration dialog.

## Development

Requires Node.js 20 or later. No third-party build dependencies.

- `npm run dev` serves the page at http://localhost:3000.
- `npm run build` copies the site into `dist` and verifies HTML asset references.
- Vercel builds with `npm run build` and publishes `dist`.

## Registration

The original five-field design is restored: full name, work email, company, job title, and event source. Inputs are editable, but submission is disabled pending verification of HubSpot field mappings and consent requirements. No values are transmitted or saved. The supplied HubSpot identifiers remain in `public/config.js`; the embed is not loaded because it overrides the requested layout.

To enable registration, add or confirm the corresponding fields in HubSpot form `28972c96-9ec5-4744-a757-03212c23ee66` under portal `21510907`, and verify internal property names, required fields, consent, and submission behavior before connecting the custom form.

The lower “Work with us” CTA opens AirOps’ existing book-a-call page with the supplied email; it is separate from event registration.

## Assets and verification

Figma assets are committed locally, with their source URLs in `asset-manifest.json`. The hero uses an optimized WebP; the original export is retained. Saans and Serrif Light are sourced from AirOps’ published website.

Build and JavaScript syntax checks pass. Browser-based desktop/mobile checks and live form submission remain pending because the browser security policy service was unavailable during verification. No test registration has been submitted.
