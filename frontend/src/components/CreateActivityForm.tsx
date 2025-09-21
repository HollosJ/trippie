import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from './Form';
import type { Activity } from '../types';
import { PlusCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createActivity } from '../api/trips';
import { useModal } from '../context/ModalProvider';

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
      <Form
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
        {errors.name && <span>{errors.name.message}</span>}

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
      </Form>
    </motion.div>
  );
}
