# PLAN.MD — assignment_01 Todo 앱 → React 마이그레이션

> 이 문서는 작업 계획서입니다. **승인 전까지 코드 마이그레이션은 진행하지 않습니다.**

## 1. 목표

`assignment_01`의 바닐라 JS Todo 앱을 `assignment_02`에 React 기반으로 마이그레이션합니다.

- **스택**: React (v18+), Vite (v5.x), Tailwind CSS (v4.x), JavaScript, localStorage
- **레이아웃**: 기존 과제의 레이아웃/디자인을 그대로 유지
- **범위(1차)**: 기본 레이아웃 + Todo **CRUD** 기능만
- **수정 UI**: `prompt()` 대신 **인라인 입력창**으로 구현

## 2. 마이그레이션 범위

### ✅ 이번에 포함 (기본 레이아웃 + CRUD)
- 카드형 컨테이너 레이아웃 (흰 카드, `#672be0` 메인 컬러, 그림자 등)
- 제목 "오늘의 할 일"
- 할 일 **추가** 폼 (입력창 + "추가" 버튼, 빈 값 에러 메시지)
- 할 일 **목록 표시** (메모리 상태로 관리)
- 할 일 **완료 토글** (텍스트/“완료” 버튼 클릭 → 취소선)
- 할 일 **수정** → **인라인 입력창** (기존 `prompt()` 대체)
- 할 일 **삭제** (페이드 아웃 트랜지션 유지)

### ✅ 2차에서 추가 (상태별 필터링) — 10번 항목 참고
- 필터 (전체 / 진행 중 / 완료 + 각 버튼에 개수 카운트 표시)

### ✅ 3차에서 추가 (일간 뷰) — 11번 항목 참고
- 날짜 네비게이션 (이전/다음 날짜 이동 + 선택 날짜 표시)
- 날짜별 todo 스코프 (선택된 날짜의 할 일만 표시, 개수도 날짜 기준)

### ✅ 4차에서 추가 (localStorage 영속화) — 12번 항목 참고
- todos 추가/수정/삭제 시 localStorage 자동 저장 + 새로고침 시 복원
- 마지막으로 본 날짜 저장 + 복원 (없으면 오늘 날짜)

### ✅ 5차에서 추가 (주간 뷰) — 13번 항목 참고
- 주차 이동 버튼 + 한 주(월~일) 날짜 카드 (3차의 일간 날짜 네비게이션을 대체)
- 오늘 날짜 시각 강조, 날짜 클릭 시 해당 날짜 todo 표시, 각 날짜 카드에 날짜별 todo 개수 배지

> 모든 핵심 기능 마이그레이션 완료. todo 데이터 모델은 `{ id, task, completed, date }` 구조입니다.
> (`date`는 'YYYY-MM-DD' 문자열)

## 3. 폴더/파일 구조 (예정)

```
assignment_02/
├─ index.html              # title 변경, lang="ko"
├─ vite.config.js          # @tailwindcss/vite 플러그인 추가
├─ package.json            # tailwindcss, @tailwindcss/vite 의존성 추가
├─ src/
│  ├─ main.jsx             # 진입점 (유지)
│  ├─ index.css            # @import "tailwindcss" + @theme(메인 컬러)
│  ├─ App.jsx              # 루트, useTodos 훅 + 날짜/주차/필터 상태/개수 + 날짜 localStorage 동기화
│  ├─ hooks/
│  │  └─ useTodos.js       # todos 상태 + localStorage 동기화 + CRUD 로직
│  ├─ utils/
│  │  └─ date.js           # 날짜 헬퍼 (formatDate/addDays/parseDate/getWeekStart)  ← 3·4·5차
│  └─ components/
│     ├─ WeeklyView.jsx    # 주간 뷰 (주차 이동 + 날짜 카드/개수/오늘·선택 강조)  ← 5차 추가
│     ├─ TodoForm.jsx      # 추가 폼 + 빈 값 에러 처리
│     ├─ Filters.jsx       # 상태별 필터 바 (전체/진행 중/완료 + 개수)  ← 2차 추가
│     ├─ TodoList.jsx      # <ul> 목록 렌더
│     └─ TodoItem.jsx      # 개별 항목 (완료 토글 / 인라인 수정 / 삭제)
└─ (기존 vite/react 데모 파일 App.css, assets/* 등은 제거)
```

## 4. 컴포넌트 설계

### `useTodos` (커스텀 훅)
- `useState`로 todos 배열 관리, 초기값은 `localStorage`에서 로드 (없으면 빈 배열)
- `useEffect`로 todos 변경 시 `localStorage`에 자동 저장
- 노출 API: `todos`, `addTodo(task, date)`, `editTodo(id, task)`, `toggleTodo(id)`, `deleteTodo(id)`
- 각 todo: `{ id: crypto.randomUUID(), task, completed, date }`

### `App.jsx`
- `useTodos()` 호출, 레이아웃 컨테이너 렌더
- `TodoForm`, `TodoList`에 핸들러 전달

### `TodoForm.jsx`
- 로컬 `useState`로 입력값 관리, submit 시 trim 검증
- 빈 값이면 에러 메시지 표시, 정상 입력 시 `addTodo` 호출 후 입력창 초기화

### `TodoItem.jsx`
- 로컬 `isEditing` 상태로 보기 모드 ↔ **인라인 입력창** 전환
  - "수정" 클릭 → 텍스트가 input으로 바뀜, 값 입력 후 Enter/“저장”으로 확정, Esc/“취소”로 원복
- "완료" 버튼/텍스트 클릭 → `toggleTodo`
- "삭제" 버튼 → 페이드 아웃 후 `deleteTodo` (CSS transition 유지)

## 5. 스타일 전략 (Tailwind v4)

- `src/index.css`에 `@import "tailwindcss";` 추가
- 기존 `style.css`의 메인 컬러(`--main-color: #672be0`)는 `@theme`로 커스텀 컬러 토큰 등록
- 기존 디자인(카드 너비 500px, 패딩, 라운드, 그림자, 버튼 색상: 완료=초록 `#2ecc71`, 수정=주황 `#f39c12`, 삭제=빨강 `#ff4d4d`, 에러=`#ff4d4d`)을 Tailwind 유틸 클래스로 1:1 재현
- 페이드 인/아웃 트랜지션은 Tailwind transition 유틸 또는 index.css의 소량 커스텀으로 유지

## 6. 의존성 변경

추가 설치 예정:
```
npm i -D tailwindcss @tailwindcss/vite
```
제거 예정: vite/react 데모 잔재 (`src/App.css`, `src/assets/*`, `public/icons.svg` 등 미사용 파일)

## 7. 검증

- `npm run dev` 실행 → 추가/수정(인라인)/완료 토글/삭제 동작 확인
- 새로고침 후 todos·마지막 본 날짜 복원(localStorage 영속성) 확인
- `npm run build` 빌드 성공 확인

## 8. 버전 결정 (확정)

현재 스캐폴드 설치본과 요청을 비교해 아래와 같이 확정했습니다:

| 항목 | 요청 | 현재 스캐폴드 | 결정 |
|------|------|----------------|------|
| React | v18+ | 19.2 | **19.2 유지** (v18+ 충족) |
| Vite | v5.x | 8.0 | **5.x로 다운그레이드** ✅ |
| Tailwind | v4.x | 미설치 | **4.x 신규 설치** ✅ |

- Vite 5.x 다운그레이드: `package.json`의 `vite`/`@vitejs/plugin-react`를 5.x 호환 버전으로 낮추고 재설치합니다.
- 범위: **기본 레이아웃 + Todo CRUD만** (날짜/주간 뷰/필터 제외) — 2번 항목대로 확정.

## 9. 직접 수정 사항 (마이그레이션 이후 사용자 추가 최적화)

마이그레이션 완료 후, 반응형/UI 안정화를 위해 아래 부분을 직접 수정했습니다.

### 9-1. 레이아웃 너비 고정 / 반응형 안정화 — `src/App.jsx`
- 컨테이너 클래스를 최종적으로 **`w-[500px] max-w-full min-w-[447px] mx-auto`** 로 확정
  - `w-[500px]`: 기본 요소 너비를 **500px로 고정**
  - `max-w-full`: 최대 너비를 **부모 요소 너비만큼**으로 제한 → 화면(부모)이 500px보다 좁아지면 부모 너비에 맞춰 줄어들어 **모바일에서 화면 밖으로 넘치지 않음**
  - **`min-w-[447px]`**: 최소 너비를 447px로 설정 → 내부 요소들이 더 이상 줄어들지 못해 생기는 **레이아웃 잘림/일그러짐을 방지**
  - `mx-auto`: 좌우 여백을 자동 배분해 **화면 중앙 정렬**
  - (이전 시도였던 `w-full max-w-[500px] md:w-[500px]` 조합은 전체 페이지 너비에 따라 레이아웃이 다시 변동되는 문제가 있어, 위 방식으로 교체)

### 9-2. 완료 / 수정 / 삭제 버튼 크기 안정화 — `src/components/TodoItem.jsx`
- 버튼 컨테이너 `<div>`에 **`shrink-0`** 추가
  - 할 일 텍스트가 길어져도 flex 레이아웃에서 **버튼들이 찌그러지지 않고 원래 크기를 유지**하도록 고정
  - 텍스트 영역(`grow`)이 남은 공간을 차지하고, 버튼 영역은 줄어들지 않음

### 9-3. (제거됨) md 브레이크포인트 변경 — `tailwind.config.js`
- 이전에 `md` 브레이크포인트를 768px→500px로 바꾸는 `tailwind.config.js`를 추가했었으나,
  9-1을 `w-[500px] max-w-full` 방식으로 변경하면서 **`md:` 분기가 더 이상 필요 없어져 `tailwind.config.js`를 삭제**함.

### 9-4. body의 display 관련 코드 제거 — `src/index.css`
- `body`의 **`display: flex; justify-content: center;` 제거**
  - 기존에는 body가 flex 컨테이너라 자식(앱 카드)을 가운데 정렬했으나,
    **레이아웃 내부 컴포넌트들의 최소 너비 합이 화면 전체 너비보다 클 때** 카드가 잘리거나 일그러지는 현상이 있었음
  - flex 정렬을 제거하고 카드 자체의 `mx-auto`(9-1)로 중앙 정렬을 처리 → 화면이 좁아져도 카드가 정상적으로 가로 스크롤/축소되며 잘림·일그러짐을 방지
  - (메인 컬러 `@theme`, 폰트, 배경색, `padding-top`, `margin: 0` 등 나머지 body 설정은 유지)

### 9-5. 긴 할 일 텍스트 줄바꿈 — `src/components/TodoItem.jsx`
- 할 일 텍스트 `<span>`에 **`break-words`**와 **`min-w-0`** 추가
  - `break-words`: 공백 없는 긴 문자열도 컨테이너 폭에서 **줄바꿈**되도록 함
  - `min-w-0`: flex 자식의 기본 `min-width: auto` 때문에 텍스트가 줄어들지 못해 레이아웃을 밀어내는 현상을 막아, `break-words`가 실제로 동작하도록 보장
  - 결과: 긴 할 일이 버튼 영역을 밀어내거나 카드를 넘치지 않고 여러 줄로 표시됨

## 10. 2차 마이그레이션 — 상태별 필터링 (완료)

기존 과제의 필터 기능(전체 / 진행 중 / 완료 + 개수 표시)을 마이그레이션했습니다.

### 10-1. 필터 상태 관리 — `src/App.jsx`
- **`useState`로 필터 상태 관리**: `const [filter, setFilter] = useState('all')` (`'all' | 'active' | 'completed'`)
- **렌더링 시점에 표시 목록 파생**: 별도 상태 없이 렌더 중 `todos`를 필터링해 `visibleTodos`를 계산
  - `active` → 미완료 항목만, `completed` → 완료 항목만, `all` → 전체
  - `TodoList`에는 `todos` 대신 **`visibleTodos`**를 전달
  - 파생 상태이므로 `useEffect`/별도 `useState`를 두지 않아 동기화 이슈와 불필요한 리렌더가 없음
- **각 필터 개수 계산**: `counts = { all, active, completed }`를 `todos`로부터 파생해 버튼에 전달

### 10-2. 필터 바 컴포넌트 — `src/components/Filters.jsx` (신규)
- 전체 / 진행 중 / 완료 3개 버튼, 각 버튼 옆에 **개수 배지** 표시
- 현재 선택된 필터 버튼은 메인 컬러(`bg-main`, 흰 글자, 볼드)로 강조, 나머지는 흰 배경/회색 글자
- 기존 `style.css`의 `.filters` / `.filter-cnt` 레이아웃을 Tailwind 유틸로 재현 (`px-3 py-1.5`, 배지 `h-5 min-w-5`)
- 배치: 추가 폼과 할 일 목록 사이 (원본 HTML 순서와 동일)

### 10-3. 검증
- `npm run build` ✅ / `npm run lint` ✅

## 11. 3차 마이그레이션 — 일간 뷰 (완료, 일부 5차에서 대체)

기존 과제의 날짜 네비게이션과 날짜별 todo 스코프를 마이그레이션했습니다.

> ⚠️ 이후 **5차(주간 뷰)에서 `DateNav`(일간 날짜 네비게이션)는 `WeeklyView`로 대체**되었습니다.
> 아래 11-1·11-2(날짜 스코프/데이터 모델)는 그대로 유효하며, 11-3의 `DateNav`만 제거되었습니다. (13번 항목 참고)

### 11-1. 날짜 상태 관리 — `src/App.jsx`
- **`useState`로 선택 날짜 저장**: `const [selectedDate, setSelectedDate] = useState(new Date())`
- 선택 날짜를 `formatDate`로 `'YYYY-MM-DD'` 문자열(`selectedDateStr`)로 변환
- **날짜별 스코프**: `dateTodos = todos.filter((t) => t.date === selectedDateStr)` — 선택된 날짜의 할 일만 추림
- **날짜 + 상태 필터 결합**: `dateTodos`에 다시 상태 필터(active/completed/all)를 적용해 `visibleTodos` 계산 → `TodoList`에 전달
- **날짜 기준 개수**: `counts`를 `todos` 전체가 아닌 **`dateTodos`** 기준으로 계산 → 날짜를 바꾸면 필터 버튼 개수도 함께 갱신
- **할 일 추가 시 날짜 주입**: `onAdd={(task) => addTodo(task, selectedDateStr)}` — 현재 선택된 날짜로 todo 생성

### 11-2. 데이터 모델 확장 — `src/hooks/useTodos.js`
- `addTodo(task, date)`로 시그니처 변경, 생성되는 todo에 `date` 필드 추가 → `{ id, task, completed, date }`

### 11-3. ~~날짜 네비게이션 컴포넌트 — `src/components/DateNav.jsx`~~ (5차에서 제거)
- (당시) 이전(`<`)/다음(`>`) 버튼 + 가운데 선택 날짜를 한국어로 표시하던 컴포넌트
- **5차에서 `WeeklyView`로 대체되며 `DateNav.jsx`와 `formatDisplayDate` 헬퍼는 삭제됨** (13번 항목 참고)

### 11-4. 날짜 헬퍼 — `src/utils/date.js` (신규)
- `formatDate(date)` → `'YYYY-MM-DD'`
- `addDays(date, days)` → 원본 불변, days만큼 이동한 새 Date 반환
- `parseDate(str)` → `'YYYY-MM-DD'`를 로컬 시간 기준 Date로 파싱 (4차에서 추가, 12번 항목 참고)
- `getWeekStart(date)` → 해당 주의 월요일 Date 반환 (5차에서 추가, 13번 항목 참고)
- (※ 3차에 있던 `formatDisplayDate`는 5차에서 `DateNav` 제거와 함께 삭제)

### 11-5. 검증
- `npm run build` ✅ / `npm run lint` ✅

## 12. 4차 마이그레이션 — localStorage 영속화 (완료)

기존 과제의 localStorage 저장/복원을 마이그레이션했습니다. todos와 "마지막으로 본 날짜"를 각각 저장합니다.

### 12-1. todos 영속화 — `src/hooks/useTodos.js`
- **초기 로드**: `useState`의 초기값을 `loadInitialTodos()`로 지정 → `localStorage.getItem('todos')`를 파싱(없거나 실패 시 빈 배열)
- **자동 저장**: `useEffect(() => localStorage.setItem('todos', JSON.stringify(todos)), [todos])`
  - 추가/수정/삭제/완료 토글 등 todos가 바뀌는 모든 동작에서 자동 반영
- 저장 키: `'todos'`

### 12-2. 마지막으로 본 날짜 영속화 — `src/App.jsx`
- **초기 로드**: `useState`의 초기값을 `loadInitialDate()`로 지정
  - `localStorage.getItem('lastDate')`가 있으면 `parseDate`로 복원, **없거나(처음 방문/스토리지 삭제) 잘못된 값이면 오늘 날짜(`new Date()`)**
- **자동 저장**: `useEffect(() => localStorage.setItem('lastDate', selectedDateStr), [selectedDateStr])`
  - 선택 날짜가 바뀔 때마다(5차 이후: 주간 뷰에서 날짜 카드 클릭 시) 마지막 본 날짜를 갱신
  - 새로고침 시 이 날짜로 복원되고, 그 날짜가 속한 주차가 주간 뷰에 표시됨
- 저장 키: `'lastDate'` (형식: `'YYYY-MM-DD'`)

### 12-3. 검증
- `npm run build` ✅ / `npm run lint` ✅

## 13. 5차 마이그레이션 — 주간 뷰 (완료)

기존 과제의 주간 뷰를 마이그레이션하고, 3차의 일간 날짜 네비게이션(`DateNav`)을 이 주간 뷰로 대체했습니다.

### 13-1. 주차 상태 관리 — `src/App.jsx`
- **주차 상태 추가**: `const [weekStart, setWeekStart] = useState(() => getWeekStart(selectedDate))`
  - 표시 중인 주차의 시작일(월요일). 초기값은 복원된 선택 날짜가 속한 주
- **주차 이동(기존 날짜 버튼 → 주차 버튼)**: `onPrevWeek/onNextWeek`에서 `setWeekStart((w) => addDays(w, ∓7))`
  - selectedDate는 건드리지 않고 표시 주차만 이동 (원본 동작과 동일)
- **날짜 선택**: 날짜 카드 클릭 시 `onSelectDay={setSelectedDate}` → 해당 날짜의 todo만 표시
- **날짜별 개수 함수**: `countByDate(dateStr) = todos.filter((t) => t.date === dateStr).length` → 각 날짜 카드 배지로 전달

### 13-2. 주간 뷰 컴포넌트 — `src/components/WeeklyView.jsx` (신규)
- 좌우 **주차 이동 버튼**(`<`, `>`) 사이에 한 주(월~일) 7개 **날짜 카드** 렌더
  - `weekStart`부터 `addDays(weekStart, i)`로 7일 생성, 요일명은 `['월'..'일'][i]`
- 각 날짜 카드: **요일 / 날짜 / 해당 날짜 todo 개수**(`countByDate`) 표시
- **오늘 날짜 강조**: `formatDate(new Date())`와 같으면 `border-2 border-main font-bold`
- **선택 날짜 강조**: `selectedDateStr`와 같으면 `bg-main text-white`
- 기존 `style.css`의 `.weekly-view` / `.day-card`(`.selected`/`.today`) 레이아웃을 Tailwind 유틸로 재현
- 배치: 카드 최상단(제목 "오늘의 할 일" 위)

### 13-3. 날짜 헬퍼 추가 / 정리 — `src/utils/date.js`
- `getWeekStart(date)` 추가: 해당 주의 월요일 Date 반환(원본 불변)
- 일간 뷰 전용이던 `formatDisplayDate` 제거 (`DateNav`와 함께 삭제)

### 13-4. 제거
- `src/components/DateNav.jsx` 삭제 (주간 뷰가 날짜 네비게이션 역할을 대체)

### 13-5. localStorage 연동 (변경 없음)
- 별도 주차 키는 저장하지 않음. `'lastDate'`(선택 날짜)만 저장하고, 새로고침 시 그 날짜가 속한 주를 `getWeekStart`로 계산해 표시 → 마지막으로 보던 주차가 자연스럽게 복원됨

### 13-6. 검증
- `npm run build` ✅ / `npm run lint` ✅
