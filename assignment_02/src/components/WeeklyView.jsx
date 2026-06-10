import { formatDate, addDays } from '../utils/date'

const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일']

// 주간 뷰 — 주차 이동(<, >) + 한 주(월~일)의 날짜 카드.
// 날짜 카드 클릭 시 해당 날짜 선택, 오늘/선택된 날짜는 시각적으로 구분, 각 카드에 날짜별 todo 개수 표시.
function WeeklyView({
  weekStart,
  selectedDateStr,
  onPrevWeek,
  onNextWeek,
  onSelectDay,
  countByDate,
}) {
  const todayStr = formatDate(new Date())
  // weekStart(월요일)부터 7일치 날짜 생성
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

export default WeeklyView
