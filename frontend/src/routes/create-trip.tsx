import { createFileRoute } from "@tanstack/react-router";
import CreateTripForm from "../components/CreateTripForm";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const Route = createFileRoute("/create-trip")({
  component: () => (
    <ProtectedRoute>
      <RouteComponent />
    </ProtectedRoute>
  ),
});

function RouteComponent() {
  return <CreateTripForm />;
}
