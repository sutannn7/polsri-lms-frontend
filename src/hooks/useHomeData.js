import { useMemo } from 'react';
import { getAnnouncements, getDeadlines, getMeetings, getTodayAgenda } from '../services/homeService';

function useHomeData() {
  return useMemo(() => {
    // "now" dipatok sekali per pemuatan data agar agenda stabil selama render.
    const now = new Date();
    const agenda = getTodayAgenda(now);
    return {
      announcements: getAnnouncements(),
      deadlines: getDeadlines(),
      meetings: getMeetings(),
      agenda,
      nextMeeting: agenda.nextMeeting,
    };
  }, []);
}

export default useHomeData;
