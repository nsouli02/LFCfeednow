import { notFound } from 'next/navigation';
import Link from 'next/link';
import { listManualPosts } from '@/lib/adminStore';

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const items = await listManualPosts();
  const post = items.find((p) => String(p.id) === String(id));
  if (!post) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4">
        <Link href="/" className="rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">← Back to home</Link>
      </div>
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      
      {post.mediaUrl && (
        <div className="mb-6 flex justify-center overflow-hidden rounded-lg bg-white/5">
          {post.mediaType === 'video' ? (
            <video 
              src={post.mediaUrl} 
              controls 
              className="w-full object-contain"
              style={{ maxHeight: '600px', maxWidth: '100%' }}
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={post.mediaUrl} 
              alt={post.title} 
              className="w-full object-contain"
              style={{ maxHeight: '600px', maxWidth: '100%' }}
            />
          )}
        </div>
      )}
      
      <article className="prose prose-invert max-w-none whitespace-pre-line">
        {post.fullText}
      </article>
    </main>
  );
}


