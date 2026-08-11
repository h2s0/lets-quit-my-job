# Design QA

## Source of truth

- `public/design-references/resignation-selected.png`
- `public/design-references/plaque-selected.png`
- `public/design-references/severance-selected.png`
- `public/design-references/pending-selected.png`

## Capture contract

- Browser: headless Chrome against the local Vite app
- Viewport: 390 × 844 CSS pixels, device scale factor 1
- Latest captures: `.omx/artifacts/visual-ralph/lets-quit-flow/iteration-16-validation-plaque-nested-burst/`
- Latest pixel diffs: `.omx/artifacts/visual-ralph/lets-quit-flow/iteration-8-details-flow/diff/`
- Test data: 브릿지웍스 주식회사 / 김민준 / 3,800,000원 and the dates shown in the selected references where the route state permits

## Final measurements

- Resignation pixel similarity: 95.68%
- Plaque pixel similarity: 96.43%
- Severance pixel similarity: 93.99%
- Pending pixel similarity: 92.49%
- Latest strict Visual Ralph verdict: 97 / 100 — pass
- Focused form-validation verdict: 97 / 100 — pass
- Focused plaque-composition verdict: 95 / 100 — pass
- Focused square-seal verdict: 96 / 100 — pass
- Focused nested-money motion verdict: 96 / 100 — pass

## Approved functional differences

- The top `퇴사하고싶다 1/3` label is removed by explicit user request.
- Calculation details are removed by explicit user request.
- Names, company, team, position, dates, tenure, amounts, and D-day are live values rather than baked image text.
- The applicant seal includes the requested physical stamp impact animation from the right edge.
- The severance and pending screens are real HTML documents, not screenshots used as UI backgrounds.
- The severance effect combines a transparent gold burst, a live canvas-confetti firework, and nine single-banknote source assets rendered as two overlapping cohorts of eighteen independent elements. Notes and confetti launch from the same center in all directions while distance and opacity change together.
- Result titles use the user-requested unspaced strings `퇴직금명세서` and `퇴직금존버통지서`.
- The pending effect uses a transparent speed-line/calendar decoration layer over the shared paper texture; its title, rows, D-day, messages, disclosure, and actions remain live HTML.

## Interaction and runtime checks

- Verified `/`, `/plaque`, and both eligible/ineligible `/severance` states.
- Verified stamp-ready, impact, and final-impression states.
- Verified the severance center-arrival motion frame and the final outward-settled frame separately.
- Replaced the former two-way motion with simultaneous 2400ms center-to-edge bursts. A second identical cohort starts at 1440ms, exactly 60% into the first, while both continue moving outward.
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

## Iteration 14 total radiance

- Removed the opaque white oval that had washed out the selected image's original white and pale-gold ray layer behind the amount.
- Anchored the burst at 50% / 45% and changed it to a one-way 2400ms pulse: vertical scale 0.93 → 1.14, horizontal scale 0.97 → 1.04, then fade without a reverse phase.
- The radiance now spans from above `예상 퇴직금` to below the amount while the amount and unit remain fully legible.
- Focused verdict: 96 / 100 — pass, with no P1/P2 findings or blockers.

## Iteration 15 square company seal and offscreen money

- Product reference: `https://m.dojangmart.net/product/도장마트-만년도장-직인-도장/335/`; the preserved visual crop is `iteration-15-square-seal-outward-money/dojangmart-square-seal-reference.jpg`.
- Replaced the round seal with a generated transparent square double-border asset based on the product's stamped impression. A live 120px canvas composes `주식회사`, the company name, and `인` as a normal left-to-right, top-to-bottom square grid.
- The canvas uses heavy rounded glyph strokes and applies deterministic alpha loss to both border and characters, producing the same uneven red-ink impression on every render.
- Replaced the former burst asset containing static notes with `severance-radiance.png`, which contains only the white/pale-gold center rays.
- All eighteen banknotes now normalize their original direction to an offscreen travel distance of `680px + noteSize × 0.35`. Transform remains linear from 4% to 100%; opacity fades only while travel continues, with no endpoint hold, shrink, reverse, or fall.
- Square-seal verdict: 95 / 100 — pass. Outward-money verdict: 97 / 100 — pass. Neither has P1/P2 findings or blockers.

## Iteration 16 validation, plaque hierarchy, and nested burst

- Replaced browser alerts/native validation bubbles with in-document validation. Missing company, team, position, name, salary, and dates receive red paper shading and borders; the first error receives focus.
- Submitting without the applicant seal marks the seal target, shakes it, and shows `신청인 도장을 찍어주세요.` inline. Form fields and date pickers expose labels, `aria-invalid`, and linked descriptions.
- Rebuilt the plaque hierarchy as `감사패` → small `직급 이름` → the retained appreciation copy → `회사명 / 팀명 일동 / 직인`, and removed the exaggerated title tracking.
- Increased every banknote source to 150% while recalculating its offscreen travel distance. Added a second eighteen-note, radiance, and confetti cohort at 1440ms, exactly 60% into the 2400ms first burst.
- Corrected the company seal from the misread vertical/right-to-left order to the product-style row-major order. `주식회사브릿지웍스인` is now read left-to-right and top-to-bottom with 7% denser glyphs.
- Form-validation verdict: 97 / 100. Plaque verdict: 95 / 100. Square-seal verdict: 96 / 100. Nested-money verdict: 96 / 100. All pass with no P1/P2 findings or blockers.

final result: passed
