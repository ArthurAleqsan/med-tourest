# Medical Tourism Armenia — med.tourest.online

A production-ready MVP for a medical tourism platform focused on international patients travelling to **Armenia** for medical treatment. Public site: **[med.tourest.online](https://med.tourest.online)** (Tourest medical brand). Patients can browse specialties, doctors, medical centers, and travel packages, then submit an **appointment request** (not an instant booking). A coordinator then contacts the patient to confirm the appointment and help organize the trip.

> This platform is **not** an emergency medical service. It does not claim HIPAA or GDPR compliance. It is structured so stronger compliance controls can be added later.

---

## Tech stack

**Frontend (`apps/web`)** — Next.js 14 (App Router), TypeScript, React 18, Tailwind CSS, React Hook Form, Zod, TanStack Query, typed fetch API client.

**Backend (`apps/api`)** — Node.js, Express, TypeScript, MongoDB + Mongoose, Zod validation, Swagger/OpenAPI, JWT admin auth, bcrypt, Helmet, CORS, express-rate-limit, Morgan logging.

**Shared (`packages/shared`)** — Reusable TypeScript types, enums, Zod validation schemas, API contracts, and the timezone-aware appointment-date logic used by **both** apps.

---

## Monorepo structure

```text
medical-tourism-armenia/
  apps/
    web/                  # Next.js frontend
      src/
        app/              # App Router routes (public + admin)
        components/       # Reusable UI + feature components
        lib/              # API client, hooks, form schemas, config, SEO
    api/                  # Express backend
      src/
        config/           # env validation, db, logger, swagger
        controllers/      # request handlers
        services/         # business logic + data access
        models/           # Mongoose models
        middleware/       # validation, auth, rate limiting, error handling
        routes/           # route wiring (/api/v1)
        seed/             # seed data + seed script
        tests/            # Vitest + supertest integration tests
        utils/            # helpers (ApiError, mappers, reference, pagination…)
  packages/
    shared/               # types, enums, zod schemas, date logic, contracts
  package.json            # npm workspaces + root scripts
  README.md
```

---

## Prerequisites

- **Node.js >= 18.18** (developed on Node 18.20)
- **MongoDB** running locally (or a connection string to a hosted instance)
- npm (workspaces are used; no extra global tools required)

---

## Quick start

```bash
# 1. Install all workspace dependencies
npm install

# 2. Create environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
#    -> edit apps/api/.env and set a strong JWT_SECRET and ADMIN_PASSWORD

# 3. Seed the database (specialties, medical centers, doctors, admin user)
npm run seed

# 4. Run both apps in development
npm run dev
```

- Frontend: <http://localhost:3000>
- API: <http://localhost:5000/api/v1>
- Swagger UI: <http://localhost:5000/api/docs>
- OpenAPI JSON: <http://localhost:5000/api/docs.json>

> **macOS note:** Port `5000` is often taken by the AirPlay Receiver ("ControlCenter"). If the API cannot bind or requests hang, either disable *System Settings → General → AirDrop & Handoff → AirPlay Receiver*, or set `PORT=5055` in `apps/api/.env` **and** point `apps/web/.env.local` at `http://localhost:5055/api/v1`.

The root `npm run dev` builds `packages/shared` first, then runs the shared watcher, the API, and the web app together via `concurrently`.

---

## Environment variables

### Backend (`apps/api/.env`)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medical-tourism-armenia
JWT_SECRET=replace-with-a-secure-secret-at-least-32-characters-long
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me-strong-password
ADMIN_FIRST_NAME=Site
ADMIN_LAST_NAME=Administrator
BUSINESS_TIMEZONE=Asia/Yerevan
```

### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Production: NEXT_PUBLIC_SITE_URL=https://med.tourest.online
```

Required backend variables are **validated at startup** (`apps/api/src/config/env.ts`). If any are missing or invalid, the API prints the problems and exits.

---

## Seeding & the first admin user

```bash
npm run seed
```

The seed script (`apps/api/src/seed/seed.ts`):

- Clears and inserts **12 specialties**, **8 medical centers**, **3 packages**, and **16 doctors** (several featured; each doctor is linked to one or more medical centers; languages include Armenian, English, Russian, French, Arabic, Persian; realistic but fictional data).
- Creates the **initial admin user** from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (password hashed with bcrypt). If an admin with that email already exists, it is left untouched.

**Log in to the admin area** at <http://localhost:3000/admin/login> using the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you configured.

---

## Appointment-date validation (timezone handling)

The preferred appointment date is a **calendar date** (no time-of-day). The rules:

- **Minimum** selectable date = **tomorrow**
- **Maximum** selectable date = **exactly one calendar month** after "today"
- Past dates and dates beyond the one-month window are rejected.

All "today / tomorrow / one month ahead" calculations are done in the **business timezone `Asia/Yerevan`**, regardless of where the patient or server is located. The single source of truth lives in `packages/shared/src/date.ts` and is imported by **both** the frontend (to restrict the date picker and validate) and the backend (which re-validates authoritatively).

- On the wire, a preferred date is always an ISO **date-only** string (`YYYY-MM-DD`).
- In MongoDB it is stored as a `Date` fixed to **UTC midnight** of that calendar day, so it round-trips without timezone drift.
- Calendar comparisons use lexicographic string comparison of `YYYY-MM-DD`, avoiding timezone ambiguity. Month math uses UTC getters/setters (no DST edge cases) and clamps short months.

**Example:** a request created on **July 15, 2026** allows preferred dates from **July 16, 2026** through **August 15, 2026**.

Patients also choose an optional preferred time period: `morning`, `afternoon`, `evening`, or `no_preference`.

On success the API returns a human-readable, race-safe reference number such as `ARM-2026-000123` (generated atomically via a MongoDB counter). The patient sees the reference and a clear notice that the appointment is **not yet confirmed**.

---

## Frontend routes

| Route | Description |
| --- | --- |
| `/` | Home / landing page (hero, specialties, featured doctors, how it works, why Armenia, services, testimonials, FAQ) |
| `/doctors` | Doctors directory — search, filter by specialty/language/medical center, sort, pagination (filters preserved in the URL) |
| `/doctors/[slug]` | Doctor profile (bio, education, certifications, treatments, price, medical centers, related doctors, request CTA) |
| `/specialties/[slug]` | Specialty details + doctors in that specialty |
| `/centers` | Medical centers directory |
| `/centers/[slug]` | Medical center details + doctors practising there |
| `/packages` | Treatment & travel packages directory (duration, hotel, tours) |
| `/packages/[slug]` | Package details (hotel info, tours, inclusions) |
| `/appointments/request` | Appointment request form (supports `?doctorId=…&doctor=<slug>` and `?specialtyId=…`) |
| `/contact` | Contact form + contact details |
| `/privacy-policy` | Privacy policy (placeholder) |
| `/terms-and-conditions` | Terms & conditions (placeholder) |
| `/admin/login` | Admin login |
| `/admin` | Admin dashboard (summary + upcoming requested dates) |
| `/admin/appointments` | Appointment requests list with filters |
| `/admin/appointments/[id]` | Appointment detail + status change + internal notes |
| `/admin/doctors` | Doctors management list |
| `/admin/doctors/new` | Create doctor (multi-select medical centers) |
| `/admin/doctors/[id]/edit` | Edit doctor |
| `/admin/centers` | Medical centers management (create/edit/delete) |
| `/admin/packages` | Packages management (duration, hotel, tours, inclusions) |
| `/admin/specialties` | Specialties management (create/edit/delete) |
| `/admin/contact-requests` | Contact requests list + status |
| `/robots.txt`, `/sitemap.xml` | SEO |

---

## Internationalization (i18n)

The public site is fully translated into **English (`en`)**, **Armenian (`hy`)**, and **Russian (`ru`)**.

- **Language switcher** in the site header (desktop + mobile). The choice is persisted in a `NEXT_LOCALE` cookie (1 year).
- **How it works**: a lightweight, dependency-free system under `apps/web/src/i18n/`:
  - `config.ts` — locales, default locale, cookie name, and display labels.
  - `messages/{en,hy,ru}.ts` — the message dictionaries. `en.ts` is the source of truth; its `Messages` type is applied to `hy`/`ru`, so a missing or misspelled key is a **compile-time error**.
  - `server.ts` — `getTranslations()` reads the cookie via `next/headers` for **Server Components** and metadata.
  - `client.tsx` — `I18nProvider` + `useI18n()` for **Client Components** (forms, filters, header).
  - `translate.ts` — `{placeholder}` interpolation and locale-aware pluralization (via `Intl.PluralRules`, including Russian one/few/many).
- `<html lang>` is set from the active locale; `formatDate`/`formatPrice` use the matching `Intl` locale (`en-US`/`hy-AM`/`ru-RU`).
- Form validation messages are localized by building the Zod schemas per-request from the active dictionary.
- **Scope**: UI/marketing copy, forms, legal pages, and page metadata are translated. The **admin panel stays English** (internal tool). **Database-sourced content** (doctor bios, specialty names/descriptions from the API) is served as stored — translating that content would require multilingual fields in the data model and is intentionally out of scope for this MVP.

To add another language: add the code to `LOCALES` in `config.ts`, create `messages/<code>.ts` (TypeScript will list every required key), register it in `messages/index.ts`, and add its `Intl` tag in `lib/utils.ts`.

---

## API endpoints (all prefixed with `/api/v1`)

### Public

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | App + database status |
| GET | `/specialties` | List active specialties (`?search=`) |
| GET | `/specialties/:slug` | Get a specialty by slug |
| GET | `/centers` | List active medical centers (`?search=`) with active-doctor counts |
| GET | `/centers/:slug` | Get a medical center by slug |
| GET | `/packages` | List active treatment & travel packages (`?search=`) |
| GET | `/packages/:slug` | Get a package by slug |
| GET | `/doctors` | List doctors (`search, specialty, language, center, featured, page, limit, sort`) |
| GET | `/doctors/featured` | Featured doctors |
| GET | `/doctors/:slug` | Doctor by slug (+ related doctors) |
| POST | `/appointment-requests` | Submit an appointment request (rate-limited) |
| GET | `/appointment-requests/:referenceNumber` | Public status lookup (privacy-safe fields only) |
| POST | `/contact-requests` | Submit a contact request (rate-limited) |

### Admin authentication

| Method | Path | Description |
| --- | --- | --- |
| POST | `/admin/auth/login` | Login → JWT (rate-limited) |
| GET | `/admin/auth/me` | Current admin profile |
| GET | `/admin/dashboard` | Dashboard summary counts + upcoming requests |

### Admin — protected (JWT bearer required)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/admin/specialties` | List all specialties (incl. inactive) |
| GET | `/admin/specialties/:id` | Get specialty by id |
| POST | `/admin/specialties` | Create specialty |
| PATCH | `/admin/specialties/:id` | Update specialty |
| DELETE | `/admin/specialties/:id` | Delete specialty |
| GET | `/admin/centers` | List all medical centers (incl. inactive) |
| GET | `/admin/centers/:id` | Get medical center by id |
| POST | `/admin/centers` | Create medical center |
| PATCH | `/admin/centers/:id` | Update medical center |
| DELETE | `/admin/centers/:id` | Delete medical center |
| GET | `/admin/packages` | List all packages (incl. inactive) |
| GET | `/admin/packages/:id` | Get package by id |
| POST | `/admin/packages` | Create package |
| PATCH | `/admin/packages/:id` | Update package |
| DELETE | `/admin/packages/:id` | Delete package |
| GET | `/admin/doctors` | List all doctors (incl. inactive) |
| GET | `/admin/doctors/:id` | Get doctor by id |
| POST | `/admin/doctors` | Create doctor |
| PATCH | `/admin/doctors/:id` | Update doctor |
| DELETE | `/admin/doctors/:id` | Delete doctor |
| GET | `/admin/appointment-requests` | List (filters: `status, doctorId, specialtyId, email, dateFrom, dateTo, page, limit, sort`) |
| GET | `/admin/appointment-requests/:id` | Get full appointment request |
| PATCH | `/admin/appointment-requests/:id/status` | Change status (+ internal notes) |
| PATCH | `/admin/appointment-requests/:id` | Update status/notes |
| GET | `/admin/contact-requests` | List contact requests |
| PATCH | `/admin/contact-requests/:id/status` | Update contact status |

> All `/admin/*` routes except `/admin/auth/login` require a valid `Authorization: Bearer <token>` header.

### Response format

```jsonc
// success
{ "success": true, "data": { }, "message": "…" }

// validation error
{ "success": false, "message": "Validation failed", "errors": [{ "field": "email", "message": "A valid email address is required." }] }

// unexpected error (no stack traces in production)
{ "success": false, "message": "An unexpected error occurred" }
```

---

## Swagger / OpenAPI

- **Swagger UI:** <http://localhost:5000/api/docs>
- **OpenAPI JSON:** <http://localhost:5000/api/docs.json>

OpenAPI 3.0.3, every endpoint documented with summaries, query params, request bodies, response schemas, pagination, common errors, JWT bearer security, and grouped by tags (Health, Specialties, Medical Centers, Doctors, Appointment Requests, Contact Requests, Admin Authentication, Admin Doctors, Admin Specialties, Admin Medical Centers, Admin Appointment Requests, Admin Contact Requests). Spec source: `apps/api/src/config/swagger.ts`.

---

## Security & privacy

- All write endpoints validate input with Zod (shared schemas); strings are trimmed/sanitized.
- Helmet, configured CORS (`CLIENT_URL` + optional `ADMIN_URL`), and JSON body size limit (100 kb).
- Public form endpoints and admin login are rate-limited (`express-rate-limit`).
- Admin passwords hashed with bcrypt; password hashes are never returned.
- Admin routes protected by JWT.
- Internal appointment notes are **never** exposed publicly; the public status lookup returns only reference number, status, doctor name, specialty name, preferred date, and created date.
- The HTTP logger records method/URL/status/time only — **no request bodies**, so medical/contact data is not logged.
- Generic error responses in production (no stack traces).
- Consent checkbox is required; a clear safety notice is shown near the appointment form.

---

## Scripts

Run from the repo root:

| Command | Description |
| --- | --- |
| `npm run dev` | Run shared watcher + API + web together |
| `npm run build` | Build shared, then API, then web |
| `npm run lint` | Lint all workspaces |
| `npm run test` | Run all test suites (shared, api, web) |
| `npm run seed` | Seed the database |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check |

Per-workspace: `npm run <script> -w @mta/shared | @mta/api | @mta/web`.

---

## Testing

- **Shared:** appointment date logic + Zod schema validation (Vitest).
- **Backend:** Vitest + supertest integration tests covering date validation, appointment request validation, doctor filtering (active-only), specialty retrieval, admin authentication, protected-route authorization, and public status-response privacy. Tests use a dedicated `mta-test` MongoDB database (requires a local MongoDB).
- **Frontend:** Vitest + React Testing Library covering appointment form validation, date-range restrictions, doctor filters, successful submission, and API error display.

```bash
npm run test           # everything
npm run test -w @mta/api
npm run test -w @mta/web
```

> The backend tests connect to `mongodb://localhost:27017/mta-test`. Ensure MongoDB is running.

---

## Status: what was verified

- ✅ `npm run lint` — clean across shared, api, web.
- ✅ `npm run test` — 47 tests passing (17 shared + 19 api + 11 web).
- ✅ `npm run build` — shared, api, and web all build successfully (17 web routes).
- ✅ Manual end-to-end: seed → API endpoints (auth, appointment creation with `ARM-YYYY-NNNNNN`, privacy-safe public status, date rejection) → web home/doctor pages render live data.

## Known limitations / not included in this MVP

- No email/Telegram/WhatsApp notification delivery is wired up — requests are stored for coordinators to action from the admin panel.
- No file/medical-record uploads (intentional; the form warns against submitting sensitive records).
- No live calendar or doctor-availability engine (per spec — patients submit a *preferred* date only).
- Placeholder imagery (`placehold.co`) and placeholder legal pages; replace before production.
- Admin UI is intentionally functional/simple; it prioritizes correctness of forms, filtering, and status management.
- Not HIPAA/GDPR compliant; add stronger controls (encryption at rest, audit logging, DPA, secure document exchange) before handling regulated data.
```
