import test from 'node:test';
import assert from 'node:assert/strict';

import { validateCalculatorLinkCreate } from '../src/validators/calculatorLink.js';
import { validateDownloadMeta } from '../src/validators/download.js';
import { validateGlossaryCreate } from '../src/validators/glossary.js';
import { validateSectionCreate } from '../src/validators/section.js';
import { validateCalculatorUrlUpdate, validateSettingsUpdate } from '../src/validators/settings.js';
import { validateVideoCreate } from '../src/validators/video.js';
import { validateWizardCreate } from '../src/validators/wizard.js';

const LONG_TEXT = 'Penjelasan statistik yang lengkap. '.repeat(400);
const LONG_HTML = `<h2>Pembahasan</h2><p>${LONG_TEXT}</p><ul><li>Langkah satu</li><li>Langkah dua</li></ul>`;

test('deskripsi materi panjang tidak dipotong validator', () => {
  const parsed = validateSectionCreate({ name: 'Materi regresi', description: LONG_HTML });
  assert.equal(parsed.description, LONG_HTML);
  assert.ok(parsed.description.length > 10_000);
});

test('deskripsi video panjang tidak dipotong validator', () => {
  const parsed = validateVideoCreate({
    sectionId: 1,
    title: 'Video regresi',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: LONG_HTML,
  });
  assert.equal(parsed.description, LONG_HTML);
});

test('markup kosong dinormalisasi, sedangkan gambar tanpa teks dipertahankan', () => {
  const empty = validateSectionCreate({ name: 'Kosong', description: '<p> &nbsp; </p>' });
  const imageOnly = '<p><img src="https://example.com/chart.png" alt="Grafik"></p>';
  const withImage = validateSectionCreate({ name: 'Gambar', description: imageOnly });
  assert.equal(empty.description, '');
  assert.equal(withImage.description, imageOnly);
});

test('deskripsi panjang pada wizard dan unduhan tidak dipotong', () => {
  assert.equal(validateWizardCreate({ title: 'Wizard', description: LONG_TEXT }).description, LONG_TEXT.trim());
  assert.equal(
    validateDownloadMeta({ title: 'Panduan', description: LONG_TEXT, category: 'Materi' }).description,
    LONG_TEXT.trim(),
  );
});

test('teks panjang pada pengaturan dan glosarium tidak dipotong', () => {
  const settings = validateSettingsUpdate({
    heroTitle: 'Riset Hub',
    heroDescription: LONG_TEXT,
    contactEmail: 'support@example.com',
  });
  const glossary = validateGlossaryCreate({
    term: 'Regresi',
    definition: LONG_TEXT,
    example: LONG_TEXT,
  });
  assert.equal(settings.heroDescription, LONG_TEXT.trim());
  assert.equal(glossary.definition, LONG_TEXT.trim());
  assert.equal(glossary.example, LONG_TEXT.trim());
});

test('tautan kalkulator hanya menerima http dan https', () => {
  assert.equal(
    validateCalculatorLinkCreate({ title: 'Kalkulator', url: 'https://example.com/tool' }).url,
    'https://example.com/tool',
  );
  assert.throws(
    () => validateCalculatorLinkCreate({ title: 'Berbahaya', url: 'javascript:alert(1)' }),
    /http:\/\/ atau https:\/\//,
  );
});

test('URL kalkulator lama tetap boleh dikosongkan tetapi protokol berbahaya ditolak', () => {
  assert.equal(validateCalculatorUrlUpdate({ calculatorUrl: '' }).calculatorUrl, '');
  assert.throws(
    () => validateCalculatorUrlUpdate({ calculatorUrl: 'data:text/html,test' }),
    /http:\/\/ atau https:\/\//,
  );
});
