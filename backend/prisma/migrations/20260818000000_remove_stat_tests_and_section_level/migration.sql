-- Remove unused stat_tests table and section level filter column
PRAGMA foreign_keys=OFF;

DROP TABLE IF EXISTS "stat_tests";
ALTER TABLE "sections" DROP COLUMN "level";

PRAGMA foreign_keys=ON;
