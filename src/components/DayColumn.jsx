import React from 'react';
import Activity from './Activity';
import { PlusCircleIcon } from '@heroicons/react/16/solid';

const DayColumn = ({
  trip,
  activities,
  index,
  setModalOpen,
  setActivityEditing,
}) => {
  // Filter activities for current day
  const tripStartDate = new Date(trip.start_date);
  const currentDay = new Date(
    tripStartDate.setDate(tripStartDate.getDate() + index)
  )
    .toISOString()
    .split('T')[0];

  const dayActivities = activities.filter(
    (activity) => activity?.date === currentDay
  );

  return (
    <div className="inline-grid content-start no-scrollbar gap-4 p-2 text-left min-w-[320px] max-w-[320px] border-r">
      <h2 className="text-xs font-normal text-right text-slate-500">
        {new Date(currentDay).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      </h2>

      {dayActivities.length > 0 && (
        <div className="grid h-full gap-4">
          {dayActivities.map((activity) => (
            <Activity
              key={activity.id}
              activity={activity}
              setActivityEditing={setActivityEditing}
              setModalOpen={setModalOpen}
            />
          ))}
        </div>
      )}

      <button
        className="button button--secondary"
        onClick={() => {
          setActivityEditing({
            title: '',
            location: '',
            date: currentDay,
            notes: '',
          });

          setModalOpen(true);
        }}
      >
        <PlusCircleIcon className="w-6 h-6 text-slate-300" />
      </button>
    </div>
  );
};

export default DayColumn;
