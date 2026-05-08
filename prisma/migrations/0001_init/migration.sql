CREATE TABLE "Board" (
  "id" SERIAL NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Thread" (
  "id" SERIAL NOT NULL,
  "boardId" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Post" (
  "id" SERIAL NOT NULL,
  "threadId" INTEGER NOT NULL,
  "postNumber" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "trip" TEXT,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Board_slug_key" ON "Board"("slug");
CREATE INDEX "Thread_boardId_updatedAt_idx" ON "Thread"("boardId", "updatedAt" DESC);
CREATE UNIQUE INDEX "Post_threadId_postNumber_key" ON "Post"("threadId", "postNumber");
CREATE INDEX "Post_threadId_createdAt_idx" ON "Post"("threadId", "createdAt" ASC);

ALTER TABLE "Thread"
ADD CONSTRAINT "Thread_boardId_fkey"
FOREIGN KEY ("boardId") REFERENCES "Board"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Post"
ADD CONSTRAINT "Post_threadId_fkey"
FOREIGN KEY ("threadId") REFERENCES "Thread"("id")
ON DELETE CASCADE ON UPDATE CASCADE;