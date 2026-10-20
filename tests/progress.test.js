import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { computeCourseProgress, averageProgress } from '../src/utils/progress.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('computeCourseProgress', () => {
  test('setengah aktivitas selesai → 50', () => {
    const course = {
      units: [{ activities: [{ completed: true }, { completed: false }] }],
    };
    assert.equal(computeCourseProgress(course), 50);
  });

  test('tanpa aktivitas → 0', () => {
    assert.equal(computeCourseProgress({ units: [{ activities: [] }] }), 0);
    assert.equal(computeCourseProgress({ units: [] }), 0);
  });

  test('semua selesai → 100', () => {
    const course = {
      units: [
        { activities: [{ completed: true }, { completed: true }] },
        { activities: [{ completed: true }] },
      ],
    };
    assert.equal(computeCourseProgress(course), 100);
  });

  test('pembulatan dari lintas unit (5 dari 11 = 45)', () => {
    const course = {
      units: [
        { activities: [{ completed: true }, { completed: true }, { completed: true }, { completed: true }] },
        { activities: [{ completed: true }, { completed: false }, { completed: false }, { completed: false }] },
        { activities: [{ completed: false }, { completed: false }, { completed: false }] },
      ],
    };
    assert.equal(computeCourseProgress(course), 45);
  });
});

describe('averageProgress', () => {
  test('rata-rata antar mata kuliah', () => {
    const courses = [
      { units: [{ activities: [{ completed: true }, { completed: false }] }] }, // 50
      { units: [{ activities: [{ completed: true }, { completed: true }] }] }, // 100
    ];
    assert.equal(averageProgress(courses), 75);
  });

  test('rata-rata berasal lintas bagian desimal (3/4 = 66.7)', () => {
    const courses = [
      { units: [{ activities: [{ completed: true }, { completed: true }, { completed: true }, { completed: false }] }] }, // 75
      { units: [{ activities: [{ completed: true }, { completed: true }, { completed: false }, { completed: false }, { completed: false }] }] }, // 40
      { units: [{ activities: [{ completed: false }, { completed: false }, { completed: false }] }] }, // 0
    ];
    assert.equal(averageProgress(courses), 38.3);
  });

  test('daftar kosong → 0', () => {
    assert.equal(averageProgress([]), 0);
  });
});

describe('mata kuliah dari service (units terlampir)', () => {
  test('getCourses melampirkan units sehingga progres tidak dianggap kosong', async () => {
    const { getCourses } = await import('../src/services/courseService.js');
    const courses = getCourses();
    assert.equal(courses.length, 11);
    assert.ok(courses.every((course) => course.units.length >= 2), 'units harus terlampir dari meetings.json');
    assert.ok(courses.every((course) => computeCourseProgress(course) >= 40), 'progres harus 40-70, bukan 0');
    assert.ok(courses.find((course) => course.id === 'perbankan').units.length >= 2);
    // Kontrak halaman daftar/detail: progress & nextSlot terlampir di tiap kursus.
    assert.ok(courses.every((course) => typeof course.progress === 'number'), 'progress harus angka, bukan undefined');
    assert.ok(
      courses.every((course) => course.nextSlot === null
        || (course.nextSlot !== undefined && typeof course.nextSlot === 'object')),
      'nextSlot harus slot agenda atau null, bukan undefined',
    );
  });
});
