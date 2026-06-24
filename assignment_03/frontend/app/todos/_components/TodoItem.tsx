'use client'

import { useEffect, useRef, useState } from 'react'

export type Todo = {
  id: number
  title: string
  completed: boolean
  date: string | null
}

type Props = {
  todo: Todo
  onToggle: (id: number) => void
  onEdit: (id: number, title: string) => void
  onDelete: (id: number) => void
}

export default function TodoItem({ todo, onToggle, onEdit, onDelete }: Props) {
  const [mounted, setMounted] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.title)
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (isEditing) editInputRef.current?.focus()
  }, [isEditing])

  const startEdit = () => {
    setEditValue(todo.title)
    setIsEditing(true)
  }

  const saveEdit = () => {
    if (editValue.trim() === '') return
    onEdit(todo.id, editValue)
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setEditValue(todo.title)
    setIsEditing(false)
  }

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit()
    else if (e.key === 'Escape') cancelEdit()
  }

  const handleDelete = () => setLeaving(true)

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
          {todo.title}
        </span>
      )}

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
