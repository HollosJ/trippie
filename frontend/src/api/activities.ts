import type { Activity } from '../types';
import { apiFetch } from '../utils/api';

export async function fetchTripActivities(tripId: number): Promise<Activity[]> {
  return apiFetch(`/trips/${tripId}/activities`);
}

export async function createActivity(activity: Partial<Activity>) {
  return apiFetch('/activities', {
    method: 'POST',
    body: JSON.stringify(activity),
  });
}

export async function patchActivity(activity: Activity) {
  return apiFetch(`/activities/${activity.id}`, {
    method: 'PATCH',
    body: JSON.stringify(activity),
  });
}

export async function deleteActivity(activityId: string) {
  return apiFetch(`/activities/${activityId}`, {
    method: 'DELETE',
  });
}
