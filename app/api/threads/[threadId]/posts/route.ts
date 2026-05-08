import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseName } from "@/lib/trip";
import { requireString, validateLength } from "@/lib/validation";

type RouteProps = {
  params: Promise<{
    threadId: string;
  }>;
};

export async function POST(request: NextRequest, { params }: RouteProps) {
  try {
    const { threadId } = await params;
    const id = Number(threadId);

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid thread id" }, { status: 400 });
    }

    const payload = await request.json();
    const rawBody = validateLength(requireString(payload.body, "body"), "body", 4000);
    const parsedName = parseName(typeof payload.name === "string" ? payload.name : "");

    const thread = await prisma.thread.findUnique({
      where: {
        id,
      },
      include: {
        posts: {
          select: {
            postNumber: true,
          },
          orderBy: {
            postNumber: "desc",
          },
          take: 1,
        },
      },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const nextPostNumber = (thread.posts[0]?.postNumber ?? 0) + 1;

    const post = await prisma.post.create({
      data: {
        threadId: thread.id,
        postNumber: nextPostNumber,
        name: parsedName.displayName,
        trip: parsedName.trip,
        body: rawBody,
      },
    });

    await prisma.thread.update({
      where: {
        id: thread.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      id: post.id,
      postNumber: post.postNumber,
      name: post.name,
      trip: post.trip,
      body: post.body,
      createdAt: post.createdAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create post" },
      { status: 400 },
    );
  }
}