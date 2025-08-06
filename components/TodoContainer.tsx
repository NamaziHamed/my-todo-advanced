"use client";
import React, { useState } from "react";
import TodoList from "./TodoList";
import TodoAddBtn from "./TodoAddBtn";
import AddTodo from "./AddTodo";
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
    <div className="max-w-fit ">
      <div className="flex items-center justify-between mb-4">
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
