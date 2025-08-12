import { NextResponse } from 'next/server';
import { getAggregatedFeed } from '@/lib/aggregator';

export const revalidate = 300;

export async function GET() {
  try {
    const items = await getAggregatedFeed(50);
    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch feeds' }, { status: 500 });
  }
}


