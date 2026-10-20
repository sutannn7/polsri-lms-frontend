import { useEffect, useState } from 'react';
import { MessagesSquare } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../components/layout/Breadcrumb';
import ActivityItem from '../components/course/ActivityItem';
import CourseHeader from '../components/course/CourseHeader';
import LecturerCard from '../components/course/LecturerCard';
import MeetingAccordion from '../components/course/MeetingAccordion';
import MobileCourseTabs from '../components/course/MobileCourseTabs';
import NextDeadlineCard from '../components/course/NextDeadlineCard';
import Tabs from '../components/ui/Tabs';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import useCourses from '../hooks/useCourses';
import useHomeData from '../hooks/useHomeData';
import { setLastOpenedCourseId } from '../services/courseService';
import { isUpcomingDeadline } from '../utils/formatDate';

function CourseDetailPage() {
  const { id } = useParams();
  const { courses } = useCourses();
  const { deadlines } = useHomeData();
  const [activeTab, setActiveTab] = useState('materials');
  const course = courses.find((item) => item.id === id);
  const units = course?.units ?? [];
  useEffect(() => {
    if (course) setLastOpenedCourseId(course.id);
  }, [course?.id]);

  if (!course) {
    return (
      <section className="rounded-card border border-border bg-background p-6 dark:shadow-card sm:p-8">
        <Link to="/mata-kuliah" className="text-sm font-semibold text-primary hover:underline">
          Kembali ke Mata Kuliah Saya
        </Link>
        <h1 className="mt-5 font-display text-3xl font-semibold text-main">Mata kuliah tidak ditemukan</h1>
        <p className="mt-2 text-sm text-secondary">Mata kuliah {id} tidak terdaftar.</p>
      </section>
    );
  }

  const activeMeeting = units.find((unit) => unit.status === 'active')
    ?? [...units].reverse().find((unit) => unit.status === 'completed');
  const tasks = deadlines
    .filter((deadline) => deadline.courseId === course.id)
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  const nextTask = tasks.find((task) => isUpcomingDeadline(task));

  const [lecturerName, ...degreeParts] = course.lecturer.split(', ');
  const lecturerDegree = degreeParts.join(', ');

  const tabs = [
    { id: 'materials', label: 'Materi pembelajaran', count: units.length },
    { id: 'tasks', label: 'Tugas', count: tasks.length },
    { id: 'forum', label: 'Forum diskusi' },
  ];

  function scrollToActiveMeeting() {
    setActiveTab('materials');
    window.setTimeout(() => {
      document.getElementById(`pertemuan-${activeMeeting?.number}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 0);
  }

  function showTasks() {
    setActiveTab('tasks');
  }

  function showForum() {
    setActiveTab('forum');
  }

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: 'Mata Kuliah Saya', href: '/mata-kuliah' },
          { label: course.name },
        ]}
      />

      <CourseHeader course={course} />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0 space-y-5" aria-label="Konten mata kuliah">
          <Tabs
            tabs={tabs}
            value={activeTab}
            onChange={setActiveTab}
            className={'border-b border-border pb-3' /* taste-skill-ignore: underline tab bar */}
          />

          {activeTab === 'materials' ? (
            units.length > 0 ? (
              <div className="space-y-3">
                {units.map((unit) => (
                  <div key={unit.number} id={`pertemuan-${unit.number}`} data-unit={unit.number}>
                    <MeetingAccordion
                      unit={unit}
                      defaultOpen={unit.number === activeMeeting?.number}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-sm text-secondary">
                Materi untuk mata kuliah ini belum tersedia.
              </Card>
            )
          ) : null}

          {activeTab === 'tasks' ? (
            tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <ActivityItem
                    key={task.id}
                    activity={{
                      ...task,
                      type: 'assignment',
                      statusLabel: task.status,
                      action: task.status === 'Selesai' ? 'Tinjau Tugas' : 'Kerjakan Tugas',
                    }}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-sm text-secondary">
                Belum ada tugas untuk mata kuliah ini.
              </Card>
            )
          ) : null}

          {activeTab === 'forum' ? (
            <Card className="p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <MessagesSquare size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-bold text-main">Forum diskusi</h2>
                  <p className="mt-2 text-sm leading-6 text-secondary">
                    Gunakan forum diskusi untuk bertanya kepada dosen dan berdiskusi dengan teman sekelas.
                  </p>
                </div>
              </div>
            </Card>
          ) : null}
        </section>

        <aside className="space-y-4" aria-label="Informasi pembelajaran">
          <Card className="p-5">
            <p className="text-sm font-semibold text-main">Lanjutkan dari sini</p>
            {activeMeeting ? (
              <>
                <p className="mt-4 inline-flex rounded-full bg-primary-soft px-3 py-1 text-[13px] font-semibold text-primary">
                  Pertemuan {activeMeeting.number}
                </p>
                <h2 className="mt-3 line-clamp-2 font-bold leading-6 text-main">{activeMeeting.title}</h2>
                <Button
                  type="button"
                  className="mt-4 w-full"
                  onClick={scrollToActiveMeeting}
                >
                  Lanjutkan Belajar
                </Button>
              </>
            ) : (
              <p className="mt-3 text-sm text-secondary">Belum ada materi aktif saat ini.</p>
            )}
          </Card>

          {nextTask ? <NextDeadlineCard activity={nextTask} onViewTasks={showTasks} /> : null}
          <LecturerCard
            name={lecturerName}
            degree={lecturerDegree}
            onOpenForum={showForum}
          />
        </aside>
      </div>
      <MobileCourseTabs activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default CourseDetailPage;
