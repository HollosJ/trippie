import type { Activity } from '../types';
import { motion } from 'framer-motion';

interface ActivityProps {
  activity: Activity | undefined;
  className?: string;
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    activity: Activity,
  ) => void;
}

export default function Activity({
  activity,
  className,
  onDragStart,
}: ActivityProps) {
  if (!activity) return null;

  return (
    <motion.div
      layout
      layoutId={`activity-${activity.id}`}
      id={`activity-${activity.id}`}
      className={`relative cursor-grab rounded bg-white p-4 shadow active:cursor-grabbing ${className || ''}`}
      onDragStart={(event) =>
        onDragStart(
          event as unknown as React.DragEvent<HTMLDivElement>,
          activity,
        )
      }
      draggable="true"
    >
      <div>{activity.name}</div>
    </motion.div>
  );
}
