# 📡 Educational Media Unit — Maris Stella College Negombo
### Official Website Repository

> *Capturing Every Moment, Sharing Every Story*

The official website of the **Educational Media Unit (EMU) of Maris Stella College, Negombo** — a student-run media organisation dedicated to photography, videography, live production, announcing, and technical services within the school community.

> ⚠️ **Note:** This repo is currently a temporary personal repo used for development and hosting. It will be moved to an official organisation account in the future.

---

## 🌐 Live Site

Hosted on **Netlify**, connected to this repo. Every push to `main` triggers an automatic redeploy — changes go live within ~60 seconds.

---

## 📁 Project Structure

```
📦 repo root
├── index.html           → Main website (reads content from site-data.json)
├── style.css            → All website styles
├── script.js            → Animations, carousel, parallax, CARYO trigger
├── site-data.json       → ⭐ Single source of truth for all content
├── admin.html           → Password-protected admin panel
├── admin-style.css      → Admin panel styles
└── assets/
    ├── images/
    │   ├── hero-bg.png
    │   ├── logo.png
    │   ├── photography.png
    │   ├── live.png
    │   ├── Announcing.png
    │   ├── technical.png
    │   └── Team/
    │       ├── 1..png   (President)
    │       ├── 2..png   (Secretary)
    │       ├── 3..png   (Treasurer)
    │       └── 4..png → 11..png  (Committee Members)
    ├── icons/
    │   ├── icon-facebook.png
    │   ├── icon-instagram.png
    │   ├── icon-whatsapp.png
    │   └── icon-youtube.png
    └── pre.gif           → Preloader animation
```

---

## ⚙️ How It Works

This is a **fully static website** — no server, no database, no build step required. Everything is plain HTML, CSS, and JavaScript.

### Content Flow

```
site-data.json  ──→  index.html fetches it on load  ──→  renders all content
      ↑
admin.html writes changes back via the GitHub API
```

1. **`site-data.json`** is the single source of truth — hero text, about paragraph, stats, services, team members, footer, contacts, and social links all live here.
2. **`index.html`** fetches `site-data.json` on every page load and renders everything dynamically — no hardcoded content in the HTML itself.
3. **`admin.html`** is a password-protected CMS that loads the live JSON from GitHub and pushes changes back via the GitHub API as new commits.
4. **Netlify** auto-deploys on every commit to `main` — no manual deploy step needed.

---

## 🔐 Admin Panel

The admin panel (`admin.html`) lets authorised members manage all website content without touching any code.

### How to Access

**Option 1 — Secret trigger:**
1. Open the live website in a browser.
2. Click anywhere on the page (not on a link or input).
3. Type **`CARYO`** (all caps, one letter at a time).
4. The admin panel opens in a new tab automatically.

**Option 2 — Direct URL:**
Navigate to `yourdomain.com/admin.html`.

### What You Can Edit

| Section | What's editable |
|---|---|
| **Navigation Bar** | Link labels and anchor targets, drag to reorder |
| **Hero / Banner** | Main title, subtitle, all four social media links |
| **About & Stats** | About Us paragraph, animated counter values and labels |
| **Services** | Title, description, image — drag to reorder |
| **Team Members** | Name, role, image path — drag to reorder |
| **Footer & Contact** | Organisation name, copyright line, WhatsApp contacts, creator credits |

### How Saving Works

1. Edit something in the admin panel.
2. Hit the **💾 Save** button for that section.
3. The admin writes the updated `site-data.json` to GitHub as a new commit.
4. Netlify detects the commit and redeploys automatically.
5. The live site reflects the change in **~30–60 seconds**.

### GitHub Setup (first time)

Go to the **GitHub Deploy** tab in the admin panel and fill in:

- **GitHub Username**
- **Repository Name**
- **Branch** — `main`
- **Personal Access Token** — create one at [github.com/settings/tokens](https://github.com/settings/tokens) with `repo` scope

The token is saved only in your browser's `localStorage` and is only ever sent to the GitHub API.

---

## 🖼️ Adding or Updating Images

Images can't be uploaded through the admin panel (browser security prevents writing files directly to a server). To update images:

1. Add the image to the correct folder in this repo:
   - Team photos → `assets/images/Team/`
   - Service images → `assets/images/`
2. Commit and push to `main`.
3. In the admin panel, enter the image path (e.g. `assets/images/Team/photo.png`) in the relevant field and save.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 + Tailwind CSS (CDN) |
| Scripting | Vanilla JavaScript (ES6+) |
| Content | JSON (`site-data.json`) |
| Hosting | Netlify |
| Version Control | GitHub |
| CMS | Custom admin panel (`admin.html`) |

### Features

- Smooth momentum scrolling with cubic-bezier easing
- Parallax hero image with fade-out on scroll
- Animated counters triggered on scroll into view
- Desktop carousel with edge-hover arrows and dot navigation
- Mobile snap-scroll carousel for the team section
- Scroll-reveal animations on all major sections
- Auto-hiding header on scroll down, reappears on scroll up
- 4-second preloader with hard fallback
- Secret admin trigger — type `CARYO` anywhere on the page

---

## 📦 `site-data.json` Structure

All content is driven by this file. You can edit it directly in GitHub if needed — Netlify will redeploy automatically.

```json
{
  "nav": [
    { "label": "Home", "href": "home" }
  ],
  "hero": {
    "title": "...",
    "subtitle": "...",
    "fb": "https://...",
    "ig": "https://...",
    "wa": "https://...",
    "yt": "https://..."
  },
  "about": {
    "text": "...",
    "stats": [
      { "value": 20, "suffix": "+", "label": "Years of Excellence" }
    ]
  },
  "services": [
    { "title": "...", "desc": "...", "img": "assets/images/..." }
  ],
  "team": [
    { "name": "...", "role": "...", "img": "assets/images/Team/..." }
  ],
  "footer": {
    "org": "...",
    "college": "...",
    "copy": "...",
    "contacts": [
      { "name": "...", "phone": "94XXXXXXXXX" }
    ],
    "creators": [
      { "name": "...", "ig": "https://www.instagram.com/..." }
    ]
  }
}
```

---

## 👨‍💻 Website Creators

| Name | Instagram |
|---|---|
| Kevan Sanketh | [@kevan_sanketh](https://www.instagram.com/kevan_sanketh/) |
| Sandila Fernando | [@sandilafernando](https://www.instagram.com/sandilafernando/) |

---

## 📞 Contact

For content updates or access requests, reach out via the social media pages listed on the live site.

---

## 📄 Licence

All rights reserved — **Educational Media Unit of Maris Stella College, Negombo**.

This codebase is maintained by the EMU web team. Unauthorised use, copying, or redistribution of this code or its assets outside of Maris Stella College is not permitted.

---

<div align="center">

**Educational Media Unit · Maris Stella College Negombo**

*Capturing Every Moment, Sharing Every Story*

</div>
