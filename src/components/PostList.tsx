import { formatName } from "@/lib/trip";
import { PostItem } from "@/lib/types";
import { AnchorText } from "./AnchorText";

type PostListProps = {
  posts: PostItem[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("ja-JP");
}

export function PostList({ posts }: PostListProps) {
  return (
    <section className="panel">
      <h2 className="thread-title">レス一覧</h2>
      {posts.map((post) => (
        <article key={post.id} className="post" id={`post-${post.postNumber}`}>
          <div className="post-meta">
            <span>{post.postNumber}</span>
            <span>{formatName(post.name, post.trip)}</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="post-body">
            <AnchorText text={post.body} />
          </div>
        </article>
      ))}
    </section>
  );
}