import { useEffect, useRef, useState } from 'react'

// 개별 할 일 항목 — 완료 토글 / 인라인 수정 / 삭제(페이드 아웃)를 담당한다.
function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [mounted, setMounted] = useState(false) // 마운트 후 페이드 인
  const [leaving, setLeaving] = useState(false) // 삭제 시 페이드 아웃
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.task)
  const editInputRef = useRef(null)

  // 마운트 직후 opacity 0 → 1 트랜지션을 트리거
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // 수정 모드 진입 시 입력창에 포커스
  useEffect(() => {
    if (isEditing) editInputRef.current?.focus()
  }, [isEditing])

  const startEdit = () => {
    setEditValue(todo.task)
    setIsEditing(true)
  }

  const saveEdit = () => {
    if (editValue.trim() === '') return
    onEdit(todo.id, editValue)
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setEditValue(todo.task)
    setIsEditing(false)
  }

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') saveEdit()
    else if (e.key === 'Escape') cancelEdit()
  }

  const handleDelete = () => setLeaving(true)

  // 페이드 아웃 트랜지션이 끝나면 실제 삭제
  const handleTransitionEnd = () => {
    if (leaving) onDelete(todo.id)
  }

  const visible = mounted && !leaving

  return (
    <li
      onTransitionEnd={handleTransitionEnd}
      className={`flex items-center justify-between gap-1.5 border-b border-gray-200 p-2.5 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {isEditing ? (
        <input
          ref={editInputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleEditKeyDown}
          className="grow rounded-md border border-gray-300 px-2 py-1 outline-none focus:border-main"
        />
      ) : (
        <span
          onClick={() => onToggle(todo.id)}
          className={`grow min-w-0 break-words cursor-pointer ${
            todo.completed ? 'text-gray-500 line-through' : ''
          }`}
        >
          {todo.task}
        </span>
      )}

      {/* **직접 수정** shrink-0을 추가하여 요소 크기 유지*/}
      <div className="flex gap-1.5 shrink-0">
        {isEditing ? (
          <>
            <button
              onClick={saveEdit}
              className="cursor-pointer rounded bg-[#2ecc71] px-2 py-1 text-xs text-white"
            >
              저장
            </button>
            <button
              onClick={cancelEdit}
              className="cursor-pointer rounded bg-gray-400 px-2 py-1 text-xs text-white"
            >
              취소
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onToggle(todo.id)}
              className="cursor-pointer rounded bg-[#2ecc71] px-2 py-1 text-xs text-white"
            >
              완료
            </button>
            <button
              onClick={startEdit}
              className="cursor-pointer rounded bg-[#f39c12] px-2 py-1 text-xs text-white"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="cursor-pointer rounded bg-[#ff4d4d] px-2 py-1 text-xs text-white"
            >
              삭제
            </button>
          </>
        )}
      </div>
    </li>
  )
}

export default TodoItem
