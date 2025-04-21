
export interface SearchAnalysis {
  keyTerms: string[];
  genres: string[];
  eras: string[];
  moods: string[];
  themes: string[];
  impliedIntent: string;
  personType?: 'actor' | 'director' | 'celebrity';
}
