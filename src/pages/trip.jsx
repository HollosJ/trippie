import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircleIcon } from '@heroicons/react/16/solid';
import supabaseClient from '@/utils/supabase/supabaseClient';
import TripInfoPanel from '@/components/TripInfoPanel';
import Modal from '@/components/Modal';
import { toast } from 'sonner';

const Activity = ({ activity, setActivityEditing, setModalOpen }) => {
  return (
    <button
      className="p-2 text-left text-black whitespace-normal transition-all bg-white rounded shadow-md hover:shadow-lg"
      onClick={() => {
        setActivityEditing(activity);
        setModalOpen(true);
      }}
    >
      <h3 className="text-lg font-bold">{activity.title}</h3>

      {activity.location && <span>{activity.location}</span>}

      {activity.notes && (
        <p className="text-sm text-gray-500">"{activity.notes}"</p>
      )}
    </button>
  );
};

const DayColumn = ({
  trip,
  activities,
  index,
  setModalOpen,
  setActivityEditing,
}) => {
  // Filter activities for current day
  const tripStartDate = new Date(trip.start_date);
  const currentDay = new Date(
    tripStartDate.setDate(tripStartDate.getDate() + index)
  )
    .toISOString()
    .split('T')[0];

  const dayActivities = activities.filter(
    (activity) => activity?.date === currentDay
  );

  return (
    <div className="inline-grid content-start no-scrollbar gap-4 p-2 text-left min-w-[320px] max-w-[320px] border-r">
      <h2 className="text-right text-gray-400">{index + 1}</h2>

      {dayActivities.length > 0 && (
        <div className="grid h-full gap-4">
          {dayActivities.map((activity) => (
            <Activity
              key={activity.id}
              activity={activity}
              setActivityEditing={setActivityEditing}
              setModalOpen={setModalOpen}
            />
          ))}
        </div>
      )}

      <button
        className="button button--secondary"
        onClick={() => {
          setActivityEditing({
            title: '',
            location: '',
            date: currentDay,
            notes: '',
          });

          setModalOpen(true);
        }}
      >
        <PlusCircleIcon className="w-6 h-6 text-slate-300" />
      </button>
    </div>
  );
};

const Trip = () => {
  const [trip, setTrip] = useState({});
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [activityEditing, setActivityEditing] = useState({
    title: '',
    location: '',
    date: '',
    notes: '',
  });

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

    // Fetch activities for the trip
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

  const handleActivityFormSubmit = async (e) => {
    e.preventDefault();

    if (activityEditing.id) {
      editExistingActivity();
      return;
    }

    const newActivity = {
      id: uuidv4(),
      title: activityEditing.title,
      location: activityEditing.location,
      date: activityEditing.date,
      notes: activityEditing.notes,
      trip_id: trip.id,
    };

    const { error } = await supabaseClient
      .from('activities')
      .insert(newActivity)
      .single();

    if (error) {
      setError('An error occurred while adding the activity.' + error.message);
      toast.error(
        'An error occurred while adding the activity.' + error.message
      );
      return;
    }

    setActivities([...activities, newActivity]);
    setModalOpen(false);
    toast.success('🎉 Activity added');
  };

  const editExistingActivity = async () => {
    const { error } = await supabaseClient
      .from('activities')
      .update({
        title: activityEditing.title,
        location: activityEditing.location,
        date: activityEditing.date,
        notes: activityEditing.notes,
      })
      .eq('id', activityEditing.id);

    if (error) {
      setError('An error occurred while updating the activity.');
      return;
    }

    setActivities(
      activities.map((activity) =>
        activity.id === activityEditing.id ? activityEditing : activity
      )
    );

    toast.success('🔄 Activity updated');
    setModalOpen(false);
  };

  const deleteActivity = async (activityId) => {
    const { error } = await supabaseClient
      .from('activities')
      .delete()
      .eq('id', activityId);

    if (error) {
      setError('An error occurred while deleting the activity.');
      return;
    }

    setActivities(activities.filter((activity) => activity.id !== activityId));
    toast.success('🗑️ Activity deleted');
    setModalOpen(false);
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
                  setModalOpen={setModalOpen}
                  activityEditing={activityEditing}
                  setActivityEditing={setActivityEditing}
                />
              ))}
          </main>
        </div>
      )}

      {!error && (
        <Modal trigger={modalOpen} setTrigger={setModalOpen}>
          <form onSubmit={handleActivityFormSubmit} className="grid gap-8">
            <h2 className="text-2xl font-bold">Add Activity</h2>

            <div className="grid">
              <label htmlFor="title">Title</label>
              <input
                className="input"
                type="text"
                id="title"
                value={activityEditing.title}
                onChange={(e) =>
                  setActivityEditing({
                    ...activityEditing,
                    title: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid">
              <label htmlFor="location">Location</label>
              <input
                className="input"
                type="text"
                id="location"
                value={activityEditing.location}
                onChange={(e) =>
                  setActivityEditing({
                    ...activityEditing,
                    location: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid">
              <label htmlFor="date">Date</label>
              <input
                className="input"
                type="date"
                id="date"
                value={activityEditing.date}
                onChange={(e) =>
                  setActivityEditing({
                    ...activityEditing,
                    date: e.target.value,
                  })
                }
                min={trip.start_date}
                max={trip.end_date}
                required
              />
            </div>

            <div className="grid">
              <label htmlFor="notes">Notes</label>
              <textarea
                className="input"
                id="notes"
                value={activityEditing.notes}
                onChange={(e) =>
                  setActivityEditing({
                    ...activityEditing,
                    notes: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              {/* Delete button */}
              {activityEditing.id && (
                <button
                  type="button"
                  className="button button--danger"
                  onClick={() => {
                    deleteActivity(activityEditing.id);
                  }}
                >
                  Delete
                </button>
              )}

              <button type="submit" className="button button--primary">
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Trip;
