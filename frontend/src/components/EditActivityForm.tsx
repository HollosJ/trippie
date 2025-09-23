import type { Activity } from '../types';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteActivity, patchActivity } from '../api/activities';
import FormError from './FormError';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import ErrorMessage from './ErrorMessage';

type Props = {
  activity: Activity;
  onSuccess?: () => void;
};

const editActivitySchema = z.object({
  name: z.string().trim().min(1, 'Activity name required').max(40, 'Too long!'),
  location: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

type EditActivityFormValues = z.infer<typeof editActivitySchema>;

export default function EditActivityForm({ activity, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const [responseError, setResponseError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditActivityFormValues>({
    resolver: zodResolver(editActivitySchema),
    defaultValues: {
      name: activity.name,
      location: activity.location ?? '',
      description: activity.description ?? '',
    },
  });

  const editMutation = useMutation({
    mutationFn: patchActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['activities', activity.tripId],
      });
      onSuccess?.();
    },
    onError: (error) => {
      setResponseError(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['activities', activity.tripId],
      });
      onSuccess?.();
    },
    onError: (error) => {
      setResponseError(error.message);
    },
  });

  const onSubmit = (data: EditActivityFormValues) => {
    editMutation.mutate({ ...activity, ...data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div>
        <label className="">Name</label>
        <input {...register('name')} className="input w-full" placeholder="" />
        <FormError message={errors.name?.message} />
      </div>

      <div>
        <label className="">Location</label>
        <input
          {...register('location')}
          className="input w-full"
          placeholder="Where's this happening? (e.g. Kyoto, Japan)"
        />
        <FormError message={errors.location?.message} />
      </div>

      <div>
        <label className="">Description</label>
        <textarea
          {...register('description')}
          className="textarea w-full"
          placeholder="What's the plan? Details, notes, or fun facts go here..."
          rows={4}
        />
        <FormError message={errors.description?.message} />
      </div>

      <ErrorMessage message={responseError} />

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => deleteMutation.mutate(String(activity.id))}
          className="btn btn--danger"
          disabled={isSubmitting || deleteMutation.isPending}
        >
          <Trash />
        </button>

        <button
          type="submit"
          className="btn btn--primary flex-1"
          disabled={isSubmitting || editMutation.isPending}
        >
          {editMutation.isPending ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
