# Design QA

## Source of truth

- `public/design-references/resignation-selected.png`
- `public/design-references/plaque-selected.png`
- `public/design-references/severance-selected.png`
- `public/design-references/pending-selected.png`

## Capture contract

- Browser: headless Chrome against the local Vite app
- Viewport: 390 × 844 CSS pixels, device scale factor 1
- Captures: `.omx/artifacts/visual-ralph/lets-quit-flow/iteration-4-final/`
- Pixel diffs: `.omx/artifacts/visual-ralph/lets-quit-flow/iteration-4-final/diff/`
- Test data: 브릿지웍스 주식회사 / 김민준 / 3,800,000원 and the dates shown in the selected references where the route state permits

## Final measurements

- Resignation pixel similarity: 95.68%
- Plaque pixel similarity: 96.43%
- Severance pixel similarity: 93.99%
- Pending pixel similarity: 92.49%
- Strict Visual Ralph verdict: 94 / 100 — pass

## Approved functional differences

- The top `퇴사하고싶다 1/3` label is removed by explicit user request.
- Calculation details are collapsed by default by explicit user request.
- Names, company, team, position, dates, tenure, amounts, and D-day are live values rather than baked image text.
- The applicant seal includes the requested physical stamp impact animation from the right edge.
- The severance and pending screens are real HTML documents, not screenshots used as UI backgrounds.
- The severance effect is split into a transparent gold/confetti layer and nine independent banknote assets. Notes travel from the edges toward the viewer/center, then burst back toward the edges.
- The pending effect uses a transparent speed-line/calendar decoration layer over the shared paper texture; its title, rows, D-day, messages, disclosure, and actions remain live HTML.

## Interaction and runtime checks

- Verified `/`, `/plaque`, and both eligible/ineligible `/severance` states.
- Verified stamp-ready, impact, and final-impression states.
- Verified the severance center-arrival motion frame and the final outward-settled frame separately.
- Replaced the former two-way motion with a center-to-edge-only infinite loop. Nine notes use negative staggered delays so outward movement is continuously visible.
- Verified the pending decoration is hard-clipped at y=484px, exactly where the summary starts.
- Replaced typed calendar labels with extracted AUG 15, JUL 31, and SEP 01 torn-calendar assets and removed stray D-day glyph fragments.
- Verified back navigation and 390px document width without horizontal overflow.
- `npm run lint`, `npm run build`, and `git diff --check` passed.

final result: passed
