import type { Activity } from '../types';
import { apiFetch } from '../utils/api';

export async function deleteTrip(tripId: number) {
  return apiFetch(`/trips/${tripId}`, {
    method: 'DELETE',
  });
}

export async function patchActivity(activity: Activity) {
  return apiFetch(`/activities/${activity.id}`, {
    method: 'PATCH',
    body: JSON.stringify(activity),
  });
}

export async function deleteActivity(activity: Activity) {
  return apiFetch(`/activities/${activity.id}`, {
    method: 'DELETE',
  });
}
