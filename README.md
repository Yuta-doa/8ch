# 8ch

Next.js App Router と Neon PostgreSQL、Prisma ORM で構築した 2ch 風匿名掲示板です。

## 技術スタック

- Next.js
- React
- Prisma ORM
- Neon PostgreSQL
- Vercel

## セットアップ

1. 依存関係をインストールします。

   ```bash
   npm install
   ```

2. `.env.example` をコピーして `.env` を作成します。

   ```bash
   cp .env.example .env
   ```

3. Prisma Client を生成します。

   ```bash
   npm run prisma:generate
   ```

4. マイグレーションを適用します。

   ```bash
   npx prisma migrate deploy
   ```

5. 初期板データを投入します。

   ```bash
   npm run prisma:seed
   ```

6. 開発サーバーを起動します。

   ```bash
   npm run dev
   ```

## 画面導線

- `/` : 板一覧
- `/boards/[boardSlug]` : スレッド一覧 / スレ作成
- `/threads/[threadId]` : スレ表示 / レス投稿 / 3秒ポーリング

## 機能

- 複数板対応
- スレッド作成と一覧表示
- 匿名レス投稿（空欄時は `名無しさん`）
- トリップ機能（`名前#secret`）
- `>>1` 形式アンカー
- 3秒ポーリングによる新着レス取得

## Vercel デプロイ

Vercel の Project Settings で以下の環境変数を設定してください。

- `DATABASE_URL`

その後、通常の Next.js アプリとしてデプロイできます。

## 補足

- DB スキーマは `prisma/schema.prisma`
- 初期マイグレーションは `prisma/migrations/0001_init/migration.sql`
- 初期板 seed は `prisma/seed.ts`