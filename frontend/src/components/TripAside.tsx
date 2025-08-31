import { useState } from 'react';
import type { Trip } from '../types';
import {
  PanelLeftClose,
  PanelRightClose,
  SquareArrowLeft,
  Trash,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useModal } from '../context/ModalProvider';

interface TripAsideProps {
  trip: Trip;

  handleDelete: () => void;
}

export default function TripAside({ trip, handleDelete }: TripAsideProps) {
  const { openModal, closeModal } = useModal();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const styles = {
    collapsed: 'w-16 p-2',
    expanded: 'w-70 p-2',
  };

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
          <span className="text-3xl text-emerald-400">{trip.name}</span>
        </h1>
      </div>

      {!isCollapsed && (
        <button
          className="self-end rounded p-2 transition-colors hover:bg-red-600/50"
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
