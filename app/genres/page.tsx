import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { getGenres } from '@/lib/tmdb/client';
import { ArrowRight, Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Genres Directory — Cinelio',
  description: 'Explore cinema by genre: Drama, Science Fiction, Thriller, History, Animation, and more.',
};

export default async function GenresPage() {
  const genres = await getGenres();

  const genreDescriptions: Record<string, string> = {
    Action: 'High-stakes conflict, physical stunts, explosive sequences, and relentless pacing.',
    Adventure: 'Expeditions into the unknown, exotic journeys, and epic quests.',
    Animation: 'Hand-drawn, stop-motion, and computer-generated visual storytelling artistry.',
    Comedy: 'Satire, wit, absurdity, and humorous explorations of the human condition.',
    Crime: 'Underworld syndicates, forensic investigations, moral compromise, and legal suspense.',
    Documentary: 'Non-fictional chronicling of real-world history, ecology, science, and human lives.',
    Drama: 'Character-driven narratives focusing on emotional depth, conflict, and societal themes.',
    Family: 'Multi-generational narratives crafted for audiences of all ages.',
    Fantasy: 'Mythological realms, magical systems, and metaphysical journeys beyond reality.',
    History: 'Dramatizations and authentic recreations of pivotal historical eras and figures.',
    Horror: 'Psychological terror, supernatural apparitions, existential dread, and suspense.',
    Music: 'Concert films, musical theater adaptations, and narratives centered on musical craft.',
    Mystery: 'Puzzles, enigmatic crimes, investigative detection, and revelatory twists.',
    Romance: 'Intimacy, passion, heartache, emotional connection, and romantic devotion.',
    'Science Fiction': 'Speculative futures, extraterrestrial encounters, cybernetics, and astrophysics.',
    'TV Movie': 'Feature-length cinema produced specifically for broadcast distribution.',
    Thriller: 'Tense anticipation, psychological mind games, espionage, and razor-edge suspense.',
    War: 'Tactical conflict, personal sacrifice, historical warfare, and the human toll of battle.',
    Western: 'Frontier mythology, desert vistas, outlaws, lawmen, and moral ambiguity on the borderlands.',
  };

  return (
    <div className="py-10 sm:py-16">
      <Container>
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Layers className="w-4 h-4" />
            <span>Archive Classification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Genres Directory
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Browse films categorized by aesthetic style, thematic focus, and narrative convention.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {genres.map((genre) => {
            const desc =
              genreDescriptions[genre.name] ||
              'Explore curated titles archived under this cinema genre category.';

            return (
              <Link
                key={genre.id}
                href={`/genres/${genre.id}`}
                className="group flex flex-col justify-between p-5 rounded-xl border border-border/70 bg-card hover:border-foreground/30 hover:bg-secondary/40 transition-all focus-visible:ring-2 focus-visible:ring-ring focus:outline-none"
              >
                <div>
                  <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {genre.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-foreground">
                  <span>Browse catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
