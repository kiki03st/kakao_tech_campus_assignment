# 작업 진행 상황

## 완료

### Backend (`backend/main.py`)

- FastAPI + SQLAlchemy + SQLite 구성
- Todo 모델: `id`, `title`, `completed`, `date` 필드
- REST API 엔드포인트:
  - `GET /todos` — 전체 목록
  - `GET /todos/{id}` — 단건 조회
  - `POST /todos` — 생성 (`title`, `date`)
  - `PUT /todos/{id}` — `completed` 토글
  - `PATCH /todos/{id}` — `title`, `date` 수정
  - `DELETE /todos/{id}` — 삭제 (204)
- CORS: `http://localhost:3000` 허용

### Frontend (`frontend/`)

#### 공통

- `globals.css` — `--color-main: #672be0` Tailwind 테마 토큰 추가
- `_lib/date.ts` — `formatDate`, `addDays`, `parseDate`, `getWeekStart` 유틸

#### 페이지

- `app/todos/page.tsx` — Server Component (TodoApp 렌더)
- `app/todos/new/page.tsx` — Server Component (NewTodoForm 렌더)
- `app/todos/[todoId]/page.tsx` — Server Component, `/api/todos/{id}` 페치 후 EditTodoForm에 전달
- `app/todos/error.tsx` — Client Component, 에러 발생 시 재시도 버튼 표시
- `app/todos/loading.tsx` — Server Component, 스켈레톤 UI

#### 컴포넌트

- `_components/TodoApp.tsx` — Client Component
  - 주간 뷰 날짜 선택 + localStorage 날짜 복원
  - 필터 상태 (`all` / `active` / `completed`)
  - 조회: `/api/todos`, 변경: Server Actions 호출
- `_components/WeeklyView.tsx` — 주간 날짜 카드 뷰
- `_components/Filters.tsx` — 상태 필터 바
- `_components/TodoList.tsx` — 목록 렌더러
- `_components/TodoItem.tsx` — 개별 항목 (페이드 인/아웃, 완료 토글, 삭제, 수정 페이지 이동)
- `_components/NewTodoForm.tsx` — Client Component, `createTodo` Server Action 호출
- `_components/EditTodoForm.tsx` — Client Component, `editTodo` Server Action 호출

#### API Route / Server Action

- `app/api/todos/route.ts` — `GET`(목록), `POST`(생성) FastAPI 프록시
- `app/api/todos/[todoId]/route.ts` — `GET`, `PUT`, `PATCH`, `DELETE` FastAPI 프록시
- `app/todos/actions.ts` — `createTodo`, `toggleTodo`, `editTodo`, `deleteTodo` + `revalidatePath`

#### 환경변수

- `frontend/.env.local` — `BACKEND_URL=http://localhost:8000`
  - `app/api/todos/route.ts`, `app/api/todos/[todoId]/route.ts`, `app/todos/actions.ts`, `app/todos/[todoId]/page.tsx`에서 `process.env.BACKEND_URL` 사용
- `backend/.env` — `DATABASE_URL`, `ALLOWED_ORIGINS`
  - `python-dotenv` 추가, `main.py`에서 `os.getenv()`로 읽기

## 미완료

없음
