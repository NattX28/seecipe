/*
  Warnings:

  - The `instructions` column on the `recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "recipe" DROP COLUMN "instructions",
ADD COLUMN     "instructions" JSONB;
