# React Router의 useLocation으로 페이지 간 데이터 전달하기

React Router의 `useLocation`은 현재 페이지의 URL 정보와 페이지 이동 시 전달된 `state`를 가져오는 Hook이다.

## 데이터 전달하기

`navigate`의 `state`에 값을 넣으면 이동할 페이지로 데이터를 전달할 수 있다.

```tsx
navigate('/plaque', {
  state: form,
});
```

이 프로젝트에서는 사직서에서 입력한 회사명, 이름, 급여, 근무 기간 등의 정보를 감사패 페이지로 전달한다.

## 데이터 가져오기

이동한 페이지에서는 `useLocation`으로 전달된 값을 가져온다.

```tsx
const location = useLocation();
const data = getResignationRouteData(location.state);
```

`location.state`에는 앞 페이지의 `navigate`에서 전달한 `form`이 들어 있다. 별도의 백엔드 통신이나 `localStorage` 저장 없이도 한 화면의 데이터를 다음 화면에서 사용할 수 있다.

다만 라우터 state에는 항상 올바른 데이터가 들어 있다고 보장할 수 없다. 사용자가 결과 페이지 URL로 바로 접근하면 state가 없을 수 있기 때문에, 이 프로젝트에서는 `getResignationRouteData`로 데이터 구조를 확인하고 올바르지 않으면 첫 페이지로 이동시킨다.

## 저장 기능과의 차이

라우터 state는 페이지 이동 과정에서 데이터를 전달하기 위한 임시 상태다. URL에는 값이 노출되지 않지만, 장기간 보관하거나 다른 사용자와 공유하기 위한 저장소는 아니다.

- 같은 화면 흐름 안에서 잠시 사용할 데이터: 라우터 state
- 브라우저를 닫은 뒤에도 유지할 데이터: `localStorage`
- 여러 기기나 사용자가 공유할 데이터: 백엔드와 데이터베이스

즉, `useLocation`은 데이터를 저장하는 Hook이라기보다 **현재 방문 기록에 연결된 위치 정보와 전달받은 데이터를 읽는 Hook**이라고 이해하면 된다.
