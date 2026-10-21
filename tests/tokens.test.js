import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const TOKENS = [
  '--surface',
  '--surface-2',
  '--surface-3',
  '--border',
  '--text',
  '--text-muted',
  '--brand',
  '--brand-strong',
  '--brand-soft',
  '--on-primary',
  '--accent',
  '--danger',
  '--success',
  // Token badge: latar (soft) dan teks kartu status, per varian tema.
  '--success-soft',
  '--success-text',
  '--danger-soft',
  '--danger-text',
  '--warning-soft',
  '--warning-text',
  '--neutral-soft',
  '--neutral-text',
];

test('tokens.css defines every variable in :root', () => {
  const css = readFileSync(path.join(ROOT, 'src/styles/tokens.css'), 'utf8');
  const rootBlock = css.slice(css.indexOf(':root {'), css.indexOf('.dark {'));
  for (const token of TOKENS) {
    assert.match(rootBlock, new RegExp(`${token}\\s*:`),
      `${token} muncul minimal sekali di blok :root`);
  }
});

test('tokens.css defines every variable in .dark', () => {
  const css = readFileSync(path.join(ROOT, 'src/styles/tokens.css'), 'utf8');
  const darkBlock = css.slice(css.indexOf('.dark {'));
  for (const token of TOKENS) {
    assert.match(darkBlock, new RegExp(`${token}\\s*:`),
      `${token} muncul minimal sekali di blok .dark`);
  }
});

test('tailwind.config.js menggunakan darkMode: class', () => {
  const config = readFileSync(path.join(ROOT, 'tailwind.config.js'), 'utf8');
  assert.match(config, /darkMode\s*:\s*['"]class['"]/);
});
