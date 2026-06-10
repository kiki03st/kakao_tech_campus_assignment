import { useEffect, useState } from 'react'
import { useTodos } from './hooks/useTodos'
import { formatDate, addDays, parseDate, getWeekStart } from './utils/date'
import WeeklyView from './components/WeeklyView'
import TodoForm from './components/TodoForm'
import Filters from './components/Filters'
import TodoList from './components/TodoList'

const LAST_DATE_KEY = 'lastDate'

// 마지막으로 본 날짜를 localStorage에서 로드한다. 없거나 잘못된 값이면 오늘 날짜.
function loadInitialDate() {
  try {
    const saved = localStorage.getItem(LAST_DATE_KEY)
    if (!saved) return new Date()
    const parsed = parseDate(saved)
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed
  } catch {
    return new Date()
  }
}

function App() {
  const { todos, addTodo, editTodo, toggleTodo, deleteTodo } = useTodos()

  // 현재 필터 상태 ('all' | 'active' | 'completed')
  const [filter, setFilter] = useState('all')
  // 선택된 날짜 (마지막으로 본 날짜를 localStorage에서 복원)
  const [selectedDate, setSelectedDate] = useState(loadInitialDate)
  // 주간 뷰에 표시 중인 주차의 시작일(월요일). 선택 날짜가 속한 주로 초기화
  const [weekStart, setWeekStart] = useState(() => getWeekStart(selectedDate))

  const selectedDateStr = formatDate(selectedDate)

  // 날짜가 바뀔 때마다 마지막으로 본 날짜를 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(LAST_DATE_KEY, selectedDateStr)
  }, [selectedDateStr])

  // 선택된 날짜에 해당하는 할 일만 추림
  const dateTodos = todos.filter((todo) => todo.date === selectedDateStr)

  // 날짜로 걸러진 목록에 상태 필터를 추가 적용 (렌더링 시점 파생 상태)
  const visibleTodos = dateTodos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  // 선택된 날짜 기준, 각 필터 상태에 해당하는 할 일 개수
  const counts = {
    all: dateTodos.length,
    active: dateTodos.filter((todo) => !todo.completed).length,
    completed: dateTodos.filter((todo) => todo.completed).length,
  }

  // 특정 날짜('YYYY-MM-DD')의 전체 todo 개수 (주간 뷰 날짜 카드 배지용)
  const countByDate = (dateStr) =>
    todos.filter((todo) => todo.date === dateStr).length

  return (
    // **직접 수정** max-w-full 태그를 넣어 요소의 최대 너비가 부모 요소의 너비만큼만 될 수 있도록 함(모바일에서 화면 밖으로 나가지 않게 함)
    // **직접 수정** w-[500px] 태그를 넣어 기본 요소 너비를 500px로 고정함
    // **직접 수정** min-w-[447px] 태그를 넣어 최소 너비 설정
    <div className="w-[500px] max-w-full min-w-[447px] mx-auto p-5 rounded-xl bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
      <WeeklyView
        weekStart={weekStart}
        selectedDateStr={selectedDateStr}
        onPrevWeek={() => setWeekStart((w) => addDays(w, -7))}
        onNextWeek={() => setWeekStart((w) => addDays(w, 7))}
        onSelectDay={setSelectedDate}
        countByDate={countByDate}
      />
      <h1 className="mb-5 text-2xl text-[#333]">오늘의 할 일</h1>
      <TodoForm onAdd={(task) => addTodo(task, selectedDateStr)} />
      <Filters filter={filter} onChange={setFilter} counts={counts} />
      <TodoList
        todos={visibleTodos}
        onToggle={toggleTodo}
        onEdit={editTodo}
        onDelete={deleteTodo}
      />
    </div>
  )
}

export default App
