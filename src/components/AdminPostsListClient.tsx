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

  const onEdit = async (item: Item) => {
    const newTitle = prompt('Edit title', item.title) || item.title;
    const newDescription = prompt('Edit description (optional)', '') || '';
    const newFullText = prompt('Edit full text (optional)', '') || '';
    const form = new FormData();
    form.set('id', item.id);
    form.set('title', newTitle);
    form.set('description', newDescription);
    form.set('fullText', newFullText);
    await fetch('/api/admin/posts', { method: 'POST', body: form });
    mutate();
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
            <div className="flex gap-2">
              <button onClick={() => onEdit(it)} className="rounded-md bg-blue-600/80 px-2 py-1 text-xs">Edit</button>
              <button onClick={() => onDelete(it.id)} className="rounded-md bg-red-600/80 px-2 py-1 text-xs">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


