import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { ThreadPageClient } from "@/components/ThreadPageClient";
import { prisma } from "@/lib/prisma";

type ThreadPageProps = {
  params: Promise<{
    threadId: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { threadId } = await params;
  const id = Number(threadId);

  if (Number.isNaN(id)) {
    notFound();
  }

  const thread = await prisma.thread.findUnique({
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
    notFound();
  }

  type PostItem = (typeof thread.posts)[number];

  return (
    <main className="page">
      <PageHeader
        title={thread.title}
        description={`板: ${thread.board.name}`}
        backHref={`/boards/${thread.board.slug}` as Route}
        backLabel="← スレ一覧に戻る"
      />
      <p>
        <Link href="/">板一覧へ</Link>
      </p>
      <ThreadPageClient
        initialThread={{
          id: thread.id,
          title: thread.title,
          board: {
            slug: thread.board.slug,
            name: thread.board.name,
          },
          createdAt: thread.createdAt.toISOString(),
          updatedAt: thread.updatedAt.toISOString(),
          posts: thread.posts.map((post: PostItem) => ({
            id: post.id,
            postNumber: post.postNumber,
            name: post.name,
            trip: post.trip,
            body: post.body,
            createdAt: post.createdAt.toISOString(),
          })),
        }}
      />
    </main>
  );
}