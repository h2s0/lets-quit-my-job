# Important Cleanup

## 문제

프로젝트 전체를 확인해보니 `!important`가 `DateSelect.css`에 집중되어 있었다.

총 31개의 `!important`가 다음 영역에 사용되고 있었다.

- DatePicker 달력 컨테이너와 popper
- 달력 header
- 요일과 날짜 셀
- hover, selected, keyboard selected 상태
- 이전/다음 navigation
- popper triangle

모든 선언은 외부 라이브러리인 `react-datepicker`의 기본 CSS를 덮어쓰기 위해 추가되어 있었다.

기존 구조는 다음 두 CSS를 TSX에서 순서대로 불러오는 방식이었다.

```ts
import 'react-datepicker/dist/react-datepicker.css';
import '@/components/DateSelect.css';
```

프로젝트 CSS가 외부 CSS보다 뒤에 로드되지만, 외부 selector의 specificity가 변경되거나 상태 selector가 더 구체적일 가능성에 대비해 대부분의 override에 `!important`를 사용하고 있었다.

이 구조에는 다음과 같은 문제가 있었다.

- 실제로 필요하지 않은 선언까지 `!important`를 사용함
- 외부 라이브러리와 프로젝트 스타일의 우선순위가 import 순서에 의존함
- 상태 selector의 specificity 경쟁을 파악하기 어려움
- popper triangle selector가 DatePicker 외부까지 전역으로 적용됨
- Tailwind Input 스타일과 페이지 CSS가 font와 width를 중복 관리함

## 목표

`!important` 문자열만 삭제하는 것이 아니라 외부 라이브러리와 프로젝트 스타일의 cascade 책임을 분리한다.

다음 기준을 적용한다.

- 외부 라이브러리 CSS를 명시적으로 낮은 cascade layer에 배치
- 프로젝트 스타일은 컴포넌트 범위 안에서 자연스럽게 우선하도록 구성
- 상태 selector를 불필요하게 더 길게 만들지 않음
- Tailwind와 기존 CSS가 같은 속성을 동시에 관리하지 않도록 정리
- 공통 Input의 variant와 state 책임을 유지
- 불가피한 `!important`만 남기고 이유를 기록

## 작업 내용

### 1. 전체 important 사용 위치 조사

프로젝트의 `src` 디렉터리에서 `!important`를 검색한 결과는 다음과 같았다.

```text
src/components/DateSelect.css: 31개
그 외 파일: 0개
```

원인별 분류:

```text
달력 컨테이너와 popper: 7개
달력 header: 4개
요일과 날짜 셀: 8개
날짜 상태 스타일: 8개
navigation: 3개
triangle: 1개
```

31개 모두 `react-datepicker` 기본 CSS와 동일한 속성을 제어하고 있었다.

### 2. 외부 CSS를 cascade layer로 격리

TSX에서 직접 불러오던 외부 CSS import를 제거한다.

```ts
import 'react-datepicker/dist/react-datepicker.css';
```

대신 `DateSelect.css`에서 외부 스타일을 `datepicker-vendor` layer로 불러온다.

```css
@import 'react-datepicker/dist/react-datepicker.css'
  layer(datepicker-vendor);
```

외부 라이브러리 스타일은 낮은 우선순위 layer에 들어가고, 프로젝트의 unlayered 컴포넌트 스타일은 selector specificity와 관계없이 자연스럽게 우선한다.

### 3. important 선언 제거

외부 CSS의 우선순위를 구조적으로 낮춘 후 `DateSelect.css`의 31개 `!important`를 제거한다.

기존:

```css
.ds-calendar .react-datepicker__day--selected {
  background: var(--color-primary) !important;
  color: var(--color-text-inverse) !important;
}
```

변경:

```css
.ds-calendar .react-datepicker__day--selected {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}
```

selected, hover, keyboard selected 등 상태 스타일도 동일한 원칙으로 정리한다.

### 4. triangle selector 범위 제한

기존 triangle selector는 모든 DatePicker triangle에 전역으로 적용될 수 있었다.

```css
.react-datepicker__triangle {
  display: none;
}
```

DateSelect popper 내부에서만 적용되도록 selector를 제한한다.

```css
.ds-popper .react-datepicker__triangle {
  display: none;
}
```

외부 CSS가 낮은 layer에 있으므로 placement attribute를 따라가는 긴 selector나 `!important`가 필요하지 않다.

### 5. 디자인 토큰 사용

DatePicker에서 직접 선언하던 font family를 디자인 시스템 토큰으로 변경한다.

```css
font-family: var(--font-sans);
```

달력의 color, radius, typography, shadow도 기존 디자인 토큰을 그대로 사용한다.

### 6. Tailwind와 페이지 CSS의 중복 책임 제거

DateSelect 입력은 이미 공통 Input 스타일 생성 함수를 사용하고 있다.

```ts
inputClassName({
  variant: 'document',
  inputSize: 'sm',
  invalid,
});
```

따라서 페이지 CSS에 남아 있던 다음 중복 스타일을 제거한다.

- `.r-table input`의 `width: 100%`
- `.r-line-control input`의 `width: 100%`
- `.r-line-field .ds-wrapper`의 중복 width
- `.r-line-field .ds-input`의 중복 font family와 letter spacing

표 입력의 border는 `Input table` variant가 소유하도록 변경하고, 페이지 CSS에는 표 높이와 label border처럼 레이아웃에 필요한 규칙만 유지한다.

DateSelect에 필요한 serif font와 tracking은 입력 class에서 명시한다.

```ts
className: 'ds-input font-serif tracking-wide'
```

### 7. 새로운 Input variant는 추가하지 않음

DateSelect 입력은 이미 `document` variant를 사용하고 있다.

현재 문제는 variant 부족이 아니라 외부 CSS의 cascade 우선순위와 페이지 override 중복이었으므로 새로운 variant를 만들지 않는다.

함수나 variant 개수를 늘리는 것보다 기존 스타일 책임을 명확히 하는 것을 우선한다.

## 확인 사항

리팩터링 후 다음 항목을 확인한다.

- 프로젝트 `src`에 설명할 수 없는 `!important`가 남아 있지 않은가
- 외부 DatePicker CSS가 `datepicker-vendor` layer에서 로드되는가
- 프로젝트 DateSelect 스타일이 unlayered 컴포넌트 스타일로 적용되는가
- selected, hover, keyboard selected 상태가 기존 디자인 토큰을 사용하는가
- triangle 제거가 DateSelect popper 범위에만 적용되는가
- Tailwind Input과 페이지 CSS가 width와 font를 중복 관리하지 않는가
- 기존 Input의 document variant와 invalid 상태가 유지되는가

자동 검증:

```text
rg -n "!important" src \
  --glob '*.css' \
  --glob '*.tsx' \
  --glob '*.ts'
npm run lint
npm run build
git diff --check
```

빌드 결과에는 Tailwind Preflight가 생성하는 다음 선언이 1개 존재한다.

```css
[hidden]:where(:not([hidden=until-found])) {
  display: none !important;
}
```

이 선언은 HTML `hidden` 속성이 다른 author style에 의해 무효화되지 않도록 Tailwind가 제공하는 framework reset이다. 프로젝트가 직접 작성한 override가 아니며 접근성 관련 기본 동작을 보장하므로 유지한다.

## 결과

- 프로젝트가 직접 작성한 `!important` 31개를 0개로 정리
- 빌드 결과에 남은 Tailwind Preflight 선언 1개의 출처와 유지 이유 기록
- 외부 `react-datepicker` CSS를 cascade layer로 격리
- selector specificity 경쟁과 import 순서 의존성 제거
- DatePicker 상태 스타일의 책임을 `DateSelect.css`로 명확하게 제한
- 전역 triangle selector를 DateSelect popper 범위로 축소
- Tailwind Input과 페이지 CSS의 중복 width, font 스타일 제거
- 새로운 variant나 의미 없는 selector를 추가하지 않음
- lint, build, diff 검증 통과

## Commit

```text
refactor: DatePicker CSS 우선순위 정리
docs: important 정리 과정 기록
```
