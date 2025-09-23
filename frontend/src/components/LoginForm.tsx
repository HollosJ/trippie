import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '../context/AuthProvider';
import FormError from './FormError';
import { useState } from 'react';
import ErrorMessage from './ErrorMessage';

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [responseError, setResponseError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: async ({ email, password }: LoginFormValues) => {
      await login(email, password);
    },
    onSuccess: () => {
      navigate({
        to: '/trips',
      });
    },
    onError: (error) => {
      setResponseError(error.message);
    },
  });

  const onSubmit = (data: LoginFormValues) => mutation.mutate(data);

  return (
    <form
      className="grid gap-8 rounded bg-white p-4 shadow md:p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid">
        <label htmlFor="email">Email</label>
        <input type="email" {...register('email')} />
        <FormError message={errors.email?.message} />
      </div>

      <div className="grid">
        <label htmlFor="password">Password</label>
        <input type="password" {...register('password')} />
        <FormError message={errors.password?.message} />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="btn btn--primary"
      >
        {mutation.isPending ? 'Logging in...' : 'Submit'}
      </button>

      <ErrorMessage message={responseError} />
    </form>
  );
}
