# ImpactPulse M&E System

> **Next-Generation Monitoring & Evaluation (M&E) and Funder Reporting Platform for Non-Profits, Charities, and Public Sector Projects.**

Developed initially for the **West London Equality Centre (WLEC)** Hate Crime Support Project (funded by City Bridge Foundation), **ImpactPulse** transforms complex multi-year grant monitoring from brittle spreadsheets into an intuitive, audit-ready, and GDPR-compliant digital operating system.

---

## 🚀 Key Highlights & Capabilities

- **12 Integrated Functional Modules**:
  1. **Executive Dashboard**: Real-time funder quick-answer panel, 5-year trajectory meter (50 → 250 cases), radial outcome gauges, and borough caseload distributions.
  2. **Client Intake Register**: Automated sequential ID generation (`HC/1`, `HC/2`...), dual privacy view, borough and risk filters, and 1-click Excel export.
  3. **Multi-Stage Outcome Tracker**: Pre- and post-assessment scoring (1–5 Likert scale) across Intake, 3M, 6M, and Closure, with automated shift calculations and police incident tracking.
  4. **Referral Tracker**: Comprehensive 17-category incoming vs. outgoing breakdown table with real-time status ledgers.
  5. **5-Year Activities & Milestones**: Multi-year targets vs. actuals tracker and milestone delivery cards.
  6. **Volunteer Log & Compliance Sentinel**: Volunteer profiles, DBS compliance tracking with expiry alerts, and activity hours ledger.
  7. **Training Register**: 8-course modular curriculum matrix, attendance tracking, and evaluation shift analytics.
  8. **KPI Trends & Visual Analytics**: Interactive SVG visualizations for trajectory, outcome success rates, geographic reach, and risk triage.
  9. **Quarterly Funder Report Generator**: Automated 7-section report compiling casework, demographics, financials, outcomes, and customizable executive narrative with 1-click Print/PDF layout.
  10. **Qualitative Case Studies**: Structured client journey narrative builder linking quantitative outcomes with qualitative quotes.
  11. **5x5 Risk Register**: Interactive probability × impact matrix with dynamic mitigation logging.
  12. **Universal System Customizer**: Sector presets (WLEC Hate Crime, Youth Mentoring & Wellbeing, Refugee & Asylum Support), configurable outcome definitions, custom dropdowns, and JSON database backup/restore.

- **GDPR & Privacy-First Architecture**:
  - Global one-click anonymization toggle masking client identities into coded references.
  - Zero third-party data tracking; all changes persist safely in the client browser.

- **Funder & Audit Ready**:
  - Export tables to Microsoft Excel (`.xlsx`) and CSV.
  - Print-optimized stylesheet for trustees and donor board meetings.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 19, TypeScript (Strict Mode)
- **Styling**: Tailwind CSS & Modern Glassmorphism UI tokens
- **Icons**: Lucide Icons
- **Data Export & Reporting**: SheetJS (`xlsx`), HTML5 Print Engine
- **Build Tooling**: Vite 6

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/DINGZTRADER/impactpulse-me-system.git
cd impactpulse-me-system

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🌐 Deploying to the Cloud

### Option 1: Vercel (Recommended for Client Sharing)
1. Push this repository to GitHub.
2. Visit [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Click **Deploy** — Vercel detects Vite automatically and delivers an instant `https://your-project.vercel.app` URL.

### Option 2: Netlify
1. Connect your GitHub repository at [netlify.com](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`

---

## 📄 License
MIT License. Created for non-profit and community empowerment.
