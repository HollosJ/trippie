import type { Activity, Trip } from '../types';

export const formatDate = (date: Date) => date.toISOString().split('T')[0];

export function createDayArray(start: string, end: string) {
  const arr: string[] = [];
  const current = new Date(start);

  while (current <= new Date(end)) {
    // Force UTC midnight ISO
    arr.push(current.toISOString().split('T')[0] + 'T00:00:00.000Z');
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return arr;
}

export function groupActivitiesByDate<
  T extends Trip & { activities: Activity[] },
>(trip: T) {
  const dateArray = createDayArray(trip.startDate, trip.endDate);

  const grouped = trip.activities.reduce(
    (acc, activity) => {
      const day =
        new Date(activity.date).toISOString().split('T')[0] + 'T00:00:00.000Z';
      (acc[day] ||= []).push(activity);
      return acc;
    },
    {} as Record<string, Activity[]>
  );

  const fullMap: Record<string, Activity[]> = {};
  for (const day of dateArray) {
    fullMap[day] = grouped[day] || [];
  }
  return fullMap;
}

export function calculateFractionalIndex(
  prevActivity: Activity,
  nextActivity: Activity
) {
  return prevActivity && nextActivity
    ? (prevActivity.position + nextActivity.position) / 2
    : prevActivity
      ? prevActivity.position + 1
      : nextActivity
        ? nextActivity.position / 2
        : 1;
}
