import { useMemo, useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import Badge from '../components/ui/Badge';
import CourseCard from '../components/course/CourseCard';
import CourseFilterBar from '../components/course/CourseFilterBar';
import CourseSummaryBar from '../components/course/CourseSummaryBar';
import Tabs from '../components/ui/Tabs';
import useAuth from '../hooks/useAuth';
import useCourses from '../hooks/useCourses';
import { getCourseStats } from '../utils/courseStatus';

function MyCoursesPage() {
  const { user } = useAuth();
  const { courses } = useCourses();
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('name-asc');
  const [view, setView] = useState('grid');
  const summary = getCourseStats(courses);
  const semesters = [...new Set(courses.map((course) => course.semester))].sort((a, b) => a - b);

  const semesterCourses = useMemo(
    () => courses.filter((course) => semester === 'all' || String(course.semester) === semester),
    [courses, semester],
  );

  const tabs = [
    { id: 'all', label: 'Semua', count: semesterCourses.length },
    { id: 'active', label: 'Sedang dipelajari', count: semesterCourses.filter((course) => course.progress < 100).length },
    { id: 'completed', label: 'Selesai', count: semesterCourses.filter((course) => course.progress >= 100).length },
  ];

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('id-ID');
    const matchingCourses = semesterCourses.filter((course) => {
      const matchesSearch = !normalizedSearch
        || `${course.id} ${course.name} ${course.lecturer}`.toLocaleLowerCase('id-ID').includes(normalizedSearch);
      const matchesStatus = status === 'all'
        || (status === 'active' && course.progress < 100)
        || (status === 'completed' && course.progress >= 100);
      return matchesSearch && matchesStatus;
    });
    const sortDirection = sort === 'name-desc' ? -1 : 1;

    return [...matchingCourses].sort((a, b) =>
      sortDirection * a.name.localeCompare(b.name, 'id-ID', { sensitivity: 'base' }),
    );
  }, [semesterCourses, search, status, sort]);

  return (
    <div className="space-y-7">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-3xl font-bold text-main">Mata Kuliah Saya</h1>
          <p className="mt-2 text-sm text-secondary">
            Kelola pembelajaran Anda dan lanjutkan materi di setiap mata kuliah.
          </p>
        </div>
        <Badge variant="info" className="self-start px-3 py-1.5">
          Semester Ganjil 2026/2027
        </Badge>
      </header>

      <CourseSummaryBar
        program={user?.program ?? courses[0]?.program}
        studentName={user?.name}
        semester={user?.semester ?? courses[0]?.semester}
        className={user?.class ?? courses[0]?.class}
        stats={summary}
      />

      <CourseFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        semesterValue={semester}
        semesters={semesters}
        onSemesterChange={setSemester}
        statusValue={status}
        onStatusChange={setStatus}
        sortValue={sort}
        onSortChange={setSort}
      />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Tabs tabs={tabs} value={status} onChange={setStatus} />
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <p className="text-sm text-secondary">Menampilkan {filteredCourses.length} mata kuliah</p>
          <div role="group" aria-label="Tampilan daftar mata kuliah" className="flex gap-2">
            <button
              type="button"
              aria-label="Tampilan grid"
              aria-pressed={view === 'grid'}
              onClick={() => setView('grid')}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${view === 'grid' ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-white text-secondary hover:text-primary'}`}
            >
              <LayoutGrid size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Tampilan daftar"
              aria-pressed={view === 'list'}
              onClick={() => setView('list')}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${view === 'list' ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-white text-secondary hover:text-primary'}`}
            >
              <List size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className={view === 'grid' ? 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3' : 'flex flex-col gap-4'}>
          {filteredCourses.map((course) => <CourseCard key={course.id} course={course} view={view} />)}
        </div>
      ) : (
        <div className="rounded-card border border-dashed border-border bg-white px-5 py-12 text-center">
          <p className="font-semibold text-main">Mata kuliah tidak ditemukan</p>
          <p className="mt-1 text-sm text-secondary">Coba ubah kata kunci atau filter yang dipilih.</p>
        </div>
      )}
    </div>
  );
}

export default MyCoursesPage;