
import { Movie } from "@/types/movie";
import { searchMoviesOmdb } from "./omdbService";
import { mockMovies } from "./mock/mockData";
import { getPopulatedMovies } from "./moviePopulationService";

// Enhanced natural language query processing
const processNaturalLanguageQuery = (query: string): {
  keyTerms: string[],
  genres: string[],
  eras: string[],
  moods: string[],
  themes: string[],
  impliedIntent: string
} => {
  // Common filler words to remove
  const fillerWords = [
    'a', 'the', 'i', 'want', 'to', 'watch', 'movie', 'about', 'with', 'like', 
    'similar', 'to', 'find', 'me', 'show', 'looking', 'for', 'please', 'can', 
    'you', 'suggest', 'recommend', 'something'
  ];
  
  // Expanded genre keywords for better matching
  const genreKeywords = [
    'action', 'adventure', 'animation', 'comedy', 'crime', 'documentary', 'drama', 
    'family', 'fantasy', 'history', 'horror', 'music', 'musical', 'mystery', 'romance', 
    'science fiction', 'sci-fi', 'thriller', 'war', 'western', 'superhero', 'biography',
    'biographical', 'sport', 'sports', 'suspense', 'fantasy', 'supernatural'
  ];
  
  // Expanded era keywords
  const eraKeywords = [
    '80s', '90s', '2000s', '70s', '60s', '50s', '40s', '30s', '20s', 
    'eighties', 'nineties', 'seventies', 'sixties', 'fifties', 
    'modern', 'classic', 'old', 'new', 'recent', 'vintage', 'retro',
    'contemporary', 'period', 'historical', 'medieval', 'futuristic'
  ];
  
  // Mood keywords to detect emotional tone desired
  const moodKeywords = [
    'happy', 'sad', 'funny', 'scary', 'thrilling', 'exciting', 'romantic',
    'nostalgic', 'dark', 'light', 'uplifting', 'depressing', 'thought-provoking',
    'inspirational', 'feel-good', 'tense', 'relaxing', 'heartwarming', 'emotional',
    'intense', 'calm', 'peaceful', 'disturbing', 'wholesome', 'gritty', 'realistic'
  ];
  
  // Theme keywords to detect plot elements
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
  
  // Intent mapping patterns
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
  
  // Process the query
  const lowerQuery = query.toLowerCase();
  
  // Extract mentioned genres
  const mentionedGenres = genreKeywords.filter(genre => 
    lowerQuery.includes(genre)
  );
  
  // Extract mentioned eras
  const mentionedEras = eraKeywords.filter(era => 
    lowerQuery.includes(era)
  );
  
  // Extract mood indicators
  const mentionedMoods = moodKeywords.filter(mood =>
    lowerQuery.includes(mood)
  );
  
  // Extract theme indicators
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
  
  // If no specific intent detected, use a generic one based on available info
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
  
  // Split query into words and remove filler words
  const words = lowerQuery
    .split(/\s+/)
    .filter(word => !fillerWords.includes(word));
  
  // Extract key terms - words that aren't already categorized
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
    impliedIntent
  };
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  console.log(`Processing natural language query: "${query}"...`);
  
  try {
    // Process the natural language query with enhanced understanding
    const { keyTerms, genres, eras, moods, themes, impliedIntent } = processNaturalLanguageQuery(query);
    
    console.log("Analysis of query:");
    console.log("- Key terms:", keyTerms);
    console.log("- Genres:", genres);
    console.log("- Eras:", eras);
    console.log("- Moods:", moods);
    console.log("- Themes:", themes);
    console.log("- Implied intent:", impliedIntent);
    
    // First try with direct OMDB search using the implied intent
    console.log(`Attempting OMDB API search with implied intent: "${impliedIntent}"`);
    let results = await searchMoviesOmdb(impliedIntent);
    
    // If no results with implied intent, try with the original query
    if (results.length === 0) {
      console.log("No results from implied intent, trying with original query...");
      results = await searchMoviesOmdb(query);
    }
    
    // If still no results, try with genres and themes
    if (results.length === 0 && (genres.length > 0 || themes.length > 0)) {
      const searchTerms = [...genres, ...themes.slice(0, 1)].join(' ');
      if (searchTerms.length > 2) {
        console.log(`No results, trying with genres and themes: "${searchTerms}"`);
        results = await searchMoviesOmdb(searchTerms);
      }
    }
    
    // If still no results, try with key terms and moods
    if (results.length === 0 && (keyTerms.length > 0 || moods.length > 0)) {
      const combinedTerms = [...keyTerms, ...moods].slice(0, 3).join(' ');
      if (combinedTerms.length > 2) {
        console.log(`Still no results, trying with key terms and moods: "${combinedTerms}"`);
        results = await searchMoviesOmdb(combinedTerms);
      }
    }
    
    // If we have OMDB results, use them
    if (results.length > 0) {
      console.log(`Found ${results.length} movies via API`);
      return results;
    }
    
    // If no API results, search our populated and mock data
    console.log("No API results, searching populated and mock database with intelligent scoring...");
    const allMovies = getPopulatedMovies();
    
    // Intelligent scoring system
    const scoredMovies = allMovies.map(movie => {
      let score = 0;
      
      // Check title matches - higher weight
      if (movie.title.toLowerCase().includes(query.toLowerCase())) {
        score += 15;
      }
      
      // Score based on genre matches
      genres.forEach(genre => {
        if (movie.genres.some(g => g.toLowerCase().includes(genre))) {
          score += 10;
        }
      });
      
      // Score based on theme matches in overview
      themes.forEach(theme => {
        if (movie.overview.toLowerCase().includes(theme)) {
          score += 8;
        }
      });
      
      // Score based on mood matches in overview
      moods.forEach(mood => {
        if (movie.overview.toLowerCase().includes(mood)) {
          score += 6;
        }
      });
      
      // Era matches
      eras.forEach(era => {
        // Check in title
        if (movie.title.toLowerCase().includes(era)) {
          score += 7;
        }
        
        // Check in description
        if (movie.overview.toLowerCase().includes(era)) {
          score += 5;
        }
        
        // Check year matches
        const yearMatch = era.match(/(\d{2})s/);
        if (yearMatch && movie.releaseDate) {
          const yearPrefix = yearMatch[1];
          const fullYear = parseInt(`19${yearPrefix}`) || parseInt(`20${yearPrefix}`);
          const releaseYear = new Date(movie.releaseDate).getFullYear();
          
          if (releaseYear >= fullYear && releaseYear < fullYear + 10) {
            score += 10;
          }
        }
      });
      
      // Key terms matching
      keyTerms.forEach(term => {
        if (movie.title.toLowerCase().includes(term)) {
          score += 8;
        }
        if (movie.overview.toLowerCase().includes(term)) {
          score += 5;
        }
      });
      
      // Implied intent matching
      if (impliedIntent && movie.overview.toLowerCase().includes(impliedIntent.toLowerCase())) {
        score += 12;
      }
      
      return { movie, score };
    });
    
    // Sort by score and take top matches
    const sortedMovies = scoredMovies
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.movie);
    
    if (sortedMovies.length > 0) {
      console.log(`Found ${sortedMovies.length} relevant movies in local database`);
      return sortedMovies.slice(0, 10); // Return top 10 most relevant
    }
    
    console.log("No matching movies found, generating a placeholder movie");
    // If no matching movies found, generate a more intelligent fake movie
    
    // Determine most likely genre based on query analysis
    let suggestedGenres = genres.length > 0 ? genres : [];
    if (suggestedGenres.length === 0 && moods.length > 0) {
      // Map moods to likely genres
      const moodToGenreMap: {[key: string]: string} = {
        'happy': 'Comedy',
        'sad': 'Drama',
        'funny': 'Comedy',
        'scary': 'Horror',
        'thrilling': 'Thriller',
        'exciting': 'Action',
        'romantic': 'Romance',
        'nostalgic': 'Drama',
        'dark': 'Thriller',
        'uplifting': 'Drama',
        'inspirational': 'Biography'
      };
      
      suggestedGenres = moods
        .map(mood => moodToGenreMap[mood])
        .filter(Boolean)
        .map(genre => genre[0].toUpperCase() + genre.slice(1));
    }
    
    if (suggestedGenres.length === 0 && themes.length > 0) {
      // Add at least one genre based on the theme
      const themeToGenreMap: {[key: string]: string} = {
        'space': 'Science Fiction',
        'aliens': 'Science Fiction',
        'zombies': 'Horror',
        'robots': 'Science Fiction',
        'love': 'Romance',
        'family': 'Drama',
        'revenge': 'Thriller',
        'survival': 'Adventure',
        'murder': 'Crime',
        'conspiracy': 'Thriller',
        'magic': 'Fantasy',
        'dragons': 'Fantasy',
        'wizards': 'Fantasy',
        'ghosts': 'Horror',
        'haunted': 'Horror'
      };
      
      const themeGenres = themes
        .map(theme => themeToGenreMap[theme] || null)
        .filter(Boolean)
        .map(genre => genre[0].toUpperCase() + genre.slice(1));
        
      suggestedGenres = [...suggestedGenres, ...themeGenres];
    }
    
    // Default genres if we still don't have any
    if (suggestedGenres.length === 0) {
      suggestedGenres = ["Drama", "Adventure"];
    }
    
    // Generate title based on query
    let generatedTitle = "";
    
    if (themes.length > 0) {
      generatedTitle = `The ${themes[0][0].toUpperCase() + themes[0].slice(1)}`;
    } else if (keyTerms.length > 0) {
      generatedTitle = keyTerms.map(term => term[0].toUpperCase() + term.slice(1)).join(' ');
    } else {
      generatedTitle = `${suggestedGenres[0]} Adventure`;
    }
    
    if (moods.length > 0) {
      // Add an adjective based on mood
      const moodAdjectives: {[key: string]: string} = {
        'happy': 'Joyful',
        'sad': 'Melancholic',
        'funny': 'Hilarious',
        'scary': 'Terrifying',
        'thrilling': 'Thrilling',
        'exciting': 'Exciting',
        'romantic': 'Passionate',
        'dark': 'Sinister',
        'light': 'Lighthearted',
        'uplifting': 'Inspiring',
        'intense': 'Intense'
      };
      
      const adjective = moodAdjectives[moods[0]];
      if (adjective) {
        generatedTitle = `The ${adjective} ${generatedTitle}`;
      }
    }
    
    // Generate a better overview based on the analysis
    let generatedOverview = `A ${moods.length > 0 ? moods[0] + " " : ""}movie about ${themes.length > 0 ? themes.join(' and ') : keyTerms.join(' and ')}. `;
    
    generatedOverview += `This ${suggestedGenres.join('/')} film takes viewers on ${eras.length > 0 ? `a journey to the ${eras[0]} ` : 'an unexpected journey '}`;
    generatedOverview += `through themes of ${['adventure', 'discovery', 'mystery', 'connection', 'conflict', 'redemption'].slice(0, 3).join(', ')}.`;
    
    // Add a line about why it matches their query
    generatedOverview += ` Based on your search for "${query}", this movie provides the perfect blend of ${suggestedGenres.join(' and ')} elements you're looking for.`;
    
    const generatedMovie: Movie = {
      id: 1000 + Math.floor(Math.random() * 1000),
      title: generatedTitle,
      overview: generatedOverview,
      posterPath: "https://image.tmdb.org/t/p/w500/placeholder.svg",
      backdropPath: "https://image.tmdb.org/t/p/original/placeholder.svg",
      releaseDate: new Date().toISOString().split('T')[0],
      voteAverage: 7.0 + Math.random() * 2,
      genres: suggestedGenres.slice(0, 3),
      runtime: 90 + Math.floor(Math.random() * 60),
      director: "Acclaimed Director",
      cast: ["Leading Actor", "Supporting Actress", "Character Actor"],
      platforms: ["Netflix", "Prime Video"],
      platformRatings: [
        { platform: "IMDb", score: 7.0 + Math.random() * 2, outOf: 10 },
        { platform: "Rotten Tomatoes", score: 70 + Math.floor(Math.random() * 25), outOf: 100 }
      ]
    };
    
    return [generatedMovie];
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};
