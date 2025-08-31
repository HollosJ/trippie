import { Link } from '@tanstack/react-router';
import type { Trip } from '../types';

function TripsGridItem({ trip }: { trip: Trip }) {
  return (
    <Link
      to={`/trips/$tripId`}
      params={{ tripId: String(trip.id) }}
      key={trip.id}
      className="rounded bg-white p-4 shadow transition-opacity hover:opacity-50"
    >
      {trip.name}
    </Link>
  );
}

interface TripsGridProps {
  trips: Trip[];
  className?: string;
}

export default function TripsGrid({ trips, className }: TripsGridProps) {
  return (
    <div className={` ${className || ''}`}>
      {trips.length === 0 && <div>You have no trips yet!</div>}

      <div className="grid gap-4 sm:grid-cols-3">
        {trips.map((trip) => (
          <TripsGridItem trip={trip} key={trip.id} />
        ))}
      </div>
    </div>
  );
}
