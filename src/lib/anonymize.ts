const NAME_PATTERNS = [
  /fabrizio\s+romano/gi,
  /david\s+ornstein/gi,
  /@?fabrizioromano/gi,
  /@?david[_\.]?ornstein/gi,
  /facebook\.com\/fabrizioromano/gi,
  /instagram\.com\/fabrizioromano/gi,
  /the\s+athletic/gi,
];

export function anonymizeText(input: string): string {
  let output = input;
  for (const pattern of NAME_PATTERNS) {
    output = output.replace(pattern, '').replace(/\s{2,}/g, ' ').trim();
  }
  output = output
    .replace(/^by\s+[^-:]+[-:]/i, '')
    .replace(/via\s+[^-:]+[-:]/i, '')
    .trim();
  return output;
}


