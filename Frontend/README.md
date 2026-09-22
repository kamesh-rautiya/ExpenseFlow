# ExpenseFlow — Frontend 💸

A modern, high-performance personal finance and expense tracking web application built with **React 19**, **TypeScript**, **Vite**, **TanStack Router & Query**, **Tailwind CSS**, and **Recharts**.

---

## 🎨 Design & Features

- **Modern Glassmorphism UI:** Dark-mode glassmorphic aesthetics with vibrant violet accents and crisp typography.
- **Interactive Visualizations:** Live cash flow summaries, category breakdowns via interactive donut charts, and balance evolution time series powered by Recharts.
- **Multi-Account Management:** Add, edit, and track accounts (Savings, Current, Family budget) with customizable colors and currencies.
- **Transaction Records:** Fast expense and income recording with category badges, date tracking, and multi-criteria filters.
- **JWT Authentication:** Secure user sign-in and sign-up with stateful session persistence.

---

## 📸 Screenshots

| Landing Page | Dashboard Overview |
| :---: | :---: |
| <img src="../screenshots/landing.png" width="450" alt="Landing Page" /> | <img src="../screenshots/dashboard.png" width="450" alt="Dashboard" /> |

| Account Management | Analytics & Trends |
| :---: | :---: |
| <img src="../screenshots/accounts.png" width="450" alt="Account Management" /> | <img src="../screenshots/analytics.png" width="450" alt="Analytics" /> |

| Transactions & Records | Authentication |
| :---: | :---: |
| <img src="../screenshots/records.png" width="450" alt="Records" /> | <img src="../screenshots/signin.png" width="450" alt="Sign In" /> |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+**
- **npm** or **pnpm** / **bun**

### Installation

```bash
# Navigate to the frontend directory
cd Frontend

# Install dependencies
npm install

# Start development server (runs on http://localhost:8080)
npm run dev
```

### Production Build

```bash
# Type-check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
Frontend/
├── src/
│   ├── assets/              # Artwork and visual assets
│   ├── components/          # Reusable UI & layout components (AppHeader, Dialog, etc.)
│   ├── lib/                 # API client, auth storage, utilities
│   ├── routes/              # TanStack file-based routes (index, dashboard, records, analytic, sign-in, sign-up)
│   └── main.tsx             # Application entry point
├── package.json
└── vite.config.ts
```
