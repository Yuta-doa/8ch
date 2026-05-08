import { notFound } from "next/navigation";
import type { Route } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ThreadForm } from "@/components/ThreadForm";
import { ThreadList } from "@/components/ThreadList";
import { prisma } from "@/lib/prisma";

type BoardPageProps = {
  params: Promise<{
    boardSlug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function BoardPage({ params }: BoardPageProps) {
  const { boardSlug } = await params;

  const board = await prisma.board.findUnique({
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
    notFound();
  }

  return (
    <main className="page">
      <PageHeader title={board.name} description={board.description ?? undefined} backHref={"/" as Route} backLabel="← 板一覧に戻る" />
      <ThreadForm boardSlug={board.slug} />
      <ThreadList
        threads={board.threads.map((thread) => ({
          id: thread.id,
          title: thread.title,
          createdAt: thread.createdAt.toISOString(),
          updatedAt: thread.updatedAt.toISOString(),
          postCount: thread._count.posts,
        }))}
      />
    </main>
  );
}