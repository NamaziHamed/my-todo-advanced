export async function getTodos() {
  const res = await fetch("/api/todos");
  return res.json();
}

export async function toggleCompleted(id: number, isCompleted: boolean) {
  const res = await fetch(`/api/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isCompleted }),
  });
}

export async function deleteTodo(id: number) {
  const res = await fetch(`/api/todos/${id}`, {
    method: "DELETE",
  });
}

export async function addNewTodo(todo: any) {
  const res = await fetch("/api/todos", {
    method: "POST",
    body: JSON.stringify(todo),
    headers: { "Content-Type": "application/json" },
  });
}

export async function updateTodo(id: number, todo: any) {
  const res = await fetch(`/api/todos/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(todo),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}
