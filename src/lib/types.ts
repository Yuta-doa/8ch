export type BoardSummary = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  threadCount: number;
};

export type ThreadSummary = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  postCount: number;
};

export type PostItem = {
  id: number;
  postNumber: number;
  name: string;
  trip: string | null;
  body: string;
  createdAt: string;
};

export type ThreadDetail = {
  id: number;
  title: string;
  board: {
    slug: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  posts: PostItem[];
};