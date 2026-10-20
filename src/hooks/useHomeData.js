import { useEffect, useMemo, useState } from 'react';
import { getAnnouncements, getDeadlines, getMeetings, getTodayAgenda } from '../services/homeService';

function useHomeData() {
  const data = useMemo(
    () => ({
      announcements: getAnnouncements(),
      deadlines: getDeadlines(),
      meetings: getMeetings(),
    }),
    [],
  );
  const [now, setNow] = useState(() => new Date());
  // Segarkan tiap menit agar status Berlangsung/Selesai ikut berganti tanpa
  // memuat ulang halaman saat sesi kelas mulai atau berakhir.
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);
  const agenda = useMemo(() => getTodayAgenda(now), [now]);
  return { ...data, agenda, nextMeeting: agenda.nextMeeting };
}

export default useHomeData;
