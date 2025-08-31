import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthProvider';
import Form from './Form';

export function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      await register(email, password);
    },
    onSuccess: () => {
      navigate({
        to: '/trips',
      });
    },
    onError: () => {
      console.error('Error during registration');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <Form className="grid gap-8" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {mutation.isError && (
        <span className="font-bold text-red-500">
          {(mutation.error as Error).message}
        </span>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="btn btn--primary"
      >
        {mutation.isPending ? 'Registering...' : 'Register'}
      </button>
    </Form>
  );
}
