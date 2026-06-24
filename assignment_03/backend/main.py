from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

# DB 설정
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# DB 모델 (테이블 구조 정의)
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    completed = Column(Boolean, default=False)
    date = Column(String, nullable=True)


# Pydantic 스키마 (요청/응답 데이터 구조 정의)
class TodoCreate(BaseModel):
    title: str
    date: str | None = None

class TodoUpdate(BaseModel):
    title: str
    date: str | None = None

class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool
    date: str | None

    class Config:
        from_attributes = True

# 테이블 생성
Base.metadata.create_all(bind=engine)

# FastAPI 앱 생성
app = FastAPI(title="Todo API")

# FastAPI 앱 미들웨어 및 CORS 설정
app.add_middleware(
    # 필요한 부분을 직접 작성해보세요.
    CORSMiddleware,
    allow_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_methods = ["*"],
    allow_headers = ["*"],
)

# DB 세션 의존성
def get_db():
    # 필요한 부분을 직접 작성해보세요.
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 엔드포인트 구현
# API 목록에 해당되는 부분을 직접 구현해보세요.
@app.get("/todos", response_model = list[TodoResponse])
def get_todos(db  = Depends(get_db)):
    return db.query(Todo).all()

@app.post("/todos", response_model = TodoResponse, status_code=201)
def create_todo(todo: TodoCreate, db = Depends(get_db)):
    db_todo = Todo(title = todo.title, date = todo.date)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.get("/todos/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, db=Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo

@app.put("/todos/{todo_id}", response_model = TodoResponse)
def update_todo(todo_id: int, db = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code = 404, detail = "Todo not found")
    db_todo.completed = not db_todo.completed
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.patch("/todos/{todo_id}", response_model=TodoResponse)
def edit_todo(todo_id: int, body: TodoUpdate, db=Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code = 404, detail = "Todo not found")
    db_todo.title = body.title
    if body.date is not None:
        db_todo.date = body.date
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int, db = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code = 404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
