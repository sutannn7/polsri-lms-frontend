import { useMemo } from 'react';
import { getCourses } from '../services/courseService';

function useCourses() {
  const courses = useMemo(() => getCourses(), []);
  return { courses };
}

export default useCourses;
