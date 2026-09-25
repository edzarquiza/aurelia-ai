# CLAUDE.md

# Aurelia AI — Repository Instructions

## 1. What This Repository Is

This repository contains the **React frontend** for Aurelia AI, an
AI-assisted invoice control automation demo, plus the original **Operations**
text-request demo it grew out of. Both are served from one Vite/React
single-page app with a shared top navigation.

This repository does **not** contain:
- the n8n workflows
- the PostgreSQL database/schema
- the Ollama/Qwen model configuration

Those are maintained separately. The frontend communicates with them only
through HTTP webhook calls — see `src/services/*.ts`.

## 2. Current Pages

The app has exactly two navigation destinations (`src/App.tsx`,
`src/components/AppNav.tsx`):

1. **Operations** (`src/pages/OperationsPage.tsx`) — the original demo.
   A single textarea submits a free-text operational request to
   `VITE_N8N_WEBHOOK_URL`, and the response (category, routing, priority,
   SLA, processing mode, knowledge guidance) is rendered by
   `RequestResult.tsx`. This page's behavior is considered stable/frozen —
   do not change its logic without an explicit request.

2. **Invoice Control Center** (`src/pages/InvoiceControlCenterPage.tsx`) —
   Aurelia AI's main product surface. A **single unified page**, not three
   separate pages, containing:
   - **Invoice Processing** — PDF upload (`InvoiceUpload.tsx`) → submit to
     `VITE_INVOICE_CONTROL_URL` → result rendered by `InvoiceResult.tsx`.
   - **Attention Center** — failed/incomplete/orphaned automation runs from
     `VITE_INVOICE_OPERATIONS_URL`, rendered by `OperationsTable.tsx`.
   - **KPI strip + breakdowns** — aggregated metrics from
     `VITE_INVOICE_KPI_URL`, rendered with `KpiBarBreakdown.tsx`.

   There is no separate "Invoice Control", "Operations Monitor", or "KPI
   Dashboard" page anymore — that three-page structure existed briefly
   during development and was deliberately consolidated. Do not
   reintroduce it without an explicit request.

## 3. Critical Architecture Rule

**AI extracts and interprets. Deterministic backend rules decide. React
only displays.**

This applies to both pages:

- Operations: category, routing, priority, SLA, confidence, and processing
  mode are all decided by n8n. React never recomputes them.
- Invoice Control: vendor/PO validation, amount/currency checks, duplicate
  detection, and the resulting `processing_status`
  (`VENDOR_PO_VALIDATED` / `EXCEPTION` / `DUPLICATE`) are all decided by
  n8n against PostgreSQL reference data. React never recomputes them.

Never write logic in this frontend that re-derives a business decision the
backend already made. If a value is missing from a response, display
nothing for that field — do not infer or fabricate it.

## 4. Environment Configuration

Four webhook URLs, one per env var, read via `import.meta.env` in the
matching service file:

| Variable | Used by | Method |
|---|---|---|
| `VITE_N8N_WEBHOOK_URL` | `services/n8nClient.ts` (Operations) | `POST` (JSON `{ request_text }`) |
| `VITE_INVOICE_CONTROL_URL` | `services/invoiceApi.ts` | `POST` (`multipart/form-data`, field `data`) |
| `VITE_INVOICE_OPERATIONS_URL` | `services/operationsApi.ts` | `GET` (optional `?status=FAILED\|INCOMPLETE\|ORPHANED`) |
| `VITE_INVOICE_KPI_URL` | `services/kpiApi.ts` | `GET` |

`.env` is gitignored; `.env.example` documents all four with localhost
placeholders. Never commit real credentials — these are the only URLs the
frontend needs; it has no other secrets.

## 5. Response Contracts

Types live under `src/types/` and were written **from verified real
webhook responses**, not invented:

- `types/opsflow.ts` — Operations page contract (`OpsFlowResponse`). Kept
  under its original filename/interface names from before the product was
  renamed to Aurelia AI; this is a deliberate, low-risk naming choice, not
  an oversight.
- `types/invoice.ts` — `InvoiceControlResponse`. Most fields are optional
  since the three outcome shapes (`VENDOR_PO_VALIDATED`/`EXCEPTION`/
  `DUPLICATE`) don't all carry the same fields.
- `types/operations.ts` — `OperationsRecord`, `OperationsSummary`,
  `OperationsResponse`.
- `types/kpi.ts` — `KpiData`, `KpiResponse`.

If the real backend response contract ever changes, update the type to
match a freshly observed response — don't guess at a schema.

## 6. Brand / Design System

- Design tokens live in `src/index.css` (`--color-*` custom properties).
  The Aurelia fuchsia/navy palette (`#d81b60` accent, `#111827` text,
  `#f8f7f9` background) is the current **app-wide default** — both pages
  share it. There is no separate "teal Operations theme" anymore.
- `AureliaBrand.tsx` is the one brand mark (an abstract moon-jelly-inspired
  SVG). It's used in the nav, both page headers, and `public/favicon.svg`.
  Don't introduce a second icon; don't add generic AI iconography (robots,
  sparkles, brains, circuit boards).
- Status badges (`ops-badge--*`, `badge--mode-*`, `badge--priority-*`,
  `invoice-status--*`) use fixed semantic colors independent of the brand
  accent — don't tie business-status color to the brand palette.
- Shared component classes (`ops-refresh-button`, `ops-status-message`,
  `ops-error`, `placeholder`/card patterns) live in `App.css` specifically
  so both pages can use them without one page's CSS file silently
  depending on another's. Keep new shared classes there, not buried in a
  page-specific CSS file.

## 7. Never Duplicate Business Logic in React

Do not implement in this frontend:
- classification, category, or routing rules
- priority or SLA calculations
- confidence thresholds
- vendor/PO existence or status checks
- amount or currency validation
- duplicate detection
- KPI/rate calculations
- any other decision the backend already returns a value for

Correct pattern: `status = response.processing_status`. Wrong pattern:
`if (amount > po_amount) { status = 'EXCEPTION' }`.

## 8. Do Not Modify Without Explicit Request

- n8n workflows (not in this repo, but don't assume behavior/change the
  contract without verifying against the real backend)
- PostgreSQL schema (not in this repo)
- AI extraction prompts/logic (not in this repo)
- API contracts / response shapes
- `sample-invoices/*.pdf` contents (synthetic test data — regenerate only
  if explicitly asked; a `.gitattributes` rule marks `*.pdf` as binary to
  prevent line-ending corruption on checkout, since these particular files
  contain no NUL bytes and would otherwise be misdetected as text)

## 9. Technology / Constraints

- React + TypeScript + Vite, plain CSS. No router (view switching is a
  local `useState` in `App.tsx` — there are only two destinations).
- No UI component library, no state-management library, no chart library.
  Keep it that way unless there's a demonstrated need.
- No backend/database access from the frontend, ever.

## 10. Testing Expectations

Before considering any frontend change done:
1. `npm run build` must pass.
2. If a change touches an API-calling service, verify it against the real
   local n8n webhook (not mocked) where practical, and say plainly if that
   wasn't possible (e.g., no backend reachable in this session).
3. Don't claim browser-rendered visual verification unless a browser tool
   was actually used to check it.

## 11. Change Control

Before a non-trivial change, ask: does this directly improve the Aurelia
AI Invoice Control Center or Operations demo as they actually exist today?
If not, don't make it. Avoid speculative refactors, new dependencies, or
scope creep beyond what's asked. Prefer the smallest correct change.
