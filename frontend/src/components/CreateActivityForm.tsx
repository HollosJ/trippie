import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createActivity } from '../api/activities';
import { useModal } from '../context/ModalProvider';
import type { Activity } from '../types';
import FormError from './FormError';

type Props = {
  position: number;
  tripId: number;
  date: string;
};

const newActivitySchema = z.object({
  name: z.string().trim().min(1, 'Activity name required').max(40, 'Too long!'),
});

export type CreateActivityType = z.infer<typeof newActivitySchema>;

export default function CreateActivityForm({ tripId, position, date }: Props) {
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModal();
  const [active, setActive] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateActivityType>({
    resolver: zodResolver(newActivitySchema),
    defaultValues: {
      name: '',
    },
  });

  const resetForm = () => {
    setActive(false);
    reset();
  };

  const createActivityMutation = useMutation({
    mutationFn: createActivity,
    onMutate: (newActivity: Partial<Activity>) => {
      // Optimistically update cache
      queryClient.setQueryData<Activity[]>(['activities', tripId], (old) => [
        ...(old || []),
        { ...(newActivity as Activity), id: Math.random() }, // temp ID
      ]);
    },
    onError: () => {
      openModal(
        <>
          <p>Please try again.</p>

          <button onClick={closeModal} className="btn btn--primary mt-8">
            Okay
          </button>
        </>,
        'Error adding activity',
      );
    },
    onSuccess: () => resetForm(),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['activities', tripId] }),
  });

  if (!active)
    return (
      <motion.button
        layout
        className="flex items-center text-gray-400 transition-colors hover:text-gray-500"
        onClick={() => setActive(true)}
      >
        <PlusCircleIcon className="mr-2 size-4" /> Add an activity
      </motion.button>
    );

  return (
    <motion.div layout>
      <form
        onSubmit={handleSubmit((formData) => {
          createActivityMutation.mutate({
            ...formData,
            tripId: tripId,
            date: date,
            position: position,
          });
        })}
        className="grid"
      >
        <input id="name" {...register('name')} autoFocus />
        <FormError message={errors.name?.message} />

        <div className="mt-2 flex justify-end gap-2">
          <button
            className="btn btn--secondary"
            type="button"
            onClick={resetForm}
          >
            Cancel
          </button>

          <button className="btn btn--primary" type="submit">
            Add
          </button>
        </div>
      </form>
    </motion.div>
  );
}
