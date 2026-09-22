import assert from 'node:assert/strict';

const SITE_URL = (process.env.SITE_URL || 'https://biostatresearch.com').replace(/\/$/, '');
const API_URL = (process.env.API_URL || 'https://api.biostatresearch.com/api').replace(/\/$/, '');
const TIMEOUT_MS = 20_000;

async function request(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      redirect: 'follow',
      ...options,
      headers: { 'user-agent': 'Riset-Hub-QA/1.0', ...options.headers },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function expectStatus(url, expected = 200) {
  const response = await request(url);
  assert.equal(response.status, expected, `${url} mengembalikan ${response.status}, seharusnya ${expected}`);
  return response;
}

async function expectJson(path, assertion) {
  const response = await expectStatus(`${API_URL}${path}`);
  assert.match(response.headers.get('content-type') || '', /application\/json/i, `${path} bukan JSON`);
  const data = await response.json();
  assertion(data, response);
  return data;
}

const checks = [];

function check(name, run) {
  checks.push({ name, run });
}

check('health API', async () => {
  await expectJson('/health', (data) => assert.equal(data.status, 'ok'));
});

check('halaman publik utama', async () => {
  const routes = ['/', '/kuis', '/glosarium', '/unduhan', '/wizard', '/kalkulator'];
  for (const route of routes) {
    const response = await expectStatus(`${SITE_URL}${route}`);
    assert.match(response.headers.get('content-type') || '', /text\/html/i);
  }
});

check('judul dan metadata beranda', async () => {
  const response = await expectStatus(`${SITE_URL}/`);
  const html = await response.text();
  assert.match(html, /<title>Riset Hub<\/title>/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/biostatresearch\.com"/i);
  assert.match(html, /name="google-site-verification"/i);
});

check('robots dan sitemap', async () => {
  const robots = await (await expectStatus(`${SITE_URL}/robots.txt`)).text();
  assert.match(robots, /Sitemap:\s*https:\/\/biostatresearch\.com\/sitemap\.xml/i);
  assert.match(robots, /Disallow:\s*\/admin\//i);
  const sitemap = await (await expectStatus(`${SITE_URL}/sitemap.xml`)).text();
  assert.match(sitemap, /<urlset[\s>]/i);
  assert.match(sitemap, /<loc>https:\/\/biostatresearch\.com\/<\/loc>/i);
});

check('data materi dan halaman detail', async () => {
  const payload = await expectJson('/sections', (data) => {
    assert.ok(Array.isArray(data.sections));
    assert.ok(data.sections.length > 0, 'Belum ada materi publik');
  });
  for (const section of payload.sections) {
    const detail = await expectJson(`/sections/${section.id}`, (data) => {
      assert.equal(data.id, section.id);
      assert.ok(Array.isArray(data.videos));
    });
    await expectStatus(`${SITE_URL}/section/${section.id}`);
    for (const video of detail.videos.slice(0, 2)) {
      await expectStatus(`${SITE_URL}/video/${video.id}`);
      await expectJson(`/videos/${video.id}`, (data) => assert.equal(data.id, video.id));
    }
  }
});

check('fitur publik berbasis data', async () => {
  await expectJson('/glossary', (data) => assert.ok(Array.isArray(data)));
  await expectJson('/downloads', (data) => assert.ok(Array.isArray(data)));
  await expectJson('/wizard', (data) => assert.ok(Array.isArray(data)));
  await expectJson('/calculator-links', (data) => assert.ok(Array.isArray(data)));
  await expectJson('/quizzes', (data) => assert.ok(Array.isArray(data)));
});

check('pencarian dan karakter khusus', async () => {
  await expectJson('/search?q=chi%20square%20%26%20uji', (data) => assert.ok(Array.isArray(data.results)));
});

check('halaman tidak ditemukan dan proteksi admin', async () => {
  await expectStatus(`${SITE_URL}/halaman-yang-tidak-ada-qa`, 404);
  await expectStatus(`${API_URL}/sections/999999999`, 404);
  await expectStatus(`${API_URL}/admin/sections`, 401);
});

let failed = 0;
for (const item of checks) {
  try {
    await item.run();
    console.log(`PASS  ${item.name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL  ${item.name}`);
    console.error(`      ${error.message}`);
  }
}

console.log(`\n${checks.length - failed}/${checks.length} kelompok pemeriksaan lulus.`);
if (failed > 0) process.exitCode = 1;
