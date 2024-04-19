import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import supabaseClient from '@/utils/supabase/supabaseClient';
import TripInfoPanel from '@/components/TripInfoPanel';

const Activity = ({ activity }) => {
  return (
    <div className="p-2 text-black whitespace-normal bg-white rounded shadow-md">
      <h3 className="text-lg font-bold">{activity.title}</h3>

      {activity.location && <span>{activity.location}</span>}
    </div>
  );
};

const DayColumn = ({ trip, activities, index }) => {
  // Filter activities for current day
  const tripStartDate = new Date(trip.start_date);
  const tripEndDate = new Date(trip.end_date);

  const dayActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.date);

    return (
      activityDate.getDate() === tripStartDate.getDate() + index &&
      activityDate >= tripStartDate &&
      activityDate <= tripEndDate
    );
  });

  return (
    <div className="inline-grid content-start no-scrollbar gap-4 p-2 text-left min-w-[320px] max-w-[320px] border-r">
      <h2 className="text-right text-gray-400">{index + 1}</h2>

      {dayActivities.length > 0 && (
        <div className="grid h-full gap-4">
          {dayActivities.map((activity) => (
            <Activity activity={activity} key={activity.id} />
          ))}
        </div>
      )}
    </div>
  );
};

const Trip = () => {
  const [trip, setTrip] = useState({});
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(0);

  // Fetch trip and activities based on trip ID from URL
  useEffect(() => {
    // Get trip ID from router params
    const tripId = window.location.pathname.split('/').pop();

    // Fetch trip details
    const fetchTrip = async () => {
      // Get current user
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      const { data: trip, error } = await supabaseClient
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

      if (error) {
        setError(
          'An error occurred while fetching the trip. The trip may no longer exist.'
        );
        setLoading(false);
        return;
      }

      // Check if the current user matches the trip in the user_trips relational database
      const { data: userTrip } = await supabaseClient
        .from('user_trips')
        .select('*')
        .eq('user_id', user.id)
        .eq('trip_id', tripId)
        .single();

      if (!userTrip) {
        setError('You do not have permission to view this trip.');
        setLoading(false);
        return;
      }

      setTrip(trip);

      setDays(
        Math.floor(
          (new Date(trip.end_date) - new Date(trip.start_date)) /
            (1000 * 60 * 60 * 24)
        ) + 1
      );

      setLoading(false);
    };

    // Fetch activities
    const fetchActivities = async () => {
      const { data: activities, error } = await supabaseClient
        .from('activities')
        .select('*')
        .eq('trip_id', tripId);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setActivities(activities);
    };

    fetchTrip();
    fetchActivities();
  }, []);

  const deleteTrip = async () => {
    const tripId = window.location.pathname.split('/').pop();

    // Delete trip and all associated activities
    const { error: tripError } = await supabaseClient
      .from('trips')
      .delete()
      .eq('id', tripId);

    const { error: activityError } = await supabaseClient
      .from('activities')
      .delete()
      .eq('trip_id', tripId);

    if (tripError || activityError) {
      setError('An error occurred while deleting the trip.');
      return;
    }

    // Redirect to trips page
    window.location.href = '/trips';
  };

  return (
    <div className="grid flex-auto h-full">
      {error && (
        <p className="flex items-center justify-center h-full text-2xl text-red-500">
          {error}
        </p>
      )}

      {!error && (
        <div className="grid content-start grid-rows-[min-content,1fr] md:grid-rows-1 md:content-stretch md:grid-cols-[min-content,1fr]">
          <TripInfoPanel
            trip={trip}
            loading={loading}
            deleteTrip={deleteTrip}
          />

          <main className="relative flex h-full overflow-x-auto shadow-inner whitespace-nowrap no-scrollbar">
            <div className="fixed z-10 w-4 h-full bg-gradient-to-r from-slate-50 to-transparent"></div>

            {days > 0 &&
              [...Array(days)].map((_, index) => (
                <DayColumn
                  key={uuidv4()}
                  trip={trip}
                  activities={activities}
                  index={index}
                />
              ))}
          </main>
        </div>
      )}
    </div>
  );
};

export default Trip;
