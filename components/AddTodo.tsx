"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addNewTodo, updateTodo } from "@/prisma/lib";
import { TodoProps } from "@/types/TodoTypes";

const AddTodo = ({
  onClose,
  initialValue,
}: {
  onClose: () => void;
  initialValue?: TodoProps;
}) => {
  const queryClient = useQueryClient();

  const [todo, setTodo] = React.useState<TodoProps>(
    initialValue || {
      title: "",
      isCompleted: false,
      startDate: undefined,
      endDate: undefined,
    }
  );
  const isEditing = !!initialValue;

  const { mutate: addMutation } = useMutation({
    mutationFn: addNewTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const { mutate: updateMutation } = useMutation({
    mutationFn: ({ id, todo }: { id: number; todo: TodoProps }) =>
      updateTodo(id, todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      onClose();
    },
  });

  const dateValidation = (
    startDate: string | undefined,
    endDate: string | undefined
  ) => {
    if (!startDate || !endDate) {
      return true;
    }
    return new Date(startDate) < new Date(endDate);
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateValidation(todo.startDate, todo.endDate)) {
      if (isEditing) {
        updateMutation({ id: initialValue!.id, todo });
      } else {
        addMutation(todo);
      }
    } else {
      alert("Start date must be before end date");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-zinc-900/60 flex items-center justify-center"
      onClick={onClose}
    >
      <form
        className="absolute w-full h-full bg-slate-800
    md:max-w-lg md:max-h-fit z-30 p-4 rounded-xl"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => handleAddTodo(e)}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="title">{isEditing ? "Edit Todo" : "Add Todo"}</h2>
          <button type="button" className="" onClick={onClose}>
            <X className="w-6 h-6 text-white cursor-pointer" />
          </button>
        </div>

        <div className="grid md:grid-cols-[1fr_4fr] gap-2">
          <label htmlFor="title">Title: </label>
          <input
            type="text"
            name="title"
            id="title"
            value={todo.title}
            className="add-todo-input"
            onChange={(e) => setTodo({ ...todo, title: e.target.value })}
            required
          />
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            name="description"
            id="description"
            className="add-todo-input"
            value={todo.description || ""}
            onChange={(e) => setTodo({ ...todo, description: e.target.value })}
          />
          <label htmlFor="begin-date">Start Date:</label>
          <DatePicker
            showTimeSelect
            dateFormat={"Pp"}
            className="bg-white text-black rounded-md py-1 px-2"
            selected={todo.startDate ? new Date(todo.startDate) : null}
            onChange={(date: any) => {
              setTodo({ ...todo, startDate: date.toISOString() });
            }}
          />
          <label htmlFor="begin-date">End Date:</label>
          <DatePicker
            showTimeSelect
            dateFormat={"Pp"}
            className="bg-white text-black rounded-md py-1 px-2"
            selected={todo.endDate ? new Date(todo.endDate) : null}
            onChange={(date: any) => {
              setTodo({ ...todo, endDate: date.toISOString() });
            }}
          />
        </div>
        <div className="flex items-center justify-center gap-7 mt-5">
          <button
            type="submit"
            className="px-2 py-1 rounded-md text-sm bg-blue-500 cursor-pointer hover:bg-blue-400 active:bg-blue-600 transition-all duration-300"
          >
            {isEditing ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 rounded-md text-sm bg-red-500  cursor-pointer hover:bg-red-400 active:bg-red-600 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTodo;
