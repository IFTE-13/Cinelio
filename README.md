# Cinelio — Explore Cinema

> A modern, editorial movie discovery and catalog experience inspired by the usefulness of IMDb, but built with a clean, minimal, and vibrant aesthetic.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🎬 Overview

**Cinelio** is a cinema discovery platform designed for cinephiles, casual viewers, and film students alike. It avoids the cluttered, ad-heavy layouts of legacy movie databases in favor of an editorial presentation that puts cinema first: high-resolution typography, immersive edge-to-edge photography, and instant interaction.

> [!NOTE]
> **Cinelio is strictly a discovery catalog and metadata database.** It does NOT host, stream, embed, or download movie media. All video content is delivered exclusively via official YouTube trailer embeds.

---

## ✨ Key Features

### 🎨 Dynamic Cinema Theming Engine
- **5 Curated Color Themes**:
  - 🟡 **Cinema Gold** (Warm amber festival aesthetic)
  - 🔴 **Velvet Red** (Classic red-carpet theater drape)
  - 🔵 **Neon Noir** (Electric cyan cyber-thriller)
  - 🟢 **Emerald Cinema** (Vintage Criterion jade)
  - 🟣 **Amethyst Arthouse** (Deep violet auteur mood)
- **Display Modes**: Seamless Light and Dark mode switching with system preference detection.
- **Instant Live Variable Injection**: Seamlessly updates `--theme-accent`, `--primary`, `--ring`, and glow highlights across the entire UI at runtime without page reloads.

### 🎲 "Surprise Me" Cinema Roulette
- Overcome decision fatigue with an interactive film reel picker.
- Filter random recommendations by genre and minimum critical score (7.0+, 7.5+, 8.0+ Masterpiece).
- Preview poster art, runtime, synopsis, and launch official trailers with one click.

### ⌘ Universal Command Palette (`Cmd+K` / `Ctrl+K`)
- Global keyboard shortcut accessible anywhere in the application.
- Real-time debounced search across films, directors, actors, cinema eras, and moods.
- Quick jumping to Cinema Eras, Mood Matcher, Auteur Showcase, and Saved Favorites.
- Visual history of recent searches with instant re-triggering.

### 🎭 Cinema Mood Matcher (`/moods` & `/moods/[mood]`)
- Emotional discovery engine mapping how you want to feel tonight:
  - **Mind-Bending & Existential** (Puzzles of reality, Nolan/Villeneuve/Fincher)
  - **Neon Nocturne & Cyber Noir** (Rain-soaked asphalt, synthetic synthesizers)
  - **Bittersweet & Poetic Romance** (Intimate glances, delicate longing)
  - **Adrenaline & Kinetic Thrills** (Visceral velocity, edge-of-seat momentum)
  - **Whimsical & Wonderfully Cozy** (Ghibli wonder, gentle magic)
  - **Atmospheric Dread & Psychological Chills** (Slow-burn paranoia, Kubrick dread)
  - **Monumental Epics & Mythic Quests** (Towering desert sagas, cosmic voyages)

### 🎬 Auteur & Visionary Directors Showcase (`/directors`)
- Curated gallery celebrating the world's most influential cinematic auteurs.
- Comprehensive dossiers for Christopher Nolan, Denis Villeneuve, Quentin Tarantino, Martin Scorsese, Hayao Miyazaki, Greta Gerwig, Bong Joon-ho, Stanley Kubrick, Wes Anderson, and David Fincher.
- Explores signature motifs, trademark camera techniques, memorable quotes, and direct filmography links.

### ⏳ Cinema Eras / Decades Time Machine (`/eras` & `/eras/[era]`)
- Dedicated historical journey spanning 50+ years of film evolution:
  - **1970s**: *New Hollywood & Auteur Renaissance* (Coppola, Scorsese, Kubrick)
  - **1980s**: *Neon, Synth & High-Concept Wonder* (Scott, Cameron, Spielberg)
  - **1990s**: *Indie Revolution & Digital Dawn* (Tarantino, Fincher, Wachowskis)
  - **2000s**: *Millennium Visionaries* (Nolan, Miyazaki, del Toro)
  - **2010s**: *Prestige Renaissance & Visual Spectacle* (Villeneuve, Gerwig, Peele)
  - **2020s**: *Contemporary Visions & New Horizons* (70mm epics, desert mythologies)
- Era-specific catalog browsing with chronology, popularity, and rating filters.

### 📊 Cinephile Watchlist Insights & Analytics (in `/favorites`)
- **Estimated Watchtime**: Calculates total hours and minutes of cinema bookmarked.
- **Taste Quality Score**: Average critical rating gauge with taste classification (Elite, Auteur, Eclectic).
- **Genre Affinity Chart**: Visual percentage bars tracking your favorite storytelling genres.
- **Decades Distribution**: Breakdown of which film eras dominate your watchlist.
- **In-Place Multi-Filtering**: Instantly filter favorites by Genre and Era directly in the page.

### 🎞 Spotlight Edge-to-Edge Hero
- Full-screen panoramic carousel highlighting trending and critically acclaimed works.
- Snappy 0.35s slide transitions with Ken Burns ambient zoom effects.
- Direct trailer launcher modal and favorite toggling.

### ⚡ Instant Quick View Modals
- Preview any film's release details, ratings, synopsis, and trailer without navigating away from your discovery grid.

### 💾 Zero-Auth Client State (`localStorage`)
- **My Favorites**: Complete local watchlist with persistent bookmarking and taste analytics.
- **Recently Viewed**: Chronological history of films explored in the current browser.
- **Recent Searches**: Track your discovery queries locally without trackers or cookies.

### 🛡 Resilient Offline Catalog
- Runs out of the box with a rich offline catalog of legendary films, casts, trailers, and collection data if no TMDB API key is supplied.

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing across all TMDB schemas)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom CSS variable mapping
- **Motion**: [Framer Motion](https://www.framer.com/motion/) for fluid modals, carousels, and card interactions
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Theme**: React Context + `next-themes` + `localStorage`
- **Data Source**: [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/cinelio.git
cd cinelio
```

### 2. Install dependencies
```bash
pnpm install
# or npm install / yarn install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root:

```env
# The Movie Database (TMDB) v3 API Key (Server-side only)
# Get your free key at: https://www.themoviedb.org/settings/api
TMDB_API_KEY=your_tmdb_api_key_here
```

> [!TIP]
> **No TMDB Key?** Cinelio works immediately without an API key using the built-in curated fallback catalog!

### 4. Run Development Server
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to explore Cinelio.

### 5. Build for Production
```bash
pnpm run build
pnpm run start
```

---

## 📂 Project Architecture

```
├── app/
│   ├── api/                  # Server Route Handlers (proxying TMDB safely)
│   │   ├── discover/         # Catalog discovery with multi-filtering & eras
│   │   ├── movies/           # Movie details & list endpoints
│   │   └── search/           # Multi-entity search (movies, people)
│   ├── collections/[id]/     # Film saga & franchise collections
│   ├── directors/            # Auteur & Visionary Directors Showcase
│   ├── discover/             # Filterable catalog (genres, scores, years)
│   ├── eras/                 # Cinema Eras Time Machine
│   │   └── [era]/            # Decade-specific catalog routes (1970s–2020s)
│   ├── favorites/            # Client watchlist & Cinephile Insights analytics
│   ├── genres/               # 19 TMDB genre categories
│   │   └── [id]/             # Dedicated genre film listings
│   ├── moods/                # Cinema Mood Matcher emotional discovery
│   │   └── [mood]/           # Dedicated atmospheric mood film listings
│   ├── movies/               # Category listings (trending, top-rated, etc.)
│   │   └── [id]/             # Rich movie detail pages with cast, trailers, similar
│   ├── people/[id]/          # Filmmaker & cast filmographies
│   ├── search/               # Dedicated search page with recent queries
│   ├── layout.tsx            # Root layout with theme providers & header
│   └── page.tsx              # Full-screen landing showcase
├── components/
│   ├── layout/               # Header, container, footer
│   ├── movie/                # Movie cards, rows, quick-view, roulette, hero
│   ├── search/               # Command palette (Cmd+K)
│   └── ui/                   # Rating badges, buttons, theme customizer
├── contexts/                 # Favorites, Recently Viewed, Theme Accent providers
├── lib/
│   ├── tmdb/                 # TMDB client, image helpers, eras, moods, directors, fallback data
│   └── utils.ts              # Class merging utilities
└── types/
    └── cinema.ts             # TypeScript interfaces for movies, credits, genres
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
