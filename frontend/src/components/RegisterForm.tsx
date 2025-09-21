import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthProvider';

interface RegisterFormProps {
  className?: string;
}

export function RegisterForm({ className }: RegisterFormProps) {
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
    <form className={`grid gap-8 ${className || ''}`} onSubmit={handleSubmit}>
      <div className="grid">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="grid">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {mutation.isError && (
        <span className="text-danger font-bold">{mutation.error.message}</span>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="btn btn--primary"
      >
        {mutation.isPending ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
