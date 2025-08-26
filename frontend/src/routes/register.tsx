import { createFileRoute, Link } from '@tanstack/react-router';
import { RegisterForm } from '../components/RegisterForm';

export const Route = createFileRoute('/register')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container my-8 md:my-16 md:max-w-screen-md">
      <h1 className="font-bold text-3xl mb-8">Register</h1>

      <RegisterForm />

      <p>
        Aleady have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
