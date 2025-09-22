import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createTrip } from '../api/trips';
import FormError from './FormError';

interface CreateTripFormProps {
  className?: string;
}

const tripSchema = z
  .object({
    name: z.string().trim().min(1, 'Trip name is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    path: ['endDate'],
    message: 'End date cannot be before start date',
  });

export type CreateTripType = z.infer<typeof tripSchema>;

export default function CreateTripForm({ className }: CreateTripFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTrip,
    onSuccess: (data: any /* TODO */) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });

      // Take user to their newly created trip
      navigate({
        to: `/trips/${data.trip.id}`,
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateTripType>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      name: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    },
  });

  const startDate = watch('startDate');

  // Keep endDate in sync with startDate:
  // If endDate is missing or before startDate, reset it to match startDate.
  useEffect(() => {
    if (startDate) {
      const currentEndDate = watch('endDate');
      if (!currentEndDate || new Date(currentEndDate) < new Date(startDate)) {
        setValue('endDate', startDate, { shouldValidate: true });
      }
    }
  }, [startDate, watch, setValue]);

  const onSubmit = (data: CreateTripType) => mutation.mutate(data);

  return (
    <div className="container my-8 md:my-16 md:max-w-screen-md">
      <h1 className="text-5xl">Create Trip</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${className || ''} mt-8 grid gap-8 rounded bg-white p-8 shadow`}
      >
        <div className="grid">
          <label htmlFor="name">Where are you going?</label>
          <input id="name" {...register('name')} />
          <FormError message={errors.name?.message} />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="grid">
            <label htmlFor="startDate">From</label>
            <input id="startDate" type="date" {...register('startDate')} />
            <FormError message={errors.startDate?.message} />
          </div>

          <div className="grid">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              {...register('endDate')}
              min={startDate}
            />
            <FormError message={errors.endDate?.message} />
          </div>
        </div>

        <button type="submit" className="btn btn--primary">
          {mutation.isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
