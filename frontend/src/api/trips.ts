import type { CreateTripType } from '../components/CreateTripForm';
import type { Activity } from '../types';
import { apiFetch } from '../utils/api';

export async function createTrip(trip: CreateTripType) {
  // Type comes from Zod schema
  return apiFetch('/trips', {
    method: 'POST',
    body: JSON.stringify({
      ...trip,
      startDate: new Date(trip.startDate),
      endDate: new Date(trip.endDate),
    }),
  });
}

export async function deleteTrip(tripId: number) {
  return apiFetch(`/trips/${tripId}`, {
    method: 'DELETE',
  });
}

export async function createActivity(activity: Activity) {
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

export async function deleteActivity(activity: Activity) {
  return apiFetch(`/activities/${activity.id}`, {
    method: 'DELETE',
  });
}
