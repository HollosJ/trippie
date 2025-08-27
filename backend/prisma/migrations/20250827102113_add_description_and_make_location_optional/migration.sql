-- AlterTable
ALTER TABLE "public"."Activity" ADD COLUMN     "description" TEXT,
ALTER COLUMN "location" DROP NOT NULL;
