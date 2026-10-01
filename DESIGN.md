# ScaleMatrix Web — Design & Architecture

## Purpose
ScaleMatrix Web is the React/Vite client for an AI-assisted social-media growth workspace. It covers authentication/onboarding, dashboarding, planning/publishing, analytics, strategy/advisor experiences, search, studio tools, and workspace settings.

## Architecture
- **Runtime:** React 19 + Vite 8, ES modules.
- **Styling:** Tailwind CSS 4 plus application CSS.
- **Visualization:** ECharts via `echarts-for-react`.
- **Auth:** application API with credentialed requests; Google OAuth client is present.
- **Structure:** feature-first modules under `src/features`, shared shell/context/utilities under `src/shared`.
- **API boundary:** `src/shared/utils/api.js` is the preferred generic API client. Feature-specific direct fetches should be consolidated over time when doing so is small and testable.

## Primary UI Areas
- Auth and onboarding: `features/common`
- Dashboard: `features/dashboard`
- Planner/publisher/schedule: `features/planner`, `features/schedule`
- Analytics/audit/competitors: `features/analytics`
- AI advisor/strategy: `features/advisor`, `features/strategy`
- Studio/search/settings: `features/studio`, `features/search`, `features/settings`
- App shell: `shared/components/{Header,Sidebar,...}`

## Backend Contract
Default API base: `VITE_API_URL`, falling back to `http://localhost:5001/api/v1`.

Expected server modules:
- `/auth/*` — register/login/OAuth/session lifecycle and current user.
- `/onboarding/*` — workspace setup, invites, onboarding status.
- `/social/*` — connected accounts, publishing, analytics, inbox.
- `/subscription/me` — current subscription/entitlements.
- `/integrations/*` — integration catalog and connection lifecycle.
- `/dashboard/*` — layout, metrics, widget binding updates.
- `/chat` — AI advisor streaming/chat endpoint.

Authentication requests use cookies (`credentials: include` in the shared client). API contracts are owned by the server and should be changed there first, then consumed here.

## State & Data Flow
The current client is primarily component/local-state driven. Theme is shared through `ThemeContext`. Persistent/session values use utilities under `src/shared/utils`. No new state-management dependency should be introduced without approval.

## UI/UX Principles
- Preserve the existing ScaleMatrix visual language while improving consistency incrementally.
- Prefer reusable feature/shared components over duplicated markup.
- Keyboard access, visible focus, semantic controls, labels, and meaningful alt text are baseline requirements.
- Loading, empty, error, and success states are part of a feature's acceptance criteria.
- Responsive behavior must remain usable on mobile and desktop.

## Known Gaps / Risks
1. Baseline ESLint is red with a large existing error set; this prevents a clean Definition of Done.
2. There is no client test script/test harness in `package.json`; adding a dependency requires approval, so QA currently relies on lint/build and targeted manual/static checks.
3. Baseline build in the current Linux runner cannot load Vite/Rolldown's optional native binding. Dependency reinstall/upgrade is intentionally not performed without approval.
4. Some feature code calls `fetch` directly rather than the shared API client.
5. Accessibility and responsive behavior need systematic audit across feature screens.
6. README is product-level only and lacks local setup, environment-variable, build, and architecture documentation.

## Change Rules
- Small, reversible changes.
- No dependency additions/upgrades, stack changes, or file deletion without approval.
- Material product changes are proposed in TODO first.
- A task is complete only after its applicable checks pass; pre-existing global failures must be tracked explicitly until repaired.
