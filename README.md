# AirOps EMEA launch party

Responsive landing page based on the supplied Figma design, with the London event hero, brand logos, AirOps overview, contact CTA, footer, and accessible registration dialog.

## Development

Requires Node.js 20 or later. No third-party build dependencies.

- `npm run dev` serves the page at http://localhost:3000.
- `npm run build` copies the site into `dist` and verifies HTML asset references.
- Vercel builds with `npm run build` and publishes `dist`.

## Registration

The custom five-field form submits to HubSpot's public Forms Submission API for portal `21510907` and form `28972c96-9ec5-4744-a757-03212c23ee66`. Property names supplied by the owner: `firstname`, `email`, `company`, `jobtitle`, `hdyhau_event`. The first field now asks for first name, matching its property.

Native validation runs before submission. Pending requests disable fields to prevent duplicates; failed requests preserve values and allow retry. Success appears only after a successful HubSpot HTTP response. No API secret is required. The form does not assert unverified marketing subscription consent or skip HubSpot validation. Additional required HubSpot fields, CAPTCHA, or consent requirements may cause rejection and must be reconciled with the account configuration.

The lower “Work with us” CTA opens AirOps’ existing book-a-call page with the supplied email; it is separate from event registration.

## Assets and verification

Figma assets are committed locally, with their source URLs in `asset-manifest.json`. The hero uses an optimized WebP; the original export is retained. Saans and Serrif Light are sourced from AirOps’ published website.

Build and JavaScript syntax checks pass. Browser-based desktop/mobile checks and live form submission remain pending because the browser security policy service was unavailable during verification. No test registration has been submitted.
