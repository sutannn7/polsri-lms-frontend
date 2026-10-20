import { useMemo, useState } from 'react';
import CourseCard from '../components/course/CourseCard';
import CourseFilterBar from '../components/course/CourseFilterBar';
import CourseSummaryBar from '../components/course/CourseSummaryBar';
import useAuth from '../hooks/useAuth';
import useCourses from '../hooks/useCourses';
import { getCourseStats } from '../utils/courseStatus';

function MyCoursesPage() {
  const { user } = useAuth();
  const { courses } = useCourses();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('name-asc');
  const [view, setView] = useState('grid');
  const stats = getCourseStats(courses);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('id-ID');
    const matchingCourses = courses.filter((course) => {
      const matchesSearch = !normalizedSearch
        || `${course.name} ${course.lecturer}`.toLocaleLowerCase('id-ID').includes(normalizedSearch);
      const matchesStatus = status === 'all'
        || (status === 'active' && course.progress < 100)
        || (status === 'completed' && course.progress >= 100);
      return matchesSearch && matchesStatus;
    });
    const sortDirection = sort === 'name-desc' ? -1 : 1;

    return [...matchingCourses].sort((a, b) =>
      sortDirection * a.name.localeCompare(b.name, 'id-ID', { sensitivity: 'base' }),
    );
  }, [courses, search, status, sort]);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-semibold text-main">Mata Kuliah Saya</h1>
        <p className="text-sm text-secondary">
          Kelola pembelajaran Anda dan lanjutkan materi di setiap mata kuliah.
        </p>
      </header>

      <CourseSummaryBar
        program={user?.program ?? courses[0]?.program}
        className={user?.class ?? courses[0]?.class}
        stats={stats}
      />

      <CourseFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        statusValue={status}
        onStatusChange={setStatus}
        statusCounts={{
          all: stats.totalCourses,
          active: stats.activeCourses,
          completed: stats.completedCourses,
        }}
        sortValue={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
      />

      {filteredCourses.length > 0 ? (
        <div className={view === 'grid' ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-4'}>
          {filteredCourses.map((course) => (
            <div key={course.id} data-course-card>
              <CourseCard
                course={course}
                progress={course.progress}
                nextSlot={course.nextSlot}
                variant={view}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-card border border-dashed border-border bg-background px-5 py-12 text-center">
          <p className="font-semibold text-main">Mata kuliah tidak ditemukan</p>
          <p className="mt-1 text-sm text-secondary">Coba ubah kata kunci atau filter yang dipilih.</p>
        </div>
      )}
    </div>
  );
}

export default MyCoursesPage;
