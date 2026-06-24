'use client'

import { useState } from 'react'

type Props = {
  onAdd: (task: string) => void
}

export default function TodoForm({ onAdd }: Props) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const task = input.trim()
    if (task === '') {
      setError(true)
      return
    }
    setError(false)
    onAdd(task)
    setInput('')
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-2.5 flex gap-2.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일을 입력하세요"
          className="grow rounded-md border border-gray-300 p-2.5 outline-none focus:border-main"
        />
        <button
          type="submit"
          className="flex cursor-pointer items-center justify-center rounded-md bg-main px-4 py-2.5 font-bold text-white"
        >
          추가
        </button>
      </form>
      {error && (
        <p className="mb-5 text-sm text-[#ff4d4d]">할 일을 입력해주세요.</p>
      )}
    </>
  )
}
