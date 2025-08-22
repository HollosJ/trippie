import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { apiFetch } from '../../utils/api';
import { useMutation } from '@tanstack/react-query';
import { deleteTrip } from '../../api/trips';
import type { Trip } from '../../types';

export const Route = createFileRoute('/trips/$tripId')({
  // Get trip id from params and fetch all relevant data
  loader: async ({ params }) => {
    if (!localStorage.getItem('token')) return;

    return apiFetch(`/trips/${params.tripId}`);
  },
  component: () => (
    <ProtectedRoute>
      <TripPage />
    </ProtectedRoute>
  ),
});

function TripPage() {
  const navigate = useNavigate();
  const trip = Route.useLoaderData() as Trip;

  console.log(trip);

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
    <div className="container">
      <pre>{JSON.stringify(trip, null, 2)}</pre>

      <button
        className="mt-8 btn btn--primary"
        onClick={() => deleteMutation.mutate()}
      >
        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
