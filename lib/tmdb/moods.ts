export interface CinemaMood {
  id: string;
  name: string;
  shortLabel: string;
  tagline: string;
  description: string;
  lore: string;
  backdropUrl: string;
  themeColor: string;
  genreIds: number[];
  genreNames: string[];
  minRating: string;
  keywords: string[];
  fallbackMovieIds: number[];
}

export const CINEMA_MOODS: CinemaMood[] = [
  {
    id: 'mind-bending',
    name: 'Mind-Bending & Existential',
    shortLabel: 'Mind-Bending',
    tagline: 'Puzzles of reality, fragmented timelines, and psychological vertigo.',
    description:
      'Films that challenge your perception of time, memory, and consciousness. Best experienced with undivided attention and a curious mind.',
    lore:
      'From recursive dream landscapes to nonlinear memory puzzles, these films question what is real and leave you dissecting every frame long after the credits roll.',
    backdropUrl: '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    themeColor: '#8B5CF6', // Violet
    genreIds: [878, 9648, 53],
    genreNames: ['Sci-Fi', 'Mystery', 'Thriller'],
    minRating: '7.5',
    keywords: ['Memory', 'Time Travel', 'Reality', 'Subconscious', 'Paradox'],
    fallbackMovieIds: [27205, 77, 603, 157336, 335984],
  },
  {
    id: 'neon-nocturne',
    name: 'Neon Nocturne & Cyber Noir',
    shortLabel: 'Neon Noir',
    tagline: 'Rain-soaked asphalt, synthetic synthesizers, and morally gray streets.',
    description:
      'Atmospheric nighttime cinema glowing with neon lights, synthetic scores, cybernetic shadows, and hardboiled antiheroes.',
    lore:
      'Rooted in the visual legacy of 1980s retro-futurism and German Expressionism, this mood immerses you in hazy cityscapes where morality is blurred and technology casts deep shadows.',
    backdropUrl: '/gNdLJU9TxrpGx4dkZidjys3fyy0.jpg',
    themeColor: '#06B6D4', // Cyan
    genreIds: [878, 80, 53],
    genreNames: ['Sci-Fi', 'Crime', 'Thriller'],
    minRating: '7.5',
    keywords: ['Cyberpunk', 'Rain', 'Night', 'Replicant', 'Dystopia'],
    fallbackMovieIds: [335984, 78, 155, 603],
  },
  {
    id: 'bittersweet',
    name: 'Bittersweet & Poetic Romance',
    shortLabel: 'Bittersweet',
    tagline: 'Lingering glances, parallel destinies, and tender human connection.',
    description:
      'Intimate, emotionally resonant stories exploring the delicate beauty of love, unchosen paths, and the passage of time.',
    lore:
      'Neither pure tragedy nor conventional happily-ever-after, these works celebrate the bittersweet poetry of human connection, cultural migration, and unhurried emotional truth.',
    backdropUrl: '/7HR38hMBl23lf38MAN63y4pKsHz.jpg',
    themeColor: '#F43F5E', // Rose
    genreIds: [18, 10749],
    genreNames: ['Drama', 'Romance'],
    minRating: '7.2',
    keywords: ['Destiny', 'Intimacy', 'Longing', 'Memory', 'Emigration'],
    fallbackMovieIds: [666277, 129, 872585],
  },
  {
    id: 'kinetic-thrill',
    name: 'Adrenaline & Kinetic Thrills',
    shortLabel: 'Kinetic Thrill',
    tagline: 'Relentless velocity, visceral stakes, and edge-of-seat momentum.',
    description:
      'High-velocity cinema crafted with jaw-dropping practical stuntwork, razor-sharp editing, and heart-pounding tension.',
    lore:
      'Cinema as pure physical momentum. When dialogue steps aside for propulsive rhythm, dynamic camera tracking, and unrelenting narrative thrust that keeps your pulse racing.',
    backdropUrl: '/9FE5eD92WfVCiivM9Pq9GVSrlWk.jpg',
    themeColor: '#EF4444', // Red
    genreIds: [28, 53],
    genreNames: ['Action', 'Thriller'],
    minRating: '7.5',
    keywords: ['Pursuit', 'Combat', 'Stunts', 'High Stakes', 'Rhythm'],
    fallbackMovieIds: [155, 603, 680, 693134],
  },
  {
    id: 'whimsical-comfort',
    name: 'Whimsical & Wonderfully Cozy',
    shortLabel: 'Whimsical Comfort',
    tagline: 'Spirited adventures, warm nostalgic charm, and gentle magic.',
    description:
      'Soul-warming cinema filled with imaginative wonder, hand-drawn magic, quirky humor, and deeply comforting emotional safety.',
    lore:
      'The antidote to modern cynicism. From enchanted bathhouses and quiet train journeys across water to eccentric stop-motion families, these films restore our sense of wonder.',
    backdropUrl: '/6oaL4DP75yABrd5EbC4H2zq5ghc.jpg',
    themeColor: '#10B981', // Emerald
    genreIds: [16, 10751, 14],
    genreNames: ['Animation', 'Family', 'Fantasy'],
    minRating: '7.5',
    keywords: ['Magic', 'Nature', 'Childhood', 'Friendship', 'Cozy'],
    fallbackMovieIds: [129, 438631, 693134],
  },
  {
    id: 'spine-chilling',
    name: 'Atmospheric Dread & Psychological Chills',
    shortLabel: 'Spine-Chilling',
    tagline: 'Slow-burn paranoia, eerie silence, and macabre tension.',
    description:
      'Masterclasses in dread and psychological suspense that linger beneath your skin through sinister atmosphere and acoustic perfection.',
    lore:
      'Esoteric terrors that rely not on cheap jump scares, but on isolating architecture, escalating psychological breakdown, and the creeping realization that something is deeply wrong.',
    backdropUrl: '/AdKA2F1SzYPhSZdEbjH1Zh75UVQ.jpg',
    themeColor: '#64748B', // Slate
    genreIds: [27, 9648, 53],
    genreNames: ['Horror', 'Mystery', 'Thriller'],
    minRating: '7.2',
    keywords: ['Isolation', 'Dread', 'Madness', 'The Supernatural', 'Silence'],
    fallbackMovieIds: [694, 77, 496243],
  },
  {
    id: 'epic-grandeur',
    name: 'Monumental Epics & Mythic Quests',
    shortLabel: 'Epic Grandeur',
    tagline: 'Sweeping desert dunes, cosmic voyages, and generational sagas.',
    description:
      'Towering theatrical scale built for the biggest screens imaginable. Overwhelming auditory design, majestic landscapes, and mythic destinies.',
    lore:
      'Grand narrative tapestries told on a massive canvas. Spanning intergalactic journeys through black holes, perilous desert conflicts, and historical transformations that altered the world.',
    backdropUrl: '/eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
    themeColor: '#F59E0B', // Amber
    genreIds: [12, 878, 36],
    genreNames: ['Adventure', 'Sci-Fi', 'History'],
    minRating: '7.8',
    keywords: ['Destiny', 'Cosmic', 'Empire', '70mm', 'Saga'],
    fallbackMovieIds: [693134, 438631, 157336, 872585, 238],
  },
];

export function getAllMoods(): CinemaMood[] {
  return CINEMA_MOODS;
}

export function getMoodById(id: string): CinemaMood | undefined {
  return CINEMA_MOODS.find((m) => m.id === id);
}
