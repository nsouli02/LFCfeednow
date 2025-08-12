const CLUBS = [
  'Liverpool', 'Arsenal', 'Chelsea', 'Manchester United', 'Manchester City', 'Tottenham', 'Newcastle', 'Aston Villa', 'West Ham', 'Brighton', 'Everton', 'Fulham', 'Crystal Palace', 'Brentford', 'Bournemouth', 'Nottingham Forest'
];

function titleCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^|[\s\-_/])([a-z])/g, (_, s, c) => s + c.toUpperCase());
}

export function generateHeadlineFrom(text: string): string {
  const base = text.replace(/\s+/g, ' ').trim();
  if (!base) return 'Breaking transfer update';
  const hereWeGo = /here we go/i.test(base);
  const loan = /loan/i.test(base);
  const medical = /medical/i.test(base);
  const bid = /bid|offer/i.test(base);
  const agree = /agree(d)?|agreement|deal/i.test(base);
  const sign = /sign|signing|signed/i.test(base);
  const club = CLUBS.find((c) => new RegExp(c, 'i').test(base));
  if (hereWeGo) return club ? `${club}: Here We Go` : 'Here We Go Major Transfer';
  if (medical) return club ? `${club} Medical Scheduled` : 'Medical Scheduled';
  if (loan) return club ? `${club} Close In On Loan Move` : 'Loan Move Advancing';
  if (bid) return club ? `${club} Table Fresh Bid` : 'Fresh Bid Submitted';
  if (agree) return club ? `${club} Reach Agreement` : 'Agreement Reached';
  if (sign) return club ? `${club} Confirm New Signing` : 'New Signing Confirmed';
  const firstSentence = base.split(/\n|[.!?]/)[0];
  const trimmed = firstSentence.length > 100 ? firstSentence.slice(0, 97) + '…' : firstSentence;
  return titleCase(trimmed);
}

export function splitTitleAndDescription(text: string): { title: string; description: string } {
  const normalized = text.replace(/\r/g, '').trim();
  const [firstLine, ...rest] = normalized.split(/\n+/);
  const title = firstLine?.trim() || generateHeadlineFrom(text);
  const description = rest.join(' ').trim() || text.slice(0, 180);
  return { title, description };
}


