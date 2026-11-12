# iampartho.github.io

Personal academic website of **Partho Ghosh**: plain HTML + CSS + JavaScript, with no
build step and nothing to install. It is hosted for free on **GitHub Pages** at
<https://iampartho.github.io>.

---

## 1. What's in this folder

```
iampartho.github.io/
├── index.html            About (home): bio, links, news, selected publications
├── publications.html     All papers, preprints & posters (search + filters + BibTeX)
├── projects.html         Ongoing PhD projects with interactive illustrations
├── experience.html       Timeline chart, positions, education, skills
├── achievements.html     Awards & competitions
├── hobbies.html          Hobby cards + photo gallery
├── cv.html               CV viewer + download button
├── 404.html              "Page not found" page (used automatically by GitHub)
├── files/
│   └── Partho_Ghosh_CV.pdf      public CV (phone numbers removed)
├── assets/
│   ├── css/style.css            all styling; colours are at the top
│   ├── js/publications.js       ← YOUR PAPERS (edit this list)
│   ├── js/photos.js             ← YOUR HOBBY PHOTOS (edit this list)
│   ├── js/viz.js                the interactive illustrations
│   ├── js/site.js               dark mode, mobile menu, small effects
│   └── img/                     profile photo, paper thumbnails, hobby photos
├── favicon.svg, robots.txt, sitemap.xml, .nojekyll
└── README.md             this file
```

Only this folder goes online. The slides, the original CV and the other files one
level up (in `website/`) stay private.

---

## 2. Preview it on your computer

Open `index.html` in a browser by double-clicking it. On your Mac you can open it
straight from the mounted lab drive. Every page and link works offline. (Only the
`404.html` page looks unstyled offline; that's expected.)

---

## 3. Publish it (first time, about 10 minutes)

### Step 1: Create the repository on GitHub
1. Sign in at <https://github.com> as **iampartho**.
2. Click **+** (top right) → **New repository**.
3. Repository name: **`iampartho.github.io`** (exactly this, all lowercase).
4. Select **Public**. Do **not** tick "Add a README". Click **Create repository**.

### Step 2: Upload the website (pick ONE way)

**Way A: command line from Argon (recommended; makes updates easy).**
Your Argon account already has a GitHub SSH key (`~/.ssh/github_iampartho`), the same
one you use to push your research code. Run:

```bash
cd /Shared/lss_segerard/parthghosh/website/iampartho.github.io
module load git/2.31.0_gcc-9.3.0     # Argon's default git (1.8) is too old for "init -b"
git config --global user.name "Partho Ghosh"          # one-time setup
git config --global user.email "partho.ndc@gmail.com" # one-time setup
git init -b main
git add -A
git commit -m "First version of my website"
git remote add origin git@github.com:iampartho/iampartho.github.io.git
git push -u origin main
```

**Way B: drag and drop in the browser (no command line).**
On the new repository's page click **"uploading an existing file"**, then drag in
everything that is *inside* the `iampartho.github.io` folder (the HTML files plus the
`assets` and `files` folders), *not* the folder itself. Click **Commit changes**.
(`.nojekyll` is a hidden file; it's fine if it doesn't upload.)

### Step 3: Turn on GitHub Pages
1. In the repository go to **Settings → Pages**.
2. Under **Build and deployment** choose **Source: Deploy from a branch**, then
   **Branch: `main`**, folder **`/ (root)`**, and click **Save**.
3. Wait 1–2 minutes and refresh. The page will say
   **"Your site is live at https://iampartho.github.io/"**. 🎉

### Step 4: Tell the world
Add `https://iampartho.github.io` to the *website* field of your GitHub profile,
your Google Scholar profile ("Homepage"), LinkedIn (Contact info → Website) and
the header of your CV.

*Optional:* to help Google find the site faster, add it in
[Google Search Console](https://search.google.com/search-console) and submit
`https://iampartho.github.io/sitemap.xml`.

---

## 4. Update the site later

Edit files here, then publish the change:

```bash
cd /Shared/lss_segerard/parthghosh/website/iampartho.github.io
module load git/2.31.0_gcc-9.3.0
git add -A
git commit -m "Describe what you changed"
git push
```

(Or, with Way B, open the file on github.com, click the ✏️ pencil, edit and commit.)
The live site updates within about a minute. If you don't see the change, hard-refresh
with **Cmd+Shift+R**.

### Common edits

| I want to… | Edit this |
|---|---|
| Add a paper | `assets/js/publications.js`: copy one `{ … }` block in `PAPERS`, paste it at the top, change the fields. Set `selected: true` to also show it on the home page. Thumbnails go in `assets/img/pubs/`. |
| Add a talk / poster | `assets/js/publications.js`: add an entry to `PRESENTATIONS`. |
| Add a news item | `index.html`: find `<section … id="news">` and copy one `<li>` line. |
| Add hobby photos | Put JPGs in `assets/img/hobbies/`, then add one line per photo to `assets/js/photos.js`. The gallery appears automatically. |
| Personalise hobbies | `hobbies.html`: edit the text and tags in the three cards. |
| Replace the CV | Overwrite `files/Partho_Ghosh_CV.pdf`, keeping the same name. Remember to remove phone numbers from the public copy. Update "Updated …" in `cv.html`. |
| Change the photo | Replace `assets/img/profile.jpg` with a square image (about 480×480 px). |
| Change colours / fonts | The variables at the top of `assets/css/style.css` (`--gold`, `--text`, …). |
| Add a new project | `projects.html`: copy a `<section class="project">` block. Illustrations are optional; a plain image (`<img>`) works too. |
| Update the footer date | Search all `.html` files for "Last updated". |

---

## 5. Notes
* **Ongoing work stays high-level on purpose.** The Projects page explains the *what*
  and *why* only. The illustrations are procedurally generated in the browser (a
  synthetic phantom and a synthetic airway tree): no patient data and no real model
  outputs.
* Paper thumbnails are figures from the published papers / arXiv preprints.
* The site respects light/dark mode automatically (toggle in the top-right corner)
  and the "reduce motion" accessibility setting.
