import { prisma } from "../src/app/lib/prisma";

const moviesData = [
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400",
    bannerUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200",
    releaseYear: 2014,
    language: ["ENGLISH"],
    genre: ["SCIFI", "DRAMA"],
    tags: ["space", "christopher nolan", "mind bending"],
    ageRating: "PG13",
    duration: 169,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    posterUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400",
    bannerUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200",
    releaseYear: 2008,
    language: ["ENGLISH"],
    genre: ["ACTION", "THRILLER"],
    tags: ["batman", "joker", "dc comics"],
    ageRating: "PG13",
    duration: 152,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200",
    releaseYear: 2010,
    language: ["ENGLISH", "FRENCH"],
    genre: ["SCIFI", "ACTION", "THRILLER"],
    tags: ["dreams", "leo dicaprio", "heist"],
    ageRating: "PG13",
    duration: 148,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    title: "Spirited Away",
    description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400",
    bannerUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200",
    releaseYear: 2001,
    language: ["JAPANESE", "ENGLISH"],
    genre: ["ANIME", "DRAMA"],
    tags: ["ghibli", "classic", "fantasy"],
    ageRating: "G",
    duration: 125,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    title: "Parasite",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400",
    bannerUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200",
    releaseYear: 2019,
    language: ["KOREAN"],
    genre: ["THRILLER", "DRAMA"],
    tags: ["oscar winner", "class struggle", "bong joon ho"],
    ageRating: "R",
    duration: 132,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    title: "Whiplash",
    description: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    posterUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=400",
    bannerUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200",
    releaseYear: 2014,
    language: ["ENGLISH"],
    genre: ["DRAMA"],
    tags: ["jazz", "drums", "intensity"],
    ageRating: "R",
    duration: 107,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    title: "The Hangover",
    description: "Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing.",
    posterUrl: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=400",
    bannerUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200",
    releaseYear: 2009,
    language: ["ENGLISH"],
    genre: ["COMEDY"],
    tags: ["vegas", "bachelor party", "hilarious"],
    ageRating: "R",
    duration: 100,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  },
  {
    title: "Get Out",
    description: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception eventually reaches a boiling point.",
    posterUrl: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=400",
    bannerUrl: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?q=80&w=1200",
    releaseYear: 2017,
    language: ["ENGLISH"],
    genre: ["HORROR", "THRILLER"],
    tags: ["jordan peele", "mystery", "social commentary"],
    ageRating: "R",
    duration: 104,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  },
  {
    title: "The Notebook",
    description: "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.",
    posterUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400",
    bannerUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200",
    releaseYear: 2004,
    language: ["ENGLISH"],
    genre: ["ROMANCE", "DRAMA"],
    tags: ["love story", "classic romance", "emotional"],
    ageRating: "PG13",
    duration: 123,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
  {
    title: "Free Solo",
    description: "Alex Honnold attempts to conquer the first free solo climb of the famed 3,000-foot El Capitan's wall in Yosemite National Park.",
    posterUrl: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=400",
    bannerUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200",
    releaseYear: 2018,
    language: ["ENGLISH"],
    genre: ["DOCUMENTARY"],
    tags: ["climbing", "adventure", "extreme sports"],
    ageRating: "PG",
    duration: 100,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  },
];

const seriesNames = [
  "Breaking Bad",
  "Stranger Things",
  "Game of Thrones",
  "Attack on Titan",
  "The Office",
  "Dark",
  "Planet Earth II",
  "Friends",
  "Haunting of Hill House",
  "Normal People",
];

const seriesData = seriesNames.map((name, sIdx) => {
  const genres = [["DRAMA", "THRILLER"], ["SCIFI", "HORROR"], ["DRAMA", "ACTION"], ["ANIME", "ACTION"], ["COMEDY"], ["SCIFI", "THRILLER"], ["DOCUMENTARY"], ["COMEDY", "ROMANCE"], ["HORROR", "DRAMA"], ["ROMANCE", "DRAMA"]];
  const ageRatings = ["R", "PG13", "R", "R", "PG13", "R", "G", "PG13", "R", "R"];
  
  return {
    title: name,
    description: `An amazing episodic show about ${name}. Explore multiple seasons of dramatic turns, adventure, and incredible storylines.`,
    posterUrl: `https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400&sig=${sIdx}`,
    bannerUrl: `https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&sig=${sIdx}`,
    releaseYear: 2010 + sIdx,
    language: ["ENGLISH"],
    genre: genres[sIdx],
    tags: [name.toLowerCase().replace(" ", ""), "tvshow", "popular"],
    ageRating: ageRatings[sIdx],
    seasons: [
      {
        seasonNumber: 1,
        episodes: Array.from({ length: 5 }).map((_, epIdx) => ({
          episodeNumber: epIdx + 1,
          title: `Episode ${epIdx + 1}: The Beginning of ${name}`,
          description: `This is the description for episode ${epIdx + 1} of season 1. Things are starting to heat up in Gotham/the world of ${name}.`,
          duration: 40 + epIdx * 5,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          thumbnailUrl: `https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=300&sig=${sIdx * 10 + epIdx}`,
        })),
      },
      {
        seasonNumber: 2,
        episodes: Array.from({ length: 5 }).map((_, epIdx) => ({
          episodeNumber: epIdx + 1,
          title: `Episode ${epIdx + 1}: The Journey Continues`,
          description: `This is the description for episode ${epIdx + 1} of season 2. The stakes are higher than ever for the characters of ${name}.`,
          duration: 45 + epIdx * 3,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          thumbnailUrl: `https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=300&sig=${sIdx * 10 + 5 + epIdx}`,
        })),
      },
    ],
  };
});

async function main() {
  console.log("Cleaning up existing data...");
  await prisma.content.deleteMany();

  console.log("Seeding Movies...");
  for (const movie of moviesData) {
    await prisma.content.create({
      data: {
        title: movie.title,
        description: movie.description,
        posterUrl: movie.posterUrl,
        bannerUrl: movie.bannerUrl,
        releaseYear: movie.releaseYear,
        language: movie.language as any,
        genre: movie.genre as any,
        tags: movie.tags,
        ageRating: movie.ageRating as any,
        type: "MOVIE",
        movie: {
          create: {
            duration: movie.duration,
            videoUrl: movie.videoUrl,
          },
        },
      },
    });
  }

  console.log("Seeding Series...");
  for (const series of seriesData) {
    await prisma.content.create({
      data: {
        title: series.title,
        description: series.description,
        posterUrl: series.posterUrl,
        bannerUrl: series.bannerUrl,
        releaseYear: series.releaseYear,
        language: series.language as any,
        genre: series.genre as any,
        tags: series.tags,
        ageRating: series.ageRating as any,
        type: "SERIES",
        series: {
          create: {
            totalSeasons: series.seasons.length,
            seasons: {
              create: series.seasons.map((season) => ({
                seasonNumber: season.seasonNumber,
                episodes: {
                  create: season.episodes.map((ep) => ({
                    episodeNumber: ep.episodeNumber,
                    title: ep.title,
                    description: ep.description,
                    duration: ep.duration,
                    videoUrl: ep.videoUrl,
                    thumbnailUrl: ep.thumbnailUrl,
                  })),
                },
              })),
            },
          },
        },
      },
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
