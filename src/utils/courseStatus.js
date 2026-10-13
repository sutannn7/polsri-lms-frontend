export function getCourseStatus(course) {
  return Number(course?.progress) >= 100 ? 'Selesai' : 'Sedang dipelajari';
}

export function getCourseStats(courses = []) {
  const totalCourses = courses.length;
  const totalCredits = courses.reduce((sum, course) => sum + Number(course.credits || 0), 0);
  const totalProgress = courses.reduce(
    (sum, course) => sum + Math.min(100, Math.max(0, Number(course.progress) || 0)),
    0,
  );

  return {
    totalCourses,
    activeCourses: courses.filter((course) => Number(course.progress) < 100).length,
    completedCourses: courses.filter((course) => Number(course.progress) >= 100).length,
    totalCredits,
    averageProgress: totalCourses ? Math.round(totalProgress / totalCourses) : 0,
  };
}

export function getActiveCourses(courses = []) {
  return courses.filter((course) => Number(course.progress) < 100);
}