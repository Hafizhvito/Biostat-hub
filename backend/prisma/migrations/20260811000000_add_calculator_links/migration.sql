CREATE TABLE "calculator_links" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "calculator_links" ("title", "url", "sort_order")
SELECT 'Kalkulator Sampel', "calculator_url", 1
FROM "site_settings"
WHERE "id" = 1 AND "calculator_url" != '';
