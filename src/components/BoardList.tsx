import Link from "next/link";
import type { Route } from "next";
import { BoardSummary } from "@/lib/types";

type BoardListProps = {
  boards: BoardSummary[];
};

export function BoardList({ boards }: BoardListProps) {
  return (
    <div className="list">
      {boards.map((board) => (
        <section key={board.id} className="panel">
          <h2 className="thread-title">
            <Link href={`/boards/${board.slug}` as Route}>{board.name}</Link>
          </h2>
          {board.description ? <p>{board.description}</p> : null}
          <p className="subtle">スレッド数: {board.threadCount}</p>
        </section>
      ))}
    </div>
  );
}