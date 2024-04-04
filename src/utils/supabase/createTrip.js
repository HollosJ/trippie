import supabaseClient from './supabaseClient';

const createTrip = async (trip) => {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  // Insert new trip
  const { error } = await supabaseClient
    .from('trips')
    .insert({
      user_id: user.id,
      location: trip.location,
      start_date: trip.start_date,
      end_date: trip.end_date,
    })
    .single();

  if (error) {
    console.error('Error inserting new trip:', error.message);
    return;
  }
};
export default createTrip;
