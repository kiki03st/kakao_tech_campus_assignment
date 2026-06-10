import TodoItem from './TodoItem'

// 할 일 목록 렌더링
function TodoList({ todos, onToggle, onEdit, onDelete }) {
  return (
    <ul className="list-none p-0">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default TodoList
