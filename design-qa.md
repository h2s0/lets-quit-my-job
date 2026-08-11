# Design QA

## Source of truth

- `public/design-references/resignation-selected.png`
- `public/design-references/plaque-selected.png`
- `public/design-references/severance-selected.png`
- `public/design-references/pending-selected.png`

## Capture contract

- Browser: headless Chrome against the local Vite app
- Viewport: 390 × 844 CSS pixels, device scale factor 1
- Latest captures: `.omx/artifacts/visual-ralph/lets-quit-flow/iteration-13-document-copy-date/`
- Latest pixel diffs: `.omx/artifacts/visual-ralph/lets-quit-flow/iteration-8-details-flow/diff/`
- Test data: 브릿지웍스 주식회사 / 김민준 / 3,800,000원 and the dates shown in the selected references where the route state permits

## Final measurements

- Resignation pixel similarity: 95.68%
- Plaque pixel similarity: 96.43%
- Severance pixel similarity: 93.99%
- Pending pixel similarity: 92.49%
- Latest strict Visual Ralph verdict: 97 / 100 — pass
- Focused selected-reference motion verdict: 98 / 100 — pass

## Approved functional differences

- The top `퇴사하고싶다 1/3` label is removed by explicit user request.
- Calculation details are removed by explicit user request.
- Names, company, team, position, dates, tenure, amounts, and D-day are live values rather than baked image text.
- The applicant seal includes the requested physical stamp impact animation from the right edge.
- The severance and pending screens are real HTML documents, not screenshots used as UI backgrounds.
- The severance effect combines a transparent gold burst, a live canvas-confetti firework, and nine single-banknote source assets rendered as eighteen independent foreground, middle-ground, and background elements. Notes and confetti launch from the same center in all directions while distance and opacity change together.
- Result titles use the user-requested unspaced strings `퇴직금명세서` and `퇴직금존버통지서`.
- The pending effect uses a transparent speed-line/calendar decoration layer over the shared paper texture; its title, rows, D-day, messages, disclosure, and actions remain live HTML.

## Interaction and runtime checks

- Verified `/`, `/plaque`, and both eligible/ineligible `/severance` states.
- Verified stamp-ready, impact, and final-impression states.
- Verified the severance center-arrival motion frame and the final outward-settled frame separately.
- Replaced the former two-way motion with one simultaneous 2400ms center-to-edge burst. Eighteen notes and eighteen confetti pieces move independently while distance and opacity change together.
- Verified the pending decoration is hard-clipped at y=484px, exactly where the summary starts.
- Replaced typed calendar labels with extracted AUG 15, JUL 31, and SEP 01 torn-calendar assets and removed stray D-day glyph fragments.
- Verified back navigation and 390px document width without horizontal overflow.
- Verified the calculation disclosures are absent from both eligible and pending results.
- Browser capture reported no console errors during the eligible and pending result checks.
- Verified six sequential reference-aligned burst frames at 200ms intervals. The selected-reference density peaks around frame 3 and the next burst begins immediately in frame 6.
- Verified each animated PNG contains one isolated banknote or one isolated confetti piece. All visible elements move through center → kick → edge → offscreen coordinates while opacity changes; no visible center hold, endpoint hold, or all-element blank interval remains.
- `npm run lint`, `npm run build`, and `git diff --check` passed.

## Iteration 8 comparison history

- P1 before fix: expanded calculation rows occupied the same absolute area as the confirmation/footer content.
  - Fix: the document now increases from 747/750px to 850px while open, and the eligible confirmation moves below the expanded 150px calculation block.
  - Evidence: `severance-open.png` and `pending-open.png`; both full-page captures are 390 × 951px with no overlap.
- P2 before fix: the pending encouragement box began too far left, used a single bright-red border, and the small seal was vertically centered beside it.
  - Fix: matched the reference box width and x-position, added the inset print line, changed the copy to dark ink, enlarged the seal, and lowered its impression relative to the box.
  - Evidence: `pending-closed.png`; strict visual verdict category scores are geometry 98 and typography 96.
- User override: title tracking and literal word spaces were removed. The rendered titles are `퇴직금명세서` and `퇴직금존버통지서`.

## Latest fidelity surfaces

- Fonts and typography: Noto Serif KR hierarchy retained; result titles render without spaces as requested. Minor natural raster/font differences remain acceptable.
- Spacing and layout rhythm: the eligible document is intentionally shorter after removing the calculation section; the pending layout remains aligned with its selected reference.
- Colors and visual tokens: paper, ink, seal red, rules, and action blue remain aligned with the selected references. The live seal is slightly cleaner than the distressed reference print.
- Image quality and asset fidelity: original extracted paper, burst, banknote, speed-line, and torn-calendar assets remain in use with no new placeholders.
- Copy and content: the encouragement copy, projection rows, disclaimer, company-name seal, and title strings match the requested state.

## Iteration 10 selected-reference restoration

- Exact source: `public/design-references/severance-selected.png`, byte-identical to the approved generated image `exec-62737386-c20d-...png`.
- Captures: `.omx/artifacts/visual-ralph/lets-quit-flow/iteration-10-reference-restored/qa-money-pop-1.png` through `qa-money-pop-6.png`.
- The rejected doubled-cohort fireworks treatment was removed. Explicit coordinates and sizes now reproduce the original upper-right, side, amount-adjacent, and lower-corner banknote anchors.
- The target-density frame uses eighteen independent banknotes, stronger foreground scale and contrast, a brighter gold burst, and varied confetti depth.
- Focused verdict: 93 / 100 — pass. The earlier P1 banknote scale and position findings and later P2 right-anchor findings are resolved; only a P3 density difference from comparing motion to a static source remains.

## Iteration 11 confetti firework and total emphasis

- Replaced the extracted confetti sprites with `canvas-confetti`, fired as two simultaneous 360-degree particle populations from the amount center every 2400ms.
- Preserved the eighteen independently animated banknotes above the canvas layer, so bills and confetti burst together without moving as a grouped image.
- Added a brighter white halo behind `예상 퇴직금`, increased the amount weight and scale, removed both calculation disclosures, and applied the exact requested disclaimer.
- Rebuilt the confirmation seal as a double-ring company stamp containing the live company name and positioned it directly beside the company name.
- Captured eight sequential frames at 150ms intervals; all report one live confetti canvas and no console errors.
- Focused verdict: 95 / 100 — pass, with no blockers.

## Iteration 12 compact footer and ink seal

- Reduced the eligible document from 675px to 650px and closed the excessive space below the amount: disclaimer y=478px, confirmation y=530px, actions y=650px.
- Replaced the clean CSS-ring seal with a transparent raster double-ring asset carrying irregular vermilion ink wear; the live company name remains real HTML inside the imprint.
- The pending result remains unchanged at 750px and its action/footer positions are unaffected.
- Focused verdict: 96 / 100 — pass, with no P1/P2 findings or blockers.

## Iteration 13 document copy and date typography

- Matched the selected image's two-line notice exactly: `※ 본 명세서는 예상 퇴직금이며,` followed by `정산 시 변동될 수 있습니다.`.
- Increased the notice line-height to reproduce the reference's centered two-line rhythm without changing the pending notice.
- Replaced the eligible confirmation's dotted date with the document-style `YYYY년 MM월 DD일` format and matching word spacing.
- Focused verdict: 98 / 100 — pass, with no P1/P2 findings or blockers.

final result: passed
