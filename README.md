<img src="assets/img/afield-icon.svg" alt="" width="48" height="48" />

# Afield Studio

The website for Afield Studio, an independent product studio. Live at **[afield-studio.github.io](https://afield-studio.github.io)**.

It's a static site (plain HTML, CSS, and a little JavaScript) served by GitHub Pages from `main`. There's no build step.

## Structure

```
index.html            Homepage: a desktop with an icon and a window for each app, plus About, Contact and Legal
pillars/privacy/      Pillars privacy policy
pillars/terms/        Pillars terms of use
assets/css/home.css   Homepage styles (desktop, windows, phone home screen)
assets/css/site.css   Legal page styles
assets/js/desktop.js  Homepage windows, dragging, tabs and clock
assets/js/main.js     Legal pages: header border on scroll; year on both
assets/img/           Studio mark, app icons, and app screenshots
```

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Adding a product

1. In `index.html`, add a desktop icon (`<button class="icon" data-open="...">`) and a matching `<section class="win app-win">` window with Story / Features tabs. Add it to the About window's quick links too.
2. Put its icon and a screenshot in `assets/img/`.
3. If it needs legal pages, copy `pillars/` to `<product>/`, rewrite the text, and link them from the homepage footer.
