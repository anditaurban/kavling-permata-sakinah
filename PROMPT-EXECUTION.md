# FIRST EXECUTION PROMPT — Permata Sakinah

Copy this prompt to the coding agent from the project root.

---

You are the coding agent for **Permata Sakinah**.

Your first task is to build the FRONTEND ONLY.

## Source of Truth
Read and follow:
- `AGENTS.md`
- `docs/PRD.md`
- `docs/USER-FLOW.md`
- `docs/UI-GUIDELINE.md`
- `docs/API-SPEC.md`
- `docs/IMPLEMENTATION-PLAN.md`

These files are authoritative. Do not invent requirements.

## Architecture
- React + Vite.
- Tailwind CSS.
- Decoupled frontend.
- Backend/database are NOT implemented now.
- Use realistic mock data.
- Create a clean mock API/service adapter so future REST API integration does not require rewriting UI components.

## Important Scope Rule
Build only the frontend.
Do NOT:
- create database schema,
- create backend server,
- create real API endpoints,
- integrate payment gateway,
- integrate WhatsApp API,
- add authentication backend,
- add modules not defined in SOT.

## Execution
Start with **Phase 0 only**.

Phase 0 must establish:
- project shell,
- routing,
- Tailwind setup,
- global design tokens,
- reusable UI primitives,
- responsive app shell,
- mock session/role,
- mock API adapter,
- initial navigation.

After Phase 0 is complete:
1. run the build,
2. verify routes,
3. verify responsive layout,
4. report files changed and validation result,
5. STOP.

Do not continue to Phase 1 until the user explicitly approves Phase 0.

## UI Quality
The product should feel like a credible modern property-sales SaaS, not an AI-generated template.
Use:
- magenta brand accent,
- strong typography,
- whitespace,
- clear hierarchy,
- restrained cards,
- meaningful data,
- subtle motion only where useful.

Avoid:
- excessive gradients,
- glassmorphism,
- neon glow,
- oversized rounded cards,
- meaningless charts,
- excessive icons,
- decorative elements without purpose.

## Coding Discipline
- Prefer simple solutions.
- Do not install dependencies unless needed.
- Do not create abstractions without real reuse.
- Keep mock data out of presentation components where practical.
- Follow the existing project structure if one already exists.
- Do not overwrite unrelated project files.

## Final Response After Phase 0
Return:
1. Phase completed.
2. Files created/changed.
3. Routes available.
4. Validation/build result.
5. Any blocker.
6. Explicitly state that you are waiting for approval before Phase 1.

STOP after Phase 0.
