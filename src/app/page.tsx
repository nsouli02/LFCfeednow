"use client";
import useSWR from 'swr';
import { FeedCard } from '@/components/FeedCard';

const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then((r) => r.json());

export default function Page() {
  const { data, isLoading } = useSWR('/api/feeds', fetcher, {
    refreshInterval: 60000, // Update every 1 minute
    revalidateOnFocus: true,
    dedupingInterval: 0,
  });
  const items = data?.items ?? [];

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images.jfif" alt="LFC" width={40} height={40} className="rounded-lg shadow-glow object-cover" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">Latest Liverpool FC News in Real Time</h1>
              <p className="muted text-sm">Live updates & transfer news</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-white/70">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            {isLoading ? 'Loading…' : 'Live feed'}
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item: any) => (
            <FeedCard key={item.id} item={item} />
          ))}
        </section>
      </div>
    </main>
  );
}


