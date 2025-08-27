/*
  Warnings:

  - Added the required column `location` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Activity" ADD COLUMN     "location" TEXT NOT NULL;
