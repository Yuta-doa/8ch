import { BoardList } from "@/components/BoardList";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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

  return (
    <main className="page">
      <PageHeader title="8ch" description="2ch風匿名掲示板。板を選んでスレッドを閲覧・作成できます。" />
      <BoardList
        boards={boards.map((board) => ({
          id: board.id,
          slug: board.slug,
          name: board.name,
          description: board.description,
          threadCount: board._count.threads,
        }))}
      />
    </main>
  );
}