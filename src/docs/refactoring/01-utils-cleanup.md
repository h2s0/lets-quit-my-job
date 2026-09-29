# Utils Cleanup

## 문제

프로젝트를 확인해보니 여러 컴포넌트 및 페이지 파일 내부에 날짜/문자열 변환과 같은 유틸리티 함수가 각각 정의되어 있었다.

예를 들어 날짜 포맷 변경 함수가 각 파일 내부에 개별적으로 존재하여 다음과 같은 문제가 있었다.

- 동일하거나 유사한 기능의 함수가 여러 파일에 중복 존재
- 함수 이름 및 구현 방식이 파일마다 달라질 가능성
- 포맷 규칙 변경 시 여러 파일을 각각 수정해야 함
- 컴포넌트가 UI 렌더링 외의 공통 변환 로직까지 포함하고 있음

## 목표

공통으로 사용할 수 있는 변환 로직을 컴포넌트에서 분리하고 `utils` 디렉터리에서 관리한다.

단순히 모든 함수를 공통화하는 것이 아니라, 여러 위치에서 재사용되거나 동일한 책임을 가지는 함수만 분리한다.

## 작업 내용

### 1. 공통 유틸리티 디렉터리 생성

기능별로 유틸리티를 관리할 수 있도록 다음과 같은 구조를 사용한다.

```text
src/
  utils/
    date.ts
    string.ts
```

필요한 경우 이후 기능에 따라 파일을 추가한다.

### 2. 날짜 관련 함수 이동

컴포넌트 내부에 존재하던 날짜 관련 변환 함수를 `utils/date.ts`로 이동한다.

예:

```ts
formatDate(...)
parseDate(...)
formatDateValue(...)
formatTenure(...)
```

### 3. 동일한 역할의 날짜 포맷 함수 통합

기존에 다음과 같이 포맷별 함수가 따로 존재하던 경우:

```ts
formatDotDate(date)
formatKoreanDate(date)
```

두 함수는 모두 동일한 날짜 문자열을 화면 표시용 문자열로 변환하고, 차이는 출력 형식뿐이므로 하나의 함수로 통합한다.

```ts
type FormatType = 'dot' | 'korean';

export function formatDate(
  date: string,
  format: FormatType = 'dot'
): string {
  if (!date) return '';

  if (format === 'dot') {
    return date.replaceAll('-', '.');
  }

  const [year, month, day] = date.split('-');

  return `${year}년 ${month}월 ${day}일`;
}
```

사용 예:

```ts
formatDate('2026-09-27', 'dot');
// 2026.09.27

formatDate('2026-09-27', 'korean');
// 2026년 09월 27일
```

### 4. 책임이 다른 함수는 무리하게 통합하지 않음

다음 함수들은 날짜와 관련되어 있지만 역할이 다르므로 별도 함수로 유지한다.

```ts
parseDate()
```

- `string → Date`

```ts
formatDateValue()
```

- `Date → string`

```ts
formatTenure()
```

- 두 날짜 사이의 기간 계산

함수 개수를 줄이는 것 자체가 목표가 아니라 각 함수가 명확한 하나의 책임을 가지도록 한다.

## 확인 사항

리팩터링 후 다음 항목을 확인한다.

- 기존 컴포넌트 내부에 동일한 날짜 변환 함수가 남아 있지 않은가
- 동일한 날짜 포맷 로직이 다른 이름으로 중복되어 있지 않은가
- 공통 함수 import 경로가 일관적인가
- 사용하지 않는 기존 helper 함수가 남아 있지 않은가
- 기존 화면의 날짜 표시 형식이 변경되지 않았는가

## 결과

- 날짜 관련 공통 로직을 컴포넌트에서 분리
- 중복된 날짜 포맷 함수를 하나의 `formatDate` 함수로 통합
- 날짜 관련 로직을 `utils/date.ts`에서 관리하도록 변경

## Commit

```text
refactor: consolidate date formatting utilities
```