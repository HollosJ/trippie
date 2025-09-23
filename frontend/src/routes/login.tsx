import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import LoginForm from '../components/LoginForm';

const redirectFallback = '/trips' as const;

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || redirectFallback });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  return (
    <div className="container my-8 md:my-16 md:max-w-screen-md">
      <h1 className="mb-4 text-2xl">Log In</h1>

      <LoginForm />

      <p className="mt-4">
        Don't have an account?{' '}
        <Link to="/register" className="underline">
          Register now
        </Link>
      </p>
    </div>
  );
}
