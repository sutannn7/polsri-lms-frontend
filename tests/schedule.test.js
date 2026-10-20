import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  getScheduleForDate,
  getMeetingStatus,
  formatTimeRange,
  shortRoom,
  normalizeCourseName,
  buildAgenda,
  getNextSlot,
} from '../src/utils/schedule.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relPath) => JSON.parse(readFileSync(path.join(ROOT, relPath), 'utf8'));

// Data kontoh miniatur (2 pertemuan) sesuai candangan.
const pertemuanSelasa = {
  id: 'manajemen-proyek-si-selasa',
  courseId: 'manajemen-proyek-sistem-informasi',
  courseName: 'Manajemen proyek sistem informasi',
  dayOfWeek: 2,
  startTime: '18.30',
  endTime: '20.30',
  room: 'Lantai 3 - Lab 3 (Jaringan Komputer)',
};

const pertemuanMon = {
  id: 'perbankan-jumat',
  courseId: 'perbankan',
  courseName: 'Perbankan',
  dayOfWeek: 1,
  startTime: '18.10',
  endTime: '19.50',
  room: 'Lantai 2 - Teori 5',
};

const pertemuanThu = {
  id: 'pad-kamis',
  courseId: 'praktikum-analisis-data',
  courseName: 'Praktikum analisis data',
  dayOfWeek: 4,
  startTime: '18.30',
  endTime: '19.50',
  room: 'Lantai 3 - Lab 5 (Pemrograman Web)',
};

describe('getScheduleForDate', () => {
  test('mengembalikan pertemuan pada hari yang cocok (Senin = 1)', () => {
    const result = getScheduleForDate([{ dayOfWeek: 1 }], new Date('2026-10-19T10:00:00+07:00'));
    assert.equal(result.length, 1);
  });

  test('hari Minggu tanpa jadwal Minggu → kosong', () => {
    const result = getScheduleForDate([{ dayOfWeek: 1 }], new Date('2026-10-25T10:00:00+07:00'));
    assert.equal(result.length, 0);
  });

  test('hasil terurut mulai dari startTime', () => {
    const schedule = [
      { ...pertemuanThu, startTime: '19.50', endTime: '21.10' },
      { ...pertemuanThu, startTime: '18.30', endTime: '19.50' },
    ];
    const result = getScheduleForDate(schedule, new Date('2026-10-22T10:00:00+07:00'));
    assert.deepEqual(result.map((m) => m.startTime), ['18.30', '19.50']);
  });
});

describe('getMeetingStatus', () => {
  const meeting = { startTime: '18.30', endTime: '20.20' };

  test('live saat now di dalam rentang', () => {
    assert.equal(getMeetingStatus(meeting, new Date('2026-10-20T19:00:00+07:00')), 'live');
  });

  test('done saat now melewati rentang', () => {
    assert.equal(getMeetingStatus(meeting, new Date('2026-10-20T21:30:00+07:00')), 'done');
  });

  test('upcoming sebelum rentang', () => {
    assert.equal(getMeetingStatus(meeting, new Date('2026-10-20T17:00:00+07:00')), 'upcoming');
  });

  test('tetap menilai rentang WIB walau Date dibangun di zona lain', () => {
    // 12.00 UTC == 19.00 WIB: 07.00-09.00 WIB sudah lewat.
    assert.equal(getMeetingStatus({ startTime: '07.00', endTime: '09.00' }, new Date('2026-10-20T03:00:00Z')), 'done');
    // 12.00 UTC == 19.00 WIB: 18.30-20.20 sedang berjalan.
    assert.equal(getMeetingStatus({ startTime: '18.30', endTime: '20.20' }, new Date('2026-10-20T12:00:00Z')), 'live');
  });
});

describe('formatTimeRange', () => {
  test('memakai en-dash dan titik sesuai sumber', () => {
    assert.equal(formatTimeRange({ startTime: '18.30', endTime: '20.20' }), '18.30–20.20');
  });
});

describe('shortRoom', () => {
  test('membuang awalan gedung dan memampatkan lantai', () => {
    assert.equal(
      shortRoom('Gedung Manajemen Informatika Lantai 3 - Lab 8 (Keamanan Komputer)'),
      'L3 · Lab 8 (Keamanan Komputer)',
    );
  });

  test('tanpa awalan gedung tetap terpampatkan', () => {
    assert.equal(shortRoom('Lantai 2 - Teori 4'), 'L2 · Teori 4');
  });
});

describe('normalizeCourseName', () => {
  test('title-case nama campur kapital', () => {
    assert.equal(normalizeCourseName('Manajemen proyek sistem informasi'), 'Manajemen Proyek Sistem Informasi');
  });

  test('akronim/kependekan tidak diperluas', () => {
    assert.equal(normalizeCourseName('Prak. Keamanan Komputer'), 'Prak. Keamanan Komputer');
  });

  test('nama yang sudah normal tetap sama', () => {
    assert.equal(normalizeCourseName('Sistem Informasi Akuntansi'), 'Sistem Informasi Akuntansi');
  });
});

describe('buildAgenda', () => {
  test('kind list dan pertemuan berstatus live di hari itu', () => {
    const agenda = buildAgenda([pertemuanSelasa], new Date('2026-10-20T19:00:00+07:00'));
    assert.equal(agenda.kind, 'list');
    assert.equal(agenda.meetings.length, 1);
    const entry = agenda.meetings[0];
    assert.equal(entry.status, 'live');
    assert.equal(entry.timeLabel, '18.30–20.30');
    assert.equal(entry.roomLabel, 'L3 · Lab 3 (Jaringan Komputer)');
    assert.equal(entry.courseLabel, 'Manajemen Proyek Sistem Informasi');
    assert.equal(entry.href, '/mata-kuliah/manajemen-proyek-sistem-informasi');
  });

  test('pertemuan yang sudah selesai tetap termasuk dengan status done', () => {
    const agenda = buildAgenda([pertemuanSelasa], new Date('2026-10-20T21:30:00+07:00'));
    assert.equal(agenda.kind, 'list');
    assert.equal(agenda.meetings.length, 1);
    assert.equal(agenda.meetings[0].status, 'done');
  });

  test('hari minggu kosong, nextMeeting menunjuk pertemuan Senin berikutnya', () => {
    const agenda = buildAgenda([pertemuanMon], new Date('2026-10-25T10:00:00+07:00'));
    assert.equal(agenda.kind, 'empty');
    assert.equal(agenda.meetings.length, 0);
    assert.ok(agenda.nextMeeting, 'nextMeeting tidak boleh null saat masih ada jadwal');
    assert.equal(agenda.nextMeeting.meeting.dayOfWeek, 1);
    assert.equal(agenda.nextMeeting.status, 'upcoming');
  });

  test('nextMeeting mengambil pertemuan berikutnya di hari yang sama', () => {
    const schedule = [
     pertemuanSelasa,
      { ...pertemuanSelasa, id: 'pad-selasa', courseId: 'praktikum-analisis-data', courseName: 'Praktikum analisis data', startTime: '20.30', endTime: '21.10' },
    ];
    const agenda = buildAgenda(schedule, new Date('2026-10-20T19:00:00+07:00'));
    assert.equal(agenda.nextMeeting.meeting.courseId, 'praktikum-analisis-data');
  });
});

describe('getNextSlot', () => {
  const schedule = [
    { ...pertemuanThu, id: 'pad-selasa', dayOfWeek: 2, startTime: '20.30', endTime: '21.10' },
    pertemuanThu,
  ];

  test('Rabu → slot Kamis', () => {
    const slot = getNextSlot('praktikum-analisis-data', schedule, new Date('2026-10-21T10:00:00+07:00'));
    assert.ok(slot);
    assert.equal(slot.meeting.dayOfWeek, 4);
    assert.equal(slot.href, '/mata-kuliah/praktikum-analisis-data');
  });
});

describe('data jadwal nyata', () => {
  const meetings = readJson('src/data/meetings.json');
  const courses = readJson('src/data/courses.json');
  const user = readJson('src/data/user.json');

  test('13 baris jadwal, 11 mata kuliah, 21 SKS sesuai profil', () => {
    assert.equal(meetings.schedule.length, 13);
    assert.equal(courses.length, 11);
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    assert.equal(totalCredits, user.totalCredits);
  });

  test('semua courseId dan unitsCount konsisten antar berkas data', () => {
    const byId = new Map(courses.map((c) => [c.id, c]));
    const seen = new Set();
    for (const meeting of meetings.schedule) {
      assert.ok(byId.has(meeting.courseId), `courseId asing: ${meeting.courseId}`);
      assert.ok(!seen.has(meeting.id), `id jadwal ganda: ${meeting.id}`);
      seen.add(meeting.id);
    }
    for (const course of courses) {
      const units = meetings.courses[course.id] ?? [];
      assert.ok(units.length >= 2 && units.length <= 4, `${course.id} harus 2-4 unit`);
      assert.equal(course.unitsCount, units.length);
      assert.ok(units.some((u) => u.title === course.next), `${course.id} next tidak ada di unit`);
    }
  });

  test('mata kuliah dua slot muncul di dua hari (Selasa+Kamis, Kamis+Senin)', () => {
    const daysFor = (courseId) => meetings.schedule.filter((m) => m.courseId === courseId).map((m) => m.dayOfWeek);
    assert.deepEqual(daysFor('praktikum-analisis-data').sort(), [2, 4]);
    assert.deepEqual(daysFor('praktikum-rekayasa-web').sort(), [1, 4]);
  });
});
