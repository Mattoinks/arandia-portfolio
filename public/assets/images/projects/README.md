# Project images

One folder per project, named after its `slug` in `src/lib/data.ts`:

- `kalinga/` — KALINGA
- `sahari-pay/` — SAHARI PAY
- `signa2z/` — SIGNA2Z

In each folder:

- `cover.png` — the main image (Work section, case-study cover). Set as the project's `thumbnail`.
- Extra screenshots for the case-study gallery, named by what they show
  (e.g. `admin-dashboard.png`). Prefix phone screenshots with `mobile-` so they
  render in a phone frame. Add them to the project's `gallery` in `data.ts`.

Blur out any real personal data before adding screenshots.
