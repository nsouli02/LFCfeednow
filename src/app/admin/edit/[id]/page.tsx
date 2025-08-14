import { notFound } from 'next/navigation';
import { listManualPosts } from '@/lib/adminStore';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  // Force fresh fetch so the editor shows latest content after a save
  const items = await listManualPosts();
  const post = items.find((p) => String(p.id) === String(id));
  if (!post) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Edit post</h1>
      <form action="/api/admin/posts" method="post" className="space-y-3">
        <input type="hidden" name="id" value={post.id} />
        <input name="title" defaultValue={post.title} className="w-full rounded-md bg-white/10 px-3 py-2 outline-none" />
        <textarea name="description" defaultValue={post.description} rows={3} className="w-full rounded-md bg-white/10 px-3 py-2 outline-none" />
        <textarea name="fullText" defaultValue={post.fullText} rows={8} className="w-full rounded-md bg-white/10 px-3 py-2 outline-none" />
        <button className="rounded-md bg-emerald-600 px-4 py-2 font-medium">Save</button>
      </form>
    </main>
  );
}


