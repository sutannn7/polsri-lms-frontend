import { averageProgress, computeCourseProgress } from './progress';

// `progress` tidak lagi field data — progres dihitung dari units, sama seperti
// yang ditampilkan kartu, agar ringkasan/filter selalu cocok dengan kartu.
export function getCourseStats(courses = []) {
  const totalCourses = courses.length;
  const totalCredits = courses.reduce((sum, course) => sum + Number(course.credits || 0), 0);

  return {
    totalCourses,
    activeCourses: courses.filter((course) => computeCourseProgress(course) < 100).length,
    completedCourses: courses.filter((course) => computeCourseProgress(course) >= 100).length,
    totalCredits,
    averageProgress: averageProgress(courses),
  };
}
