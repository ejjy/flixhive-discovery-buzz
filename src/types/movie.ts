
export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
  runtime?: number;
  director?: string;
  cast?: string[];
  platforms?: string[];
  platformRatings?: {
    platform: string;
    score: number;
    outOf: number;
  }[];
}

export interface Review {
  id: number;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
}

export interface OTTPlatformPopularity {
  platform: string;
  rank?: number;
  trending?: boolean;
  note?: string;
}

export interface AIReview {
  summary: string;
  pros: string[];
  cons: string[];
  watchRecommendation: string;
  ottPopularity?: OTTPlatformPopularity[];
  error?: boolean;
  errorMessage?: string;
}
