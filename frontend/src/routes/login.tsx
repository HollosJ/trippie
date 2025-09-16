import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { z } from 'zod';

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
  const { auth } = Route.useRouteContext();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await auth.login(email, password);
      // Navigate to the redirect URL using router navigation
      await router.invalidate();

      await navigate({
        to: search.redirect || redirectFallback,
      });
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: Convert to React Query

  return (
    <div className="container my-8 md:my-16 md:max-w-screen-md">
      <h1 className="text-3xl">Log In</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-8 rounded bg-white p-8 shadow"
      >
        {error && (
          <div className="border-danger text-danger rounded border bg-red-100 px-4 py-3">
            {error}
          </div>
        )}

        <div className="grid">
          <label htmlFor="email" className="">
            Email
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid">
          <label htmlFor="password" className="">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isLoading} className="btn btn--primary">
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p>
        Don't have an account?{' '}
        <Link to="/register" className="underline">
          Register
        </Link>
      </p>
    </div>
  );
}
