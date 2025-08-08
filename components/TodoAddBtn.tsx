"use client";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";

const TodoAddBtn = ({ handleToggle }: { handleToggle: () => void }) => {
  return (
    <>
      <button onClick={handleToggle}>
        <PlusCircle
          className="text-blue-500 w-6 h-6 lg:w-10 lg:h-10 
      cursor-pointer peer hover:text-blue-400 active:text-blue-600
      hover:scale-110 transition-all duration-300"
        />
      </button>

    </>
  );
};

export default TodoAddBtn;
