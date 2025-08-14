function decodeNumericEntity(entity: string): string {
  const num = entity.startsWith('x') || entity.startsWith('X')
    ? parseInt(entity.slice(1), 16)
    : parseInt(entity, 10);
  if (!Number.isFinite(num)) return '';
  try { return String.fromCodePoint(num); } catch { return ''; }
}

export function decodeHtmlEntities(input: string): string {
  if (!input) return '';
  return input
    .replace(/&(#x?[0-9a-fA-F]+);/g, (_, g1) => decodeNumericEntity(g1))
    .replace(/&(amp|lt|gt|quot|apos);/g, (_, name) => {
      switch (name) {
        case 'amp': return '&';
        case 'lt': return '<';
        case 'gt': return '>';
        case 'quot': return '"';
        case 'apos': return "'";
        default: return '';
      }
    });
}

export function lettersOnly(input: string): string {
  if (!input) return '';
  const normalized = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Keep letters, numbers, spaces, full stops and commas
  return normalized.replace(/[^A-Za-z0-9., ]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}


