import { Link } from '@tanstack/react-router';
import {
  CalendarIcon,
  CornerDownLeft,
  MoreVertical,
  Trash,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useModal } from '../context/ModalProvider';
import type { Trip } from '../types';
import { AnimatePresence, motion } from 'framer-motion';

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

  const deleteTripModal = () =>
    openModal(
      <>
        <p>Are you sure you want to delete this trip?</p>

        <div className="mt-8 flex justify-end gap-2">
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
      'Delete Trip',
    );

  return (
    <>
      {/* Mobile */}
      <div className="bg-primary fixed bottom-0 w-full p-4 text-white md:hidden">
        <div className="container flex items-center justify-between gap-4">
          <Link
            to="/trips"
            className="flex flex-col items-center gap-2 text-xs"
          >
            <CornerDownLeft className="size-4" />
            <span>Return</span>
          </Link>

          <div className="flex flex-1 flex-col items-center">
            <h1 className="text-lg">{trip.name}</h1>

            <span className="flex items-center gap-2 text-xs">
              <CalendarIcon className="size-4" />
              In {daysUntilTrip} {daysUntilTrip === 1 ? 'day' : 'days'}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 text-xs">
            <MoreVertical
              className="size-4"
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
            <span>More</span>
          </div>

          {/* Context menu */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="absolute right-0 bottom-full w-full bg-emerald-800 p-4"
              >
                <div className="container flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={deleteTripModal}
                    className="flex flex-col items-center gap-2 text-xs"
                  >
                    <Trash className="size-4" />
                    Delete Trip
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop */}
    </>
  );
}
