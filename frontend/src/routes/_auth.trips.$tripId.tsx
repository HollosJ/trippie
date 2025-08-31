import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { deleteTrip } from '../api/trips';
import TripBoard from '../components/TripBoard';
import type { Trip } from '../types';
import { apiFetch } from '../utils/api';
import TripAside from '../components/TripAside';

export const Route = createFileRoute('/_auth/trips/$tripId')({
  // /trips/:id
  loader: async ({ params }) => {
    return apiFetch(`/trips/${params.tripId}?activities=true&groupByDate=true`);
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
    <div className='flex'>
      <TripAside trip={trip} />

      <TripBoard trip={trip} />
    </div>
  );
}
