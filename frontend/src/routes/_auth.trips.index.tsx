import { createFileRoute, Link } from '@tanstack/react-router';
import TripsGrid from '../components/TripsGrid';
import type { Trip } from '../types';
import { fetchTrips } from '../api/trips';

export const Route = createFileRoute('/_auth/trips/')({
  // /trips
  loader: fetchTrips,
  component: Trips,
});

function Trips() {
  const trips = Route.useLoaderData() as Trip[];

  return (
    <div className="container my-8 md:my-16 md:max-w-screen-md">
      <h1 className="text-2xl">My Trips</h1>

      <TripsGrid trips={trips} className="mt-8" />

      <Link to="/trips/new" className="btn btn--primary mt-8">
        Create New Trip
      </Link>
    </div>
  );
}
