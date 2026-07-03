-- Kuis mandiri: judul sendiri, tidak terikat materi (section)
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_quizzes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT 'Kuis',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

INSERT INTO "new_quizzes" ("id", "title", "sort_order", "created_at", "updated_at")
SELECT
    q."id",
    COALESCE(s."name", 'Kuis'),
    COALESCE(s."sort_order", 0),
    q."created_at",
    q."updated_at"
FROM "quizzes" q
LEFT JOIN "sections" s ON s."id" = q."section_id";

DROP TABLE "quizzes";
ALTER TABLE "new_quizzes" RENAME TO "quizzes";

PRAGMA foreign_keys=ON;
