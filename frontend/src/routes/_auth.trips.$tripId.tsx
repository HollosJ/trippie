import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { deleteTrip } from '../api/trips';
import type { Trip } from '../types';
import { apiFetch } from '../utils/api';
import { createDayArray } from '../utils/helpers';
import DayColumn from '../components/DayColumn';

export const Route = createFileRoute('/_auth/trips/$tripId')({
  // /trips/:id
  loader: async ({ params }) => {
    return apiFetch(`/trips/${params.tripId}`);
  },
  component: TripPage,
});

function TripPage() {
  const navigate = useNavigate();
  const trip = Route.useLoaderData() as Trip;

  const deleteMutation = useMutation({
    mutationFn: () => deleteTrip(trip.id),
    onSuccess: () => {
      navigate({ to: '/trips' });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <div className="flex divide-x divide-x-black min-h-dvh">
      {createDayArray(new Date(trip.startDate), new Date(trip.endDate)).map(
        (date) => (
          <DayColumn title={date} key={date} activities={[]} />
        )
      )}
    </div>
  );
}
