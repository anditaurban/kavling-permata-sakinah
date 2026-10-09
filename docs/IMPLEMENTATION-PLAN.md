# IMPLEMENTATION PLAN — Permata Sakinah

## Phase 0 — Foundation `[Status: Selesai]`
Goal: project shell.
- [x] React + Vite.
- [x] Tailwind CSS.
- [x] Routing.
- [x] Global styles/tokens.
- [x] Reusable UI primitives.
- [x] Mock session.
- [x] Mock API adapter.
- [x] Responsive layout.
Deliverable: app shell only.

## Phase 1 — Landing Page `[Status: Selesai]`
- [x] Navbar.
- [x] Hero.
- [x] Project highlights.
- [x] Featured lots.
- [x] Process.
- [x] FAQ.
- [x] CTA/footer.
- [x] Responsive states.

Gate: user validates landing page.

## Phase 2 — Project & Lot Explorer `[Status: Selesai]`
- [x] Project list.
- [x] Project detail.
- [x] Site-plan visual grid map.
- [x] Lot detail.
- [x] Status/filter/search.
- [x] Inquiry/booking CTA.

Gate: user validates property browsing flow.

## Phase 3 — POS `[Status: Selesai]`
- [x] POS shell.
- [x] Project/lots selector.
- [x] Customer selector.
- [x] Transaction summary.
- [x] Payment entry.
- [x] Confirmation.
- [x] Receipt preview/print.
- [x] Transaction history.

Gate: user validates sales operation flow.

## Phase 4 — Owner/Admin/Staff Dashboard `[Status: Selesai]`
- [x] Dashboard overview.
- [x] Projects/lots.
- [x] Customers.
- [x] Transactions.
- [x] Payments.
- [x] Users.
- [x] Reports.
- [x] Role-aware navigation.

Gate: user validates internal operations.

## Phase 5 — Customer Portal `[Status: Selesai]`
- [x] Customer dashboard.
- [x] My lot.
- [x] Transaction status.
- [x] Payment schedule/history.
- [x] Documents placeholder if applicable.
- [x] Profile.

Gate: user validates customer experience.

## Phase 6 — UX Hardening `[Status: Selesai - Menunggu Frontend Sign-off]`
- [x] Loading states.
- [x] Empty states refinement.
- [x] Error states & form validation.
- [x] Responsive layout baseline.
- [x] Accessibility baseline.
- [x] Interaction consistency.
- [x] Visual polish.

Gate: frontend sign-off.

## Phase 7 — API Integration Preparation & Full CRUD `[Status: Selesai]`
Sesuai instruksi dan panduan resmi `frontend-integration/INTEGRATION-GUIDE.md` & `frontend-integration/collection.json`:
- [x] Replace mock adapter with live API client (`client.js` & `adapter.js`).
- [x] Align API contract with REST endpoints (`/auth`, `/projects`, `/plots`, `/customers`, `/bookings`, `/sales`, `/payments`, `/dashboard`, `/reports`).
- [x] Authentication integration dengan JWT token bearer & role switching demo accounts (Owner, Admin, Staff 1, Staff 2, Customer).
- [x] Error handling & standardized response format (`{ success, data, error, meta }`).
- [x] CRUD operations connected across Projects, Lots, Customers & Activities, POS & Bookings, Transactions, Payments Verification/Rejection, and Executive Reports.

## Phase 8 — Database & Backend `[Status: Hold - Menunggu Frontend Sign-off]`
Separate project phase after explicit user approval.
- [ ] Database schema.
- [ ] Seed/dummy data.
- [ ] Backend API.
- [ ] Authentication/authorization.
- [ ] Validation.
- [ ] Business rules.
- [ ] Testing.

## Anti-Overengineering Rules
1. Do not add modules not listed in PRD.
2. Do not create backend/database during frontend phases.
3. Do not introduce state-management libraries unless actual complexity requires them.
4. Prefer simple components and local state.
5. Reuse components before creating variants.
6. Do not create abstractions without at least two real use cases.
7. Do not implement integrations before UI approval.
8. Stop at each gate and wait for user approval.

## Definition of Done
A phase is done only when:
- build works,
- routes work,
- responsive behavior works,
- mock data is coherent,
- primary interactions work,
- no obvious console errors,
- UI follows UI-GUIDELINE,
- scope remains within SOT.
