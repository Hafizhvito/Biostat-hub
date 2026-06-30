-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_quiz_questions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quiz_id" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "image_url" TEXT NOT NULL DEFAULT '',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "quiz_questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_quiz_questions" ("created_at", "id", "question_text", "quiz_id", "sort_order", "updated_at") SELECT "created_at", "id", "question_text", "quiz_id", "sort_order", "updated_at" FROM "quiz_questions";
DROP TABLE "quiz_questions";
ALTER TABLE "new_quiz_questions" RENAME TO "quiz_questions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
