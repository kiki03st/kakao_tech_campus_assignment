'use server'

import { revalidatePath } from 'next/cache'

const BACKEND = 'http://localhost:8000'

export async function createTodo(title: string, date: string) {
  await fetch(`${BACKEND}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, date }),
  })
  revalidatePath('/todos')
}

export async function toggleTodo(id: number) {
  await fetch(`${BACKEND}/todos/${id}`, { method: 'PUT' })
  revalidatePath('/todos')
}

export async function editTodo(id: number, title: string, date: string | null) {
  await fetch(`${BACKEND}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, date }),
  })
  revalidatePath('/todos')
}

export async function deleteTodo(id: number) {
  await fetch(`${BACKEND}/todos/${id}`, { method: 'DELETE' })
  revalidatePath('/todos')
}
