import { apiFetch } from "../utils/api";

export async function deleteTrip(tripId: number) {
    return apiFetch(`/trips/${tripId}`, {
        method: 'DELETE'
    })
}
