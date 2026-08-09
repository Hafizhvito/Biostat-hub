-- Refactor stat_tests to title + description + image (same shape as wizard)
PRAGMA foreign_keys=OFF;

DROP TABLE IF EXISTS "stat_tests";

CREATE TABLE "stat_tests" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "filename" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

PRAGMA foreign_keys=ON;
