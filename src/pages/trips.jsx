import { useEffect, useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';
import supabaseClient from '@/utils/supabase/supabaseClient';
import formatDate from '@/utils/helpers/formatDate';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      // Get current user
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      const { data: userTrips, error } = await supabaseClient
        .from('user_trips')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching trips:', error.message);
        return;
      }

      const tripIds = userTrips.map((trip) => trip.trip_id);

      const { data: trips, error: tripsError } = await supabaseClient
        .from('trips')
        .select('*')
        .in('id', tripIds);

      if (tripsError) {
        console.error('Error fetching trips:', tripsError.message);
        return;
      }

      setTrips(trips);
      setLoading(false);
    };
    fetchTrips();
  }, []);

  return (
    <div className="container grid my-8 md:max-w-screen-md">
      <h1 className="text-2xl md:text-4xl">My Trips</h1>

      {loading ? (
        <div className="grid gap-4 mt-8 md:grid-cols-3">
          <div className="h-16 skeleton"></div>
          <div className="h-16 skeleton"></div>
          <div className="h-16 skeleton"></div>
        </div>
      ) : trips.length > 0 ? (
        <div className="grid gap-4 mt-8 md:grid-cols-3">
          {trips.map((trip) => (
            <a
              className="p-4 bg-white rounded shadow-md"
              href={`/trips/${trip.id}`}
              key={trip.id}
            >
              <h2>{trip.location}</h2>

              <span>{formatDate(trip.start_date)}</span>
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-lg text-slate-500">
          You don't have any trips yet. Create a new trip to get started!
        </p>
      )}

      {!loading && (
        <a
          className="mt-8 text-white button button--primary bg-gradient-to-tr"
          href="/trips/new"
        >
          Create a new trip <PencilIcon className="w-6 h-6 ml-2" />
        </a>
      )}
    </div>
  );
};

export default Trips;
