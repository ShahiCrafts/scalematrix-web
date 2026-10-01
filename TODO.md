# ScaleMatrix Web — TODO

Tasks are ordered. Only mark a task complete when its acceptance criteria and applicable verification pass.

- [ ] **P0 — Restore a clean frontend quality baseline**
  - Acceptance: `npm run lint` exits 0 with no errors.
  - Acceptance: `npm run build` exits 0 in a supported environment without changing dependencies unless separately approved.
  - Acceptance: fixes are behavior-preserving and split into reviewable commits.
  - Note: build runner currently has an optional Rolldown native-binding problem; do not reinstall dependencies without approval.

- [ ] **P0 — Verify authentication and onboarding end-to-end contract**
  - Acceptance: client calls match server routes and payloads.
  - Acceptance: authenticated, unauthenticated, expired-session, onboarding-incomplete, and onboarding-complete flows have explicit behavior.
  - Acceptance: loading/error states are usable and accessible.

- [ ] **P1 — Audit dashboard data integrity**
  - Acceptance: identify hardcoded/mock/fallback production data.
  - Acceptance: backend-owned metrics use documented API contracts.
  - Acceptance: dashboard handles loading, empty, partial, and error states.

- [ ] **P1 — Accessibility and responsive pass**
  - Acceptance: interactive controls are keyboard reachable and semantically correct.
  - Acceptance: forms have labels/error associations and dialogs/drawers have appropriate focus behavior.
  - Acceptance: primary flows are usable at mobile and desktop widths.

- [ ] **P1 — Consolidate API access where safe**
  - Acceptance: authenticated API calls use one consistent request/session policy.
  - Acceptance: no feature regression and no API contract drift.

- [ ] **P2 — Product opportunity backlog (proposal only)**
  - Review opportunities for workflow automation, approval queues, reusable content templates, cross-channel campaign views, actionable anomaly alerts, and team collaboration.
  - Material features require owner approval before implementation.
