export default function TodosLoading() {
  return (
    <div className="min-h-screen bg-[#f4f4f9] pt-[50px]">
      <div className="w-[500px] max-w-full min-w-[447px] mx-auto p-5 rounded-xl bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
        <div className="mb-5 flex items-center justify-between rounded-lg bg-[#f9f9f9] p-2.5">
          <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
          <div className="flex gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-12 w-10 animate-pulse rounded-md bg-gray-200" />
            ))}
          </div>
          <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mb-5 flex items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-9 w-16 animate-pulse rounded-md bg-gray-200" />
        </div>
        <div className="mb-5 flex gap-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-9 w-20 animate-pulse rounded-md bg-gray-200" />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between border-b border-gray-200 p-2.5">
            <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
            <div className="flex gap-1.5">
              <div className="h-6 w-10 animate-pulse rounded bg-gray-200" />
              <div className="h-6 w-10 animate-pulse rounded bg-gray-200" />
              <div className="h-6 w-10 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
