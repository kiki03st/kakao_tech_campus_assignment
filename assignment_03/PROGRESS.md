# 작업 진행 상황

## 완료

### Backend (`backend/main.py`)

- FastAPI + SQLAlchemy + SQLite 구성
- Todo 모델: `id`, `title`, `completed`, `date` 필드
- REST API 엔드포인트:
  - `GET /todos` — 전체 목록
  - `POST /todos` — 생성 (`title`, `date`)
  - `PUT /todos/{id}` — `completed` 토글
  - `PATCH /todos/{id}` — `title` 수정
  - `DELETE /todos/{id}` — 삭제 (204)
- CORS: `http://localhost:3000` 허용

## 미완료

### Frontend (`frontend/`)
- `app/todos/error.tsx` — 에러 화면
- `app/todos/loading.tsx` — 로딩 화면

## 완료 (Frontend) — 추가

### `app/todos/new/page.tsx` — Todo 생성 페이지

- `new/page.tsx` — Server Component
- `_components/NewTodoForm.tsx` — Client Component
  - 제목 입력 + 날짜 입력 (오늘 날짜 기본값)
  - 추가 버튼 → `POST /todos` → `/todos`로 이동
  - 취소 버튼 → `/todos`로 이동

## 완료 (Frontend)

### `app/todos/page.tsx` — Todo 목록 페이지 (assignment_02 스타일 마이그레이션)

- `page.tsx` — Server Component (얇은 진입점, `TodoApp` 렌더)
- `_lib/date.ts` — `formatDate`, `addDays`, `parseDate`, `getWeekStart` 유틸
- `_components/TodoApp.tsx` — Client Component (App.jsx 대응)
  - 주간 뷰 날짜 선택 + localStorage 날짜 복원
  - 필터 상태 (`all` / `active` / `completed`)
  - API CRUD: POST·PUT·PATCH·DELETE → `fetchTodos()` 재조회
- `_components/WeeklyView.tsx` — 주간 날짜 카드 뷰
- `_components/TodoForm.tsx` — 할 일 추가 폼
- `_components/Filters.tsx` — 상태 필터 바
- `_components/TodoList.tsx` — 목록 렌더러
- `_components/TodoItem.tsx` — 개별 항목 (페이드 인/아웃, 인라인 수정)
- `globals.css` — `--color-main: #672be0` Tailwind 테마 토큰 추가
