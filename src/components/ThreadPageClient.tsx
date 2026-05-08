"use client";

import { ThreadDetail } from "@/lib/types";
import { useThreadPolling } from "@/hooks/useThreadPolling";
import { PostForm } from "./PostForm";
import { PostList } from "./PostList";

type ThreadPageClientProps = {
  initialThread: ThreadDetail;
};

export function ThreadPageClient({ initialThread }: ThreadPageClientProps) {
  const { thread, refresh } = useThreadPolling(initialThread);

  return (
    <>
      <section className="panel">
        <h2 className="thread-title">{thread.title}</h2>
        <p className="subtle">
          このスレッドは 3 秒ごとに新着レスを確認します。現在 {thread.posts.length} 件
        </p>
      </section>
      <PostForm threadId={thread.id} onCreated={refresh} />
      <PostList posts={thread.posts} />
    </>
  );
}