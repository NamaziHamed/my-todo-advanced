import { prisma } from "@/prisma/Prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const todoData = await request.json(); // Get the data to update from the request body

    const res = await prisma.todo.update({
      where: { id },
      data: { ...todoData }, // Use the data from the request body
    });

    return NextResponse.json(res);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}