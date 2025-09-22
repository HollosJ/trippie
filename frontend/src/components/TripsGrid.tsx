import { Link } from '@tanstack/react-router';
import type { Trip } from '../types';

function TripsGridItem({ trip }: { trip: Trip }) {
  return (
    <Link
      to={`/trips/$tripId`}
      params={{ tripId: String(trip.id) }}
      key={trip.id}
      className="rounded bg-white p-4 shadow transition-opacity hover:opacity-75"
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
  const list = trips.reduce(
    (acc: { upcoming: Trip[]; past: Trip[] }, item: Trip) => {
      if (new Date(item.startDate) < new Date()) {
        acc.past.push(item);
      } else {
        acc.upcoming.push(item);
      }

      return acc;
    },
    {
      upcoming: [],
      past: [],
    },
  );

  return (
    <div className={` ${className || ''}`}>
      {trips.length === 0 && <div>You have no trips yet!</div>}

      {list.upcoming.length > 0 && (
        <div className="grid gap-4">
          <h2 className="text-lg">Upcoming trips</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {list.upcoming.map((trip) => (
              <TripsGridItem trip={trip} key={trip.id} />
            ))}
          </div>
        </div>
      )}

      {list.past.length > 0 && (
        <div className="mt-4 grid gap-4">
          <h2 className="text-lg">Past trips</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {list.past.map((trip) => (
              <TripsGridItem trip={trip} key={trip.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
