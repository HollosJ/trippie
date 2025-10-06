/*
  Warnings:

  - You are about to drop the column `emojiSlug` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Trip" DROP COLUMN "emojiSlug",
ADD COLUMN     "emoji" TEXT;
