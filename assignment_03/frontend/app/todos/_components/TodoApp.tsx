'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDate, addDays, parseDate, getWeekStart } from '../_lib/date'
import WeeklyView from './WeeklyView'
import Filters from './Filters'
import TodoList from './TodoList'
import type { Todo } from './TodoItem'

const LAST_DATE_KEY = 'lastDate'
const API = 'http://localhost:8000'

function loadInitialDate(): Date {
  try {
    const saved = localStorage.getItem(LAST_DATE_KEY)
    if (!saved) return new Date()
    const parsed = parseDate(saved)
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed
  } catch {
    return new Date()
  }
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date())
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()))

  useEffect(() => {
    const initial = loadInitialDate()
    setSelectedDate(initial)
    setWeekStart(getWeekStart(initial))
  }, [])

  const selectedDateStr = formatDate(selectedDate)

  useEffect(() => {
    localStorage.setItem(LAST_DATE_KEY, selectedDateStr)
  }, [selectedDateStr])

  const fetchTodos = useCallback(async () => {
    const res = await fetch(`${API}/todos`)
    if (res.ok) setTodos(await res.json())
  }, [])

  useEffect(() => { fetchTodos() }, [fetchTodos])

  const editTodo = async (id: number, title: string) => {
    await fetch(`${API}/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    fetchTodos()
  }

  const toggleTodo = async (id: number) => {
    await fetch(`${API}/todos/${id}`, { method: 'PUT' })
    fetchTodos()
  }

  const deleteTodo = async (id: number) => {
    await fetch(`${API}/todos/${id}`, { method: 'DELETE' })
    fetchTodos()
  }

  const dateTodos = todos.filter((todo) => todo.date === selectedDateStr)
  const visibleTodos = dateTodos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const counts = {
    all: dateTodos.length,
    active: dateTodos.filter((t) => !t.completed).length,
    completed: dateTodos.filter((t) => t.completed).length,
  }

  const countByDate = (dateStr: string) =>
    todos.filter((todo) => todo.date === dateStr).length

  return (
    <div className="min-h-screen bg-[#f4f4f9] pt-[50px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]">
      <div className="w-[500px] max-w-full min-w-[447px] mx-auto p-5 rounded-xl bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
        <WeeklyView
          weekStart={weekStart}
          selectedDateStr={selectedDateStr}
          onPrevWeek={() => setWeekStart((w) => addDays(w, -7))}
          onNextWeek={() => setWeekStart((w) => addDays(w, 7))}
          onSelectDay={setSelectedDate}
          countByDate={countByDate}
        />
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl text-[#333]">오늘의 할 일</h1>
          <Link
            href="/todos/new"
            className="cursor-pointer rounded-md bg-main px-4 py-2 text-sm font-bold text-white"
          >
            + 추가
          </Link>
        </div>
        <Filters filter={filter} onChange={setFilter} counts={counts} />
        <TodoList
          todos={visibleTodos}
          onToggle={toggleTodo}
          onEdit={editTodo}
          onDelete={deleteTodo}
        />
      </div>
    </div>
  )
}
