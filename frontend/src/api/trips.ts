import type { Activity } from '../types';
import { apiFetch } from '../utils/api';

export async function deleteTrip(tripId: number) {
  return apiFetch(`/trips/${tripId}`, {
    method: 'DELETE',
  });
}

export async function patchActivity(activity: Activity) {
  const { id } = activity;
  return apiFetch(`/activities/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(activity),
  });
}
