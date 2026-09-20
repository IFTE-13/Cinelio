export interface CuratedDirector {
  id: number;
  name: string;
  birthYear: string;
  nationality: string;
  tagline: string;
  quote: string;
  signatureStyle: string;
  hallmarks: string[];
  keyMasterpieces: string[];
  profilePath: string;
  backdropPath: string;
}

export const CURATED_DIRECTORS: CuratedDirector[] = [
  {
    id: 525,
    name: 'Christopher Nolan',
    birthYear: '1970',
    nationality: 'British-American',
    tagline: 'Master of temporal puzzles, practical illusions, and IMAX canvas.',
    quote: 'I have always been fascinated by time, by subjective perception versus objective reality.',
    signatureStyle: 'Nonlinear cross-cutting, cross-genre practical filmmaking, and thundering auditory themes.',
    hallmarks: ['Nonlinear Timelines', 'Practical Special Effects', 'IMAX 70mm Formats', 'Shepard Tone Scores', 'Antihero Obsessions'],
    keyMasterpieces: ['Oppenheimer (2023)', 'Interstellar (2014)', 'The Dark Knight (2008)', 'Inception (2010)'],
    profilePath: '/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg',
    backdropPath: '/8sNiAPPYU14PUepFNeSNGUTiHW.jpg', // Interstellar (Verified 200 OK)
  },
  {
    id: 137427,
    name: 'Denis Villeneuve',
    birthYear: '1967',
    nationality: 'French-Canadian',
    tagline: 'Architect of monumental scale, contemplative silence, and atmospheric sci-fi.',
    quote: 'Cinema is about sound and image. It is about emotional geography.',
    signatureStyle: 'Monolithic brutalist architecture, patient meditative pacing, and overwhelming sensory immersion.',
    hallmarks: ['Brutalist Architecture', 'Meditative Silence', 'Immersive Soundscapes', 'Moral Ambiguity', 'Epic Desert Landscapes'],
    keyMasterpieces: ['Dune: Part Two (2024)', 'Blade Runner 2049 (2017)', 'Arrival (2016)', 'Sicario (2015)'],
    profilePath: '/zdDx9Xs93UIrJFWYApYR28J8M6b.jpg',
    backdropPath: '/eZ239CUp1d6OryZEBPnO2n87gMG.jpg', // Dune 2 (Verified 200 OK)
  },
  {
    id: 138,
    name: 'Quentin Tarantino',
    birthYear: '1963',
    nationality: 'American',
    tagline: 'Hyper-verbal pop-culture pastiche, explosive tension, and 35mm film loyalty.',
    quote: 'I do not believe in elitism. I do not think the audience is this dumb person lower than me.',
    signatureStyle: 'Razor-sharp digressive dialogue, chaptered nonlinear storytelling, and intense standoffs.',
    hallmarks: ['Trunk Shots', 'Non-Chronological Chapters', 'Bespoke Vintage Soundtracks', 'Spurting Blood Pastiche', 'Extended Dialogues'],
    keyMasterpieces: ['Pulp Fiction (1994)', 'Inglourious Basterds (2009)', 'Kill Bill (2003)', 'Django Unchained (2012)'],
    profilePath: '/1gjcpAa99FAOWGnrUvHEXXsRs7o.jpg',
    backdropPath: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg', // Pulp Fiction (Verified 200 OK)
  },
  {
    id: 1032,
    name: 'Martin Scorsese',
    birthYear: '1942',
    nationality: 'American',
    tagline: 'The poet laureate of guilt, kinetic ambition, and the American underworld.',
    quote: 'Cinema is a matter of what is in the frame and what is out.',
    signatureStyle: 'Sweeping continuous tracking shots, freeze frames, needle-drop soundtracks, and Catholic themes.',
    hallmarks: ['Copacabana Long Takes', 'Freeze Frames & Voiceover', 'Moral Damnation', 'Rock & Soul Needle Drops', 'Frenetic Tracking'],
    keyMasterpieces: ['Taxi Driver (1976)', 'Goodfellas (1990)', 'The Departed (2006)', 'The Wolf of Wall Street (2013)'],
    profilePath: '/g3DjfKsgZQWZiw30I20hZVk1oMX.jpg',
    backdropPath: '/7Nwnmyzrtd0FkcRyPqmdzTPppQa.jpg', // Wolf of Wall Street (Verified 200 OK)
  },
  {
    id: 608,
    name: 'Hayao Miyazaki',
    birthYear: '1941',
    nationality: 'Japanese',
    tagline: 'Gentle animator of spirits, soaring flight, and environmental reverence.',
    quote: 'The concept of portraying evil and then destroying it is not how the world works.',
    signatureStyle: 'Breathtaking hand-painted watercolor landscapes, quiet contemplation (Ma), and flying machines.',
    hallmarks: ['Flight & Aeronautics', 'Eco-Pacifism', 'Quiet Moments of Stillness', 'Spirits & Shinto Lore', 'Young Resilient Heroines'],
    keyMasterpieces: ['Spirited Away (2001)', 'Princess Mononoke (1997)', 'The Boy and the Heron (2023)', 'Howl’s Moving Castle (2004)'],
    profilePath: '/ouhjt9KugzhWtdEyBPipihB3ic8.jpg',
    backdropPath: '/6oaL4DP75yABrd5EbC4H2zq5ghc.jpg', // Spirited Away (Verified 200 OK)
  },
  {
    id: 45400,
    name: 'Greta Gerwig',
    birthYear: '1983',
    nationality: 'American',
    tagline: 'Vibrant humanist wit, female agency, and kaleidoscopic warmth.',
    quote: 'I wanted to make something that was anarchic and wild and funny and cathartic.',
    signatureStyle: 'Fast-paced overlapping naturalistic dialogue, deep emotional empathy, and theatrical choreography.',
    hallmarks: ['Overlapping Dialogue', 'Complex Female Friendships', 'Coming-of-Age Empathy', 'Literary Adaptations', 'Bold Production Design'],
    keyMasterpieces: ['Barbie (2023)', 'Little Women (2019)', 'Lady Bird (2017)'],
    profilePath: '/dxKAhpkz4XNwmRzMG5QOpXjPZ1N.jpg',
    backdropPath: '/1esAE8sLJRWWFsLLeh5r3g2WanI.jpg', // Barbie (Verified 200 OK)
  },
  {
    id: 21684,
    name: 'Bong Joon-ho',
    birthYear: '1969',
    nationality: 'South Korean',
    tagline: 'Uncompromising genre-subversion, vertical class satire, and pitch-black humor.',
    quote: 'Once you overcome the one-inch-tall barrier of subtitles, you will be introduced to so many more amazing films.',
    signatureStyle: 'Abrupt emotional shifts from slapstick to horror, vertical spatial metaphors, and surgical framing.',
    hallmarks: ['Genre Blending', 'Architectural Class Divide', 'Pitch-Black Humor', 'Subversion of Tropes', 'Lateral Camera Movement'],
    keyMasterpieces: ['Parasite (2019)', 'Memories of Murder (2003)', 'Snowpiercer (2013)', 'The Host (2006)'],
    profilePath: '/stwnTvZAoD8gEJEDHpDQyLCyDy5.jpg',
    backdropPath: '/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg', // Parasite (Verified 200 OK)
  },
  {
    id: 240,
    name: 'Stanley Kubrick',
    birthYear: '1928',
    nationality: 'American',
    tagline: 'Meticulous one-point symmetry, chilling philosophical detachment, and visual perfection.',
    quote: 'If it can be written, or thought, it can be filmed.',
    signatureStyle: 'One-point perspective hallways, classical music counterpoint, and cold anthropological observation of humanity.',
    hallmarks: ['One-Point Perspective', 'The "Kubrick Stare"', 'Classical Music Juxtaposition', 'Extreme Methodical Takes', 'Technological Coldness'],
    keyMasterpieces: ['2001: A Space Odyssey (1968)', 'The Shining (1980)', 'A Clockwork Orange (1971)', 'Eyes Wide Shut (1999)'],
    profilePath: '/yFT0VyIelI9aegZrsAwOG5iVP4v.jpg',
    backdropPath: '/AdKA2F1SzYPhSZdEbjH1Zh75UVQ.jpg', // The Shining (Verified 200 OK)
  },
  {
    id: 5655,
    name: 'Wes Anderson',
    birthYear: '1969',
    nationality: 'American',
    tagline: 'Pastel diorama perfection, melancholic family whimsy, and deadpan charm.',
    quote: 'That’s the kind of movie I like to make—it’s like a little world in a glass case.',
    signatureStyle: 'Planar camera movements (whip pans & 90-degree tracking), pastel color palettes, and deadpan delivery.',
    hallmarks: ['Symmetrical Framing', 'Pastel Color Coordination', 'Stop-Motion Miniatures', 'Eccentric Ensembles', 'Futura Bold Typography'],
    keyMasterpieces: ['The Grand Budapest Hotel (2014)', 'Moonrise Kingdom (2012)', 'Fantastic Mr. Fox (2009)', 'Asteroid City (2023)'],
    profilePath: '/s03CeUeC5yAXyB1acqP0zGNo2SC.jpg',
    backdropPath: '/jK65srQczOKTpW62wPxwwKztGgE.jpg', // Grand Budapest Hotel (Verified 200 OK)
  },
  {
    id: 7467,
    name: 'David Fincher',
    birthYear: '1962',
    nationality: 'American',
    tagline: 'Obsessive procedural mastery, low-key lighting, and psychological cynicism.',
    quote: 'People will say, "There’s a million ways to shoot a scene." But I don’t think so. There’s maybe two, and one is wrong.',
    signatureStyle: 'Micro-controlled robotic tripod pans, yellow-green fluorescent color casts, and razor-sharp digital cleanliness.',
    hallmarks: ['Robotic Tripod Tracking', 'Yellow-Green Grading', 'Obsessive Multi-Takes', 'Cynical Worldviews', 'Industrial Soundscapes'],
    keyMasterpieces: ['Fight Club (1999)', 'The Social Network (2010)', 'Se7en (1995)', 'Zodiac (2007)'],
    profilePath: '/tpEczFclQZeKAiCeKZZ0adRvtfz.jpg',
    backdropPath: '/c6OLXfKAk5BKeR6broC8pYiCquX.jpg', // Fight Club (Verified 200 OK)
  },
];

export function getAllDirectors(): CuratedDirector[] {
  return CURATED_DIRECTORS;
}

export function getDirectorById(id: number): CuratedDirector | undefined {
  return CURATED_DIRECTORS.find((d) => d.id === id);
}
