import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function isAuthed(): boolean {
  const c = cookies();
  const token = (c.get('session')?.value || '').trim();
  const secret = (process.env.ADMIN_SESSION_SECRET || '').trim();
  return Boolean(token && secret && token === secret);
}

export default function AdminPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const authed = isAuthed();
  const loginError = searchParams?.error === '1';

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Admin</h1>
      {!authed ? (
        <div className="glass rounded-xl p-6">
          <p className="mb-4">Enter access code to manage posts.</p>
          {loginError && (
            <div className="mb-3 rounded-md bg-red-500/20 px-3 py-2 text-sm text-red-200">Invalid code</div>
          )}
          <form action="/api/admin/login" method="post" encType="multipart/form-data" className="flex gap-2">
            <input name="code" type="password" placeholder="Access code" className="w-full rounded-md bg-white/10 px-3 py-2 outline-none" />
            <button className="rounded-md bg-brand-600 px-4 py-2 font-medium">Login</button>
          </form>
        </div>
      ) : (
        <div className="glass rounded-xl p-6">
          <form action="/api/admin/posts" method="post" className="space-y-3">
            <input name="title" placeholder="Title" className="w-full rounded-md bg-white/10 px-3 py-2 outline-none" />
            <textarea name="description" placeholder="Short description" className="w-full rounded-md bg-white/10 px-3 py-2 outline-none" rows={4} />
            <textarea name="fullText" placeholder="Full text (optional)" className="w-full rounded-md bg-white/10 px-3 py-2 outline-none" rows={6} />
            <input name="permalinkUrl" placeholder="Source link (optional)" className="w-full rounded-md bg-white/10 px-3 py-2 outline-none" />
            <button className="rounded-md bg-emerald-600 px-4 py-2 font-medium">Publish</button>
          </form>
          <ManualPostsList />
          <div className="mt-4 flex items-center justify-between text-sm text-white/70">
            <form action="/api/admin/logout" method="post">
              <button className="rounded-md bg-red-600/80 px-3 py-1.5 font-medium text-white">Logout</button>
            </form>
            <div>Back to <Link href="/" className="underline">home</Link></div>
          </div>
        </div>
      )}
    </main>
  );
}

async function ManualPostsList() {
  let items: any[] = [];
  try {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/posts`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Posts fetch failed: ${res.status}`);
    const data = await res.json();
    items = data.items || [];
  } catch {
    items = [];
  }
  if (!items.length) return null;
  return (
    <div className="mt-6">
      <h2 className="mb-2 text-lg font-semibold">Your posts</h2>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2">
            <div className="truncate pr-3 text-sm">{it.title}</div>
            <form action="/api/admin/posts/delete" method="post">
              <input type="hidden" name="id" value={it.id} />
              <button className="rounded-md bg-red-600/80 px-2 py-1 text-xs">Delete</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}


