import EditTodoForm from '../_components/EditTodoForm'

type Todo = {
  id: number
  title: string
  completed: boolean
  date: string | null
}

async function getTodo(id: string): Promise<Todo> {
  const res = await fetch(`${process.env.BACKEND_URL}/todos/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('할 일을 불러오지 못했습니다.')
  return res.json()
}

export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ todoId: string }>
}) {
  const { todoId } = await params
  const todo = await getTodo(todoId)
  return <EditTodoForm todo={todo} />
}
