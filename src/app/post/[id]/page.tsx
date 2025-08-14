import { notFound } from 'next/navigation';
import { listManualPosts } from '@/lib/adminStore';

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const items = await listManualPosts();
  const post = items.find((p) => String(p.id) === String(id));
  if (!post) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      <article className="prose prose-invert max-w-none whitespace-pre-line">
        {post.fullText}
      </article>
    </main>
  );
}


