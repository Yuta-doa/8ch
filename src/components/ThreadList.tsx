import Link from "next/link";
import type { Route } from "next";
import { ThreadSummary } from "@/lib/types";

type ThreadListProps = {
  threads: ThreadSummary[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("ja-JP");
}

export function ThreadList({ threads }: ThreadListProps) {
  if (threads.length === 0) {
    return <section className="panel">まだスレッドはありません。</section>;
  }

  return (
    <div className="list">
      {threads.map((thread) => (
        <section key={thread.id} className="panel">
          <h2 className="thread-title">
            <Link href={`/threads/${thread.id}` as Route}>{thread.title}</Link>
          </h2>
          <div className="thread-meta">
            <span>レス数: {thread.postCount}</span>
            <span>作成: {formatDate(thread.createdAt)}</span>
            <span>最終更新: {formatDate(thread.updatedAt)}</span>
          </div>
        </section>
      ))}
    </div>
  );
}