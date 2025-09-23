import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { deleteActivity } from '../api/activities';
import { useModal } from '../context/ModalProvider';
import type { Activity } from '../types';
import EditActivityForm from './EditActivityForm';

interface ActivityProps {
  activity: Activity | undefined;
  className?: string;
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    activity: Activity,
  ) => void;
}

export function ActivitySkeleton({ className }: { className?: string }) {
  return (
    <motion.div
      className={`${className || ''} h-16 animate-pulse rounded bg-gray-200 shadow`}
    ></motion.div>
  );
}

export default function Activity({
  activity,
  className,
  onDragStart,
}: ActivityProps) {
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModal();

  const deleteActivityMutation = useMutation({
    mutationFn: deleteActivity,
    onMutate: () => {
      queryClient.setQueryData<Activity[]>(
        ['activities', activity?.tripId],
        (old) => old?.filter((a) => a.id !== activity?.id),
      );
    },
    onError: () => {
      openModal(
        <div>
          <p>Please try again.</p>

          <button onClick={closeModal} className="btn btn--primary mt-8">
            Okay
          </button>
        </div>,
      );
    },
    onSuccess: closeModal,
  });

  if (!activity) return null;

  return (
    <motion.div
      layout
      layoutId={`activity-${activity.id}`}
      id={`activity-${activity.id}`}
      className={`relative cursor-grab rounded bg-white p-4 whitespace-normal shadow active:cursor-grabbing ${className || ''}`}
      onDragStart={(event) =>
        onDragStart(
          event as unknown as React.DragEvent<HTMLDivElement>,
          activity,
        )
      }
      draggable="true"
      onClick={() =>
        openModal(
          <EditActivityForm activity={activity} onSuccess={closeModal} />,
          'Edit Activity',
        )
      }
    >
      <div>
        <h3 className="font-normal">{activity.name}</h3>
      </div>
    </motion.div>
  );
}
