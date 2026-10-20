// Atribut `with { type: 'json' }` membuat berkas ini bisa diimpor langsung oleh `node --test`.
import coursesData from '../data/courses.json' with { type: 'json' };
import meetingsData from '../data/meetings.json' with { type: 'json' };

export function getCourses() {
  return coursesData.map((course) => ({
    ...course,
    units: (meetingsData.courses[course.id] ?? []).map((unit) => ({
      ...unit,
      activities: unit.activities.map((activity) => ({ ...activity })),
    })),
  }));
}

export function getCourseById(id) {
  return getCourses().find((course) => course.id === id) ?? null;
}

export function getCourseMeetings(courseId) {
  return (meetingsData.courses[courseId] ?? []).map((meeting) => ({
    ...meeting,
    activities: meeting.activities.map((activity) => ({ ...activity })),
  }));
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