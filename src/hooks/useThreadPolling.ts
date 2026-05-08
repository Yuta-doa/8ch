"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ThreadDetail } from "@/lib/types";

export function useThreadPolling(initialThread: ThreadDetail) {
  const [thread, setThread] = useState(initialThread);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refresh = useCallback(async () => {
    const response = await fetch(`/api/threads/${initialThread.id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return;
    }

    const latestThread = (await response.json()) as ThreadDetail;

    setThread((currentThread) => {
      if (latestThread.posts.length <= currentThread.posts.length) {
        return {
          ...latestThread,
          posts: currentThread.posts,
        };
      }

      return latestThread;
    });
  }, [initialThread.id]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      void refresh();
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refresh]);

  return {
    thread,
    refresh,
  };
}