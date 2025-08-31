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
    expanded: 'w-70 p-4',
  };

  return (
    <aside
      className={`${isCollapsed ? styles.collapsed : styles.expanded} relative shrink-0 transition-all bg-slate-950 text-white z-10 content-start grid`}
    >
      <div className={`flex flex-wrap`}>
        <Link className='' to={`/trips`}>
          <SquareArrowLeft className='size-16' />
        </Link>

        <button className='' onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? (
            <PanelRightClose className='size-16' />
          ) : (
            <PanelLeftClose className='size-16' />
          )}
        </button>
      </div>

      <h1 className={`mt-4 ${isCollapsed ? '[writing-mode:vertical-lr]' : ''}`}>
        <span className='text-3xl text-emerald-500'>{trip.name}</span>
      </h1>

      {!isCollapsed && (
        <button
          onClick={() =>
            openModal(
              <div className='flex gap-2 items-center justify-end'>
                <button onClick={closeModal} className='btn btn--secondary'>
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    closeModal();
                  }}
                  className='btn btn--danger'
                >
                  Delete
                </button>
              </div>,
              'Are you sure?'
            )
          }
        >
          <Trash />
        </button>
      )}
    </aside>
  );
}
