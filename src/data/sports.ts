export interface SportItem {
  id: string;
  slug: string;
  name: string;
  sport: string;
  league: string;
  country: string;
  city: string;
  aliases: string[];
  colors: string[];
  svg: string;
  png: string;
  website: string;
  founded: number;
  verified: boolean;
}

const CDN = 'https://logohub.dev/cdn';

export const footballTeams: SportItem[] = [
  { id: 'f1', slug: 'real-madrid', name: 'Real Madrid', sport: 'football', league: 'la-liga', country: 'ES', city: 'Madrid', aliases: ['real madrid cf', 'los blancos', 'real'], colors: ['#FFFFFF', '#FFD700', '#003DA5'], svg: `${CDN}/football/real-madrid.svg`, png: `${CDN}/football/real-madrid.png`, website: 'https://realmadrid.com', founded: 1902, verified: true },
  { id: 'f2', slug: 'barcelona', name: 'FC Barcelona', sport: 'football', league: 'la-liga', country: 'ES', city: 'Barcelona', aliases: ['barca', 'fcb', 'barça', 'fc barcelona'], colors: ['#004D98', '#A50044'], svg: `${CDN}/football/barcelona.svg`, png: `${CDN}/football/barcelona.png`, website: 'https://fcbarcelona.com', founded: 1899, verified: true },
  { id: 'f3', slug: 'manchester-united', name: 'Manchester United', sport: 'football', league: 'premier-league', country: 'GB', city: 'Manchester', aliases: ['man utd', 'man united', 'mufc', 'the red devils'], colors: ['#DA291C', '#FBE122'], svg: `${CDN}/football/manchester-united.svg`, png: `${CDN}/football/manchester-united.png`, website: 'https://manutd.com', founded: 1878, verified: true },
  { id: 'f4', slug: 'manchester-city', name: 'Manchester City', sport: 'football', league: 'premier-league', country: 'GB', city: 'Manchester', aliases: ['man city', 'mcfc', 'city', 'the citizens'], colors: ['#6CABDD', '#1C2C5B'], svg: `${CDN}/football/manchester-city.svg`, png: `${CDN}/football/manchester-city.png`, website: 'https://mancity.com', founded: 1880, verified: true },
  { id: 'f5', slug: 'liverpool', name: 'Liverpool FC', sport: 'football', league: 'premier-league', country: 'GB', city: 'Liverpool', aliases: ['lfc', 'the reds', 'liverpool football club'], colors: ['#C8102E', '#F6EB61', '#00B2A9'], svg: `${CDN}/football/liverpool.svg`, png: `${CDN}/football/liverpool.png`, website: 'https://liverpoolfc.com', founded: 1892, verified: true },
  { id: 'f6', slug: 'chelsea', name: 'Chelsea FC', sport: 'football', league: 'premier-league', country: 'GB', city: 'London', aliases: ['cfc', 'the blues', 'chelsea football club'], colors: ['#034694', '#FFFFFF'], svg: `${CDN}/football/chelsea.svg`, png: `${CDN}/football/chelsea.png`, website: 'https://chelseafc.com', founded: 1905, verified: true },
  { id: 'f7', slug: 'arsenal', name: 'Arsenal FC', sport: 'football', league: 'premier-league', country: 'GB', city: 'London', aliases: ['the gunners', 'afc', 'arsenal football club'], colors: ['#EF0107', '#063672'], svg: `${CDN}/football/arsenal.svg`, png: `${CDN}/football/arsenal.png`, website: 'https://arsenal.com', founded: 1886, verified: true },
  { id: 'f8', slug: 'juventus', name: 'Juventus FC', sport: 'football', league: 'serie-a', country: 'IT', city: 'Turin', aliases: ['juve', 'la vecchia signora', 'juventus'], colors: ['#000000', '#FFFFFF'], svg: `${CDN}/football/juventus.svg`, png: `${CDN}/football/juventus.png`, website: 'https://juventus.com', founded: 1897, verified: true },
  { id: 'f9', slug: 'psg', name: 'Paris Saint-Germain', sport: 'football', league: 'ligue-1', country: 'FR', city: 'Paris', aliases: ['psg', 'paris sg', 'paris saint germain'], colors: ['#004170', '#DA291C', '#FFFFFF'], svg: `${CDN}/football/psg.svg`, png: `${CDN}/football/psg.png`, website: 'https://psg.fr', founded: 1970, verified: true },
  { id: 'f10', slug: 'bayern-munich', name: 'Bayern Munich', sport: 'football', league: 'bundesliga', country: 'DE', city: 'Munich', aliases: ['fcb', 'fc bayern', 'fc bayern munich', 'die roten'], colors: ['#DC052D', '#0066B2'], svg: `${CDN}/football/bayern-munich.svg`, png: `${CDN}/football/bayern-munich.png`, website: 'https://fcbayern.com', founded: 1900, verified: true },
  { id: 'f11', slug: 'flamengo', name: 'Flamengo', sport: 'football', league: 'brasileiro', country: 'BR', city: 'Rio de Janeiro', aliases: ['flamengo', 'rubro negro', 'crf'], colors: ['#CC0000', '#000000'], svg: `${CDN}/football/flamengo.svg`, png: `${CDN}/football/flamengo.png`, website: 'https://flamengo.com.br', founded: 1895, verified: true },
  { id: 'f12', slug: 'benfica', name: 'SL Benfica', sport: 'football', league: 'liga-portugal', country: 'PT', city: 'Lisbon', aliases: ['sl benfica', 'benfica', 'eagles', 'as aguias'], colors: ['#FF0000', '#FFFFFF'], svg: `${CDN}/football/benfica.svg`, png: `${CDN}/football/benfica.png`, website: 'https://slbenfica.pt', founded: 1904, verified: true },
  { id: 'f13', slug: 'porto', name: 'FC Porto', sport: 'football', league: 'liga-portugal', country: 'PT', city: 'Porto', aliases: ['fcp', 'porto', 'dragons', 'os dragoes'], colors: ['#003DA5', '#FFFFFF', '#FFD700'], svg: `${CDN}/football/porto.svg`, png: `${CDN}/football/porto.png`, website: 'https://fcporto.pt', founded: 1893, verified: true },
  { id: 'f14', slug: 'sporting-cp', name: 'Sporting CP', sport: 'football', league: 'liga-portugal', country: 'PT', city: 'Lisbon', aliases: ['sporting', 'sporting clube', 'scp'], colors: ['#006400', '#FFFFFF', '#FFD700'], svg: `${CDN}/football/sporting-cp.svg`, png: `${CDN}/football/sporting-cp.png`, website: 'https://sporting.pt', founded: 1906, verified: true },
];

export const basketballTeams: SportItem[] = [
  { id: 'b1', slug: 'lakers', name: 'Los Angeles Lakers', sport: 'basketball', league: 'nba', country: 'US', city: 'Los Angeles', aliases: ['la lakers', 'lakers', 'los angeles lakers'], colors: ['#552583', '#FDB927'], svg: `${CDN}/basketball/lakers.svg`, png: `${CDN}/basketball/lakers.png`, website: 'https://nba.com/lakers', founded: 1947, verified: true },
  { id: 'b2', slug: 'golden-state-warriors', name: 'Golden State Warriors', sport: 'basketball', league: 'nba', country: 'US', city: 'San Francisco', aliases: ['warriors', 'gsw', 'the dubs'], colors: ['#1D428A', '#FFC72C'], svg: `${CDN}/basketball/warriors.svg`, png: `${CDN}/basketball/warriors.png`, website: 'https://nba.com/warriors', founded: 1946, verified: true },
  { id: 'b3', slug: 'chicago-bulls', name: 'Chicago Bulls', sport: 'basketball', league: 'nba', country: 'US', city: 'Chicago', aliases: ['bulls', 'chicago bulls'], colors: ['#CE1141', '#000000'], svg: `${CDN}/basketball/bulls.svg`, png: `${CDN}/basketball/bulls.png`, website: 'https://nba.com/bulls', founded: 1966, verified: true },
];

export const formula1Teams: SportItem[] = [
  { id: 'r1', slug: 'ferrari', name: 'Scuderia Ferrari', sport: 'formula1', league: 'f1', country: 'IT', city: 'Maranello', aliases: ['ferrari', 'scuderia ferrari', 'sf'], colors: ['#DC0000', '#FFFFFF'], svg: `${CDN}/formula1/ferrari.svg`, png: `${CDN}/formula1/ferrari.png`, website: 'https://ferrari.com/formula1', founded: 1950, verified: true },
  { id: 'r2', slug: 'red-bull-racing', name: 'Red Bull Racing', sport: 'formula1', league: 'f1', country: 'AT', city: 'Milton Keynes', aliases: ['red bull', 'redbull', 'rbr'], colors: ['#3671C6', '#CC1E4A'], svg: `${CDN}/formula1/red-bull.svg`, png: `${CDN}/formula1/red-bull.png`, website: 'https://redbullracing.com', founded: 2004, verified: true },
  { id: 'r3', slug: 'mercedes-amg-f1', name: 'Mercedes-AMG F1', sport: 'formula1', league: 'f1', country: 'DE', city: 'Brackley', aliases: ['mercedes', 'mercedes f1', 'amg'], colors: ['#00D2BE', '#000000'], svg: `${CDN}/formula1/mercedes.svg`, png: `${CDN}/formula1/mercedes.png`, website: 'https://mercedesamgf1.com', founded: 1954, verified: true },
];

export function searchSports(query: string, sport?: string): SportItem[] {
  const q = query.toLowerCase().replace(/\s+/g, '');
  const all = [...footballTeams, ...basketballTeams, ...formula1Teams];
  return all.filter(s => {
    if (sport && s.sport !== sport) return false;
    const nameMatch = s.name.toLowerCase().replace(/\s+/g, '').includes(q);
    const slugMatch = s.slug.replace(/-/g, '').includes(q);
    const aliasMatch = s.aliases.some(a => a.replace(/\s+/g, '').includes(q));
    return nameMatch || slugMatch || aliasMatch;
  });
}
