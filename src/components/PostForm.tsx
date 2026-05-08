"use client";

import { FormEvent, useState } from "react";

type PostFormProps = {
  threadId: number;
  onCreated: () => Promise<void> | void;
};

export function PostForm({ threadId, onCreated }: PostFormProps) {
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/threads/${threadId}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, body }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "レス投稿に失敗しました");
      }

      setName("");
      setBody("");
      setSuccess("投稿しました");
      await onCreated();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "レス投稿に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <h2 className="thread-title">レスを投稿</h2>
      <form className="form" onSubmit={onSubmit}>
        <input className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="名前（空欄なら名無しさん / #付きでトリップ）" maxLength={60} />
        <textarea className="textarea" value={body} onChange={(event) => setBody(event.target.value)} placeholder="本文" maxLength={4000} />
        {error ? <p className="error">{error}</p> : null}
        {success ? <p className="success">{success}</p> : null}
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "投稿中..." : "書き込む"}
        </button>
      </form>
    </section>
  );
}