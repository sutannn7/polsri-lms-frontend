import { useMemo } from 'react';
import { getAnnouncements, getDeadlines, getMeetings } from '../services/homeService';

function useHomeData() {
  return useMemo(
    () => ({
      announcements: getAnnouncements(),
      deadlines: getDeadlines(),
      meetings: getMeetings(),
    }),
    [],
  );
}

export default useHomeData;
