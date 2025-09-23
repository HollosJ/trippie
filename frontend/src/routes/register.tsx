import { createFileRoute, Link } from '@tanstack/react-router';
import { RegisterForm } from '../components/RegisterForm';

export const Route = createFileRoute('/register')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container my-8 md:my-16 md:max-w-screen-md">
      <h1 className="mb-8 text-2xl">Register</h1>

      <RegisterForm className="bg-white p-8 shadow" />

      <p className="mt-4">
        Aleady have an account?{' '}
        <Link to="/login" className="underline">
          Login
        </Link>
      </p>
    </div>
  );
}
