import announcementsData from '../data/announcements.json';
import deadlinesData from '../data/deadlines.json';
import meetingsData from '../data/meetings.json';

export function getAnnouncements() {
  return announcementsData.map((announcement) => ({ ...announcement }));
}

export function getDeadlines() {
  return deadlinesData.map((deadline) => ({ ...deadline }));
}

export function getMeetings() {
  return meetingsData.schedule.map((meeting) => ({ ...meeting }));
}
