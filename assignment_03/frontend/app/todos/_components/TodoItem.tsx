'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export type Todo = {
  id: number
  title: string
  completed: boolean
  date: string | null
}

type Props = {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  const [mounted, setMounted] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

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
      <span
        onClick={() => onToggle(todo.id)}
        className={`grow min-w-0 break-words cursor-pointer ${
          todo.completed ? 'text-gray-500 line-through' : ''
        }`}
      >
        {todo.title}
      </span>

      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={() => onToggle(todo.id)}
          className="cursor-pointer rounded bg-[#2ecc71] px-2 py-1 text-xs text-white"
        >
          완료
        </button>
        <Link
          href={`/todos/${todo.id}`}
          className="cursor-pointer rounded bg-[#f39c12] px-2 py-1 text-xs text-white"
        >
          수정
        </Link>
        <button
          onClick={handleDelete}
          className="cursor-pointer rounded bg-[#ff4d4d] px-2 py-1 text-xs text-white"
        >
          삭제
        </button>
      </div>
    </li>
  )
}
