# 02. 디자인 시스템과 공통 UI 컴포넌트 도입

## 개요

기존 프로젝트는 페이지와 컴포넌트마다 CSS를 개별적으로 작성하고 있었다. 비슷한 역할의 텍스트, 버튼, 입력 필드가 서로 다른 크기와 색상, 간격을 사용해 스타일 기준을 파악하거나 일관되게 수정하기 어려운 상태였다.

이번 작업에서는 기존 디자인을 픽셀 단위로 복제하는 대신, 반복되는 스타일을 제한된 디자인 토큰으로 축소하고 공통 UI 컴포넌트가 토큰을 소비하도록 구조를 변경했다. 페이지 CSS에는 배경 이미지 정렬, 고정 프레임 좌표, 도장과 돈비 애니메이션 등 화면 고유의 표현만 남기는 것을 기준으로 삼았다.

## 문제

### 세분화된 스타일 값

- 본문 글자 크기가 `10px`부터 `17px`까지 거의 1px 단위로 나뉘어 있었다.
- 기본 텍스트 색상이 `#171717`, `#1a1a1a` 등 유사한 값으로 중복되어 있었다.
- 오류와 도장 색상이 `#a52d25`, `#b5342b`, `#c53d34`처럼 용도별 기준 없이 분산되어 있었다.
- 배경색도 `#faf7ef`, `#f8f5ed`, `#fffdf8`, `#f1efeb`처럼 비슷한 값이 반복되었다.
- `3px`, `4px`, `5px`, `6px`, `7px`처럼 지나치게 많은 간격 값이 존재했다.
- border radius가 `2px`, `3px`, `12px`, 원형 등으로 개별 선언되어 있었다.

### 공통 UI 부재

- 주요 버튼이 `.r-submit`, `.action-primary`, `.action-secondary`, `.sv-share`, `.p-save`로 각각 구현되어 있었다.
- 텍스트 입력, 날짜 입력, textarea가 동일한 focus 및 invalid 상태를 공유하지 않았다.
- 페이지에서 색상, 글자 크기, 굵기, radius 등 시각적 결정을 직접 내리고 있었다.
- 새로운 페이지나 상태를 추가할 때 기존 스타일을 복사해 수정할 가능성이 높았다.

### 페이지 CSS의 역할 과다

페이지 CSS가 다음 역할을 동시에 담당하고 있었다.

- 페이지 레이아웃
- 타이포그래피
- 폼 컨트롤 상태
- 버튼 variant
- 색상과 radius
- 이미지 기반 문서의 좌표 보정
- 애니메이션과 장식 효과

이로 인해 재사용 가능한 UI 규칙과 해당 화면만의 특수한 규칙을 구분하기 어려웠다.

## 목표

- 반복되는 스타일 값을 대표적인 디자인 토큰으로 축소한다.
- Tailwind CSS를 사용하되 arbitrary value 사용을 피한다.
- 페이지가 색상, 글자 크기, radius를 직접 결정하지 않도록 한다.
- 의미 있는 UI는 공통 컴포넌트에서 variant와 size로 선택한다.
- 페이지에서는 flex, grid, gap, margin 등 레이아웃 중심의 스타일만 직접 사용한다.
- 교체가 끝난 영역의 기존 CSS만 제거한다.
- 배경 이미지와 맞물린 절대 좌표, 애니메이션 등 화면 고유의 표현은 보존한다.
- 기존 사용자 흐름과 접근성 속성을 유지한다.

## AI Instructions

이번 리팩터링에 적용한 사용자 지시사항은 다음과 같다.

1. 기존 CSS 전체에서 typography, color, background, border, radius, spacing, button, input, badge, modal 등의 반복 패턴을 먼저 분석한다.
2. 기존 값을 모두 보존하지 않고 제한된 디자인 시스템 스케일로 통합한다.
3. `text-[14px]`, `px-[7px]`, `rounded-[9px]` 같은 Tailwind arbitrary value를 남발하지 않는다.
4. 최소한 `Button`, `Input`, `Textarea`, `Select`, `Typography`, `Badge`, `Modal` 공통 컴포넌트를 만든다.
5. 페이지와 기능 컴포넌트는 의미 있는 UI의 색상, 글자 크기, radius를 직접 결정하지 않고 공통 UI 컴포넌트를 사용한다.
6. 페이지에서 Tailwind utility를 사용할 때는 flex, grid, gap, margin 등 단순 레이아웃을 중심으로 사용한다.
7. 기존 CSS는 한 번에 삭제하지 않고 공통 컴포넌트로 대체된 규칙부터 제거한다.
8. 기존 디자인의 픽셀 단위 보존보다 일관성과 유지보수성 향상을 우선한다.
9. 구현 전에 반복 패턴, 토큰, 컴포넌트, 매핑, 리팩터링 순서를 먼저 정리한다.

## 디자인 토큰

디자인 토큰은 `src/index.css`의 Tailwind `@theme`에 정의했다.

### Typography

| 토큰 | 용도 |
| --- | --- |
| `display` | 퇴직금, D-day처럼 가장 강한 숫자 정보 |
| `heading-lg` | 페이지 문서 제목 |
| `heading-md` | 섹션 및 감사패 제목 |
| `heading-sm` | 작은 제목과 강조 텍스트 |
| `body-lg` | 강조 본문과 레이블 |
| `body-md` | 기본 본문과 컨트롤 |
| `body-sm` | 보조 본문과 문서 필드 |
| `caption` | 설명, 오류, 표의 작은 레이블 |

폰트는 `sans`와 `serif` 두 계열로 제한했다. 공통 `Typography` 컴포넌트에서 `variant`, `serif`, `tone`, `leading` 속성으로 선택한다.

### Color

| 토큰 | 용도 |
| --- | --- |
| `primary`, `primary-hover` | 주요 액션과 focus 상태 |
| `text-primary` | 기본 텍스트 |
| `text-secondary` | 보조 텍스트 |
| `text-muted` | placeholder와 비활성 정보 |
| `text-inverse` | 강조 배경 위 텍스트 |
| `border`, `border-strong` | 기본 및 강조 테두리 |
| `surface`, `surface-muted` | 기본 및 보조 표면 |
| `paper` | 문서형 화면 배경 |
| `danger`, `danger-muted` | 오류와 도장 상태 |
| `success`, `success-muted` | 성공 상태 |
| `warning`, `warning-muted` | 경고 상태 |

문서 내부의 반투명 선은 `document-rule`, `document-rule-muted` 토큰으로 통합했다.

### Radius와 Shadow

- Radius: `sm`, `md`, `lg`, `full`
- Shadow: `paper`, `floating`, `engraving`, `stamp`

### Spacing

Tailwind의 4px 기반 기본 스케일을 사용한다. 일반 UI에서는 주로 `1`, `2`, `3`, `4`, `6`, `8` 단계를 사용한다. 배경 이미지와 텍스트 위치를 맞추기 위한 절대 좌표는 일반 spacing 토큰의 적용 대상에서 제외했다.

## 공통 UI 컴포넌트

공통 컴포넌트는 `src/components/ui/`에 배치하고 `index.ts`에서 내보낸다.

### DocumentFrame

- 세 페이지가 공유하는 390px 문서 프레임을 제공한다.
- 모바일에서는 화면 너비에 맞춰 축소하고 데스크톱에서는 문서 여백과 그림자를 적용한다.
- 페이지별 최소 높이와 배경 이미지는 각 페이지 CSS에 유지한다.

### ActionGroup

- 문서 하단의 2열 내비게이션 레이아웃을 제공한다.
- 공통 문서 gutter와 버튼 간격을 관리한다.
- 페이지별 absolute 배치나 위쪽 여백은 `className`으로 전달한다.

### Button

- Variant: `primary`, `secondary`, `outline`, `ghost`
- Size: `sm`, `md`, `lg`
- Shape: `default`, `square`, `full`
- `fullWidth`, `iconOnly`, disabled, focus, active 상태 지원

### Input

- Variant: `default`, `document`, `table`
- Size: `sm`, `md`
- invalid, disabled, focus 상태 지원
- DatePicker도 `inputClassName`을 통해 동일한 입력 스타일을 사용한다.

### Textarea

- Variant: `default`, `document`
- invalid, disabled, focus 상태 지원

### Select

- Variant: `default`, `document`
- Size: `sm`, `md`
- invalid, disabled, focus 상태 지원

### Typography

- 디자인 시스템의 typography variant를 HTML 요소와 분리해서 선택할 수 있다.
- `as`로 `h1`, `p`, `label`, `strong`, `time`, `dt`, `dd` 등의 의미론을 유지한다.
- `serif`, `tone`, `leading`을 통해 페이지가 직접 CSS 값을 선언하지 않고 의미를 전달한다.

### Badge

- Variant: `neutral`, `primary`, `success`, `warning`, `danger`
- 현재 화면에는 억지로 추가하지 않고 이후 상태 UI에서 사용할 수 있도록 기반만 제공한다.

### Modal

- 제목, 설명, 본문, footer 영역을 제공한다.
- backdrop 클릭과 Escape 키 닫기를 지원한다.
- `role="dialog"`, `aria-modal`, 제목과 설명 연결을 포함한다.
- 현재 화면에는 modal 사용처가 없어 공통 기반만 제공한다.

## 변경 내용

### Tailwind CSS 도입

- `tailwindcss`와 `@tailwindcss/vite`를 개발 의존성으로 추가했다.
- `vite.config.ts`에 공식 Tailwind Vite 플러그인을 연결했다.
- `src/index.css`에서 Tailwind를 가져오고 `@theme`으로 프로젝트 토큰을 정의했다.
- 전역 body, root, 폼 요소의 기본 스타일은 `@layer base`로 이동했다.

### 사직서 페이지

- 표 입력 필드를 `Input table` variant로 교체했다.
- 급여 입력을 `Input document` variant로 교체했다.
- 사직 사유를 `Textarea document` variant로 교체했다.
- 제목, 레이블, 선언문, 날짜, 오류 문구를 `Typography`로 교체했다.
- 제출 버튼을 `Button primary / lg / square` 조합으로 교체했다.
- 공통 컴포넌트가 담당하게 된 font-size, color, input state, button style CSS를 제거했다.
- 도장 버튼과 실제 도장 애니메이션은 페이지 고유 표현으로 유지했다.

### 감사패 페이지

- 감사패 제목, 수령인, 본문, 회사 정보를 `Typography`로 교체했다.
- 이전 및 다음 버튼을 `Button secondary`, `Button primary`로 교체했다.
- 이미지 저장 버튼을 `Button ghost / iconOnly / full` 조합으로 교체했다.
- 공통 버튼 스타일과 반복 typography CSS를 제거했다.
- 트로피 배경에 맞춘 각인 영역 좌표와 이미지 저장 영역은 유지했다.

### 퇴직금 페이지

- 공유, 이전, 처음 버튼을 공통 `Button`으로 교체했다.
- 제목, 개인 정보, 요약, 예상 금액, D-day, 안내 문구를 `Typography`로 교체했다.
- 성공 및 1년 미만 화면이 동일한 typography와 action 규칙을 사용하도록 통합했다.
- 공통 버튼의 색상, 크기, radius, 상태 관련 CSS를 제거했다.
- 문서 배경 위치, 달력 이미지, D-day 애니메이션, 돈비 효과는 유지했다.

### DatePicker

- 입력 영역은 공통 `Input document` 스타일 생성 함수를 사용한다.
- 라이브러리가 생성하는 달력 DOM은 직접 컴포넌트로 변경할 수 없어 adapter CSS를 유지했다.
- 달력의 색상, typography, radius는 새 디자인 토큰을 사용하도록 변경했다.

## 기존 스타일 매핑

| 기존 스타일 | 변경 후 |
| --- | --- |
| `.r-submit` | `Button`의 `primary`, `lg`, `square` |
| `.action-primary` | `Button`의 `primary` |
| `.action-secondary` | `Button`의 `secondary` |
| `.sv-share` | `Button`의 `outline` |
| `.p-save` | `Button`의 `ghost`, `iconOnly`, `full` |
| `.r-page`, `.p-page`, `.sv-page`의 공통 프레임 | `DocumentFrame` |
| `.p-actions`, `.sv-actions` | `ActionGroup` |
| `.r-table input` | `Input`의 `table`, `sm` |
| `.r-line-control input` | `Input`의 `document`, `sm` |
| `.r-reason textarea` | `Textarea`의 `document` |
| 페이지별 제목과 본문 | `Typography` variant |
| 페이지별 오류 색상 | `Typography tone="danger"`, Input invalid 상태 |
| `13px`, `13.5px`, `14px` | `body-sm` |
| `14.5px`, `15px`, `16px` | `body-md` 또는 `body-lg` |
| `10px`, `11px`, `12px` | `caption` |

## 유지한 예외

다음 값은 재사용 가능한 UI 스타일이 아니라 이미지 및 애니메이션 동작과 연결된 값이므로 Tailwind utility로 강제 변환하지 않았다.

- 390×844 문서 프레임 크기
- 감사패 배경 이미지의 각인 위치
- 퇴직금 문서의 고정 섹션 좌표
- 도장 크기, 회전, 이동 경로
- 달력과 돈 이미지의 애니메이션 위치
- react-datepicker 내부 DOM 크기와 selector
- 캡처 결과를 유지하기 위한 배경 이미지 설정

## 검토 결과

### 자동 검증

- `npm run lint`: 통과
- `npm run build`: 통과
- `git diff --check`: 통과
- Vite 개발 서버 `/`: HTTP `200 OK` 확인

### 스타일 검토

- 공통 UI와 페이지 TSX에서 Tailwind arbitrary value를 사용하지 않았다.
- 페이지 CSS의 직접 hex 및 rgb 색상 선언을 제거하고 디자인 토큰으로 교체했다.
- 교체가 끝난 버튼, 입력, textarea, typography 관련 CSS만 제거했다.
- Select, Badge, Modal은 현재 사용처가 없지만 동일한 토큰과 상태 규칙으로 구현했다.
- 기존 `formatDate` 통합 API와 충돌하지 않도록 날짜 표시 호출부를 유지했다.

### 추가 확인이 필요한 사항

- 자동 빌드와 개발 서버 응답은 확인했지만 브라우저별 시각 회귀 테스트는 별도로 수행하지 않았다.
- 고정 배경 이미지에 맞춘 페이지이므로 실제 모바일 폭과 폰트 로딩 상태에서 최종 육안 확인이 필요하다.
- Badge, Select, Modal은 실제 화면에 적용될 때 키보드 이동과 제품 문맥에 맞는 variant를 다시 확인해야 한다.
