"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addNewTodo, updateTodo } from "@/prisma/lib";
import { TodoProps } from "@/types/TodoTypes";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ZOD Schema: TodoProps
const todoSchema = z
  .object({
    id: z.number().optional(),
    title: z
      .string()
      .min(4, { message: "Title must be at least 4 characters" }),
    description: z
      .string()
      .max(255, { message: "Description must be less than 255 characters" })
      .optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    isCompleted: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.startDate) < new Date(data.endDate);
    },
    {
      message: "Start date must be before end date",
      path: ["endDate"],
    }
  );

//infer the type of the schema
export type TodoSchema = z.infer<typeof todoSchema>;

const AddTodo = ({
  onClose,
  initialValue,
}: {
  onClose: () => void;
  initialValue?: TodoProps;
}) => {
  // query client to invalidate queries when adding or updating a todo
  const queryClient = useQueryClient();

  // whether we are editing a todo or adding a new one
  const isEditing = !!initialValue;

  // mutation to add a new todo
  const { mutate: addMutation } = useMutation({
    mutationFn: addNewTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  // mutation to update a todo
  const { mutate: updateMutation } = useMutation({
    mutationFn: ({ id, todo }: { id: number; todo: TodoProps }) =>
      updateTodo(id, todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      onClose();
    },
  });

  // handles adding a new todo or updating an existing one
  const onSubmit = (data: TodoSchema) => {
    console.log(data);
    if (isEditing) {
      const id = initialValue.id;
      updateMutation({ id: id, todo: data as TodoProps });
    } else {
      addMutation(data);
    }
    onClose();
  };

  const parseDate = (dateString: string | undefined): Date | undefined => {
  if (dateString) {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  }
  return undefined;
};

  //useForm hook for form validation
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TodoSchema>({
    resolver: zodResolver(todoSchema),
    defaultValues: initialValue
      ? {
          id: initialValue.id,
          title: initialValue.title,
          description: initialValue.description || "",
          isCompleted: initialValue.isCompleted,
          // Ensure dates are parsed correctly
          startDate: parseDate(initialValue.startDate),
          endDate: parseDate(initialValue.endDate),
        }
      : {
          // Fallback for when initialValue is undefined
          id: undefined,
          title: "",
          description: "",
          isCompleted: false,
          startDate: undefined,
          endDate: undefined,
        },
  });

  return (
    <div
      className="fixed inset-0 bg-zinc-900/60 flex items-center justify-center"
      onClick={onClose}
    >
      <form
        className="absolute w-full h-full bg-slate-800
    md:max-w-lg md:max-h-fit z-30 p-4 rounded-xl"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit(onSubmit)}
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
            id="title"
            className="add-todo-input"
            {...register("title")}
          />
          {errors.title && (
            <span className="error-msg-form">{errors.title.message}</span>
          )}
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            className="add-todo-input"
            {...register("description")}
          />
          {errors.description && (
            <span className="error-msg-form">{errors.description.message}</span>
          )}
          <label htmlFor="begin-date">Start Date:</label>
          <div className="add-todo-input">
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <DatePicker
                  placeholderText="Selece Start Date"
                  showTimeSelect
                  dateFormat={"Pp"}
                  className="bg-white text-black rounded-md py-1 px-2"
                  selected={field.value || null}
                  onChange={(date: any) => {
                    field.onChange(date);
                  }}
                />
              )}
            />
          </div>
          <label htmlFor="begin-date">End Date:</label>
          <div className="add-todo-input">
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <DatePicker
                  placeholderText="Selece End Date"
                  showTimeSelect
                  dateFormat={"Pp"}
                  className="bg-white text-black rounded-md py-1 px-2"
                  selected={field.value || null}
                  onChange={(date: any) => {
                    field.onChange(date);
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-7 mt-5">
          <button
            type="submit"
            className="px-2 py-1 rounded-md text-sm bg-blue-500 cursor-pointer hover:bg-blue-400 active:bg-blue-600 transition-all duration-300"
          >
            {isEditing
              ? isSubmitting
                ? "Updating..."
                : "Update"
              : isSubmitting
              ? "Adding..."
              : "Add"}
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
