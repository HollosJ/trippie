import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { Activity } from '../types';
import { useModal } from '../context/ModalProvider';

interface ActivityProps {
  activity: Activity | undefined;
  active?: boolean;
  className?: string;
  onDelete?: (activity: Activity) => void;
}

export default function Activity({
  activity,
  active,
  className,
  onDelete,
}: ActivityProps) {
  if (!activity) return null;

  const { openModal, closeModal } = useModal();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: activity.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      className={`relative flex cursor-pointer items-center justify-between rounded bg-white p-2 text-lg whitespace-normal shadow ${
        active ? 'opacity-50' : ''
      } ${className || ''}`}
      style={style}
      ref={setNodeRef}
      onClick={() => {
        if (!active) {
          openModal(
            <div>
              <pre>{JSON.stringify(activity, null, 2)}</pre>

              <button
                className="btn btn--danger"
                onClick={() => {
                  onDelete && onDelete(activity);
                  closeModal();
                }}
              >
                Delete
              </button>
            </div>,
            'Edit Activity',
          );
        }
      }}
    >
      <div>{activity.name}</div>

      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none rounded bg-gray-200 p-1 transition-colors hover:bg-gray-300"
      >
        <GripVertical className="stroke-gray-600" />
      </button>
    </div>
  );
}
