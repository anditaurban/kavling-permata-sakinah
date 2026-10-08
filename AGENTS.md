# AGENTS.md — Permata Sakinah

## Mission
Build Permata Sakinah as a frontend-first, decoupled property sales application. Follow the SOT in `docs/` as the source of truth.

## Mandatory Rules
1. Read `docs/PRD.md`, `docs/USER-FLOW.md`, `docs/UI-GUIDELINE.md`, `docs/API-SPEC.md`, and `docs/IMPLEMENTATION-PLAN.md` before coding.
2. Do not implement database or backend during frontend phases.
3. Use React + Vite + Tailwind CSS.
4. Keep frontend API-ready through a mock API/service adapter.
5. Do not invent modules outside the SOT.
6. Avoid overengineering and unnecessary dependencies.
7. Use Indonesian UI copy unless the SOT explicitly requires otherwise.
8. Use realistic mock data.
9. Respect role boundaries: Owner, Admin, Staff, Customer.
10. Stop at implementation gates and wait for explicit user approval.

## Execution Order
Phase 0 → Phase 1 → approval
→ Phase 2 → approval
→ Phase 3 → approval
→ Phase 4 → approval
→ Phase 5 → approval
→ Phase 6 → frontend sign-off
→ only then Phase 7/8 with explicit approval.

## UI Rules
- Follow UI-GUIDELINE exactly.
- Magenta is accent, not an excuse for excessive gradients.
- Avoid AI-slop aesthetics.
- Prioritize hierarchy, whitespace, typography, and usability.
- Responsive is mandatory.

## Code Rules
- Prefer simple React components.
- Keep data access separated from presentation.
- Do not put mock data directly into many UI components.
- Use reusable components for repeated patterns.
- Keep naming explicit.
- Avoid premature abstraction.

## Validation
Before reporting a phase complete:
- run build,
- inspect responsive layout,
- check main user flows,
- check empty/loading/error states where applicable,
- check browser console for obvious errors,
- verify no out-of-scope features were added.

## Change Control
If a requested change affects scope, architecture, user flow, or API contract:
1. identify the affected SOT file,
2. propose the change,
3. wait for approval when it materially changes scope,
4. then implement.

Never silently rewrite the product concept.
