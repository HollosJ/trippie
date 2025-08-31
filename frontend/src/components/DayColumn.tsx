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
}

export default function DayColumn({
  title,
  activities,
  activeId,
  active = false,
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
        className={`min-w-72 max-w-72 flex flex-col transition-colors ${active ? 'bg-gray-50' : ''}`}
      >
        <div className='p-2'>
          <h2 className='text-gray-400'>{displayDate}</h2>
        </div>

        <div className='flex flex-col gap-2 mt-4 flex-1 p-2' ref={setNodeRef}>
          {activities.map((activity) => (
            <Activity
              key={activity.id}
              activity={activity}
              active={activeId === activity.id}
            />
          ))}
          <motion.button
            layout
            key={`add-new-${title}`}
            className='btn btn--secondary'
          >
            <PlusCircle />
          </motion.button>
        </div>
      </div>
    </SortableContext>
  );
}
