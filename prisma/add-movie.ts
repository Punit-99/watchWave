import { prisma } from "../src/app/lib/prisma";

async function main() {
  console.log("Adding a new test movie to verify Hero Carousel sorting...");
  
  const movie = await prisma.content.create({
    data: {
      title: "Gladiator II",
      description: "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.",
      posterUrl: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=400",
      bannerUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200",
      releaseYear: 2024,
      language: ["ENGLISH"],
      genre: ["ACTION", "DRAMA"],
      tags: ["gladiator", "rome", "action", "new release"],
      ageRating: "R",
      type: "MOVIE",
      movie: {
        create: {
          duration: 148,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        },
      },
    },
  });

  console.log(`Successfully added test movie: "${movie.title}" with ID: ${movie.id}`);
}

main()
  .catch((e) => {
    console.error("Error adding test movie:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
