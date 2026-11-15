# tyre.ge Operations Demo

An interactive operations dashboard for a tire retailer. Explore orders, review a simulated payment decision, inspect customer records, and browse inventory through the existing Georgian admin interface.

This repository contains a standalone extraction of the project's synthetic demo component. It runs entirely in the browser and is suitable for GitHub Pages.

## Try the workflow

1. Open **შეკვეთები** (Orders), search the list and select an order to inspect its items and timeline.
2. Open **გადახდები** (Payments), select a payment and try approving or rejecting it.
3. Explore **კლიენტები** (Customers) and **მარაგები** (Inventory).

The overview and other panels use fixed illustrative totals. Decisions only change local in-memory state; refresh the page to reset the session. There is no backend, authentication, bank connection or persistent transaction processing in this repository. Names, orders and payment records are explicitly synthetic. This is a functional UI demonstration, not the complete commerce platform.

## Run locally

The prebuilt version needs no dependencies. From the repository root:

```sh
python -m http.server 8080 --directory docs
```

Open `http://localhost:8080`. Use an HTTP server instead of opening the HTML file directly.

## Build from source

The app uses Angular 21, TypeScript and Sass. Use Node.js 22.12+ or Node.js 24, with npm:

```sh
cd sources
npm ci --ignore-scripts
npm run build
```

The build writes to `docs/`. Source and build configuration are in `sources/`; runtime assets are in `docs/`. Dependency versions and integrity hashes are locked. `sources/build-provenance.json` records the component hashes and verification scope. No source maps, private configuration or production data are included.

For GitHub Pages, select **Deploy from a branch → main → /docs**. The relative base URL supports repository subpaths; no server-side routes or API configuration are required.

## Verification

The production build passed. The dependency lock passed an offline `npm ci --dry-run --ignore-scripts` check. `npm audit --omit=dev` for this isolated package returned zero advisories on 15 November 2026; this does not describe the full application's dependencies. A fresh dependency installation was not performed during extraction.

## ქართულად

საბურავების მაღაზიის ოპერაციების ინტერაქტიული დემო: შეკვეთები, გადახდის საცდელი დადასტურება, კლიენტები და მარაგები. ყველა ჩანაწერი სინთეტიკურია; რეალურ ბანკთან ან სერვერთან კავშირი არ არის. ცვლილებები მხოლოდ მიმდინარე გვერდის მეხსიერებაში რჩება და განახლებისას თავიდან იწყება.
