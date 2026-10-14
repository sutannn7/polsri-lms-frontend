import coursesData from '../data/courses.json';
import meetingsData from '../data/meetings.json';

export function getCourses() {
  return coursesData.map((course) => ({ ...course }));
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