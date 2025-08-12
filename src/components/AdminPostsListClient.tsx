"use client";
import useSWR from 'swr';

type Item = { id: string; title: string };

const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then((r) => r.json());

export function AdminPostsListClient() {
  const { data, isLoading, mutate } = useSWR('/api/admin/posts', fetcher, { refreshInterval: 10000 });
  const items: Item[] = data?.items ?? [];

  const onDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/posts/delete?id=${encodeURIComponent(id)}`, { method: 'GET' });
    } finally {
      mutate();
    }
  };

  if (isLoading) return null;
  if (!items.length) return null;

  return (
    <div className="mt-6">
      <h2 className="mb-2 text-lg font-semibold">Your posts</h2>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2">
            <div className="truncate pr-3 text-sm">{it.title}</div>
            <button onClick={() => onDelete(it.id)} className="rounded-md bg-red-600/80 px-2 py-1 text-xs">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


