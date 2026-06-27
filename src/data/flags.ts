export interface FlagItem {
  slug: string;
  name: string;
  code: string;
  type: 'country' | 'state' | 'region' | 'continent';
  continent?: string;
  svg: string;
  png: string;
  emoji: string;
}

const CDN = 'https://logohub.dev/cdn';

export const flags: FlagItem[] = [
  { slug: 'portugal', name: 'Portugal', code: 'PT', type: 'country', continent: 'europe', svg: `${CDN}/flags/pt.svg`, png: `${CDN}/flags/pt.png`, emoji: '🇵🇹' },
  { slug: 'brazil', name: 'Brazil', code: 'BR', type: 'country', continent: 'south-america', svg: `${CDN}/flags/br.svg`, png: `${CDN}/flags/br.png`, emoji: '🇧🇷' },
  { slug: 'usa', name: 'United States', code: 'US', type: 'country', continent: 'north-america', svg: `${CDN}/flags/us.svg`, png: `${CDN}/flags/us.png`, emoji: '🇺🇸' },
  { slug: 'uk', name: 'United Kingdom', code: 'GB', type: 'country', continent: 'europe', svg: `${CDN}/flags/gb.svg`, png: `${CDN}/flags/gb.png`, emoji: '🇬🇧' },
  { slug: 'germany', name: 'Germany', code: 'DE', type: 'country', continent: 'europe', svg: `${CDN}/flags/de.svg`, png: `${CDN}/flags/de.png`, emoji: '🇩🇪' },
  { slug: 'france', name: 'France', code: 'FR', type: 'country', continent: 'europe', svg: `${CDN}/flags/fr.svg`, png: `${CDN}/flags/fr.png`, emoji: '🇫🇷' },
  { slug: 'spain', name: 'Spain', code: 'ES', type: 'country', continent: 'europe', svg: `${CDN}/flags/es.svg`, png: `${CDN}/flags/es.png`, emoji: '🇪🇸' },
  { slug: 'italy', name: 'Italy', code: 'IT', type: 'country', continent: 'europe', svg: `${CDN}/flags/it.svg`, png: `${CDN}/flags/it.png`, emoji: '🇮🇹' },
  { slug: 'japan', name: 'Japan', code: 'JP', type: 'country', continent: 'asia', svg: `${CDN}/flags/jp.svg`, png: `${CDN}/flags/jp.png`, emoji: '🇯🇵' },
  { slug: 'china', name: 'China', code: 'CN', type: 'country', continent: 'asia', svg: `${CDN}/flags/cn.svg`, png: `${CDN}/flags/cn.png`, emoji: '🇨🇳' },
  { slug: 'canada', name: 'Canada', code: 'CA', type: 'country', continent: 'north-america', svg: `${CDN}/flags/ca.svg`, png: `${CDN}/flags/ca.png`, emoji: '🇨🇦' },
  { slug: 'australia', name: 'Australia', code: 'AU', type: 'country', continent: 'oceania', svg: `${CDN}/flags/au.svg`, png: `${CDN}/flags/au.png`, emoji: '🇦🇺' },
  { slug: 'argentina', name: 'Argentina', code: 'AR', type: 'country', continent: 'south-america', svg: `${CDN}/flags/ar.svg`, png: `${CDN}/flags/ar.png`, emoji: '🇦🇷' },
  { slug: 'netherlands', name: 'Netherlands', code: 'NL', type: 'country', continent: 'europe', svg: `${CDN}/flags/nl.svg`, png: `${CDN}/flags/nl.png`, emoji: '🇳🇱' },
  { slug: 'sweden', name: 'Sweden', code: 'SE', type: 'country', continent: 'europe', svg: `${CDN}/flags/se.svg`, png: `${CDN}/flags/se.png`, emoji: '🇸🇪' },
  { slug: 'europe', name: 'European Union', code: 'EU', type: 'region', continent: 'europe', svg: `${CDN}/flags/eu.svg`, png: `${CDN}/flags/eu.png`, emoji: '🇪🇺' },
];

export function getFlagBySlug(slug: string): FlagItem | undefined {
  return flags.find(f => f.slug === slug || f.code.toLowerCase() === slug.toLowerCase() || f.name.toLowerCase().replace(/\s+/g, '-') === slug);
}

export function searchFlags(query: string): FlagItem[] {
  const q = query.toLowerCase();
  return flags.filter(f => f.name.toLowerCase().includes(q) || f.slug.includes(q) || f.code.toLowerCase().includes(q));
}
