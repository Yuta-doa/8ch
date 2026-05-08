"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

type ThreadFormProps = {
  boardSlug: string;
};

export function ThreadForm({ boardSlug }: ThreadFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/boards/${boardSlug}/threads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, name, body }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "スレッド作成に失敗しました");
      }

      setTitle("");
      setName("");
      setBody("");
      router.push(`/threads/${data.thread.id}` as Route);
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "スレッド作成に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="thread-title">新規スレッド作成</h2>
      <form className="form" onSubmit={onSubmit}>
        <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="スレッドタイトル" maxLength={120} />
        <input className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="名前（#付きでトリップ）" maxLength={60} />
        <textarea className="textarea" value={body} onChange={(event) => setBody(event.target.value)} placeholder="本文" maxLength={4000} />
        {error ? <p className="error">{error}</p> : null}
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "作成中..." : "スレッドを作成"}
        </button>
      </form>
    </section>
  );
}