// 상태별 필터 바 — 각 버튼에 해당 상태의 할 일 개수를 함께 표시한다.
function Filters({ filter, onChange, counts }) {
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

export default Filters
