'use client'

type Counts = { all: number; active: number; completed: number }

type Props = {
  filter: string
  onChange: (f: string) => void
  counts: Counts
}

export default function Filters({ filter, onChange, counts }: Props) {
  const items = [
    { key: 'all', label: '전체', count: counts.all },
    { key: 'active', label: '진행 중', count: counts.active },
    { key: 'completed', label: '완료', count: counts.completed },
  ]

  return (
    <div className="mb-5 flex gap-2.5">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={`flex cursor-pointer items-center gap-1 rounded-md border px-3 py-1.5 ${
            filter === item.key
              ? 'border-main bg-main font-bold text-white'
              : 'border-gray-300 bg-white font-normal text-[#666]'
          }`}
        >
          {item.label}
          <span className="flex h-5 min-w-5 items-center justify-center p-0.5">
            {item.count}
          </span>
        </button>
      ))}
    </div>
  )
}
