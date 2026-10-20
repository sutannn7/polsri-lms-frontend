import { useMemo } from 'react';
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
  // Agenda dihitung ulang tiap render (hanya 13 baris jadwal) agar status
  // pertemuan bisa berganti Berlangsung/Selesai tanpa memuat ulang halaman.
  const agenda = getTodayAgenda();
  return { ...data, agenda, nextMeeting: agenda.nextMeeting };
}

export default useHomeData;
