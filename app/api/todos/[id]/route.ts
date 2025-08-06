import { prisma } from "@/prisma/Prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const { isCompleted } = await req.json();
  const res = await prisma.todo.update({
    where: { id },
    data: { isCompleted },
  });
  return NextResponse.json(res);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  const res = await prisma.todo.delete({ where: { id } });
  return NextResponse.json(res);
}
