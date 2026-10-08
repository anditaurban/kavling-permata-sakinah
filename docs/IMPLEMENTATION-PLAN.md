# IMPLEMENTATION PLAN — Permata Sakinah

## Phase 0 — Foundation
Goal: project shell.
- React + Vite.
- Tailwind CSS.
- Routing.
- Global styles/tokens.
- Reusable UI primitives.
- Mock session.
- Mock API adapter.
- Responsive layout.
Deliverable: app shell only.

## Phase 1 — Landing Page
- Navbar.
- Hero.
- Project highlights.
- Featured lots.
- Process.
- FAQ.
- CTA/footer.
- Responsive states.

Gate: user validates landing page.

## Phase 2 — Project & Lot Explorer
- Project list.
- Project detail.
- Site-plan.
- Lot detail.
- Status/filter/search.
- Inquiry/booking CTA.

Gate: user validates property browsing flow.

## Phase 3 — POS
- POS shell.
- Project/lots selector.
- Customer selector.
- Transaction summary.
- Payment entry.
- Confirmation.
- Receipt.
- Transaction history.

Gate: user validates sales operation flow.

## Phase 4 — Owner/Admin/Staff Dashboard
- Dashboard overview.
- Projects/lots.
- Customers.
- Transactions.
- Payments.
- Users.
- Reports.
- Role-aware navigation.

Gate: user validates internal operations.

## Phase 5 — Customer Portal
- Customer dashboard.
- My lot.
- Transaction status.
- Payment schedule/history.
- Documents placeholder if applicable.
- Profile.

Gate: user validates customer experience.

## Phase 6 — UX Hardening
- Loading.
- Empty.
- Error.
- Validation.
- Responsive.
- Accessibility.
- Interaction consistency.
- Visual polish.

Gate: frontend sign-off.

## Phase 7 — API Integration Preparation
Only after frontend approval:
- Replace mock adapter with API adapter.
- Align API contract.
- Authentication integration.
- Error mapping.
- No database implementation in this phase unless separately approved.

## Phase 8 — Database & Backend
Separate project phase after explicit user approval.
- Database schema.
- Seed/dummy data.
- Backend API.
- Authentication/authorization.
- Validation.
- Business rules.
- Testing.

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
