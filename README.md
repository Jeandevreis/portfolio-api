# Hono API & React Admin Panel

A full-stack application living in a single repository, split into two main layers: a fast **Hono** API and a **React + Vite Admin Panel**. The frontend is a subproject of the backend (`/admin-panel`). In development, Vite proxies requests to the API; in production, the panel is built and its static files are served directly by Hono from a `public` folder.

[![CI Tests](https://github.com/SEU_USUARIO/SEU_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/SEU_USUARIO/SEU_REPO/actions/workflows/ci.yml)
[![Codecov](https://codecov.io/gh/SEU_USUARIO/SEU_REPO/graph/badge.svg)](https://codecov.io/gh/SEU_USUARIO/SEU_REPO)

> 🖥️ **Frontend docs:** the Admin Panel has its own README with UI-specific details → [`admin-panel/README.md`](./admin-panel/README.md)

---

## 📑 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running in Development](#running-in-development)
  - [Build & Production](#build--production)
- [Running Tests](#-running-tests)
- [Frontend (Admin Panel)](#-frontend-admin-panel)
- [License](#-license)

---

## 💻 Tech Stack

**Backend (root)**
- **Framework:** Hono (Node.js Adapter)
- **Database & ORM:** PostgreSQL (Neon Serverless) + Drizzle ORM
- **Validation:** Zod
- **Security:** Bcryptjs
- **Uploads & Emails:** Cloudinary, Resend
- **Realtime/Driver:** `pg`, `ws` (Neon serverless websockets)
- **Testing:** Vitest + Coverage V8

**Frontend (`/admin-panel`)** — see full details in its own [README](./admin-panel/README.md)
- React 19 + Vite, Tailwind CSS v4, React Hook Form + Zod, React Router DOM, i18next

---

## 🏗️ Project Structure

The codebase separates concerns clearly, with unit tests covering business logic on both ends.

**Backend (`/src`)**
```
src/
├── controllers/   # Route response logic
├── repositories/  # Direct interactions with Drizzle ORM / database
├── routes/        # Hono endpoint definitions
├── schemas/       # Zod validation schemas (shared or isolated)
└── tests/         # Vitest test coverage
```

**Frontend (`/admin-panel/src`)** — see the [Admin Panel README](./admin-panel/README.md) for the full breakdown
```
admin-panel/src/
├── components/          # Reusable, isolated UI
├── hooks/               # Custom hooks (e.g. useProjects, useSettings)
├── pages/                # Main React Router views
├── helpers/ & services/  # Utilities and API calls
└── tests/               # UI and client-side business logic tests
```

---

## 🗄️ Database Schema

The database is modeled with Drizzle ORM and supports native internationalization through dedicated translation tables.

| Table | Description |
|---|---|
| `users` | Authentication, access control, and login attempt tracking (`loginAttempts`, `lockUntil`) |
| `settings` | Global system settings (theme, panel language, site URL, public email, logo, custom JSON config) |
| `projects` & `github_stats` | Portfolio project management, integrated with GitHub data (stars, languages, topics) |
| `education` | Academic history and certifications (supports certificate and image links) |
| `services` | Services offered by the user (link + image) |
| `project_translations`, `education_translations`, `service_translations` | Multi-language support (e.g. `pt`, `en`) for dynamic content |

All tables use UUID primary keys and automatic `createdAt` / `updatedAt` timestamps. Relations between entities (e.g. `projects` ↔ `project_translations` ↔ `github_stats`) are defined via Drizzle's `relations()` API, including cascade deletes on translation and stats tables.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- A configured PostgreSQL database (update your `.env` accordingly)

### Installation

Install dependencies for both the root (backend) and the panel (frontend):

```bash
# At the project root (Backend)
npm install

# Inside the admin panel (Frontend)
cd admin-panel
npm install
```

### Running in Development

Open two terminals. In the first, run the API. In the second, run the Vite panel (it will automatically proxy requests to the API).

```bash
# Terminal 1 - Root
npm run dev

# Terminal 2 - /admin-panel
npm run dev
```

### Build & Production

To prepare the project for production, the frontend must be built and its static files served by Hono.

```bash
cd admin-panel
npm run build
# Hono's build/serve setup takes care of serving the static files from /public
```

---

## 🧪 Running Tests

Both projects have full test coverage using Vitest. The root `package.json` centralizes test commands to simplify CI/CD pipelines.

From the project root, you can use the following commands:

**Run only the API tests:**
```bash
npm run test
```

**Run only the React Panel tests:**
```bash
npm run test:front
```

**Run all tests (API + Panel) at once:**
```bash
npm run test:all
```

**Generate code coverage reports:**
```bash
npm run test:coverage
```

---

## 🖥️ Frontend (Admin Panel)

The `/admin-panel` folder contains a self-contained React + Vite application (Tailwind CSS v4, React Hook Form, React Router, i18next) with its own test suite (Vitest + React Testing Library).

For component structure, hooks, pages, environment variables, and frontend-specific scripts, check the dedicated documentation:

👉 **[admin-panel/README.md](./admin-panel/README.md)**

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
