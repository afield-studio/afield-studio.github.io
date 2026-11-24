<img src="assets/img/afield-icon.svg" alt="" width="48" height="48" />

# Afield Studio

The website for Afield Studio, an independent product studio. Live at **[afield-studio.github.io](https://afield-studio.github.io)**.

It's a static site (plain HTML, CSS, and a little JavaScript) served by GitHub Pages from `main`. There's no build step.

## Structure

```
index.html            Homepage: a notebook page with a short intro, then each app as a taped-on iPhone screenshot
pillars/privacy/      Pillars privacy policy
pillars/terms/        Pillars terms of use
assets/css/home.css   Homepage styles
assets/css/site.css   Legal page styles
assets/js/main.js     Header border on scroll, footer year
assets/img/           Studio mark, app icons, and app screenshots
```

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Adding a product

1. Add an `<article class="entry">` to the apps list in `index.html`: an iPhone-sized screenshot (`assets/img/<app>-screen.webp`, 780×1688, status bar included) with a handwritten caption, the app name, a one-line kind, and why it was built.
2. Put its icon and a screenshot in `assets/img/`.
3. If it needs legal pages, copy `pillars/` to `<product>/`, rewrite the text, and link them from the homepage footer.
