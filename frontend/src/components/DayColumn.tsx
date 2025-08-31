import { useDroppable } from '@dnd-kit/core';
import type { Activity as IActivity } from '../types';
import Activity from './Activity';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DayColumnProps {
  title: string;
  activities: IActivity[];
  activeId?: number | null;
  active?: boolean;
  onDeleteActivity: (activity: IActivity) => void;
}

export default function DayColumn({
  title,
  activities,
  activeId,
  active = false,
  onDeleteActivity,
}: DayColumnProps) {
  const { setNodeRef } = useDroppable({ id: title });

  const displayDate = new Date(title).toLocaleDateString();

  return (
    <SortableContext
      id={title}
      items={activities.map((activity) => activity.id)}
      strategy={verticalListSortingStrategy}
    >
      <div
        className={`flex max-w-72 min-w-72 flex-col transition-colors ${active ? 'bg-gray-200' : ''}`}
      >
        <div className="p-2">
          <h2 className="text-gray-400">{displayDate}</h2>
        </div>

        <div className="mt-4 flex flex-1 flex-col gap-2 p-2" ref={setNodeRef}>
          {activities.map((activity) => (
            <Activity
              key={activity.id}
              activity={activity}
              active={activeId === activity.id}
              onDelete={onDeleteActivity}
            />
          ))}
          <motion.button
            layout
            key={`add-new-${title}`}
            className="btn btn--secondary"
          >
            <PlusCircle />
          </motion.button>
        </div>
      </div>
    </SortableContext>
  );
}
