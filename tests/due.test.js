import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { daysUntil, isOverdue, dueLabel } from '../src/utils/due.js';

describe('daysUntil', () => {
  test('1 hari (23.59 besok, lihat sekarang pagi)', () => {
    assert.equal(
      daysUntil('2026-10-21T23:59:00+07:00', new Date('2026-10-20T08:00:00+07:00')),
      1,
    );
  });

  test('negatif untuk tenggat yang lewat', () => {
    assert.equal(
      daysUntil('2026-10-18T23:59:00+07:00', new Date('2026-10-20T08:00:00+07:00')),
      -2,
    );
  });
});

describe('isOverdue', () => {
  test('tanggal lewat → true', () => {
    assert.equal(isOverdue('2026-10-19T23:59:00+07:00', new Date('2026-10-20T08:00:00+07:00')), true);
  });

  test('tanggal depan → false', () => {
    assert.equal(isOverdue('2026-10-21T23:59:00+07:00', new Date('2026-10-20T08:00:00+07:00')), false);
  });
});

describe('dueLabel', () => {
  test('Besok', () => {
    assert.equal(
      dueLabel('2026-10-21T23:59:00+07:00', new Date('2026-10-20T08:00:00+07:00')),
      'Besok',
    );
  });

  test('Hari ini', () => {
    assert.equal(
      dueLabel('2026-10-20T23:59:00+07:00', new Date('2026-10-20T08:00:00+07:00')),
      'Hari ini',
    );
  });

  test('3 hari lagi', () => {
    assert.equal(
      dueLabel('2026-10-23T23:59:00+07:00', new Date('2026-10-20T08:00:00+07:00')),
      '3 hari lagi',
    );
  });

  test('Terlambat 2 hari', () => {
    assert.equal(
      dueLabel('2026-10-18T23:59:00+07:00', new Date('2026-10-20T08:00:00+07:00')),
      'Terlambat 2 hari',
    );
  });
});
