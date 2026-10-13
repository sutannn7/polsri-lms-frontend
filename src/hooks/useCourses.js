import { useMemo } from 'react';
import { getCourseMeetings, getCourses } from '../services/courseService';

function useCourses() {
  const courses = useMemo(() => getCourses(), []);
  return { courses, getCourseMeetings };
}

export default useCourses;