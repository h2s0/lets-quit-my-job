# Type Cleanup

## 문제

프로젝트를 확인해보니 타입 정의가 여러 파일에 분산되어 있고,
동일하거나 유사한 타입이 중복 정의되어 있을 가능성이 있다.

또한 AI로 생성된 코드 특성상 다음과 같은 타입 회피 패턴이 존재할 수 있다.

- `any`
- `as`
- `as unknown as`
- non-null assertion (`!`)
- 동일한 데이터 구조를 여러 파일에서 각각 정의
- API 응답 타입과 UI 타입이 섞여 있음
- 한 파일에서만 사용하는 타입까지 전역으로 분리됨

## 목표

타입의 위치와 책임을 명확히 정리한다.

- 한 파일에서만 사용하는 타입은 해당 파일 근처에 유지
- 같은 feature 내부 여러 파일에서 공유하면 feature의 `types.ts`
- 프로젝트 전역에서 공유되는 타입만 `types/`에 배치
- 동일한 구조의 중복 타입 제거
- 가능한 경우 기존 source type을 재사용
- 불필요한 `any`, 강제 타입 캐스팅 제거
- 타입 이름만 보고 역할을 이해할 수 있도록 정리

## 정리 기준

### 1. Local Type

한 파일에서만 사용하는 props/type은 해당 파일 내부에 둔다.

```ts
type UserCardProps = {
  name: string;
  email: string;
};
```

### 2. Feature Type

같은 기능 영역에서 여러 파일이 공유하는 타입은 해당 feature 내부의 `types.ts`에 둔다.

```text
features/
  user/
    UserCard.tsx
    UserForm.tsx
    types.ts
```

예:

```ts
// features/user/types.ts
export type User = {
  id: string;
  name: string;
  email: string;
};
```

```ts
// features/user/UserCard.tsx
import type { User } from './types';
```

### 3. Shared Type

프로젝트 여러 영역에서 공통으로 사용하는 타입만 전역 `types/` 디렉터리에 둔다.

```text
types/
  user.ts
  api.ts
  common.ts
```

예:

```ts
// types/api.ts
export type ApiResponse<T> = {
  data: T;
  message?: string;
};
```

단순히 여러 파일에서 사용된다는 이유만으로 모든 타입을 전역 `types/`에 이동하지 않는다.
사용 범위가 좁다면 해당 feature 가까이에 두는 것을 우선한다.

## AI 작업 지시

프로젝트 전체의 TypeScript 타입 사용을 분석해줘.

다음 항목을 우선 조사한다.

1. `any` 사용 위치
2. `as` / `as unknown as` 사용 위치
3. non-null assertion (`!`) 사용 위치
4. 동일하거나 거의 동일한 `type` / `interface` 중복 정의
5. 여러 파일에서 공유되는데 각각 따로 정의된 타입
6. 한 파일에서만 사용하는데 전역 `types/` 폴더에 있는 타입
7. API / DB / UI 타입이 불필요하게 중복된 부분
8. 타입 이름이 너무 포괄적이거나 의미가 불명확한 부분
9. 실제 source type을 재사용할 수 있는데 새 타입을 다시 정의한 부분
10. optional (`?`)이 실제 요구사항보다 과도하게 사용된 부분

단순히 모든 타입을 `types/` 폴더로 이동하지 말고,
사용 범위에 가장 가까운 위치에 두는 것을 원칙으로 한다.

## 수정 전 분석 결과로 먼저 보여줄 것

실제 코드를 수정하기 전에 다음 내용을 먼저 정리해서 보여줘.

- 중복 타입 목록
- `any` 사용 목록
- 강제 캐스팅 사용 목록
- non-null assertion 사용 목록
- 공통화가 필요한 타입
- feature 내부로 이동해야 하는 타입
- 로컬 파일 내부에 남겨야 하는 타입
- 삭제하거나 기존 타입을 재사용할 수 있는 타입
- 타입 이름 개선이 필요한 항목
- 권장 디렉터리 구조

각 항목에는 가능하면 다음 정보를 포함해줘.

- 파일 경로
- 현재 타입 이름
- 현재 사용 위치
- 문제점
- 권장 변경 방법

## 실제 수정 원칙

분석 이후 실제 수정 시 다음 원칙을 따른다.

### 중복 타입

동일한 데이터 구조가 여러 파일에서 중복 정의되어 있다면
하나의 source type으로 통합한다.

단, 이름만 비슷하고 의미가 다른 타입은 억지로 합치지 않는다.

### `any`

`any`는 무조건 제거하지 말고 왜 사용되었는지 먼저 확인한다.

구체적인 타입을 알 수 있는 경우 실제 타입으로 변경한다.

외부 데이터처럼 구조를 알 수 없는 경우에는 필요한 경우 `unknown`을 사용하고
검증 후 타입을 좁힌다.

### Type Assertion

다음과 같은 강제 캐스팅은 우선적으로 검토한다.

```ts
value as SomeType
value as unknown as SomeType
```

실제 타입 흐름을 수정해서 assertion 없이 타입 추론이 가능하다면
그 구조로 변경한다.

### Non-null Assertion

다음과 같은 코드는 실제로 null/undefined가 발생할 수 없는지 확인한다.

```ts
user!.id
```

가능하면 명시적인 validation 또는 조건 처리를 통해 제거한다.

### Props Type

특정 컴포넌트에서만 사용하는 Props 타입은 해당 컴포넌트 파일에 유지한다.

```ts
type ButtonProps = {
  ...
};
```

여러 컴포넌트가 실제로 동일한 계약을 공유할 때만 공통 타입으로 추출한다.

## 확인 사항

리팩터링 이후 다음 항목을 확인한다.

- 기존 중복 타입이 제거되었는가
- 불필요한 `any`가 남아 있지 않은가
- `as unknown as` 같은 이중 캐스팅이 남아 있지 않은가
- 타입이 불필요하게 전역화되어 있지 않은가
- 동일한 도메인 타입이 여러 곳에서 다시 정의되지 않았는가
- 타입 이름만 보고 역할을 이해할 수 있는가
- TypeScript compile/typecheck가 정상적으로 통과하는가
- 타입 정리 과정에서 런타임 동작이 변경되지 않았는가

## 결과

작업 완료 후 아래 내용을 기록한다.

- 수정한 타입 수
- 제거한 중복 타입 수
- 제거하거나 대체한 `any` 수
- 제거한 강제 캐스팅 수
- 새로 생성하거나 이동한 타입 파일
- 남겨둔 타입 관련 기술 부채와 이유

## Commit 예시

```text
refactor: clean up shared types and type assertions
```
