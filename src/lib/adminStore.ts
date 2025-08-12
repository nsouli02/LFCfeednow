import type { FeedItem } from './types';

const store: FeedItem[] = [];

export function addManualPost(item: FeedItem): void {
  store.unshift(item);
}

export function removeManualPost(id: string): boolean {
  const idx = store.findIndex((p) => p.id === id);
  if (idx >= 0) {
    store.splice(idx, 1);
    return true;
  }
  return false;
}

export function listManualPosts(): FeedItem[] {
  return store;
}


