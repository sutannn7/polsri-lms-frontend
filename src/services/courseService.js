// Atribut `with { type: 'json' }` membuat berkas ini bisa diimpor langsung oleh `node --test`.
import coursesData from '../data/courses.json' with { type: 'json' };
import meetingsData from '../data/meetings.json' with { type: 'json' };
// Ekstensi `.js` eksplisit agar bisa diimpor langsung oleh `node --test` (ESM).
import { computeCourseProgress } from '../utils/progress.js';
import { getNextSlot } from '../utils/schedule.js';

function attachUnits(course) {
  const units = (meetingsData.courses[course.id] ?? []).map((unit) => ({
    ...unit,
    activities: unit.activities.map((activity) => ({ ...activity })),
  }));
  return { ...course, units };
}

export function getCourses() {
  const now = new Date();
  return coursesData.map((course) => {
    const enriched = attachUnits(course);
    return {
      ...enriched,
      progress: computeCourseProgress(enriched),
      nextSlot: getNextSlot(course.id, meetingsData.schedule, now),
    };
  });
}

export function getCourseById(id) {
  return getCourses().find((course) => course.id === id) ?? null;
}

export function setLastOpenedCourseId(courseId) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem('learnease:last-opened-course', courseId);
  }
}

export function getLastOpenedCourseId() {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem('learnease:last-opened-course');
}
