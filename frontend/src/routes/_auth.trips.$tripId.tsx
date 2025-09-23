import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { deleteTrip } from '../api/trips';
import LoadingSpinner from '../components/LoadingSpinner';
import TripAside from '../components/TripAside';
import TripBoard from '../components/TripBoard';
import type { Trip } from '../types';
import { apiFetch } from '../utils/api';

export const Route = createFileRoute('/_auth/trips/$tripId')({
  // /trips/:id
  component: TripPage,
});

function TripPage() {
  const { tripId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery<Trip>({
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

  if (error)
    return (
      <div className="container my-8 text-center md:my-16">
        <h1 className="text-danger text-2xl">
          There was an error fetching this trip!
        </h1>

        <Link to="/trips" className="mt-8 font-bold">
          Go back
        </Link>
      </div>
    );

  if (isPending || !data)
    return (
      <div className="container my-8 flex items-center justify-center md:my-16">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="flex">
      <TripAside trip={data} handleDelete={deleteTripMutation.mutate} />
      <TripBoard trip={data} />
    </div>
  );
}
