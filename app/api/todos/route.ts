import { prisma } from "@/prisma/Prisma";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    await prisma.todo.findMany({
      orderBy: [
        {
          isCompleted: "asc",
        },
        {
          startDate: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    })
  );
}

export async function POST(req: Request) {
  const todo = await req.json();
  const res = await prisma.todo.create({ data: todo });
  return NextResponse.json(res);
}
