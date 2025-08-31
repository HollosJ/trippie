import { useState } from 'react';
import type { Trip } from '../types';
import { PanelLeftClose, PanelRightClose } from 'lucide-react';

interface TripAsideProps {
  trip: Trip;
}

export default function TripAside({ trip }: TripAsideProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const styles = {
    collapsed: 'w-16 p-2',
    expanded: 'w-70 p-4',
  };

  return (
    <aside
      className={`${isCollapsed ? styles.collapsed : styles.expanded} relative transition-all bg-slate-950 text-white z-10 content-start grid`}
    >
      <h1 className={`${isCollapsed ? '[writing-mode:vertical-lr]' : ''}`}>
        <span className='text-3xl text-emerald-500'>{trip.name}</span>
      </h1>

      <button
        className='p-1 rounded bg-slate-950 mt-4 cursor-pointer hover:bg-slate-900 transition-colors justify-self-end'
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <PanelRightClose /> : <PanelLeftClose />}
      </button>
    </aside>
  );
}
