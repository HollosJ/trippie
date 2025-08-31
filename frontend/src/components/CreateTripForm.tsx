import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';
import Form from './Form';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

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

type Trip = z.infer<typeof tripSchema>;

export default function CreateTripForm({ className }: CreateTripFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (trip: Trip) => {
      return apiFetch('/trips', {
        method: 'POST',
        body: JSON.stringify({
          ...trip,
          startDate: new Date(trip.startDate),
          endDate: new Date(trip.endDate),
        }),
      });
    },
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
  } = useForm<Trip>({
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

  const onSubmit = (data: Trip) => mutation.mutate(data);

  return (
    <div className='container md:max-w-screen-md my-8 md:my-16'>
      <h1 className='text-5xl'>Create Trip</h1>

      <Form
        onSubmit={handleSubmit(onSubmit)}
        className={`${className || ''} mt-8 grid gap-8`}
      >
        <div className='grid'>
          <label htmlFor='name'>Where are you going?</label>
          <input id='name' {...register('name')} />
          {errors.name && <span>{errors.name.message}</span>}
        </div>

        <div className='grid grid-cols-2 gap-8'>
          <div className='grid'>
            <label htmlFor='startDate'>From</label>
            <input id='startDate' type='date' {...register('startDate')} />
            {errors.startDate && <span>{errors.startDate.message}</span>}
          </div>

          <div className='grid'>
            <label htmlFor='endDate'>End Date</label>
            <input
              id='endDate'
              type='date'
              {...register('endDate')}
              min={startDate}
            />
            {errors.endDate && <span>{errors.endDate.message}</span>}
          </div>
        </div>

        <button type='submit' className='btn btn--primary'>
          {mutation.isPending ? 'Submitting...' : 'Submit'}
        </button>
      </Form>
    </div>
  );
}
