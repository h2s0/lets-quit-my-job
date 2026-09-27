# CSS Cascade와 Cascade Layer

## CSS Cascade란

하나의 HTML 요소에 여러 CSS 규칙이 같은 속성을 지정하면 브라우저는 cascade 규칙에 따라 최종 스타일을 결정한다.

단순히 CSS 파일의 가장 아래에 있는 선언이 항상 적용되는 것은 아니다.

브라우저는 대략 다음 순서로 우선순위를 판단한다.

1. `!important` 여부와 스타일 출처
2. cascade layer의 우선순위
3. selector specificity
4. CSS 작성 순서

앞 단계에서 승자가 결정되면 다음 단계는 비교하지 않는다.

## Selector Specificity

Specificity는 selector가 대상을 얼마나 구체적으로 지정하는지를 나타낸다.

대략 다음 순서로 강해진다.

```css
div               /* HTML 요소 */
.title            /* class */
.page .title      /* class 2개 */
#main .title      /* id + class */
```

attribute와 상태 selector도 specificity를 높인다.

```css
[aria-disabled="true"]
[data-placement="bottom"]
:hover
:disabled
```

예를 들어 다음 두 규칙이 있을 때:

```css
.page .title {
  color: blue;
}

.title {
  color: red;
}
```

`.title`이 아래에 작성되었더라도 더 구체적인 `.page .title`의 `blue`가 적용된다.

CSS 작성 순서는 specificity까지 같은 경우에만 마지막 판단 기준으로 사용된다.

```css
.title {
  color: blue;
}

.title {
  color: red;
}
```

두 selector의 specificity가 같으므로 뒤에 작성된 `red`가 적용된다.

## Important의 역할

`!important`는 일반적인 cascade 우선순위를 강제로 넘어가기 위해 사용한다.

```css
.title {
  color: red !important;
}
```

쉽게 스타일을 덮어쓸 수 있지만 반복적으로 사용하면 다음 문제가 생긴다.

- 이후 override에도 다시 `!important`가 필요해짐
- 어떤 스타일이 적용되는지 추적하기 어려워짐
- 컴포넌트 variant와 상태의 책임이 CSS override에 분산됨
- 외부 라이브러리의 selector 변경에 계속 대응해야 함

따라서 `!important`는 우선순위 구조를 설계하기 어려운 불가피한 경우에만 사용한다.

## Cascade Layer란

Cascade layer는 CSS를 명시적인 우선순위 그룹으로 분류하는 기능이다.

```css
@layer reset, vendor, base, components, utilities;
```

위 선언은 일반 스타일의 우선순위를 다음처럼 정의한다.

```text
reset
vendor
base
components
utilities
```

아래쪽에 선언된 layer일수록 높은 우선순위를 가진다.

```css
@layer vendor {
  .library .popup .button {
    color: blue;
  }
}

@layer components {
  .button {
    color: red;
  }
}
```

vendor selector가 더 구체적이더라도 상위 layer인 components의 `red`가 적용된다.

Layer는 selector specificity를 초기화하지 않는다. 같은 layer 안에서는 기존 specificity 규칙이 그대로 적용된다.

```css
@layer components {
  .button {
    color: red;
  }

  .dialog .button {
    color: green;
  }
}
```

두 규칙이 같은 layer에 있으므로 더 구체적인 `.dialog .button`이 적용된다.

일반 선언에서는 layer 밖에 작성한 CSS가 layer 내부의 CSS보다 우선한다.

```css
@layer vendor {
  .library .button {
    color: blue;
  }
}

.button {
  color: red;
}
```

따라서 외부 라이브러리를 낮은 layer에 넣고 프로젝트 CSS를 layer 밖에 두는 방식으로 외부 스타일을 안정적으로 재정의할 수 있다.

위 설명은 일반 선언을 기준으로 한다. `!important`가 붙은 선언은 layer 우선순위가 반대로 동작하므로 layer를 사용하더라도 `!important` 자체는 신중하게 사용해야 한다.

## DatePicker에 적용한 방법

`react-datepicker`는 달력, 날짜 셀, 선택 상태, hover, navigation 등 전체 UI의 CSS를 제공한다.

프로젝트에서는 외부 CSS를 가져온 뒤 여러 상태를 디자인 시스템에 맞게 다시 꾸며야 했다.

기존에는 TSX에서 두 CSS를 순서대로 불러왔다.

```ts
import 'react-datepicker/dist/react-datepicker.css';
import '@/components/DateSelect.css';
```

프로젝트 CSS가 뒤에 있어도 외부 selector가 더 구체적이면 외부 스타일이 적용될 수 있었다.

```css
.react-datepicker-popper[data-placement^="bottom"]
.react-datepicker__triangle {
  /* 외부 라이브러리 스타일 */
}
```

이를 강제로 덮기 위해 기존에는 여러 선언에 `!important`가 사용되고 있었다.

```css
.react-datepicker__triangle {
  display: none !important;
}
```

현재는 외부 CSS를 `datepicker-vendor` layer로 불러온다.

```css
@import 'react-datepicker/dist/react-datepicker.css'
  layer(datepicker-vendor);
```

프로젝트의 DateSelect 스타일은 layer 밖에서 관리한다.

```css
.ds-calendar .react-datepicker__day--selected {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.ds-popper .react-datepicker__triangle {
  display: none;
}
```

외부 CSS가 낮은 layer에 있으므로 다음 상태를 `!important` 없이 재정의할 수 있다.

- 달력 배경과 border
- 날짜 셀 크기
- hover 상태
- selected 상태
- keyboard selected 상태
- 이전/다음 navigation
- popper triangle

또한 `.ds-calendar`, `.ds-popper`를 사용해 스타일 범위를 DateSelect 컴포넌트 내부로 제한한다.

## Cascade Layer가 적합한 경우

다음과 같은 경우 cascade layer 사용을 검토할 수 있다.

- 외부 라이브러리 CSS 전체를 가져오는 경우
- 라이브러리의 여러 상태와 하위 요소를 다시 디자인해야 하는 경우
- 외부 selector와 계속 specificity 경쟁이 발생하는 경우
- 동일한 override에 `!important`가 반복되는 경우
- reset, vendor, component, utility의 우선순위를 프로젝트 차원에서 관리하려는 경우

다음과 같이 일부 스타일만 변경한다면 layer가 필요하지 않을 수 있다.

- 라이브러리가 theme prop이나 CSS variable을 제공하는 경우
- 컴포넌트의 variant로 표현할 수 있는 경우
- 범위가 제한된 selector 한두 개로 충분한 경우

## 권장 판단 순서

외부 스타일을 수정해야 할 때는 다음 순서로 판단한다.

1. 라이브러리가 제공하는 theme, prop, CSS variable을 사용할 수 있는지 확인한다.
2. 프로젝트 공통 컴포넌트의 variant나 state로 표현할 수 있는지 확인한다.
3. 컴포넌트 범위의 selector로 해결할 수 있는지 확인한다.
4. 외부 CSS 전체와 우선순위가 반복적으로 충돌하면 cascade layer를 사용한다.
5. 다른 방법으로 해결하기 어려운 경우에만 `!important`를 사용한다.

## 요약

- CSS 작성 순서는 specificity가 같은 경우에만 최종 판단 기준이 된다.
- selector가 더 구체적이면 앞에 작성되어 있어도 이길 수 있다.
- `!important`는 cascade를 강제로 넘어가므로 반복 사용을 피한다.
- cascade layer는 CSS를 명시적인 우선순위 그룹으로 나눈다.
- layer는 specificity를 없애는 것이 아니라 specificity를 비교하기 전에 그룹 우선순위를 결정한다.
- 외부 CSS 전체를 다시 꾸미는 경우 vendor layer를 사용하면 `!important`와 selector 경쟁을 줄일 수 있다.
