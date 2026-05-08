import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseName } from "@/lib/trip";
import { requireString, validateLength } from "@/lib/validation";

type BoardWithThreads = Prisma.BoardGetPayload<{
  include: {
    threads: {
      include: {
        _count: {
          select: {
            posts: true;
          };
        };
      };
    };
  };
}>;

type ThreadWithPostCount = BoardWithThreads["threads"][number];

type RouteProps = {
  params: Promise<{
    boardSlug: string;
  }>;
};

export async function GET(_: NextRequest, { params }: RouteProps) {
  const { boardSlug } = await params;

  const board: BoardWithThreads | null = await prisma.board.findUnique({
    where: {
      slug: boardSlug,
    },
    include: {
      threads: {
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      },
    },
  });

  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: board.id,
    slug: board.slug,
    name: board.name,
    description: board.description,
    threads: board.threads.map((thread: ThreadWithPostCount) => ({
      id: thread.id,
      title: thread.title,
      createdAt: thread.createdAt.toISOString(),
      updatedAt: thread.updatedAt.toISOString(),
      postCount: thread._count.posts,
    })),
  });
}

export async function POST(request: NextRequest, { params }: RouteProps) {
  try {
    const { boardSlug } = await params;
    const body = await request.json();
    const title = validateLength(requireString(body.title, "title"), "title", 120);
    const rawBody = validateLength(requireString(body.body, "body"), "body", 4000);
    const parsedName = parseName(typeof body.name === "string" ? body.name : "");

    const board = await prisma.board.findUnique({
      where: {
        slug: boardSlug,
      },
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const thread = await prisma.thread.create({
      data: {
        boardId: board.id,
        title,
        posts: {
          create: {
            postNumber: 1,
            name: parsedName.displayName,
            trip: parsedName.trip,
            body: rawBody,
          },
        },
      },
      include: {
        posts: true,
      },
    });

    return NextResponse.json({
      thread: {
        id: thread.id,
        title: thread.title,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create thread" },
      { status: 400 },
    );
  }
}