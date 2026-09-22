import test from 'node:test';
import assert from 'node:assert/strict';

import { extractYouTubeId, toYouTubeWatchUrl } from '../src/utils/youtube.js';

const VIDEO_ID = 'dQw4w9WgXcQ';

test('mendukung format URL YouTube umum', () => {
  assert.equal(extractYouTubeId(`https://youtu.be/${VIDEO_ID}`), VIDEO_ID);
  assert.equal(extractYouTubeId(`https://www.youtube.com/watch?v=${VIDEO_ID}`), VIDEO_ID);
  assert.equal(extractYouTubeId(`https://www.youtube.com/embed/${VIDEO_ID}`), VIDEO_ID);
  assert.equal(extractYouTubeId(`https://www.youtube.com/shorts/${VIDEO_ID}`), VIDEO_ID);
});

test('menolak URL non-YouTube dan ID yang tidak lengkap', () => {
  assert.equal(extractYouTubeId('https://example.com/watch?v=dQw4w9WgXcQ'), null);
  assert.equal(extractYouTubeId('https://youtube.com/watch?v=pendek'), null);
  assert.equal(extractYouTubeId(''), null);
});

test('membentuk URL watch dari ID', () => {
  assert.equal(toYouTubeWatchUrl(VIDEO_ID), `https://www.youtube.com/watch?v=${VIDEO_ID}`);
});
