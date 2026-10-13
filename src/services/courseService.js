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