import { createFileRoute, Link } from "@tanstack/react-router";
import { RegisterForm } from "../components/RegisterForm";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container my-8 md:my-16">
      <h1 className="font-bold text-3xl">Register</h1>

      <RegisterForm />

      <Link to="/login">I already have an account</Link>
    </div>
  );
}
