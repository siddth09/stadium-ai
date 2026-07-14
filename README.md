# StadiumAI — Smart Stadium Operations | FIFA World Cup 2026 ⚽🏟️

## 📌 Submission for Prompt Wars - Challenge 4

**Vertical Chosen:** Smart Stadiums & Tournament Operations
**Live Demo:** [StadiumAI on Vercel](https://stadium-ai-three.vercel.app)
**Repository:** [GitHub — siddth09/stadium-ai](https://github.com/siddth09/stadium-ai)

---

## 🎯 Approach and Logic

StadiumAI is a **GenAI-enabled comprehensive digital operations hub** built to enhance the FIFA World Cup 2026 experience for fans, organizers, volunteers, and venue staff.

Instead of treating stadium management as isolated problems (e.g., ticketing vs. navigation vs. crowd control), our approach unifies these into a **single, cohesive React-based ecosystem** powered by the **Google Gemini API**.

### Architecture Overview

```
┌──────────────────────────────────────────────────┐
│                   React Frontend                  │
│  ┌─────────────────────────────────────────────┐ │
│  │  AppContext (useReducer — Single Source of   │ │
│  │  Truth for all real-time stadium state)      │ │
│  └──────────┬──────────────────────────┬───────┘ │
│             │                          │         │
│  ┌──────────▼────────┐    ┌───────────▼───────┐ │
│  │   UI Components    │    │   AI Service      │ │
│  │  Dashboard         │    │  ┌─────────────┐  │ │
│  │  CrowdManager      │    │  │ Gemini API  │  │ │
│  │  Wayfinding        │◄──►│  │ (Primary)   │  │ │
│  │  Transport         │    │  ├─────────────┤  │ │
│  │  Emergency         │    │  │ Rule-Based  │  │ │
│  │  Sustainability    │    │  │ (Fallback)  │  │ │
│  │  Volunteer         │    │  └─────────────┘  │ │
│  └───────────────────┘    └───────────────────┘ │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  Security Layer                              │ │
│  │  DOMPurify · Rate Limiter · CSP · Zod       │ │
│  └─────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### Core Design Pillars

1. **Real-Time State Management:** A unified Context API (useReducer) tracks live crowd densities, transit schedules, emergency alerts, and match state — providing a single source of truth consumed by all components.
2. **Operational Intelligence & Decision Support:** A dedicated AI dashboard generates live, actionable decision-support reports (e.g., "Divert fans from North Gate, dispatch medical to Section 101") based on the real-time stadium data.
3. **Context-Aware GenAI Assistant:** Using the **Google Gemini API**, we provide multilingual, context-aware assistance that knows the live stadium state, the user's role, and safety protocols.
4. **Interactive Visual Intelligence:** An SVG-based Football Stadium heatmap dynamically translates numerical density data into pulsing visual indicators for immediate operational decision-making.

---

## ⚙️ How the Solution Works

### Feature ↔ Challenge Requirement Matrix

| Challenge Requirement | Feature | Component |
|---|---|---|
| **Navigation** | AI-powered seat finder, zone search, accessible routing | `Wayfinding` |
| **Crowd Management** | Real-time SVG heatmap, density tracking per zone | `CrowdManager`, `StadiumMap` |
| **Accessibility** | High-contrast mode, screen reader support (ARIA), sensory room routing, wheelchair routes | `Accessibility`, all components |
| **Transportation** | Live transit options with carbon comparison | `Transport` |
| **Sustainability** | Carbon footprint tracking, recycling rates, renewable energy metrics | `Sustainability` |
| **Multilingual Assistance** | 12-language support via i18n + Gemini multilingual prompting | `AIAssistant`, `i18n.ts` |
| **Operational Intelligence** | AI-generated decision support reports from live state | `Dashboard` (AI OI section) |
| **Real-time Decision Support** | Context-aware Gemini responses using live crowd/emergency data | `aiService.ts` |
| **Volunteer Coordination** | Task management with priority and status tracking | `Volunteer` |
| **Emergency Response** | Severity-based alerts, incident reporting, evacuation guidance | `Emergency` |

### GenAI Integration Details

The solution integrates the **Google Gemini 2.0 Flash** model in two ways:

1. **Conversational AI Assistant** — Users ask questions in natural language. The system constructs a context-enriched prompt that includes:
   - Current match score and status
   - Live crowd density for every zone
   - Active emergency alerts
   - User role (fan/staff/volunteer/organizer)
   - Language preference

   Gemini responds with situationally-aware guidance. A **rule-based fallback** ensures the app works without an API key.

2. **Operational Intelligence Dashboard** — Staff can generate AI-powered real-time reports that analyze the current stadium state and output **3 actionable decisions** for crowd flow optimization and safety.

---

## 🧠 Assumptions Made

1. **Live Data Feeds:** We assume the presence of stadium IoT sensors (turnstiles, cameras) that provide the real-time occupancy data mocked in `stadiumData.ts`.
2. **Connectivity:** We assume a baseline level of 5G/Wi-Fi connectivity within the stadium for real-time app synchronization.
3. **Hardware:** The visual heatmap assumes the user is on a modern device capable of rendering CSS animations and SVG efficiently.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript (strict mode) |
| Build | Vite 8 with esbuild minification |
| GenAI | Google Gemini 2.0 Flash API |
| State | React Context + useReducer |
| Styling | CSS custom properties (design tokens) |
| Validation | Zod v4 (runtime schema validation) |
| Security | DOMPurify, CSP, rate limiting, input sanitization |
| Testing | Vitest + Testing Library + v8 coverage |
| Visualization | Recharts (line charts), custom SVG (stadium heatmap) |
| Deployment | Vercel (auto-deploy from main branch) |

---

## 🏆 Evaluation Focus Areas

### 1. Code Quality (High Impact)
- **TypeScript Strict Mode:** `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`, `forceConsistentCasingInFileNames` all enabled.
- **ESLint Hardened:** `no-explicit-any: warn`, `no-unused-vars: warn`, `jsx-a11y` plugin active, `no-console` restricted.
- **Architecture:** Clean separation — `components/`, `services/`, `hooks/`, `utils/`, `config/`, `types/`, `context/`.
- **CSS Design System:** All styling uses CSS custom properties and utility classes. Inline styles are minimized to prevent render-time object allocation.
- **EditorConfig & Prettier:** Consistent formatting enforced across editors.

### 2. Security (High Impact)
- **Content Security Policy:** Applied via `<meta>` tag — restricts script/style/connect sources.
- **XSS Prevention:** All user inputs sanitized through `DOMPurify` before rendering.
- **Input Validation:** Runtime schema validation via `Zod` on all user-facing inputs.
- **Rate Limiting:** Token-bucket algorithm prevents API abuse (10 requests burst, 1/sec refill).
- **Trusted Origins:** API calls validated against an allowlist before execution.
- **No Secrets Exposed:** API keys loaded via environment variables, `.env` files gitignored.

### 3. Efficiency (Medium Impact)
- **Code Splitting:** All page components lazy-loaded via `React.lazy` + `Suspense`.
- **Bundle Optimization:** Vendor/UI/app chunks separated via `manualChunks`. Production build drops `console` and `debugger`.
- **Memoization:** `useMemo` for computed data, `useCallback` for event handlers, `memo()` on all exported components.
- **CSS over Inline Styles:** Styles defined in CSS classes rather than inline `style={{}}` objects to avoid per-render object creation.
- **Debouncing:** Custom `useDebounce` hook prevents excessive re-computation during user input.

### 4. Testing (Medium Impact)
- **Coverage:** Comprehensive unit tests for all layers — components, services, context, utilities, config.
- **Test Pyramid:** Unit tests for utilities/services, component render tests with Testing Library, reducer tests for state logic.
- **100% Pass Rate:** All test suites pass with zero failures.

### 5. Accessibility (Low Impact)
- **WCAG AA:** High-contrast mode, `aria-live` regions, semantic HTML, focus management.
- **Screen Readers:** `aria-label`, `role="alert"`, `role="log"`, `PageAnnouncer` for route changes.
- **Keyboard Navigation:** Full focus-trap support, skip-to-content link, visible focus indicators.
- **Reduced Motion:** `prefers-reduced-motion` media query disables all animations.
- **Inclusive Design:** Sensory room routing, wheelchair-accessible paths, multilingual support.

### 6. Problem Statement Alignment (High Impact)
- Directly addresses **FIFA World Cup 2026** context with MetLife Stadium data.
- Covers **all 8 challenge areas**: navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, operational intelligence, real-time decision support.
- Demonstrates **smart, dynamic assistant** capability with context-aware Gemini integration.
- Shows **logical decision making** through density-based routing and AI-generated operational reports.

---

## 🚀 Local Setup & Installation

```bash
# Clone the repository
git clone https://github.com/siddth09/stadium-ai.git
cd stadium-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your VITE_GEMINI_API_KEY to the .env file

# Run the development server
npm run dev

# Run all tests with coverage
npm run test:coverage

# Lint the codebase
npm run lint

# Production build
npm run build
```

---

## 📄 License

[MIT License](./LICENSE)
