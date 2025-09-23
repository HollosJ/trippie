import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '../context/AuthProvider';
import ErrorMessage from './ErrorMessage';
import FormError from './FormError';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .refine(
    (val) => /[A-Z]/.test(val),
    'Password must contain at least one uppercase letter',
  )
  .refine(
    (val) => /[a-z]/.test(val),
    'Password must contain at least one lowercase letter',
  )
  .refine(
    (val) => /[0-9]/.test(val),
    'Password must contain at least one number',
  )
  .refine(
    (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
    'Password must contain at least one special character',
  );

const registerSchema = z.object({
  email: z.email(),
  password: passwordSchema,
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [responseError, setResponseError] = useState<string>('');

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: async ({ email, password }: RegisterFormValues) => {
      await register(email, password);
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

  const onSubmit = (data: RegisterFormValues) => mutation.mutate(data);

  return (
    <form
      className={`grid gap-8 rounded bg-white p-4 shadow md:p-8`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid">
        <label htmlFor="email">Email</label>
        <input type="email" {...registerField('email')} />
        <FormError message={errors.email?.message} />
      </div>

      <div className="grid">
        <label htmlFor="password">Password</label>
        <input type="password" {...registerField('password')} />
        <FormError message={errors.password?.message} />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="btn btn--primary"
      >
        {mutation.isPending ? 'Registering...' : 'Register'}
      </button>

      <ErrorMessage message={responseError} />
    </form>
  );
}
