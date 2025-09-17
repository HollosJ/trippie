import { createFileRoute, Link } from '@tanstack/react-router';
import TripsGrid from '../components/TripsGrid';
import type { Trip } from '../types';
import { apiFetch } from '../utils/api';

export const Route = createFileRoute('/_auth/trips/')({
  // /trips
  loader: async () => {
    return apiFetch('/trips') as Promise<Trip[]>;
  },
  component: Trips,
});

function Trips() {
  const trips = Route.useLoaderData() as Trip[];

  return (
    <div className="container my-8 md:my-16 md:max-w-screen-md">
      <h1 className="text-3xl">My Trips</h1>

      <TripsGrid trips={trips} className="mt-8" />

      <Link to="/trips/new" className="btn btn--primary mt-8">
        Create New Trip
      </Link>
    </div>
  );
}
