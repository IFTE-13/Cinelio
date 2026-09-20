export interface CinemaEra {
  id: string;
  name: string;
  decade: string;
  years: string;
  tagline: string;
  description: string;
  lore: string;
  backdropUrl: string;
  keyFilmmakers: string[];
  hallmarks: string[];
  releaseDateGte: string;
  releaseDateLte: string;
  themeColor: string;
}

export const CINEMA_ERAS: CinemaEra[] = [
  {
    id: '1970s',
    name: 'New Hollywood & Auteur Renaissance',
    decade: '1970s',
    years: '1970 – 1979',
    tagline: 'When directors took the keys to the kingdom.',
    description:
      'A golden era fueled by disillusionment, cinematic rebellion, and creative freedom. Directors stepped out of studio confines into gritty realism.',
    lore:
      'Following the collapse of traditional studio systems in the late 1960s, a new generation of film-school educated mavericks captured the angst, paranoia, and raw human emotions of a shifting world. Characterized by moral ambiguity, location shooting, and iconic method acting.',
    backdropUrl: '/tSPT36ZKlP2WVHJLM4cQPLSzv3b.jpg', // The Godfather backdrop (Verified 200 OK)
    keyFilmmakers: ['Francis Ford Coppola', 'Martin Scorsese', 'Steven Spielberg', 'Stanley Kubrick', 'George Lucas'],
    hallmarks: ['Moral Ambiguity', 'Gritty Realism', 'Antiheroes', 'Method Acting', 'Naturalistic Sound Design'],
    releaseDateGte: '1970-01-01',
    releaseDateLte: '1979-12-31',
    themeColor: '#D97706', // Warm amber / 70s gold
  },
  {
    id: '1980s',
    name: 'Neon, Synth & High-Concept Wonder',
    decade: '1980s',
    years: '1980 – 1989',
    tagline: 'Spectacle, practical magic, and neon-lit futures.',
    description:
      'The dawn of modern blockbuster culture. Groundbreaking practical effects, synthesizers, iconic villains, and unforgettable escapist wonder.',
    lore:
      'The 1980s redefined global popular culture. With the summer blockbuster in full swing, cinema exploded with imaginative sci-fi, animatronic marvels, cyber-noir dystopias, and heart-pounding adventure stories that permanently shaped modern franchise filmmaking.',
    backdropUrl: '/2spEHYDcyE9r9mS7AFEscfKVDzO.jpg', // Blade Runner backdrop (Verified 200 OK)
    keyFilmmakers: ['Ridley Scott', 'James Cameron', 'Steven Spielberg', 'John Carpenter', 'David Cronenberg'],
    hallmarks: ['Practical Special Effects', 'Synth Soundtracks', 'Cyberpunk & Sci-Fi', 'High-Concept Blockbusters', 'Larger-than-Life Heroes'],
    releaseDateGte: '1980-01-01',
    releaseDateLte: '1989-12-31',
    themeColor: '#EC4899', // Neon magenta / 80s synth
  },
  {
    id: '1990s',
    name: 'Indie Revolution & Digital Dawn',
    decade: '1990s',
    years: '1990 – 1999',
    tagline: 'Non-linear narratives, Sundance energy, and CGI revolutions.',
    description:
      'Bold indie voices collided with the initial wave of digital effects. Razor-sharp dialogue, postmodern irony, and philosophical blockbusters.',
    lore:
      'Independent cinema conquered the mainstream throughout the 1990s. From Sundance breakout hits with punchy conversational scripts to existential sci-fi redefining virtual realities and digital compositing, the 90s bridged analog film craftsmanship and futuristic computer generation.',
    backdropUrl: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg', // Pulp Fiction backdrop (Verified 200 OK)
    keyFilmmakers: ['Quentin Tarantino', 'David Fincher', 'The Wachowskis', 'Paul Thomas Anderson', 'Joel & Ethan Coen'],
    hallmarks: ['Non-Linear Storytelling', 'Postmodern Wit', 'Stylized Violence', 'Early CGI Integration', 'Grungy Neo-Noir'],
    releaseDateGte: '1990-01-01',
    releaseDateLte: '1999-12-31',
    themeColor: '#06B6D4', // Electric cyan / 90s matrix
  },
  {
    id: '2000s',
    name: 'Millennium Visionaries & Modern Masterpieces',
    decade: '2000s',
    years: '2000 – 2009',
    tagline: 'Darker tones, cinematic scope, and psychological depth.',
    description:
      'Turn of the millennium cinema embraced psychological tension, mature graphic novel adaptations, international masterworks, and ambitious digital cinematography.',
    lore:
      'Entering the 21st century, cinematic storytelling expanded globally. Anime achieved international prestige, comic book cinema turned brooding and hyper-realistic, and directors pushed the psychological boundaries of memory, guilt, and identity in complex cinematic puzzles.',
    backdropUrl: '/9FE5eD92WfVCiivM9Pq9GVSrlWk.jpg', // The Dark Knight backdrop (Verified 200 OK)
    keyFilmmakers: ['Christopher Nolan', 'Hayao Miyazaki', 'Guillermo del Toro', 'Peter Jackson', 'Bong Joon-ho'],
    hallmarks: ['Grounded Realism', 'Complex Nonlinear Puzzles', 'International Crossover', 'Digital Color Grading', 'Prestige Genre Films'],
    releaseDateGte: '2000-01-01',
    releaseDateLte: '2009-12-31',
    themeColor: '#3B82F6', // Cobalt blue
  },
  {
    id: '2010s',
    name: 'Prestige Renaissance & Visual Spectacle',
    decade: '2010s',
    years: '2010 – 2019',
    tagline: 'A24 auteur rebirth, deep space epics, and social allegories.',
    description:
      'The rise of elevated genre storytelling, intimate auteur retrospectives, IMAX cosmic voyages, and historic international award sweeps.',
    lore:
      'Between cosmic journeys exploring love and gravity, breathtaking neon-drenched dystopias, and sharp social allegories that broke historical box office and academy records, the 2010s proved that visionary filmmaking could capture both vast scale and intimate humanity.',
    backdropUrl: '/8sNiAPPYU14PUepFNeSNGUTiHW.jpg', // Interstellar backdrop (Verified 200 OK)
    keyFilmmakers: ['Denis Villeneuve', 'Christopher Nolan', 'Jordan Peele', 'Greta Gerwig', 'Alfonso Cuarón'],
    hallmarks: ['Elevated Horror & Sci-Fi', 'Existential Epics', 'Sharp Social Satire', 'IMAX Formats', 'Auteur Driven Resurgence'],
    releaseDateGte: '2010-01-01',
    releaseDateLte: '2019-12-31',
    themeColor: '#8B5CF6', // Royal purple / A24 violet
  },
  {
    id: '2020s',
    name: 'Contemporary Visions & New Horizons',
    decade: '2020s',
    years: '2020 – Present',
    tagline: 'Bold historical epics, maximalist worlds, and raw emotional resonance.',
    description:
      'Modern filmmakers confront existential questions through towering 70mm epics, desert mythologies, and intimate reflections on fate and memory.',
    lore:
      'In a transformative decade for moviegoers, cinema returned with monumental power. Audiences rallied for breathtaking 3-hour theoretical biographies, epic science fiction adaptations on sand-swept planets, and deeply personal bilingual meditations on destiny.',
    backdropUrl: '/7CENyUim29IEsaJhUxIGymCRvPu.jpg', // Oppenheimer backdrop (Verified 200 OK)
    keyFilmmakers: ['Christopher Nolan', 'Denis Villeneuve', 'Celine Song', 'Martin Scorsese', 'Yorgos Lanthimos'],
    hallmarks: ['70mm Film Resurgence', 'Audacious Worldbuilding', 'Intimate Multilingual Dramas', 'Practical Stunts', 'Theatrical Event Cinema'],
    releaseDateGte: '2020-01-01',
    releaseDateLte: '2029-12-31',
    themeColor: '#E11D48', // Crimson red
  },
];

export function getAllEras(): CinemaEra[] {
  return CINEMA_ERAS;
}

export function getEraById(id: string): CinemaEra | undefined {
  return CINEMA_ERAS.find((era) => era.id === id);
}
