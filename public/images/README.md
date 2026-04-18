# public/images

Drop your site assets here. They're served at `/images/<filename>`.

## Logo

Save your logo as **`public/images/logo.png`** (square, 256×256 or 512×512 PNG
works best). The header and hero reference `/images/logo.png`; if the file is
missing the UI falls back to a 🪐 emoji badge so a missing logo never breaks
the deploy.

Usage check after dropping the file:

```
git add public/images/logo.png
git commit -m "Add site logo"
git push
```
