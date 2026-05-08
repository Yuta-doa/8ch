import { prisma } from "../src/lib/prisma";

async function main() {
  const boards = [
    { slug: "news", name: "ニュース速報", description: "最新ニュースを語る板" },
    { slug: "tech", name: "技術", description: "Web・アプリ・インフラの話題" },
    { slug: "games", name: "ゲーム", description: "ゲーム全般の雑談板" },
  ];

  for (const board of boards) {
    await prisma.board.upsert({
      where: { slug: board.slug },
      update: {
        name: board.name,
        description: board.description,
      },
      create: board,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });