// Murni, tanpa React/DOM. Progres hanya dihitung dari aktivitas yang selesai.
export function computeCourseProgress(course) {
  const activities = (course.units ?? []).flatMap((unit) => unit.activities ?? []);
  if (activities.length === 0) return 0;
  const done = activities.filter((activity) => activity.completed).length;
  return Math.round((done / activities.length) * 100);
}

export function averageProgress(courses) {
  if (courses.length === 0) return 0;
  const total = courses.reduce((sum, course) => sum + computeCourseProgress(course), 0);
  return Math.round((total / courses.length) * 10) / 10;
}
