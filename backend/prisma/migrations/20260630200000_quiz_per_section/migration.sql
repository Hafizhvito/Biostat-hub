-- Pindahkan kuis dari per-video ke per-materi (section)
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_quizzes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "section_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "quizzes_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_quizzes" ("id", "section_id", "created_at", "updated_at")
SELECT q."id", v."section_id", q."created_at", q."updated_at"
FROM "quizzes" q
INNER JOIN "videos" v ON v."id" = q."video_id";

DROP TABLE "quizzes";
ALTER TABLE "new_quizzes" RENAME TO "quizzes";
CREATE UNIQUE INDEX "quizzes_section_id_key" ON "quizzes"("section_id");

PRAGMA foreign_keys=ON;
