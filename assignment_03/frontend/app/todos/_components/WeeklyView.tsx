'use client'

import { formatDate, addDays } from '../_lib/date'

const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일']

type Props = {
  weekStart: Date
  selectedDateStr: string
  onPrevWeek: () => void
  onNextWeek: () => void
  onSelectDay: (date: Date) => void
  countByDate: (dateStr: string) => number
}

export default function WeeklyView({
  weekStart,
  selectedDateStr,
  onPrevWeek,
  onNextWeek,
  onSelectDay,
  countByDate,
}: Props) {
  const todayStr = formatDate(new Date())
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="mb-5 flex items-center justify-between rounded-lg bg-[#f9f9f9] p-2.5">
      <button
        onClick={onPrevWeek}
        className="cursor-pointer rounded border border-gray-200 px-2.5 py-[5px] text-xl text-main hover:bg-gray-100"
      >
        &lt;
      </button>

      <div className="flex gap-1.5">
        {days.map((date, i) => {
          const dateStr = formatDate(date)
          const isSelected = dateStr === selectedDateStr
          const isToday = dateStr === todayStr
          return (
            <button
              key={dateStr}
              onClick={() => onSelectDay(date)}
              className={`flex w-10 cursor-pointer flex-col items-center rounded-md p-[5px] text-xs ${
                isSelected ? 'bg-main text-white' : 'hover:bg-[#eee]'
              } ${isToday ? 'border-2 border-main font-bold' : ''}`}
            >
              <span className="mb-0.5">{DAY_NAMES[i]}</span>
              <span>{date.getDate()}</span>
              <span className="text-[10px]">{countByDate(dateStr)}</span>
            </button>
          )
        })}
      </div>

      <button
        onClick={onNextWeek}
        className="cursor-pointer rounded border border-gray-200 px-2.5 py-[5px] text-xl text-main hover:bg-gray-100"
      >
        &gt;
      </button>
    </div>
  )
}
