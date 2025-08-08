"use client";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTodo, getTodos, toggleCompleted } from "@/prisma/lib";
import { Trash2, Pencil, Square, SquareCheckBig } from "lucide-react";


// Component: TodoList
const TodoList = ({ handleToggle, setInitialValue }: any) => {
  // QueryClient: For invalidating queries
  const queryClient = useQueryClient();

  // Mutation: Toggle todo completion status
  const { mutate: toggleMutate, isPending } = useMutation({
    mutationFn: ({ id, current }: { id: number; current: boolean }) =>
      toggleCompleted(id, !current),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Mutation: Delete todo
  const { mutate: deleteMutate } = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteTodo(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  // Query: Fetch todos
  const {
    data: todos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  // Render: Loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render: Error state
  if (error) {
    return <div className="text-red-500">Error loading Todos</div>;
  }

  // Render: Todos list
  return (
    <ul className="flex flex-col justify-between gap-2">
      {todos.map((todo: any) => (
        <li
          draggable="true"
          key={todo.id}
          className="flex items-center gap-2 justify-between border-b border-slate-500"
        >
          <div className="flex items-center gap-2">
            <span
              onClick={() =>
                !isPending &&
                toggleMutate({ id: todo.id, current: todo.isCompleted })
              }
            >
              {todo.isCompleted ? <SquareCheckBig /> : <Square />}
            </span>
            <span
              className={`${
                todo.isCompleted ? "line-through text-slate-400" : ""
              }`}
            >
              {todo.title}
            </span>
            {todo.description && (
              <span className="text-xs text-slate-200">
                - {todo.description}
              </span>
            )}
          </div>
          <div className="flex gap-1 items-center">
            <button
              className="cursor-pointer "
              onClick={() => {
                setInitialValue(todo);
                handleToggle();
              }}
            >
              <Pencil className="text-yellow-300" />
            </button>
            <button
              className="cursor-pointer "
              onClick={() => deleteMutate({ id: todo.id })}
            >
              <Trash2 className="text-red-500 " />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
