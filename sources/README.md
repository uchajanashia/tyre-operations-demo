# Demo source

This folder is a standalone Angular application. Run `npm ci --ignore-scripts` and `npm run build`; output is written to `../docs/`. See the repository README for the full workflow and limitations.

`src/admin-demo.page.ts`, `.html`, and `.scss` retain the existing synthetic demo component. `src/main.ts` bootstraps that component without the production router, API client, authentication or integration providers. Direct dependency versions are pinned and the dependency lock is included. Do not copy production configuration into this demo.
