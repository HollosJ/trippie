import { useEffect, useState } from 'react';
import supabaseClient from '../utils/supabase/supabaseClient';
import formatDate from '../utils/helpers/formatDate';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      const { data, error } = await supabaseClient
        .from('user_trips')
        .select('trip_id, user_id');

      if (error) console.error('error', error);
      else {
        const tripIds = data.map((trip) => trip.trip_id);

        const { data: tripsData, error: tripsError } = await supabaseClient
          .from('trips')
          .select('*')
          .in('id', tripIds);

        if (tripsError) console.error('error', tripsError);
        else setTrips(tripsData);
      }

      setLoading(false);
    };
    fetchTrips();
  }, []);

  return (
    <div className="container grid my-8 md:max-w-screen-md">
      <h1 className="text-2xl md:text-4xl">My Trips</h1>

      <div className="grid gap-4 mt-8 md:grid-cols-3">
        {loading ? (
          <>
            <div className="h-16 skeleton"></div>
            <div className="h-16 skeleton"></div>
            <div className="h-16 skeleton"></div>
          </>
        ) : (
          trips.map((trip) => (
            <a
              className="p-4 bg-white rounded shadow-md"
              href={`/trips/${trip.id}`}
              key={trip.id}
            >
              <h2>{trip.location}</h2>

              <span>{formatDate(trip.start_date)}</span>
            </a>
          ))
        )}
      </div>
    </div>
  );
};

export default Trips;
