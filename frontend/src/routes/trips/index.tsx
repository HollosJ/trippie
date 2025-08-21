import { createFileRoute, Link } from "@tanstack/react-router";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import TripsGrid from "../../components/TripsGrid";
import type { Trip } from "../../types";
import { apiFetch } from "../../utils/api";

export const Route = createFileRoute("/trips/")({
  loader: async () => {
    return apiFetch("/trips") as Promise<Trip[]>;
  },
  component: () => (
    <ProtectedRoute>
      <Trips />
    </ProtectedRoute>
  ),
});
function Trips() {
  const trips = Route.useLoaderData();

  return (
    <div className="container my-8 md:my-16">
      <h1 className="text-3xl">My Trips</h1>

      <TripsGrid trips={trips} />

      <Link to="/create-trip">Create Trip</Link>
    </div>
  );
}
