import type { FeedItem } from '@/lib/types';
import { timeAgo } from '@/lib/time';
import Link from 'next/link';
import { clsx } from 'clsx';

export function FeedCard({ item }: { item: FeedItem }) {
  return (
    <article className="glass flex h-full flex-col rounded-xl p-4 transition hover:shadow-glow">
      <div className="mb-2 flex items-center justify-between text-xs text-white/60">
        <span className={clsx('rounded-md px-2 py-1', 'bg-emerald-500/15 text-emerald-200')}>
          {item.platform}
        </span>
        <span>{timeAgo(new Date(item.timestamp))}</span>
      </div>

      <h3 className="headline line-clamp-4 mb-2">{item.title}</h3>
      <p className="muted line-clamp-4 whitespace-pre-line text-sm">{item.description}</p>
      {item.platform === 'manual' && item.fullText && item.fullText.trim() && item.fullText.trim() !== (item.description || '').trim() && (
        <p className="muted mt-2 line-clamp-4 whitespace-pre-line text-sm">{item.fullText}</p>
      )}

      {item.mediaUrl && (
        <div className="mt-3 overflow-hidden rounded-lg bg-white/5">
          {item.mediaType === 'video' ? (
            <video 
              src={item.mediaUrl} 
              controls 
              className="w-full max-h-80 object-contain"
              preload="metadata"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={item.mediaUrl} 
              alt="post media" 
              className="w-full max-h-80 object-contain"
              style={{ minHeight: '200px' }}
            />
          )}
        </div>
      )}

      <div className="mt-3 mt-auto flex items-center justify-between text-xs text-white/60">
        <Link
          href={item.platform === 'manual' ? `/post/${encodeURIComponent(item.id)}` : item.permalinkUrl}
          target={item.platform === 'manual' ? undefined : '_blank'}
          rel={item.platform === 'manual' ? undefined : 'noopener noreferrer'}
          className="hover:text-white/90"
        >
          {item.platform === 'manual' ? 'Open post' : 'View source'}
        </Link>
        <span className="rounded bg-white/10 px-2 py-0.5">{item.sourceLabel}</span>
      </div>
    </article>
  );
}


