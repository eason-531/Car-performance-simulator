# Purpose: Claude logs changes made here; Codex reads this file as a reference before reviewing the branch.
# Rule 1 (Codex): Inspect this file before reviewing the codebase.
# Rule 2 (Claude): Document changes in maximum detail using dense, machine-readable language (human readability is not required).
# Rule 3 (Claude): Clear this file upon creating a new branch. Exclude changes from other branches.
# Rule 4 (Both): Preserve this header block when clearing the file.

## Session constraint: no original-source web access (branch `claude/upbeat-volta-401qlz`, 2026-11-24)

- STATUS: Claude cloud sessions cannot open original source pages. Claude's verification is limited to search-engine summaries and owner-supplied files.
- EVIDENCE (2026-11-24): `curl https://www.caranddriver.com/` → proxy CONNECT 403 (connect_rejected). WebFetch via the page-reading helper on the C/D 911 Turbo S test URL → "unable to fetch from www.caranddriver.com". Creating an env with magazine/OEM hosts allowlisted → environments service rejected it twice. The Default env is already `network: unrestricted`, so the block sits outside env settings (org policy or destination bot blocking). Per-host probe of motortrend/roadandtrack/nissannews/toyota pressroom was not run; the auto-mode classifier denied it. Untested hosts must be treated as unreachable.
- ROOT CAUSE OF PRIOR ERRORS: The Nissan Z figure error came from a search-summary number never checked against the original magazine page. The same risk applies to any number Claude added without an attached original.
- OWNER DECISION (Eason): Codex owns verification against original sources (magazine test tables, OEM US spec sheets, press-kit PDFs). Claude will not attempt workarounds.
- CODEX ACTIONS:
  1. Treat every Claude-entered benchmark/spec value as UNVERIFIED unless its provenance cites an owner-supplied file under `docs/spec-sheets/`. Prioritize values whose provenance is a secondary or summary source.
  2. In `Codex.md`, record per figure: car id, field, Claude value, original value, URL, and match/mismatch. Claude applies the corrections exactly as listed.
  3. Where an original page shows a conflict (body style, model year, timing convention: rollout vs brake release), state which one applies. Claude cannot resolve these independently.
- CLAUDE CONVENTION GOING FORWARD: Any new figure sourced only from search summaries gets a provenance note `unverified-summary` and is listed in this file for Codex checking.
- OTHER OPEN ITEMS (unchanged, non-blocking): unpublished gearing/aero for Kona N, Octavia, RS 3, Macan GTS. No real-world test for CT4-V, Camaro ZL1 1LE, E 63 wagon. No native iPad touch/keyboard test of the car picker yet (owner to try it). Owner to forward official US factory spec sheets when found.
- CODE CHANGES THIS ENTRY: none (documentation only).
