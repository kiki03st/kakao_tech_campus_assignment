# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

FastAPI 백엔드와 Next.js 프론트엔드로 구성된 Todo 앱 (카카오 테크 캠퍼스 과제 03).

## 개발 명령어

### 백엔드 (FastAPI)

`backend/` 디렉토리에서 가상환경을 활성화한 후 실행:

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload
```

백엔드는 `http://localhost:8000`에서 실행되며, API 문서는 `http://localhost:8000/docs`에서 확인 가능.

의존성 설치:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 프론트엔드 (Next.js)

`frontend/` 디렉토리에서 실행:

```bash
cd frontend
npm install
npm run dev     # 개발 서버: http://localhost:3000
npm run build   # 프로덕션 빌드
npm run lint    # ESLint 실행
```

## 아키텍처

### 백엔드 (`backend/`)

`main.py` 하나로 구성된 단일 파일 FastAPI 앱:
- **SQLite** 데이터베이스 (`backend/todos.db`) — 앱 시작 시 SQLAlchemy `create_all`로 자동 생성
- **SQLAlchemy ORM** 모델 `Todo`: `id`, `title`, `completed` 필드
- **Pydantic 스키마**: `TodoCreate`(입력), `TodoResponse`(출력)
- **CORS**: `allow_origins=["*"]`로 전체 허용 (프론트엔드 연결용)

REST API 엔드포인트:
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/todos` | 전체 Todo 목록 조회 |
| POST | `/todos` | Todo 생성 (`{"title": "..."}`) |
| PUT | `/todos/{id}` | Todo의 `completed` 토글 |
| DELETE | `/todos/{id}` | Todo 삭제 (204 반환) |

### 프론트엔드 (`frontend/`)

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4.

> **주의**: 이 프로젝트는 Next.js 16으로, 이전 버전과 비교해 breaking change가 있을 수 있음. Next.js 관련 코드 작성 전 `node_modules/next/dist/docs/`의 실제 API 문서를 확인할 것.

주요 파일:
- `app/layout.tsx` — Geist 폰트와 Tailwind 기본 스타일이 적용된 루트 레이아웃
- `app/page.tsx` — 메인 페이지 (현재 기본 템플릿; Todo UI를 여기에 구현)
- `app/globals.css` — 전역 스타일
- `next.config.ts` — Next.js 설정 (현재 비어 있음)

프론트엔드는 `http://localhost:8000`의 백엔드와 통신.

## 중요 사항

- 구현은 전체를 한번에 구현하지 않고, 단계적으로 말하는 것에 대해 하나씩 구현할 것.
- 작업 내용은 PROGRESS.md 파일에 작업 완료 시마다 갱신할 것.
- 이전까지의 작업 내용이 없는 상태(다른 환경에서 작업 진행)라면 PROGRESS.md 파일을 참고하여 작업을 수행할 것.
