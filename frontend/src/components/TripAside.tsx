import { Link } from '@tanstack/react-router';
import {
  CalendarIcon,
  PanelLeftClose,
  PanelRightClose,
  SquareArrowLeft,
  Trash,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useModal } from '../context/ModalProvider';
import type { Trip } from '../types';

interface TripAsideProps {
  trip: Trip;
  handleDelete: () => void;
}

export default function TripAside({ trip, handleDelete }: TripAsideProps) {
  const { openModal, closeModal } = useModal();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (!savedSettings) return false;

    try {
      const parsed = JSON.parse(savedSettings);
      return parsed.sidebarCollapsed ?? false;
    } catch {
      return false;
    }
  });

  const styles = {
    collapsed: 'w-16 p-2',
    expanded: 'w-70 p-2',
  };

  // Remember user preferencee
  useEffect(() => {
    localStorage.setItem(
      'dashboardSettings',
      JSON.stringify({ sidebarCollapsed: isCollapsed }),
    );
  }, [isCollapsed]);

  const daysUntilTrip = Math.ceil(
    (new Date(trip.startDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <aside
      className={`${isCollapsed ? styles.collapsed : styles.expanded} relative z-10 flex shrink-0 flex-col content-start bg-slate-950 text-white transition-all`}
    >
      <div
        className={`grid gap-2 ${isCollapsed ? 'grid-cols-1' : 'grid-cols-2'}`}
      >
        <Link
          className="flex flex-1 items-center justify-center gap-2 rounded p-2 transition-colors hover:bg-white/10"
          to={`/trips`}
          title="Back to Trips"
        >
          <SquareArrowLeft /> {!isCollapsed && 'Back'}
        </Link>

        <button
          className="flex flex-1 items-center justify-center gap-2 rounded p-2 transition-colors hover:bg-white/10"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? (
            <PanelRightClose />
          ) : (
            <>
              <PanelLeftClose /> {!isCollapsed && 'Collapse'}
            </>
          )}
        </button>
      </div>

      {/* Main content */}
      <div className="h-full">
        <h1
          className={`mt-4 ${isCollapsed ? '[writing-mode:vertical-lr]' : ''}`}
        >
          <span className="text-2xl text-emerald-400">
            {trip.emoji ?? ''}
            {trip.name}
          </span>
        </h1>

        {!isCollapsed && daysUntilTrip > 0 && (
          <span className="flex items-center text-gray-400">
            <CalendarIcon className="mr-2 size-4" />
            In {daysUntilTrip} day{daysUntilTrip > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {!isCollapsed && (
        <button
          className="btn btn--danger self-end"
          onClick={() =>
            openModal(
              <>
                <p>This action cannot be undone.</p>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button onClick={closeModal} className="btn btn--secondary">
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      handleDelete();
                      closeModal();
                    }}
                    className="btn btn--danger"
                  >
                    Delete
                  </button>
                </div>
              </>,
              'Are you sure?',
            )
          }
        >
          <Trash />
        </button>
      )}
    </aside>
  );
}
