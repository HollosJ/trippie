import { createFileRoute } from '@tanstack/react-router';
import CreateTripForm from '../components/CreateTripForm';

export const Route = createFileRoute('/_auth/trips/new')({
  // /trips/new
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateTripForm />;
}
