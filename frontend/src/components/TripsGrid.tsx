import { Link } from '@tanstack/react-router';
import type { Trip } from '../types';

interface TripsGridProps {
  trips: Trip[];
}

export default function TripsGrid({ trips }: TripsGridProps) {
  return (
    <div>
      {trips.map((trip) => (
        <Link
          to={`/trips/$tripId`}
          params={{ tripId: String(trip.id) }}
          key={trip.id}
        >
          {trip.name}
        </Link>
      ))}
    </div>
  );
}
