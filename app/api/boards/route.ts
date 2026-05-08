import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type BoardWithThreadCount = Prisma.BoardGetPayload<{
  include: {
    _count: {
      select: {
        threads: true;
      };
    };
  };
}>;

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
    boards.map((board: BoardWithThreadCount) => ({
      id: board.id,
      slug: board.slug,
      name: board.name,
      description: board.description,
      threadCount: board._count.threads,
    })),
  );
}