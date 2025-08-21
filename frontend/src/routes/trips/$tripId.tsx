import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { apiFetch } from "../../utils/api";

export const Route = createFileRoute("/trips/$tripId")({
  // Get trip id from params and fetch all relevant data
  loader: async ({ params }) => {
    return apiFetch(`/trips/${params.tripId}`);
  },
  component: () => (
    <ProtectedRoute>
      <TripPage />
    </ProtectedRoute>
  ),
});

function TripPage() {
  const trip = Route.useLoaderData();

  return <pre>{JSON.stringify(trip, null, 2)}</pre>;
}
