# Biostat Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public biostatistics learning platform (videos + quizzes) with an admin panel for content management, runnable with zero videos until the client provides content.

**Architecture:** Monorepo with Next.js frontend (Vercel/Netlify) and Express + Prisma + SQLite backend (VPS). All content is database-driven. Public pages degrade gracefully when sections/videos are empty.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Node.js, Express, Prisma, SQLite, Zod, JWT, lucide-react

**Design direction:** Educational content site inspired by Ruang Guru — clear hierarchy, approachable but professional, content-first layout. Color palette: clean blues/teals with warm white backgrounds (not generic AI purple gradients). Implementer has discretion to tune exact shades; anchor on readability and credibility for medical faculty context.

---

## File Map (created by this plan)

```
Biostat_Hub/
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   ├── .env.local.example
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── not-found.tsx
│       │   ├── globals.css
│       │   ├── section/[id]/page.tsx
│       │   ├── video/[id]/page.tsx
│       │   ├── quiz/[videoId]/page.tsx
│       │   └── admin/
│       │       ├── layout.tsx
│       │       ├── login/page.tsx
│       │       ├── sections/page.tsx
│       │       ├── videos/page.tsx
│       │       ├── quizzes/page.tsx
│       │       └── settings/page.tsx
│       ├── components/
│       │   ├── layout/SiteHeader.tsx
│       │   ├── layout/SiteFooter.tsx
│       │   ├── layout/AdminLayout.tsx
│       │   ├── ui/Button.tsx
│       │   ├── ui/Card.tsx
│       │   ├── ui/Input.tsx
│       │   ├── ui/Textarea.tsx
│       │   ├── ui/Select.tsx
│       │   ├── ui/EmptyState.tsx
│       │   ├── ui/ConfirmDialog.tsx
│       │   ├── home/HeroSection.tsx
│       │   ├── home/SectionGrid.tsx
│       │   ├── section/VideoGrid.tsx
│       │   ├── video/YouTubePlayer.tsx
│       │   ├── quiz/QuizForm.tsx
│       │   ├── quiz/QuizResult.tsx
│       │   └── admin/ReorderButtons.tsx
│       └── lib/
│           ├── api.ts
│           ├── auth.ts
│           └── youtube.ts
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/env.js
│   │   ├── lib/prisma.js
│   │   ├── middleware/auth.js
│   │   ├── middleware/errorHandler.js
│   │   ├── utils/youtube.js
│   │   ├── validators/
│   │   │   ├── section.js
│   │   │   ├── video.js
│   │   │   ├── quiz.js
│   │   │   └── settings.js
│   │   ├── services/quizGrading.js
│   │   ├── controllers/
│   │   │   ├── public/
│   │   │   │   ├── settingsController.js
│   │   │   │   ├── sectionController.js
│   │   │   │   ├── videoController.js
│   │   │   │   └── quizController.js
│   │   │   └── admin/
│   │   │       ├── authController.js
│   │   │       ├── settingsController.js
│   │   │       ├── sectionController.js
│   │   │       ├── videoController.js
│   │   │       └── quizController.js
│   │   └── routes/
│   │       ├── index.js
│   │       ├── public.js
│   │       └── admin.js
│   └── tests/
│       └── quizGrading.test.js
├── .gitignore
└── README.md
```

---

## Empty-State Behavior (required)

The site MUST work with zero videos. Implement these states:

| Page | Condition | UI |
|------|-----------|-----|
| Beranda | 0 sections | Hero + stats show `0` + EmptyState: "Belum ada materi. Materi akan segera ditambahkan." |
| Beranda | sections exist, 0 videos total | Hero + section grid works; stats show `0` videos |
| `/section/[id]` | 0 videos in section | Section header + EmptyState: "Belum ada video di materi ini." |
| `/video/[id]` | video not found | 404 page |
| `/quiz/[videoId]` | no quiz | Redirect or message: "Kuis belum tersedia untuk video ini." |
| Admin lists | empty | Table area shows: "Belum ada data. Klik Tambah Baru untuk memulai." |

Seed ships with **admin account + site_settings only**. No placeholder sections/videos unless developer wants demo data — client fills content via admin tomorrow.

---

## Task 1: Monorepo Scaffold

**Files:**
- Create: `.gitignore`, `README.md`, `backend/package.json`, `frontend/package.json`

- [ ] **Step 1: Create root `.gitignore`**

```gitignore
node_modules/
.env
.env.local
*.db
*.db-journal
dist/
.next/
.DS_Store
```

- [ ] **Step 2: Create `backend/package.json`**

```json
{
  "name": "biostat-hub-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:reset": "prisma migrate reset",
    "test": "node --test tests/"
  },
  "prisma": {
    "seed": "node prisma/seed.js"
  },
  "dependencies": {
    "@prisma/client": "^6.0.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "prisma": "^6.0.0"
  }
}
```

- [ ] **Step 3: Scaffold Next.js frontend**

Run from repo root:
```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack
```

- [ ] **Step 4: Add frontend dependencies**

```bash
cd frontend
npm install lucide-react
```

- [ ] **Step 5: Create root `README.md`** with dev instructions (two terminals: `backend npm run dev` on :3001, `frontend npm run dev` on :3000).

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: scaffold monorepo with Next.js and Express"
```

---

## Task 2: Prisma Schema & Migration

**Files:**
- Create: `backend/prisma/schema.prisma`, `backend/src/lib/prisma.js`, `backend/.env.example`

- [ ] **Step 1: Create `backend/.env.example`**

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="ganti-dengan-string-panjang-random"
JWT_EXPIRES_IN="7d"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="ganti-password-aman"
CORS_ORIGIN="http://localhost:3000"
PORT=3001
```

- [ ] **Step 2: Copy to `backend/.env`** (local only, not committed)

- [ ] **Step 3: Write `backend/prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Section {
  id          Int      @id @default(autoincrement())
  name        String
  description String   @default("")
  sortOrder   Int      @default(0) @map("sort_order")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  videos      Video[]

  @@map("sections")
}

model Video {
  id          Int      @id @default(autoincrement())
  sectionId   Int      @map("section_id")
  title       String
  youtubeUrl  String   @map("youtube_url")
  description String   @default("")
  sortOrder   Int      @default(0) @map("sort_order")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  section     Section  @relation(fields: [sectionId], references: [id], onDelete: Restrict)
  quiz        Quiz?

  @@map("videos")
}

model Quiz {
  id        Int            @id @default(autoincrement())
  videoId   Int            @unique @map("video_id")
  createdAt DateTime       @default(now()) @map("created_at")
  updatedAt DateTime       @updatedAt @map("updated_at")
  video     Video          @relation(fields: [videoId], references: [id], onDelete: Cascade)
  questions QuizQuestion[]

  @@map("quizzes")
}

model QuizQuestion {
  id           Int          @id @default(autoincrement())
  quizId       Int          @map("quiz_id")
  questionText String       @map("question_text")
  sortOrder    Int          @default(0) @map("sort_order")
  createdAt    DateTime     @default(now()) @map("created_at")
  updatedAt    DateTime     @updatedAt @map("updated_at")
  quiz         Quiz         @relation(fields: [quizId], references: [id], onDelete: Cascade)
  options      QuizOption[]

  @@map("quiz_questions")
}

model QuizOption {
  id         Int          @id @default(autoincrement())
  questionId Int          @map("question_id")
  optionText String       @map("option_text")
  isCorrect  Boolean      @default(false) @map("is_correct")
  sortOrder  Int          @default(0) @map("sort_order")
  question   QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@map("quiz_options")
}

model AdminUser {
  id           Int      @id @default(autoincrement())
  username     String   @unique
  passwordHash String   @map("password_hash")
  createdAt    DateTime @default(now()) @map("created_at")

  @@map("admin_users")
}

model SiteSettings {
  id              Int      @id @default(1)
  heroTitle       String   @map("hero_title")
  heroDescription String   @map("hero_description")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("site_settings")
}
```

- [ ] **Step 4: Create `backend/src/lib/prisma.js`**

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;
```

- [ ] **Step 5: Run migration**

```bash
cd backend
npm install
npx prisma migrate dev --name init
```

Expected: `dev.db` created, migrations applied.

- [ ] **Step 6: Commit**

```bash
git add backend/prisma backend/src/lib backend/.env.example
git commit -m "feat: add Prisma schema and initial migration"
```

---

## Task 3: Database Seed (Admin + Settings Only)

**Files:**
- Create: `backend/prisma/seed.js`

- [ ] **Step 1: Write `backend/prisma/seed.js`**

```javascript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

  await prisma.adminUser.upsert({
    where: { username: process.env.ADMIN_USERNAME || 'admin' },
    update: {},
    create: {
      username: process.env.ADMIN_USERNAME || 'admin',
      passwordHash,
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroTitle: 'Biostat Hub',
      heroDescription:
        'Platform pembelajaran mandiri uji statistik dan pengolahan data SPSS — Fakultas Kedokteran YARSI.',
    },
  });

  console.log('Seed selesai: admin + pengaturan beranda.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 2: Run seed**

```bash
cd backend
npm run db:seed
```

Expected: `Seed selesai: admin + pengaturan beranda.`

- [ ] **Step 3: Commit**

```bash
git add backend/prisma/seed.js
git commit -m "feat: seed admin user and site settings"
```

---

## Task 4: Express App Core

**Files:**
- Create: `backend/src/config/env.js`, `backend/src/middleware/errorHandler.js`, `backend/src/app.js`, `backend/src/server.js`

- [ ] **Step 1: Write `backend/src/config/env.js`**

```javascript
import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
```

- [ ] **Step 2: Write `backend/src/middleware/errorHandler.js`**

```javascript
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Terjadi kesalahan. Silakan coba lagi.';
  if (status >= 500) console.error(err);
  res.status(status).json({ error: message });
}

export function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
```

- [ ] **Step 3: Write `backend/src/app.js`**

```javascript
import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

export default app;
```

- [ ] **Step 4: Write `backend/src/server.js`**

```javascript
import app from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.log(`API berjalan di http://localhost:${env.port}`);
});
```

- [ ] **Step 5: Write stub `backend/src/routes/index.js`**

```javascript
import { Router } from 'express';
const router = Router();
router.get('/health', (req, res) => res.json({ status: 'ok' }));
export default router;
```

- [ ] **Step 6: Verify**

```bash
cd backend && npm run dev
curl http://localhost:3001/api/health
```

Expected: `{"status":"ok"}`

- [ ] **Step 7: Commit**

```bash
git add backend/src
git commit -m "feat: express app core with health endpoint"
```

---

## Task 5: YouTube URL Utility

**Files:**
- Create: `backend/src/utils/youtube.js`, `frontend/src/lib/youtube.ts`

- [ ] **Step 1: Write `backend/src/utils/youtube.js`**

```javascript
export function extractYouTubeId(url) {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
```

- [ ] **Step 2: Write `frontend/src/lib/youtube.ts`** (same logic, TypeScript)

- [ ] **Step 3: Commit**

```bash
git add backend/src/utils/youtube.js frontend/src/lib/youtube.ts
git commit -m "feat: youtube url parser utility"
```

---

## Task 6: Quiz Grading Service (with test)

**Files:**
- Create: `backend/src/services/quizGrading.js`, `backend/tests/quizGrading.test.js`

- [ ] **Step 1: Write failing test `backend/tests/quizGrading.test.js`**

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gradeQuiz } from '../src/services/quizGrading.js';

test('gradeQuiz returns score and per-question results', () => {
  const questions = [
    { id: 1, options: [{ id: 10, isCorrect: true }, { id: 11, isCorrect: false }] },
    { id: 2, options: [{ id: 20, isCorrect: false }, { id: 21, isCorrect: true }] },
  ];
  const answers = [
    { question_id: 1, option_id: 10 },
    { question_id: 2, option_id: 20 },
  ];
  const result = gradeQuiz(questions, answers);
  assert.equal(result.score, 1);
  assert.equal(result.total, 2);
  assert.equal(result.results[0].is_correct, true);
  assert.equal(result.results[1].is_correct, false);
});

test('gradeQuiz rejects unanswered questions', () => {
  const questions = [{ id: 1, options: [{ id: 10, isCorrect: true }] }];
  const answers = [];
  assert.throws(() => gradeQuiz(questions, answers), /semua soal/i);
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
cd backend && npm test
```

- [ ] **Step 3: Implement `backend/src/services/quizGrading.js`**

```javascript
import { createError } from '../middleware/errorHandler.js';

export function gradeQuiz(questions, answers) {
  if (answers.length !== questions.length) {
    throw createError(422, 'Mohon jawab semua soal sebelum mengirim.');
  }

  const answerMap = new Map(answers.map((a) => [a.question_id, a.option_id]));
  const results = questions.map((q) => {
    const selectedId = answerMap.get(q.id);
    const correctOption = q.options.find((o) => o.isCorrect);
    const isCorrect = selectedId === correctOption?.id;
    return {
      question_id: q.id,
      selected_option_id: selectedId,
      correct_option_id: correctOption?.id,
      is_correct: isCorrect,
    };
  });

  const score = results.filter((r) => r.is_correct).length;
  return { score, total: questions.length, results };
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
cd backend && npm test
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/services backend/tests
git commit -m "feat: quiz grading service with unit tests"
```

---

## Task 7: Public API Endpoints

**Files:**
- Create: controllers + `backend/src/routes/public.js`
- Modify: `backend/src/routes/index.js`

- [ ] **Step 1: Implement `settingsController.js` (public)**

`GET /api/settings` → returns `{ hero_title, hero_description }`

- [ ] **Step 2: Implement `sectionController.js` (public)**

`GET /api/sections` → sections ordered by `sortOrder`, each with `_count: { videos }`, plus `stats: { total_sections, total_videos }`

`GET /api/sections/:id` → section + videos ordered by `sortOrder`

- [ ] **Step 3: Implement `videoController.js` (public)**

`GET /api/videos/:id` → video with section name, `has_quiz: boolean`, `youtube_id` extracted

- [ ] **Step 4: Implement `quizController.js` (public)**

`GET /api/videos/:id/quiz` → questions + options WITHOUT `is_correct`; 404 if no quiz

`POST /api/videos/:id/quiz/submit` → body `{ answers: [{ question_id, option_id }] }`, uses `gradeQuiz`

- [ ] **Step 5: Wire `backend/src/routes/public.js`**

```javascript
import { Router } from 'express';
import * as settings from '../controllers/public/settingsController.js';
import * as sections from '../controllers/public/sectionController.js';
import * as videos from '../controllers/public/videoController.js';
import * as quiz from '../controllers/public/quizController.js';

const router = Router();
router.get('/settings', settings.get);
router.get('/sections', sections.list);
router.get('/sections/:id', sections.getById);
router.get('/videos/:id', videos.getById);
router.get('/videos/:id/quiz', quiz.getByVideoId);
router.post('/videos/:id/quiz/submit', quiz.submit);
export default router;
```

- [ ] **Step 6: Mount in `routes/index.js`**

```javascript
import publicRoutes from './public.js';
router.use('/', publicRoutes);
```

- [ ] **Step 7: Manual test with empty DB**

```bash
curl http://localhost:3001/api/sections
```

Expected: `{ "sections": [], "stats": { "total_sections": 0, "total_videos": 0 } }`

- [ ] **Step 8: Commit**

```bash
git commit -m "feat: public API endpoints for settings, sections, videos, quiz"
```

---

## Task 8: Admin Auth Middleware & Login

**Files:**
- Create: `backend/src/middleware/auth.js`, `backend/src/controllers/admin/authController.js`
- Modify: `backend/src/routes/admin.js`, `backend/src/routes/index.js`

- [ ] **Step 1: Write `backend/src/middleware/auth.js`**

```javascript
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { createError } from './errorHandler.js';

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(createError(401, 'Silakan login terlebih dahulu.'));
  }
  try {
    const token = header.slice(7);
    req.admin = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    next(createError(401, 'Sesi login telah berakhir. Silakan login kembali.'));
  }
}
```

- [ ] **Step 2: Implement `authController.js`**

`POST /api/admin/login` — validate username/password with bcrypt, return `{ token, expires_in }`

- [ ] **Step 3: Test login**

```bash
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_PASSWORD"}'
```

Expected: `{ "token": "...", "expires_in": "7d" }`

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: admin JWT authentication"
```

---

## Task 9: Admin CRUD API

**Files:**
- Create: admin controllers, validators, `backend/src/routes/admin.js`

- [ ] **Step 1: Zod validators** for section, video, quiz, settings in `backend/src/validators/`

Section create: `{ name: string min 1, description: string optional }`
Video create: `{ title, youtube_url (must parse to valid ID), section_id, description optional }`
Quiz save: `{ questions: [{ question_text, options: [{ option_text, is_correct }], min 2 options, exactly 1 is_correct }] }`

- [ ] **Step 2: Admin settings** — `GET/PUT /api/admin/settings`

- [ ] **Step 3: Admin sections** — full CRUD + `PATCH /:id/reorder`

Delete: check `video.count > 0` → throw 409 `"Materi ini masih berisi X video. Hapus atau pindahkan video terlebih dahulu."`

Reorder: swap `sortOrder` with adjacent section

- [ ] **Step 4: Admin videos** — full CRUD + reorder within section

Delete: cascade quiz via Prisma `onDelete: Cascade` on Quiz model

Validate youtube URL on create/update

- [ ] **Step 5: Admin quiz** — `GET/PUT/DELETE /api/admin/videos/:id/quiz`

PUT replaces entire quiz (delete old questions/options, create new) in a transaction

- [ ] **Step 6: Wire `backend/src/routes/admin.js`** with `requireAdmin` on all routes except login

- [ ] **Step 7: Manual CRUD test** — create section, create video, create quiz via curl/Thunder Client

- [ ] **Step 8: Commit**

```bash
git commit -m "feat: admin CRUD API for settings, sections, videos, quizzes"
```

---

## Task 10: Frontend Tailwind Theme & API Client

**Files:**
- Modify: `frontend/tailwind.config.ts`, `frontend/src/app/globals.css`
- Create: `frontend/src/lib/api.ts`, `frontend/src/lib/auth.ts`, `frontend/.env.local.example`

- [ ] **Step 1: Configure Tailwind colors** in `tailwind.config.ts`

```typescript
colors: {
  brand: {
    navy: '#0b2e3d',
    teal: '#0f6e6e',
    mint: '#1fb6a6',
    'bg-light': '#f7faf9',
    'teal-soft': '#e3f3f1',
  },
},
```

Tune shades during UI task if needed (Ruang Guru-inspired: slightly warmer bg, clear contrast).

- [ ] **Step 2: Base styles in `globals.css`**

```css
body {
  @apply bg-brand-bg-light text-gray-800 antialiased;
}
```

- [ ] **Step 3: Write `frontend/src/lib/api.ts`**

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan. Silakan coba lagi.');
  return data;
}

export function apiWithAuth(token: string) {
  return <T>(path: string, options?: RequestInit) =>
    api<T>(path, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, ...options?.headers },
    });
}
```

- [ ] **Step 4: Write `frontend/src/lib/auth.ts`**

Token get/set/remove from `localStorage` (key: `biostat_admin_token`). Only access in client components.

- [ ] **Step 5: Create `frontend/.env.local.example`**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

- [ ] **Step 6: Commit**

```bash
git commit -m "feat: tailwind theme and API client"
```

---

## Task 11: Shared UI Components

**Files:**
- Create: `frontend/src/components/ui/*`, `frontend/src/components/layout/SiteHeader.tsx`, `SiteFooter.tsx`

- [ ] **Step 1: Build minimal UI primitives**

`Button` (variants: primary/secondary/danger), `Card`, `Input`, `Textarea`, `Select` — Tailwind only, no shadcn dependency.

- [ ] **Step 2: Build `EmptyState.tsx`**

```tsx
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-gray-500">
      {message}
    </div>
  );
}
```

- [ ] **Step 3: Build `SiteHeader`** — logo text "Biostat Hub", nav link "Beranda", navy background.

- [ ] **Step 4: Build `SiteFooter`** — simple copyright line.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: shared UI components and layout"
```

---

## Task 12: Public Pages

**Files:**
- Create: `page.tsx`, `section/[id]/page.tsx`, `video/[id]/page.tsx`, `quiz/[videoId]/page.tsx`, `not-found.tsx`
- Create: `home/HeroSection.tsx`, `home/SectionGrid.tsx`, `section/VideoGrid.tsx`, `video/YouTubePlayer.tsx`, `quiz/QuizForm.tsx`, `quiz/QuizResult.tsx`

- [ ] **Step 1: Beranda (`page.tsx`)** — server component fetching `/api/settings` and `/api/sections`

Render HeroSection with dynamic title/description/stats.
If `sections.length === 0` → EmptyState instead of grid.

- [ ] **Step 2: Section page** — fetch `/api/sections/:id`

If no videos → EmptyState "Belum ada video di materi ini."
Else VideoGrid with cards linking to `/video/[id]`.

- [ ] **Step 3: Video page** — YouTubePlayer embed using extracted ID

"Kerjakan Kuis" button only if `has_quiz`. Breadcrumb back to section.

- [ ] **Step 4: Quiz page** — client component

Fetch quiz on mount. QuizForm with radio buttons for all questions.
On submit POST to `/api/videos/:id/quiz/submit`, show QuizResult.
Validate all answered before submit.

- [ ] **Step 5: `not-found.tsx`** — "Halaman tidak ditemukan" + link Beranda

- [ ] **Step 6: Verify empty state**

With seeded empty DB: beranda loads, shows 0 stats, empty state message. No errors in console.

- [ ] **Step 7: Commit**

```bash
git commit -m "feat: public pages with empty state handling"
```

---

## Task 13: Admin Layout & Login

**Files:**
- Create: `admin/layout.tsx`, `admin/login/page.tsx`, `admin/AdminLayout.tsx` (or in components/layout)

- [ ] **Step 1: Admin login page** — form Nama Pengguna + Kata Sandi

On success store token, redirect to `/admin/sections`.
Error: "Nama pengguna atau kata sandi salah"

- [ ] **Step 2: Admin layout** — sidebar with 4 links:

Kelola Materi, Kelola Video, Kelola Kuis, Pengaturan Beranda

Auth guard: if no token redirect to login.

- [ ] **Step 3: Commit**

```bash
git commit -m "feat: admin login and layout"
```

---

## Task 14: Admin CRUD Pages

**Files:**
- Create: `admin/sections/page.tsx`, `admin/videos/page.tsx`, `admin/quizzes/page.tsx`, `admin/settings/page.tsx`
- Create: `admin/ReorderButtons.tsx`, `admin/ConfirmDialog.tsx`

- [ ] **Step 1: Kelola Materi** — list, add/edit form, delete with confirm, reorder ↑↓, "Lihat di Website" link

- [ ] **Step 2: Kelola Video** — list with materi filter, add/edit form with YouTube validation feedback, reorder, delete confirm

- [ ] **Step 3: Kelola Kuis** — video dropdown grouped by section, dynamic question editor (add/remove questions, 4 options each, mark correct), single Simpan Kuis button

- [ ] **Step 4: Pengaturan Beranda** — edit hero title + description

- [ ] **Step 5: Empty admin states** — "Belum ada data. Klik Tambah Baru untuk memulai."

- [ ] **Step 6: Commit**

```bash
git commit -m "feat: admin CRUD pages in Bahasa Indonesia"
```

---

## Task 15: Visual Polish & Responsive QA

**Files:**
- Modify: various components

- [ ] **Step 1: Apply Ruang Guru-inspired layout patterns**

- Content-first card grids with clear thumbnails area (use YouTube thumbnail URL: `https://img.youtube.com/vi/{id}/mqdefault.jpg` on video cards)
- Generous but not excessive whitespace
- Clear typographic hierarchy (section title > card title > meta)
- Mobile: single-column grids, collapsible admin sidebar to top nav

- [ ] **Step 2: Responsive pass** — test 375px, 768px, 1280px

- [ ] **Step 3: Final empty-state + full-flow test**

1. Fresh DB (no sections) → beranda works
2. Admin adds section → appears on beranda
3. Admin adds video with YouTube URL → plays on video page
4. Admin adds quiz → quiz flow works end-to-end

- [ ] **Step 4: Update README** with setup steps, env vars, deployment notes

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: visual polish and responsive layout"
```

---

## Spec Coverage Checklist

| Spec requirement | Task |
|-----------------|------|
| Dynamic sections/videos | 2, 7, 9, 12, 14 |
| Empty site works | 3 (minimal seed), 12 (empty states) |
| YouTube embed | 5, 12 |
| Quiz auto-grading | 6, 7, 12 |
| No public login | 12 |
| Admin JWT | 8, 13 |
| Admin CRUD | 9, 14 |
| site_settings editable | 3, 9, 14 |
| Section delete blocked | 9 |
| Reorder up/down | 9, 14 |
| Bahasa Indonesia UI | 11–14 |
| CORS separate deploy | 4, 10 |
| Anti-AI-ish design | 10, 11, 15 |

---

## Post-Implementation: Client Content Handoff

When client provides structure tomorrow:

1. Login admin → Kelola Materi → add sections in correct order
2. Kelola Video → add YouTube links per section
3. Kelola Kuis → add quizzes where needed
4. Pengaturan Beranda → adjust hero text if needed

No code changes required.
