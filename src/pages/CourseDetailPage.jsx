import { useEffect, useMemo, useState } from 'react';
import { BookOpenText, MessagesSquare } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../components/layout/Breadcrumb';
import TracingBeam from '../components/aceternity/TracingBeam';
import ActivityItem from '../components/course/ActivityItem';
import CourseHeader from '../components/course/CourseHeader';
import LecturerCard from '../components/course/LecturerCard';
import MeetingAccordion from '../components/course/MeetingAccordion';
import MobileCourseTabs from '../components/course/MobileCourseTabs';
import NextDeadlineCard from '../components/course/NextDeadlineCard';
import Tabs from '../components/ui/Tabs';
import Card from '../components/ui/Card';
import useCourses from '../hooks/useCourses';
import { setLastOpenedCourseId } from '../services/courseService';
import { isUpcomingDeadline } from '../utils/formatDate';

function CourseDetailPage() {
  const { id } = useParams();
  const { courses, getCourseMeetings } = useCourses();
  const [activeTab, setActiveTab] = useState('materials');
  const course = courses.find((item) => item.id === id);
  const meetings = useMemo(() => getCourseMeetings(id), [getCourseMeetings, id]);
  useEffect(() => {
    if (course) setLastOpenedCourseId(course.id);
  }, [course?.id]);

  if (!course) {
    return (
      <section className="rounded-card border border-border bg-white p-6 shadow-card sm:p-8">
        <Link to="/mata-kuliah" className="text-sm font-semibold text-primary hover:text-primary-dark">
          Kembali ke Mata Kuliah Saya
        </Link>
        <h1 className="mt-5 text-2xl font-bold text-main">Mata kuliah tidak ditemukan</h1>
        <p className="mt-2 text-sm text-secondary">Kode mata kuliah {id} tidak terdaftar.</p>
      </section>
    );
  }

  const completedActivities = meetings.reduce(
    (total, meeting) => total + meeting.activities.filter((activity) => activity.completed).length,
    0,
  );
  const totalActivities = meetings.reduce(
    (total, meeting) => total + meeting.activities.length,
    0,
  );
  const tasks = meetings
    .flatMap((meeting) => meeting.activities.filter((activity) => activity.type === 'assignment'))
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  const nextTask = tasks.find((task) => !task.completed && isUpcomingDeadline(task));
  const activeMeeting = meetings.find((meeting) => meeting.status === 'active')
    ?? [...meetings].reverse().find((meeting) => meeting.status === 'completed');
  const activeQuiz = activeMeeting?.activities.find((activity) => activity.type === 'quiz');
  const [lecturerName, ...degreeParts] = course.lecturer.split(', ');
  const lecturerDegree = degreeParts.join(', ');

  const tabs = [
    { id: 'materials', label: 'Materi pembelajaran', count: meetings.length },
    { id: 'tasks', label: 'Tugas', count: tasks.length },
    { id: 'forum', label: 'Forum diskusi', count: 3 },
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
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Mata Kuliah Saya', href: '/mata-kuliah' },
          { label: course.id, href: `/mata-kuliah/${course.id}` },
          { label: activeMeeting ? `Pertemuan ${activeMeeting.number}` : 'Detail Mata Kuliah' },
        ]}
      />

      <CourseHeader
        course={course}
        completedActivities={completedActivities}
        totalActivities={totalActivities}
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0 space-y-5" aria-label="Konten mata kuliah">
          <Tabs
            tabs={tabs}
            value={activeTab}
            onChange={setActiveTab}
            className={'border-b border-border pb-3' /* taste-skill-ignore: underline tab bar */}
          />

          <TracingBeam>
            {activeTab === 'materials' ? (
            meetings.length > 0 ? (
              <div className="space-y-3">
                {meetings.map((meeting) => (
                  <div key={meeting.number} id={`pertemuan-${meeting.number}`}>
                    <MeetingAccordion
                      meeting={meeting}
                      defaultOpen={meeting.number === activeMeeting?.number}
                      onActivityAction={(activity) => {
                        if (activity.type === 'assignment') showTasks();
                      }}
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
                  <ActivityItem key={task.title} activity={task} />
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
          </TracingBeam>
        </section>

        <aside className="space-y-4" aria-label="Informasi pembelajaran">
          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-main">
              <BookOpenText size={18} aria-hidden="true" className="text-primary" />
              Lanjutkan dari sini
            </div>
            {activeMeeting && activeQuiz ? (
              <>
                <p className="mt-4 inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-dark">
                  Pertemuan {activeMeeting.number} • Kuis
                </p>
                <h2 className="mt-3 font-bold leading-6 text-main">{activeMeeting.title}</h2>
                <p className="mt-2 text-sm leading-5 text-secondary">{activeQuiz.description}</p>
                <p className="mt-3 text-sm font-medium text-secondary">{activeQuiz.duration}</p>
                <button
                  type="button"
                  onClick={scrollToActiveMeeting}
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {activeQuiz.completed ? 'Tinjau Kuis' : 'Lanjutkan Belajar'}
                </button>
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
