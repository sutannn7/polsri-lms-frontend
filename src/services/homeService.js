import announcementsData from '../data/announcements.json';
import deadlinesData from '../data/deadlines.json';
import meetingsData from '../data/meetings.json';
import { buildAgenda } from '../utils/schedule';

function jakartaDueAt(daysFromToday) {
  const target = new Date(Date.now() + daysFromToday * 86_400_000);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(target);
  const date = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${date.year}-${date.month}-${date.day}T23:59:00+07:00`;
}

export function getAnnouncements() {
  return announcementsData.map((announcement) => ({ ...announcement }));
}

export function getDeadlines() {
  // Seed deadlines are relative to today so the demo never reaches a state
  // where every deadline is already in the past.
  return deadlinesData.map(({ dueInDays = 0, ...deadline }) => ({
    ...deadline,
    dueAt: jakartaDueAt(dueInDays),
  }));
}

export function getMeetings() {
  return meetingsData.schedule.map((meeting) => ({ ...meeting }));
}

export function getTodayAgenda(now = new Date()) {
  return buildAgenda(getMeetings(), now);
}
