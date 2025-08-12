export type Platform = 'web' | 'manual';

export type FeedItem = {
  id: string;
  platform: Platform;
  title: string;
  description: string;
  fullText: string;
  mediaUrl?: string | null;
  permalinkUrl: string;
  timestamp: string; // ISO
  sourceLabel: string;
};


