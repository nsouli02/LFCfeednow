import { notFound } from 'next/navigation';
import { listManualPosts } from '@/lib/adminStore';
import { AdminEditForm } from '@/components/AdminEditForm';

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
      <AdminEditForm post={post} />
    </main>
  );
}


