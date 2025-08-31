import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { Activity } from '../types';

interface ActivityProps {
  activity: Activity | undefined;
  active?: boolean;
  className?: string;
}

export default function Activity({
  activity,
  active,
  className,
}: ActivityProps) {
  if (!activity) return null;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: activity.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  function handleModalOpen() {
    console.log('CLICK!');
  }

  return (
    <div
      className={`p-2 bg-white rounded whitespace-normal text-lg relative flex items-center justify-between cursor-pointer ${
        active ? 'opacity-0' : ''
      } ${className || ''}`}
      style={style}
      ref={setNodeRef}
      onClick={handleModalOpen}
    >
      <div>{activity.name}</div>

      <button
        {...attributes}
        {...listeners}
        className='cursor-grab p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors'
      >
        <GripVertical className='stroke-gray-600' />
      </button>
    </div>
  );
}
