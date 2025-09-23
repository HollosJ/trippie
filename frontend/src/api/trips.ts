import type { CreateTripType } from '../components/CreateTripForm';
import { apiFetch } from '../utils/api';

export async function fetchTrips() {
  return apiFetch('/trips');
}

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
