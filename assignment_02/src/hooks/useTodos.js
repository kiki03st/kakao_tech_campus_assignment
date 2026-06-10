import { useEffect, useState } from 'react'

const STORAGE_KEY = 'todos'

// localStorage에서 초기 todos를 로드한다. 값이 없거나 파싱 실패 시 빈 배열.
function loadInitialTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// todos 상태 + localStorage 동기화 + CRUD 로직을 캡슐화한 커스텀 훅
export function useTodos() {
  const [todos, setTodos] = useState(loadInitialTodos)

  // todos가 바뀔 때마다(추가/수정/삭제/완료 토글) localStorage에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = (task, date) => {
    const trimmed = task.trim()
    if (trimmed === '') return
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), task: trimmed, completed: false, date },
    ])
  }

  const editTodo = (id, task) => {
    const trimmed = task.trim()
    if (trimmed === '') return
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, task: trimmed } : todo)),
    )
  }

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  return { todos, addTodo, editTodo, toggleTodo, deleteTodo }
}
