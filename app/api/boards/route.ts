import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type BoardSummary = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  _count: {
    threads: number;
  };
};

export async function GET() {
  const boards = await prisma.board.findMany({
    orderBy: {
      id: "asc",
    },
    include: {
      _count: {
        select: {
          threads: true,
        },
      },
    },
  });

  return NextResponse.json(
    boards.map((board: BoardSummary) => ({
      id: board.id,
      slug: board.slug,
      name: board.name,
      description: board.description,
      threadCount: board._count.threads,
    })),
  );
}