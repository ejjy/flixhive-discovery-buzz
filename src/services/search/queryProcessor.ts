
import { SearchAnalysis } from './types';

// Keywords and patterns for search analysis
const fillerWords = [
  'a', 'the', 'i', 'want', 'to', 'watch', 'movie', 'about', 'with', 'like', 
  'similar', 'to', 'find', 'me', 'show', 'looking', 'for', 'please', 'can', 
  'you', 'suggest', 'recommend', 'something'
];

const genreKeywords = [
  'action', 'adventure', 'animation', 'comedy', 'crime', 'documentary', 'drama', 
  'family', 'fantasy', 'history', 'horror', 'music', 'musical', 'mystery', 'romance', 
  'science fiction', 'sci-fi', 'thriller', 'war', 'western', 'superhero', 'biography',
  'biographical', 'sport', 'sports', 'suspense', 'fantasy', 'supernatural'
];

const eraKeywords = [
  '80s', '90s', '2000s', '70s', '60s', '50s', '40s', '30s', '20s', 
  'eighties', 'nineties', 'seventies', 'sixties', 'fifties', 
  'modern', 'classic', 'old', 'new', 'recent', 'vintage', 'retro',
  'contemporary', 'period', 'historical', 'medieval', 'futuristic'
];

const moodKeywords = [
  'happy', 'sad', 'funny', 'scary', 'thrilling', 'exciting', 'romantic',
  'nostalgic', 'dark', 'light', 'uplifting', 'depressing', 'thought-provoking',
  'inspirational', 'feel-good', 'tense', 'relaxing', 'heartwarming', 'emotional',
  'intense', 'calm', 'peaceful', 'disturbing', 'wholesome', 'gritty', 'realistic'
];

const themeKeywords = [
  'space', 'time travel', 'aliens', 'zombies', 'robots', 'ai', 'artificial intelligence',
  'love', 'friendship', 'family', 'revenge', 'redemption', 'coming of age', 'growing up',
  'survival', 'disaster', 'apocalypse', 'conspiracy', 'heist', 'murder', 'mystery',
  'politics', 'war', 'high school', 'college', 'road trip', 'vacation', 'holiday',
  'christmas', 'halloween', 'summer', 'winter', 'dystopian', 'utopian', 'post-apocalyptic',
  'psychological', 'mind-bending', 'twist', 'based on true story', 'true story', 'based on book',
  'superhero', 'magic', 'fantasy', 'dragons', 'wizards', 'witches', 'vampires', 'werewolves',
  'monsters', 'ghosts', 'haunted', 'paranormal', 'supernatural'
];

const intentPatterns = [
  { pattern: /(something|movie|film).*(sad|cry|tears|emotional)/i, intent: "emotional drama" },
  { pattern: /(something|movie|film).*(funny|laugh|comedy|hilarious)/i, intent: "comedy" },
  { pattern: /(something|movie|film).*(scary|frightening|terrifying|horror)/i, intent: "horror" },
  { pattern: /(something|movie|film).*(exciting|action|thrill|adventure)/i, intent: "action" },
  { pattern: /(something|movie|film).*(romantic|love|romance)/i, intent: "romance" },
  { pattern: /(something|movie|film).*(kids|children|family)/i, intent: "family" },
  { pattern: /(something|movie|film).*(mind-bending|twist|psychological)/i, intent: "psychological thriller" },
  { pattern: /(something|movie|film).*(space|sci-fi|future|alien)/i, intent: "science fiction" },
  { pattern: /(something|movie|film).*(tense|suspense|thriller)/i, intent: "thriller" },
  { pattern: /(bored|cannot sleep|can't sleep|insomnia)/i, intent: "entertaining" },
  { pattern: /(feeling down|depressed|sad)/i, intent: "uplifting" },
  { pattern: /(date night|with partner|with girlfriend|with boyfriend)/i, intent: "romance or comedy" },
  { pattern: /(family night|with kids|with children)/i, intent: "family friendly" },
  { pattern: /(thought-provoking|makes you think|philosophical)/i, intent: "drama or documentary" },
  { pattern: /(like|similar to) (.+)/i, intent: "similar to $2" }
];

const actorKeywords = ['actor', 'actress', 'star', 'cast', 'starring', 'plays', 'played by', 'featuring'];
const directorKeywords = ['director', 'directed by', 'filmmaker', 'film by', 'movies by'];

export const processNaturalLanguageQuery = (query: string): SearchAnalysis => {
  const lowerQuery = query.toLowerCase();
  
  // Detect if query is about a person
  let personType: 'actor' | 'director' | 'celebrity' | undefined;
  
  if (actorKeywords.some(keyword => lowerQuery.includes(keyword))) {
    personType = 'actor';
  } else if (directorKeywords.some(keyword => lowerQuery.includes(keyword))) {
    personType = 'director';
  } else {
    const words = query.split(' ');
    if (words.length <= 3 && words.every(word => /^[A-Za-z]+$/.test(word))) {
      personType = 'celebrity';
    }
  }
  
  // Extract keywords and patterns
  const mentionedGenres = genreKeywords.filter(genre => lowerQuery.includes(genre));
  const mentionedEras = eraKeywords.filter(era => lowerQuery.includes(era));
  const mentionedMoods = moodKeywords.filter(mood => lowerQuery.includes(mood));
  const mentionedThemes = themeKeywords.filter(theme =>
    lowerQuery.includes(theme) || lowerQuery.includes(theme.split(' ')[0])
  );
  
  // Detect implied intent
  let impliedIntent = "";
  for (const { pattern, intent } of intentPatterns) {
    const match = lowerQuery.match(pattern);
    if (match) {
      impliedIntent = intent.replace(/\$(\d+)/g, (_, n) => match[parseInt(n)] || "");
      break;
    }
  }
  
  // If no specific intent detected, use generic based on available info
  if (!impliedIntent) {
    if (mentionedGenres.length > 0) {
      impliedIntent = mentionedGenres[0] + " movie";
    } else if (mentionedThemes.length > 0) {
      impliedIntent = "movie about " + mentionedThemes[0];
    } else if (mentionedMoods.length > 0) {
      impliedIntent = mentionedMoods[0] + " movie";
    } else {
      impliedIntent = "general entertainment";
    }
  }
  
  // Extract key terms
  const words = lowerQuery
    .split(/\s+/)
    .filter(word => !fillerWords.includes(word));
  
  const allCategorizedTerms = new Set([
    ...mentionedGenres, 
    ...mentionedEras, 
    ...mentionedMoods, 
    ...mentionedThemes,
    ...fillerWords
  ]);
  
  const keyTerms = words.filter(word => 
    !allCategorizedTerms.has(word) && word.length > 2
  );
  
  return {
    keyTerms: Array.from(new Set(keyTerms)),
    genres: mentionedGenres,
    eras: mentionedEras,
    moods: mentionedMoods,
    themes: mentionedThemes,
    impliedIntent,
    personType
  };
};
