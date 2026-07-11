/*
  Warnings:

  - Added the required column `totalPrice` to the `rental_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rental_requests" ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;
