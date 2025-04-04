
import { Movie, Review, AIReview, OTTPlatformPopularity } from "@/types/movie";

// Mock movie data
export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Dune: Part Two",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
    posterPath: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/wRYZlWi3HuXsXEClFrHEKXzfL2l.jpg",
    releaseDate: "2024-03-01",
    voteAverage: 8.6,
    genres: ["Science Fiction", "Adventure", "Drama"],
    runtime: 166,
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Josh Brolin"],
    platforms: ["HBO Max", "Theaters"],
    platformRatings: [
      { platform: "IMDb", score: 8.5, outOf: 10 },
      { platform: "Rotten Tomatoes", score: 92, outOf: 100 },
      { platform: "Metacritic", score: 79, outOf: 100 }
    ]
  },
  {
    id: 2,
    title: "Oppenheimer",
    overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    posterPath: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    releaseDate: "2023-07-21",
    voteAverage: 8.2,
    genres: ["Drama", "History", "Thriller"],
    runtime: 180,
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
    platforms: ["Prime Video", "Apple TV"],
    platformRatings: [
      { platform: "IMDb", score: 8.3, outOf: 10 },
      { platform: "Rotten Tomatoes", score: 93, outOf: 100 },
      { platform: "Metacritic", score: 88, outOf: 100 }
    ]
  },
  {
    id: 3,
    title: "Poor Things",
    overview: "The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.",
    posterPath: "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/hzZ1Qe7HumjVrpK4PU8qzlJgZuS.jpg",
    releaseDate: "2023-12-08",
    voteAverage: 7.9,
    genres: ["Science Fiction", "Romance", "Comedy"],
    runtime: 141,
    director: "Yorgos Lanthimos",
    cast: ["Emma Stone", "Mark Ruffalo", "Willem Dafoe", "Ramy Youssef"],
    platforms: ["Hulu", "Disney+"],
    platformRatings: [
      { platform: "IMDb", score: 7.8, outOf: 10 },
      { platform: "Rotten Tomatoes", score: 92, outOf: 100 },
      { platform: "Metacritic", score: 87, outOf: 100 }
    ]
  },
  {
    id: 4,
    title: "The Batman",
    overview: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    posterPath: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/5P8SmMzSNYikXpxil6BYzJ16611.jpg",
    releaseDate: "2022-03-04",
    voteAverage: 7.7,
    genres: ["Crime", "Mystery", "Action"],
    runtime: 176,
    director: "Matt Reeves",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Jeffrey Wright", "Colin Farrell"],
    platforms: ["HBO Max", "Netflix"],
    platformRatings: [
      { platform: "IMDb", score: 7.8, outOf: 10 },
      { platform: "Rotten Tomatoes", score: 85, outOf: 100 },
      { platform: "Metacritic", score: 72, outOf: 100 }
    ]
  },
  {
    id: 5,
    title: "Everything Everywhere All at Once",
    overview: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.",
    posterPath: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/9n2tJBplPbgR2ca05hS5CKXwP2c.jpg",
    releaseDate: "2022-03-25",
    voteAverage: 8.0,
    genres: ["Action", "Adventure", "Science Fiction"],
    runtime: 139,
    director: "Daniel Kwan, Daniel Scheinert",
    cast: ["Michelle Yeoh", "Ke Huy Quan", "Stephanie Hsu", "Jamie Lee Curtis"],
    platforms: ["Netflix", "Showtime"],
    platformRatings: [
      { platform: "IMDb", score: 7.8, outOf: 10 },
      { platform: "Rotten Tomatoes", score: 94, outOf: 100 },
      { platform: "Metacritic", score: 81, outOf: 100 }
    ]
  },
  {
    id: 6,
    title: "Killers of the Flower Moon",
    overview: "Members of the Osage tribe in the United States are murdered under mysterious circumstances in the 1920s, sparking a major F.B.I. investigation involving J. Edgar Hoover.",
    posterPath: "https://image.tmdb.org/t/p/w500/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg",
    backdropPath: "https://image.tmdb.org/t/p/original/1X7vow16X7CnCoexXh4H4F2yDJv.jpg",
    releaseDate: "2023-10-20",
    voteAverage: 7.5,
    genres: ["Crime", "Drama", "History"],
    runtime: 206,
    director: "Martin Scorsese",
    cast: ["Leonardo DiCaprio", "Robert De Niro", "Lily Gladstone", "Jesse Plemons"],
    platforms: ["Apple TV+"],
    platformRatings: [
      { platform: "IMDb", score: 7.7, outOf: 10 },
      { platform: "Rotten Tomatoes", score: 93, outOf: 100 },
      { platform: "Metacritic", score: 89, outOf: 100 }
    ]
  },
];

// Mock reviews data
export const mockReviews: { [key: number]: Review[] } = {
  1: [
    {
      id: 101,
      author: "MovieBuff42",
      content: "Denis Villeneuve delivers a visually stunning and emotionally resonant continuation of the Dune saga. The world-building is meticulous and the performances are outstanding, especially Zendaya who gets much more screen time.",
      rating: 9,
      createdAt: "2024-03-05T14:22:00Z"
    },
    {
      id: 102,
      author: "SciFiLover",
      content: "An epic masterpiece that expands on the first film in every way. The visuals are breathtaking and Hans Zimmer's score is transcendent.",
      rating: 10,
      createdAt: "2024-03-02T09:15:00Z"
    }
  ],
  2: [
    {
      id: 201,
      author: "FilmCritic88",
      content: "Nolan crafts a biographical thriller that's as ambitious as its subject. Cillian Murphy delivers a career-defining performance as the tortured genius behind the atomic bomb.",
      rating: 9,
      createdAt: "2023-07-25T16:45:00Z"
    }
  ]
};

// Mock AI reviews with OTT popularity data
export const mockAIReviews: { [key: number]: AIReview } = {
  1: {
    summary: "Dune: Part Two is a visually stunning and emotionally profound continuation of the epic saga, with expanded roles for previously underutilized characters and breathtaking desert action sequences.",
    pros: [
      "Spectacular visuals and world-building",
      "Expanded character development, especially for Zendaya's Chani",
      "Impressive action sequences",
      "Hans Zimmer's immersive score"
    ],
    cons: [
      "Some viewers might find the 166-minute runtime challenging",
      "Complex political elements may confuse those unfamiliar with the source material"
    ],
    watchRecommendation: "Must-watch for sci-fi fans and anyone who enjoyed the first part",
    ottPopularity: [
      {
        platform: "HBO Max",
        rank: 1,
        trending: true,
        note: "Currently #1 trending movie on HBO Max"
      },
      {
        platform: "Prime Video",
        trending: true,
        note: "Among top 5 most watched movies this week"
      }
    ]
  },
  2: {
    summary: "Oppenheimer is a technical masterpiece and historical epic, with Christopher Nolan delivering a nuanced character study anchored by Cillian Murphy's remarkable performance as the conflicted father of the atomic bomb.",
    pros: [
      "Cillian Murphy's transformative performance",
      "Masterful direction from Christopher Nolan",
      "Complex moral storytelling",
      "Outstanding supporting cast"
    ],
    cons: [
      "The three-hour runtime may be demanding for some viewers",
      "Non-linear narrative style can be occasionally challenging to follow"
    ],
    watchRecommendation: "Essential viewing for history buffs and cinephiles seeking thought-provoking entertainment",
    ottPopularity: [
      {
        platform: "Netflix",
        rank: 3,
        trending: true,
        note: "Currently in Netflix Top 10 Movies"
      },
      {
        platform: "Prime Video",
        trending: false,
        note: "Recently added to the platform"
      }
    ]
  },
  3: {
    summary: "Poor Things is a bizarre, beautiful, and bold reimagining of the Frankenstein story, with Emma Stone delivering a fearless performance in Yorgos Lanthimos's visually spectacular and thematically rich world.",
    pros: [
      "Emma Stone's fearless, transformative performance",
      "Stunning visual design and world-building",
      "Bold, unique storytelling approach",
      "Thought-provoking themes about autonomy and discovery"
    ],
    cons: [
      "The film's explicit content and oddity may alienate some viewers",
      "The unconventional pacing takes some adjustment"
    ],
    watchRecommendation: "A must-see for fans of bold, artistic cinema willing to embrace the unusual",
    ottPopularity: [
      {
        platform: "Hulu",
        trending: true,
        note: "Currently trending on Hulu"
      },
      {
        platform: "Disney+",
        rank: 7,
        trending: true,
        note: "Recently added to Disney+ with strong viewer numbers"
      }
    ]
  },
  4: {
    summary: "The Batman reinvents the Dark Knight with a noir-detective approach, showcasing Robert Pattinson's intense portrayal in a rain-soaked, atmospheric Gotham that feels both fresh and faithful to the character's roots.",
    pros: [
      "Atmospheric, noir-influenced detective story",
      "Robert Pattinson's brooding, intense Batman",
      "Stunning cinematography and production design",
      "Compelling villain portrayals, especially Colin Farrell's unrecognizable Penguin"
    ],
    cons: [
      "The nearly three-hour runtime might test some viewers' patience",
      "The consistently dark tone offers little levity"
    ],
    watchRecommendation: "Essential viewing for Batman fans and those who appreciate darker, detective-focused superhero stories",
    ottPopularity: [
      {
        platform: "HBO Max",
        trending: true,
        note: "Consistently popular on HBO Max since release"
      },
      {
        platform: "Netflix",
        trending: false,
        note: "Recently added to Netflix catalog"
      }
    ]
  },
  5: {
    summary: "Everything Everywhere All at Once is a genre-defying masterpiece that blends science fiction, martial arts, comedy, and family drama into a visually inventive and emotionally resonant experience anchored by Michelle Yeoh's stellar performance.",
    pros: [
      "Wildly inventive multiverse concept and execution",
      "Michelle Yeoh's tour de force performance",
      "Surprisingly emotional family story beneath the chaos",
      "Unique visual style and creative action sequences"
    ],
    cons: [
      "The frenetic pacing and visual chaos might overwhelm some viewers",
      "Abstract concepts may be confusing without total engagement"
    ],
    watchRecommendation: "A must-watch for anyone seeking fresh, boundary-pushing filmmaking that balances heart with spectacle",
    ottPopularity: [
      {
        platform: "Netflix",
        rank: 2,
        trending: true,
        note: "Currently #2 trending film on Netflix"
      },
      {
        platform: "Showtime",
        trending: true,
        note: "Among most-watched content on Showtime"
      }
    ]
  },
  6: {
    summary: "Killers of the Flower Moon is a meticulously crafted historical epic that exposes a dark chapter in American history, featuring exceptional performances from Leonardo DiCaprio, Robert De Niro, and a breakthrough turn from Lily Gladstone.",
    pros: [
      "Powerful storytelling of a little-known historical tragedy",
      "Exceptional performances, particularly from Lily Gladstone",
      "Scorsese's masterful direction and attention to period detail",
      "Robbie Robertson's haunting final score"
    ],
    cons: [
      "The three-and-a-half-hour runtime requires viewer commitment",
      "Deliberately methodical pacing may test patience"
    ],
    watchRecommendation: "Essential viewing for those interested in American history and appreciate methodical, character-driven storytelling",
    ottPopularity: [
      {
        platform: "Apple TV+",
        rank: 1,
        trending: true,
        note: "Top performing original film on Apple TV+"
      }
    ]
  }
};
