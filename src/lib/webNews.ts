import type { FeedItem } from './types';
import { anonymizeText } from './anonymize';
import { splitTitleAndDescription, generateHeadlineFrom } from './headlines';
import { XMLParser } from 'fast-xml-parser';
import { RSS_FEEDS } from './rssSources';
import { decodeHtmlEntities, lettersOnly } from './sanitize';

export async function fetchLiverpoolRss(limit = 50): Promise<FeedItem[]> {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
  const tasks = RSS_FEEDS.map(async (src) => {
    try {
      const res = await fetch(src.url, { next: { revalidate: 60 } });
      if (!res.ok) return [] as FeedItem[];
      const xml = await res.text();
      const json = parser.parse(xml);
      const items: Array<any> = json?.rss?.channel?.item ?? [];
      const lfcRegex = /(liverpool|lfc|anfield|reds|klopp|slot)/i;
      return items
        .filter((it) => {
          const text = `${it.title} ${it.description}`;
          return src.filterLiverpoolOnly ? lfcRegex.test(text) : true;
        })
        .slice(0, Math.ceil(limit / RSS_FEEDS.length) + 2)
        .map((it) => {
          const link: string = it.link;
          const rawTitle: string = (it.title || '').toString();
          const rawDesc: string = (it.description || '').toString().replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          const decodedTitle = decodeHtmlEntities(rawTitle);
          const decodedDesc = decodeHtmlEntities(rawDesc);
          const fullRaw = [decodedTitle, decodedDesc].filter(Boolean).join(' ');
          const fullText = anonymizeText(fullRaw);
          const { title, description } = splitTitleAndDescription(fullText);
          const finalTitle = lettersOnly(title || generateHeadlineFrom(fullText));
          const finalDesc = lettersOnly(description);
          return {
            id: `web_${Buffer.from(link).toString('base64').slice(0, 16)}`,
            platform: 'web',
            title: finalTitle,
            description: finalDesc,
            fullText,
            mediaUrl: undefined,
            permalinkUrl: link,
            timestamp: new Date().toISOString(),
            sourceLabel: src.name,
          } satisfies FeedItem;
        });
    } catch {
      return [] as FeedItem[];
    }
  });

  const results = await Promise.allSettled(tasks);
  let all: FeedItem[] = [];
  for (const r of results) if (r.status === 'fulfilled') all = all.concat(r.value);
  return all
    .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
    .slice(0, limit);
}


