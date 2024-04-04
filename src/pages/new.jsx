import { useState } from 'react';
import supabaseClient from '../utils/supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const NewTrip = () => {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [trip, setTrip] = useState({
    location: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  });

  const createTrip = async (e) => {
    const tripId = uuidv4();

    try {
      e.preventDefault();

      if (!trip.location) throw new Error('Please enter a location.');

      if (trip.start_date > trip.end_date)
        throw new Error('Leaving date must be after arrival date.');

      // Set 'loading' state so we can disable submit button once pressed
      setSubmitting(true);

      // Get current user
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      // Insert new trip
      const { error } = await supabaseClient
        .from('trips')
        .insert({
          id: tripId,
          user_id: user.id,
          location: trip.location,
          start_date: trip.start_date,
          end_date: trip.end_date,
        })
        .single();

      // Create relationship between user and trip
      await supabaseClient.from('user_trips').insert([
        {
          user_id: user.id,
          trip_id: tripId,
        },
      ]);

      if (error) {
        console.error('Error inserting new trip:', error.message);
        return;
      }

      // Reset 'loading' state
      setSubmitting(false);

      // Redirect to home page
      navigate('/trips');
    } catch (error) {
      console.error('Error creating trip:', error.message);
    }
  };

  return (
    <div className="container my-8 md:max-w-screen-md">
      <form
        onSubmit={createTrip}
        className="grid gap-8 p-4 bg-white rounded shadow-md"
      >
        <h1 className="text-4xl">Create Trip</h1>

        <div className="grid">
          <label htmlFor="location">Where are you going?</label>

          <input
            id="location"
            type="text"
            value={trip.location}
            onChange={(e) => setTrip({ ...trip, location: e.target.value })}
            placeholder="Tromsø, Norway"
            className="input"
            required
          />
        </div>

        <div className="grid gap-8 md:gap-4 md:grid-cols-2">
          {/* Start */}
          <div className="grid">
            <label htmlFor="start_date">Arrival Date</label>

            <input
              id="start_date"
              type="date"
              value={trip.start_date}
              onChange={(e) => {
                let newTrip = { ...trip, start_date: e.target.value };

                if (!trip.end_date) {
                  newTrip = { ...newTrip, end_date: e.target.value };
                }

                setTrip(newTrip);
              }}
              className="w-full input"
              required
            />
          </div>

          {/* End */}
          <div className="grid">
            <label htmlFor="end_date">Leaving Date</label>

            <input
              className="w-full input"
              type="date"
              id="end_date"
              value={trip.end_date}
              min={trip.start_date || false}
              required
              onChange={(e) => setTrip({ ...trip, end_date: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-self-end">
          <button
            type="button"
            className="button button--secondary"
            onClick={() => navigate('/trips')}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="button button--primary"
            disabled={submitting}
          >
            {submitting ? 'Creating Trip...' : 'Create Trip'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTrip;
