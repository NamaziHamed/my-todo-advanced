"use client";
import React, { useState } from "react";
import TodoList from "./TodoList";
import TodoAddBtn from "./TodoAddBtn";
import AddTodo, { TodoSchema } from "./AddTodo";
import { TodoProps } from "@/types/TodoTypes";

const TodoContainer = () => {
  const [toggleDialog, setToggleDialog] = useState(false);
  const [initialValue, setInitialValue] = useState<TodoProps>();

  const handleToggle = () => {
    if (toggleDialog) {
      setInitialValue(undefined);
    }
    setToggleDialog(!toggleDialog);
  };

  return (
    <div className="flex-1 max-w-fit">
      <div className="flex items-center justify-between mb-4 p-3">
        <h2 className="title">Todos:</h2>
        <TodoAddBtn handleToggle={handleToggle} />
      </div>
      <TodoList setInitialValue={setInitialValue} handleToggle={handleToggle} />
      {toggleDialog && (
        <AddTodo onClose={handleToggle} initialValue={initialValue} />
      )}
    </div>
  );
};

export default TodoContainer;
