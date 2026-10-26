# LUMA — The Science of Light. The Power to Heal.

[![React](https://img.shields.io/badge/React-19.3.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Display Fidelity](https://img.shields.io/badge/Display_Matrix-FHD_|_2K_|_4K-EC2024?style=flat-square)](./ARCHITECTURE.md)
[![PRD Quality Check](https://img.shields.io/badge/PRD_Acceptance-100%25_Passing-success?style=flat-square)](./prd.json)
[![License](https://img.shields.io/badge/License-Proprietary-black?style=flat-square)](#)

> **Official Frontend Repository for LUMA**  
> Calibrated for **Norvexa Technologies**  
> Live Production E-Commerce Platform for Medical-Grade Photobiomodulation & Red Light Therapy.

---

## 🌟 Overview

**LUMA** is an ultra-premium, high-performance light therapy and health-tech e-commerce platform built with **React 19**, **Vite 8**, and **Tailwind CSS v4**.

Engineered with extreme precision against a master 3840px Photoshop design canvas (`Luma-Homepage-Design.psd`), LUMA delivers uncompromising visual fidelity, seamless micro-animations, dedicated multi-screen responsiveness (Laptop, MacBook, Full HD, 2K QHD, and 4K UHD), and an entirely self-hosted typography system with zero external font CDNs.

📖 **Detailed System Architecture:** Read the full engineering breakdown in [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## ✨ Key Features

- **🎯 Exact PSD Canvas Calibration:** Layer-by-layer alignment with 225+ design layers across coordinates, font weights, and unboxed radial ambient light geometry.
- **⚡ Zero-CDN Local Font Engine:** Exclusively loads the `Manrope` font family across 7 calibrated weights (`200` to `800`) directly from local TTF files (`public/assets/FONT/`), eliminating third-party latency and layout shifts.
- **🖥️ Dedicated Multi-Display CSS Engine:** Dynamic viewport optimization via `src/styles/screens.css` targeting 1366px laptops, 1440px MacBooks, 1536px Windows displays, 1920px Full HD, 2560px 2K QHD, and 3840px 4K UHD screens.
- **🛍️ Reactive Slide-Over Cart Drawer:** Accessible, keyboard-navigable shopping bag drawer with backdrop blur and instant body scroll-locking.
- **🌍 Regional Currency Switcher:** Real-time localization support for AED (UAE Dirham), USD, EUR, and GBP with custom currency flag triggers.
- **🧪 Interactive 1-Minute Diagnostic Quiz:** Step-by-step diagnostic assessment recommending optimal light therapy devices based on user health objectives.
- **⚡ Before & After Interactive Comparison:** Interactive dual-image split slider showcasing verified clinical results across dermatology and recovery trials.
- **🤖 Autonomous Ralph Loop Verification:** 17/17 user stories in `prd.json` verified with zero breaking changes and fully automated Playwright multi-screen visual suites.

---

## 📐 Multi-Display Responsive Matrix

| Breakpoint Tier | Screen Range | Target Devices | Calibration Highlights |
|---|---|---|---|
| **Mobile** | `< 640px` | iOS / Android smartphones | Stacked touch-optimized cards, mobile navigation drawer |
| **Tablet** | `640px – 1023px` | iPad Air, iPad Mini, Surface | Adaptive 2-column grids, fluid spacing |
| **Laptop 1366** | `1280px – 1439px` | 13"-14" compact laptops | 72px header, 1320px content constraints |
| **MacBook 1440** | `1440px – 1535px` | MacBook Air, MacBook Pro 14" | 78px header, calibrated 175px CTA buttons |
| **Windows 1536** | `1536px – 1799px` | 15.6" laptops (125% DPI) | 84px header, 1480px content constraints |
| **Full HD 1080p** | `1800px – 2399px` | Standard 1920×1080 monitors | 96px header, 74px headline, 1720px grids |
| **2K QHD 1440p** | `2400px – 3199px` | 27"-32" Pro & Gaming displays | 128px header, 96px headline, 2300px containers |
| **4K UHD 2160p** | `≥ 3200px` | 3840×2160 UHD & Ultrawide | 191px header, 108px headline, 3200px bounds |

---

## 📁 Project Structure

```
luma/
├── .github/
│   └── workflows/
│       └── ci.yml                     # Continuous integration build pipeline
├── public/
│   └── assets/
│       ├── FONT/                      # Local Manrope TTF font family (200-800)
│       ├── before_after/              # Clinical comparison photography
│       ├── benefits/                  # Clinical benefit iconography and media
│       ├── experts/                   # Key opinion leader cards and assets
│       ├── footer/                    # Social and contact icons
│       ├── guarantees/                # Certification and warranty iconography
│       └── products/                  # High-resolution hardware catalog photos
├── scripts/
│   ├── analyze_all_sections_compare.py  # Visual difference analysis suite
│   ├── capture_and_compare_sections.py  # Playwright DOM vs PSD section slicer
│   ├── correlate_sections.py            # Coordinate mapping utility
│   ├── detailed_section_inspect.py      # Layer typography inspection
│   ├── generate_slices.py               # PSD composite automated slicer
│   ├── inspect_text_layers_by_sec.py    # Text layer font validator
│   ├── test_all_monitors_ralph_loop.py  # 9-monitor automated test matrix
│   └── test_responsiveness_loop.py      # Cross-breakpoint regression tester
├── src/
│   ├── components/
│   │   ├── AboutSection.jsx           # Brand heritage & Dubai story
│   │   ├── AssessmentQuiz.jsx         # Interactive 1-minute diagnostic quiz
│   │   ├── BeforeAfter.jsx            # Interactive clinical split comparison
│   │   ├── BenefitsOverview.jsx       # 6 clinical pillars with circular badges
│   │   ├── CartDrawer.jsx             # Slide-over shopping bag drawer
│   │   ├── ClinicalTech.jsx           # Wavelength penetration spectrograph
│   │   ├── CommunitySection.jsx       # LUMA Community banner
│   │   ├── CurrencyDropdown.jsx       # Multi-currency localization selector
│   │   ├── ExpertTestimonials.jsx     # Medical expert video testimonial cards
│   │   ├── FaqSection.jsx             # Two-column accordion knowledge base
│   │   ├── Footer.jsx                 # Site navigation, disclosures & newsletter
│   │   ├── Hero.jsx                   # Unboxed ambient hero backdrop & CTAs
│   │   ├── MobileDrawer.jsx           # Responsive slide-over navigation
│   │   ├── Navbar.jsx                 # Frosted glass sticky header
│   │   ├── ProductRange.jsx           # Hardware catalog (Nova, Surge, Go, Glow)
│   │   ├── TopBanner.jsx              # Shipping notification & currency trigger
│   │   ├── TrustGuarantees.jsx        # 60-day trial & warranty assurances
│   │   └── TrustStrip.jsx             # 8-parameter continuous certification ticker
│   ├── styles/
│   │   └── screens.css                # Dedicated multi-screen display CSS
│   ├── App.jsx                        # Main application container & state host
│   ├── index.css                      # Tailwind v4 theme, local font-face definitions
│   └── main.jsx                       # React 19 root bootstrap
├── ARCHITECTURE.md                    # In-depth system architecture documentation
├── index.html                         # HTML5 shell
├── package.json                       # Dependencies and build scripts
├── prd.json                           # Acceptance criteria & Ralph loop tracking (17/17 passing)
├── progress.txt                       # Detailed Ralph loop implementation log
├── prompt.md                          # Ralph loop agent instructions
├── ralph.sh                           # Autonomous execution runner
├── vite.config.js                     # Vite 8 configuration with Tailwind v4 plugin
└── .gitignore                         # Clean production git configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher

### Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/NorvexaTechnologies/luma-frontend.git
cd luma-frontend
npm install
```

### Development Server
Start the local Vite dev server with hot module replacement:

```bash
npm run dev
```

Open your browser at `http://localhost:5173/` (or the URL displayed in your terminal).

### Production Build
Compile and bundle the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🧪 Testing & Verification Scripts

The repository includes an automated testing suite powered by Playwright to verify responsiveness and visual alignment:

```bash
# Run multi-monitor test suite across 9 screen resolutions (1280px to 3840px):
python3 scripts/test_all_monitors_ralph_loop.py

# Run responsive breakpoint testing suite:
python3 scripts/test_responsiveness_loop.py
```

---

## 🚢 Deployment

The application is optimized for zero-configuration deployment on **Vercel**:

```bash
# Deploy with Vercel CLI
npx vercel --prod
```

The repository includes `.vercelignore` to ensure development test scripts, PSD source files, and temporary image dumps are excluded from deployment bundles.

---

## 📄 License & Intellectual Property

Proprietary and Confidential. Copyright © 2026 **Norvexa Technologies**. All rights reserved.
