'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { editTodo } from '../actions'

type Todo = {
  id: number
  title: string
  completed: boolean
  date: string | null
}

export default function EditTodoForm({ todo }: { todo: Todo }) {
  const router = useRouter()
  const [title, setTitle] = useState(todo.title)
  const [date, setDate] = useState(todo.date ?? '')
  const [titleError, setTitleError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() === '') {
      setTitleError(true)
      return
    }
    setTitleError(false)
    setSubmitting(true)
    await editTodo(todo.id, title.trim(), date || null)
    router.push('/todos')
  }

  return (
    <div className="min-h-screen bg-[#f4f4f9] pt-[50px]">
      <div className="w-[500px] max-w-full min-w-[447px] mx-auto p-5 rounded-xl bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
        <h1 className="mb-5 text-2xl text-[#333]">할 일 수정</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#555]">할 일</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="할 일을 입력하세요"
              className="rounded-md border border-gray-300 p-2.5 outline-none focus:border-main"
            />
            {titleError && (
              <p className="text-sm text-[#ff4d4d]">할 일을 입력해주세요.</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#555]">날짜</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-gray-300 p-2.5 outline-none focus:border-main"
            />
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 cursor-pointer rounded-md bg-main py-2.5 font-bold text-white disabled:opacity-50"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => router.push('/todos')}
              className="flex-1 cursor-pointer rounded-md border border-gray-300 py-2.5 font-bold text-[#666]"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
