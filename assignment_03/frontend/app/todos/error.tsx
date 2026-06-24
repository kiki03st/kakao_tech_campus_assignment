'use client'

import { useEffect } from 'react'

export default function TodosError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#f4f4f9] pt-[50px]">
      <div className="w-[500px] max-w-full min-w-[447px] mx-auto p-5 rounded-xl bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
        <h1 className="mb-2 text-2xl text-[#333]">오류가 발생했습니다</h1>
        <p className="mb-5 text-sm text-[#666]">{error.message}</p>
        <button
          onClick={unstable_retry}
          className="cursor-pointer rounded-md bg-main px-4 py-2 font-bold text-white"
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}
