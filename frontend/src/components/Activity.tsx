import { motion } from 'framer-motion';
import { useModal } from '../context/ModalProvider';
import type { Activity } from '../types';
import EditActivityForm from './EditActivityForm';
import { MapPin } from 'lucide-react';

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
  const { openModal, closeModal } = useModal();

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
        {activity.location && (
          <p className="flex text-sm text-gray-400">
            <MapPin className="mr-1 size-4" />

            {activity.location}
          </p>
        )}

        <h3 className="font-normal">{activity.name}</h3>

        {activity.description && (
          <p className="text-sm text-gray-500">{activity.description}</p>
        )}
      </div>
    </motion.div>
  );
}
