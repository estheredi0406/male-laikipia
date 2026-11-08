# Male Ranch

A conservation finance portfolio by Esther Sessenou: the 2025 Male Ranch Conservancy plan (Laikipia, Kenya),
revisited with a Theory of Change and a driver-based five-year financial model.

Plain HTML, CSS and JavaScript. No build step.

## Structure
- `index.html` – the site (Home, The plan, Theory of Change, Financial model, About)
- `css/style.css` – design
- `js/model.js` – **all model inputs and sources** (edit numbers here) and the calculation
- `js/app.js` – page logic, charts, Theory of Change content
- `img/` – photos (see below)

## Add your photos
Drop these files into `img/` (JPG, ideally under 400 KB each; wide photos ~2000px):
- `hero.jpg` – wide landscape for the home page
- `portrait.jpg` – square photo of you
- `field-1.jpg` – herding · `field-2.jpg` – giraffe · `field-3.jpg` – binoculars (add more figures in index.html to extend the gallery)
Any photo that is missing shows a topographic pattern instead, so the site works without them.

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Deploy on Render (free static site)
1. In VS Code: Source Control → Initialize Repository → commit → **Publish Branch** (choose a public repository named `male-ranch-revisited`).
2. In Render: **New → Static Site** → connect the repository.
3. Settings: **Build command:** leave empty · **Publish directory:** `.`
4. Click **Create Static Site**. Render gives you a URL like `https://male-ranch-revisited.onrender.com`.
Every push to GitHub redeploys the site automatically.

## Credits
Herding and giraffe photos by Mayibongwe Musariri. Prices and benchmarks are cited next to each input in the Financial model.
