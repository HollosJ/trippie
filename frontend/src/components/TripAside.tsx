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

const MotionTrash = motion(Trash);
const MotionArrowLeft = motion(ArrowLeft);
const MotionLink = motion(Link);

export default function TripAside({ trip, handleDelete }: TripAsideProps) {
  const { openModal, closeModal } = useModal();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDesktopMenuOpen, setisDesktopMenuOpen] = useState(() => {
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (!savedSettings) return false;

    try {
      const parsed = JSON.parse(savedSettings);
      return parsed.sidebarOpen ?? false;
    } catch {
      return false;
    }
  });

  // Remember user preferencee
  useEffect(() => {
    localStorage.setItem(
      'dashboardSettings',
      JSON.stringify({ sidebarOpen: isDesktopMenuOpen }),
    );
  }, [isDesktopMenuOpen]);

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
      <motion.aside
        layout
        className="relative top-0 hidden h-dvh shrink-0 flex-col bg-white p-2 shadow md:flex"
        initial={{ width: isDesktopMenuOpen ? 225 : 80 }}
        animate={{ width: isDesktopMenuOpen ? 225 : 80 }}
        transition={{ duration: 0.25 }}
      >
        {/* Toggle */}
        <motion.button
          layout
          className="bg-primary absolute top-4 -right-3 flex size-6 items-center justify-center rounded-full text-white"
          onClick={() => setisDesktopMenuOpen(!isDesktopMenuOpen)}
        >
          <ChevronRight
            className={`size-4 transition-transform ${isDesktopMenuOpen ? 'rotate-180' : ''}`}
          />
        </motion.button>

        {isDesktopMenuOpen && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-8"
          >
            Your trip to
            <h1
              className={`from-primary bg-gradient-to-r to-emerald-700 bg-clip-text text-3xl hyphens-auto text-transparent`}
            >
              {trip.name}
            </h1>
          </motion.div>
        )}

        {/* Content */}
        <MotionLink
          layout
          to="/trips"
          className="btn btn--secondary mt-auto gap-2"
        >
          <MotionArrowLeft className="size-4" />

          {isDesktopMenuOpen && (
            <motion.span
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              Back to trips
            </motion.span>
          )}
        </MotionLink>

        <motion.button
          className="btn btn--danger mt-2 gap-2"
          onClick={deleteTripModal}
        >
          <MotionTrash className="size-4" />

          {isDesktopMenuOpen && (
            <motion.span
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              Delete Trip
            </motion.span>
          )}
        </motion.button>
      </motion.aside>
    </>
  );
}
