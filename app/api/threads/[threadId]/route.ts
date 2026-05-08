import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type ThreadWithBoardAndPosts = Prisma.ThreadGetPayload<{
  include: {
    board: true;
    posts: true;
  };
}>;

type ThreadPost = ThreadWithBoardAndPosts["posts"][number];

type RouteProps = {
  params: Promise<{
    threadId: string;
  }>;
};

export async function GET(_: NextRequest, { params }: RouteProps) {
  const { threadId } = await params;
  const id = Number(threadId);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid thread id" }, { status: 400 });
  }

  const thread: ThreadWithBoardAndPosts | null = await prisma.thread.findUnique({
    where: {
      id,
    },
    include: {
      board: true,
      posts: {
        orderBy: {
          postNumber: "asc",
        },
      },
    },
  });

  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: thread.id,
    title: thread.title,
    board: {
      slug: thread.board.slug,
      name: thread.board.name,
    },
    createdAt: thread.createdAt.toISOString(),
    updatedAt: thread.updatedAt.toISOString(),
    posts: thread.posts.map((post: ThreadPost) => ({
      id: post.id,
      postNumber: post.postNumber,
      name: post.name,
      trip: post.trip,
      body: post.body,
      createdAt: post.createdAt.toISOString(),
    })),
  });
}