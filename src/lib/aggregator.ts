import type { FeedItem } from './types';
import { fetchLiverpoolRss } from './webNews';
import { listManualPosts } from './adminStore';

export async function getAggregatedFeed(limit = 24): Promise<FeedItem[]> {
  let items: FeedItem[] = [];
  const results = await Promise.allSettled([
    fetchLiverpoolRss(limit),
    listManualPosts(),
  ]);
  for (const r of results) if (r.status === 'fulfilled') items = items.concat(r.value);

  return items
    .sort((a, b) => {
      if (a.platform === 'manual' && b.platform !== 'manual') return -1;
      if (b.platform === 'manual' && a.platform !== 'manual') return 1;
      return +new Date(b.timestamp) - +new Date(a.timestamp);
    })
    .slice(0, limit);
}


