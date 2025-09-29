import { Link } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  CalendarIcon,
  ChevronRight,
  CornerDownLeft,
  MoreVertical,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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
      <div className="bg-primary fixed bottom-0 w-full py-4 text-white md:hidden">
        <div className="container flex items-center justify-between gap-4">
          <Link
            to="/trips"
            className="flex flex-col items-center gap-2 rounded bg-emerald-700 p-4 text-xs"
          >
            <CornerDownLeft className="size-4" />
          </Link>

          <div className="flex flex-1 flex-col items-center">
            <h1 className="text-lg">{trip.name}</h1>

            <span className="flex items-center gap-2 text-xs">
              <CalendarIcon className="size-4" />
              In {daysUntilTrip} {daysUntilTrip === 1 ? 'day' : 'days'}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 rounded bg-emerald-700 p-4 text-xs">
            <MoreVertical
              className="size-4"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>

          {/* Context menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="absolute right-0 bottom-full w-full bg-emerald-800"
              >
                <div className="container flex items-center justify-between gap-4 py-4">
                  <button
                    type="button"
                    onClick={deleteTripModal}
                    className="text-danger flex flex-col items-center text-xs"
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
      <aside
        className={`relative hidden shrink-0 flex-col bg-gray-900 text-white transition-all md:flex ${isCollapsed ? 'w-16' : 'w-72'}`}
      >
        {/* Toggle */}
        <button
          className="absolute top-4 -right-3 z-10 flex size-6 items-center justify-center rounded-full bg-gray-800"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronRight
            className={`${isCollapsed ? '' : 'rotate-180'} size-4 transition-transform`}
          />
        </button>

        {/* Content */}
        <div className={`mt-8 flex flex-1 flex-col p-2 transition-all`}>
          <Link
            className="flex items-center justify-center gap-2 rounded bg-gray-800 p-2 hover:brightness-125"
            to="/trips"
          >
            <ArrowLeft className="size-4" /> {!isCollapsed && 'Back to trips'}
          </Link>

          <button
            className="btn btn--danger mt-2 gap-2"
            onClick={deleteTripModal}
          >
            <Trash className="size-4" />

            {!isCollapsed && 'Delete Trip'}
          </button>

          <h1
            className={`mt-8 text-sm leading-0 font-normal ${isCollapsed ? '[writing-mode:vertical-lr]' : ''}`}
          >
            {!isCollapsed && (
              <>
                Your trip to <br />
              </>
            )}
            <span
              className={`bg-gradient-to-tr from-emerald-500 to-emerald-600 bg-clip-text font-bold hyphens-auto text-transparent ${isCollapsed ? 'text-4xl' : 'text-3xl'}`}
            >
              {trip.name}
            </span>
          </h1>
        </div>
      </aside>
    </>
  );
}
