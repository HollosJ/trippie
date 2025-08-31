import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { deleteTrip } from '../api/trips';
import TripBoard from '../components/TripBoard';
import type { Trip } from '../types';
import { apiFetch } from '../utils/api';
import TripAside from '../components/TripAside';

export const Route = createFileRoute('/_auth/trips/$tripId')({
  // /trips/:id
  component: TripPage,
});

function TripPage() {
  const { tripId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: trip } = useQuery<Trip>({
    queryKey: ['trip', tripId],
    queryFn: () =>
      apiFetch(`/trips/${tripId}?activities=true&groupByDate=true`),
  });

  const deleteTripMutation = useMutation({
    mutationFn: () => deleteTrip(Number(tripId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
      navigate({ to: '/trips' });
    },
  });

  if (!trip) return <div>Loading...</div>;

  return (
    <div className='flex'>
      <TripAside trip={trip} handleDelete={deleteTripMutation.mutate} />
      <TripBoard trip={trip} />
    </div>
  );
}
