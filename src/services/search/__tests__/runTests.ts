
import { describe, it, expect } from 'vitest';
import { SearchAnalysis } from '../types';
import { processNaturalLanguageQuery } from '../queryProcessor';
import { scoreMovie } from '../movieScoring';
import { generateMovie } from '../movieGenerator';
import { Movie } from '@/types/movie';

// Mock movie for testing
const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  overview: "A thriller about time travel with some comedy elements set in the 90s.",
  posterPath: "/path/to/poster.jpg",
  backdropPath: "/path/to/backdrop.jpg",
  releaseDate: "1995-03-15",
  voteAverage: 7.5,
  genres: ["Thriller", "Science Fiction", "Comedy"],
  runtime: 120,
  director: "Test Director",
  cast: ["Actor One", "Actor Two"],
  platforms: ["Netflix"],
  platformRatings: [
    { platform: "IMDb", score: 7.5, outOf: 10 },
    { platform: "Rotten Tomatoes", score: 85, outOf: 100 }
  ]
};

console.log("Running search module tests...");

// Test SearchAnalysis type
describe('SearchAnalysis Type', () => {
  it('should have the correct structure', () => {
    const analysis: SearchAnalysis = {
      keyTerms: ["test"],
      genres: ["action"],
      eras: ["90s"],
      moods: ["happy"],
      themes: ["love"],
      impliedIntent: "action movie",
      personType: "actor"
    };
    
    expect(analysis.keyTerms).toBeInstanceOf(Array);
    expect(analysis.genres).toBeInstanceOf(Array);
    expect(analysis.eras).toBeInstanceOf(Array);
    expect(analysis.moods).toBeInstanceOf(Array);
    expect(analysis.themes).toBeInstanceOf(Array);
    expect(typeof analysis.impliedIntent).toBe("string");
    expect(["actor", "director", "celebrity", undefined].includes(analysis.personType as any)).toBe(true);
    
    console.log("✓ SearchAnalysis type test passed");
  });
});

// Test processNaturalLanguageQuery
describe('processNaturalLanguageQuery', () => {
  it('should correctly analyze a simple query', () => {
    const query = "I want to watch a funny comedy from the 90s";
    const result = processNaturalLanguageQuery(query);
    
    expect(result.genres).toContain("comedy");
    expect(result.eras).toContain("90s");
    expect(result.moods).toContain("funny");
    
    console.log("✓ processNaturalLanguageQuery simple query test passed");
  });
  
  it('should identify a person query', () => {
    const query = "Movies with Tom Hanks";
    const result = processNaturalLanguageQuery(query);
    
    expect(result.personType).toBe("actor");
    expect(result.keyTerms).toContain("tom");
    expect(result.keyTerms).toContain("hanks");
    
    console.log("✓ processNaturalLanguageQuery person query test passed");
  });
});

// Test scoreMovie
describe('scoreMovie', () => {
  it('should score a movie based on matching criteria', () => {
    const query = "thriller time travel";
    const analysis: SearchAnalysis = {
      keyTerms: ["thriller", "time", "travel"],
      genres: ["thriller"],
      eras: [],
      moods: [],
      themes: ["time travel"],
      impliedIntent: "thriller movie"
    };
    
    const score = scoreMovie(mockMovie, query, analysis);
    expect(score).toBeGreaterThan(0);
    
    // The movie should have a higher score due to matching title, genre, and theme
    const lowMatchMovie: Movie = {
      ...mockMovie,
      title: "Unrelated Title",
      overview: "Nothing matching here",
      genres: ["Romance"]
    };
    const lowScore = scoreMovie(lowMatchMovie, query, analysis);
    
    expect(score).toBeGreaterThan(lowScore);
    
    console.log("✓ scoreMovie test passed");
  });
});

// Test generateMovie
describe('generateMovie', () => {
  it('should generate a movie based on the query and analysis', () => {
    const query = "sci-fi movie about robots in the future";
    const analysis: SearchAnalysis = {
      keyTerms: ["robots", "future"],
      genres: ["sci-fi"],
      eras: ["future"],
      moods: [],
      themes: ["robots"],
      impliedIntent: "science fiction"
    };
    
    const generatedMovie = generateMovie(query, analysis);
    
    expect(generatedMovie.id).toBeGreaterThan(1000); // Generated movie IDs start at 1000
    expect(generatedMovie.title).toBeTruthy();
    expect(generatedMovie.overview).toContain("robots");
    expect(generatedMovie.genres).toContain("Science Fiction");
    
    console.log("✓ generateMovie test passed");
  });
});

console.log("All tests completed!");
