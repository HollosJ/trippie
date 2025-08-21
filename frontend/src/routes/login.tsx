import { createFileRoute, Link } from "@tanstack/react-router";
import LoginForm from "../components/LoginForm";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container my-8 md:my-16">
      <h1 className="font-bold text-3xl">Login</h1>

      <LoginForm />

      <Link to="/register">I dont have an account</Link>
    </div>
  );
}
