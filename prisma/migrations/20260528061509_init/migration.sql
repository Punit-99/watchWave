-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('MOVIE', 'SERIES');

-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('ACTION', 'COMEDY', 'DRAMA', 'HORROR', 'ROMANCE', 'SCIFI', 'THRILLER', 'ANIME', 'DOCUMENTARY');

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "bannerUrl" TEXT,
    "releaseYear" INTEGER,
    "language" TEXT,
    "genre" "Genre"[],
    "tags" TEXT[],
    "ageRating" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "type" "ContentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "videoUrl" TEXT,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "totalSeasons" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "episodeNumber" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "videoUrl" TEXT,
    "thumbnailUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_contentId_key" ON "Movie"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "Series_contentId_key" ON "Series"("contentId");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;
