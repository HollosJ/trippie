import { Link } from '@tanstack/react-router';
import type { Trip } from '../types';

function TripsGridItem({ trip }: { trip: Trip }) {
  return (
    <Link
      to={`/trips/$tripId`}
      params={{ tripId: String(trip.id) }}
      key={trip.id}
      className="border rounded shadow hover:opacity-50 p-4 transition-opacity"
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

      <div className="grid sm:grid-cols-3 gap-4">
        {trips.map((trip) => (
          <TripsGridItem trip={trip} key={trip.id} />
        ))}
      </div>
    </div>
  );
}
