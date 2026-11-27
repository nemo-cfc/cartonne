# Cartonne website

Static website based on the supplied Cartonne HTML design. Serve this repository with any static HTTP server; no build step or API key is required. Relative asset paths support both root domains and GitHub Pages project paths.

- `index.html`: page content and metadata.
- `styles.css`: the page's layout and components, redesigned with the Hallmark skill (`.claude/skills/hallmark`); its first lines record the design decisions.
- `tokens.css`: the Cartonne colours, faces, type scale and spacing as CSS variables.
- `base.css`: shared base rules (focus rings, overflow, reduced motion).
- `.hallmark/`: the redesign's log and the before record that `sloplint --kept` checks against.
- `app.js`: mobile navigation, quote drawer, forms, carousel, gallery filters, swipe indicators and animations.
- `assets/`: local imagery and brand files.

## Quote requests

Both forms validate required details and open an email draft addressed to hello@cartonne.in. Visitors must send the email in their configured mail app. There is no backend submission or lead storage; call links provide a fallback. This replaces the reference HTML's simulated successful submission.

## Validation

Six DOM interaction checks passed: link/image resolution, mobile menu and Escape handling, product quote prefill/dismissal, gallery filtering, form/phone validation, carousel/spec synchronization. JavaScript syntax and local asset/anchor checks passed. The equivalent React/Vite delivery also passed its production build and TypeScript checks.

Phone/tablet/desktop CSS includes touch controls, wrapping, safe-area spacing, keyboard focus handling and reduced-motion support. Visual device checks remain outstanding because the preview browser could not connect to the local server.

Fonts and icon fonts load from Google Fonts and jsDelivr. Page images are local. Existing legal copy remains a placeholder and should be reviewed before launch. Existing stock imagery, testimonials and business claims are retained from the supplied content.
