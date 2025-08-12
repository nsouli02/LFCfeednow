export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4, 'week'],
    [12, 'month'],
    [Number.POSITIVE_INFINITY, 'year'],
  ];
  let count = seconds;
  let unit: Intl.RelativeTimeFormatUnit = 'second';
  for (let i = 0, divisor = 1; i < intervals.length; i++) {
    const [limit, nextUnit] = intervals[i];
    if (count < limit) {
      unit = nextUnit;
      const value = Math.floor(count / divisor);
      const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
      return rtf.format(-value, unit);
    }
    divisor = limit;
    count = Math.floor(count / limit);
  }
  return date.toLocaleString();
}


