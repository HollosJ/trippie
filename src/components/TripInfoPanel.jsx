import { ClockIcon } from '@heroicons/react/24/solid';
import { toast } from 'sonner';

const TripInfoPanel = ({ trip, loading, deleteTrip }) => {
  // Calculate days until trip
  const date = new Date();
  const tripStart = new Date(trip.start_date);
  const daysTill = Math.floor((tripStart - date) / (1000 * 60 * 60 * 24));

  return (
    <aside className="flex flex-wrap content-between justify-between gap-4 p-4 text-white md:grid bg-slate-950 md:w-64">
      {/* Top portion */}
      <div className="flex flex-wrap items-center justify-between gap-4 md:grid">
        <div className="grid overflow-hidden">
          <span>Your trip to</span>

          <h1>
            {loading ? (
              <div className="h-8 rounded w-36 bg-slate-200 animate-pulse"></div>
            ) : (
              <span
                className={`text-transparent text-2xl break-all gradient--green font-bold bg-clip-text`}
              >
                {trip.location}
              </span>
            )}
          </h1>
        </div>

        {/* Days till */}
        {daysTill > 0 && !loading && (
          <div className="flex items-center gap-2 p-2 rounded justify-self-start md:justify-self-stretch gradient--green">
            <ClockIcon className="w-6 h-6" /> {daysTill} days away!
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Delete button */}
        <button
          className="text-red-500 underline"
          onClick={() =>
            toast('Are you sure you want to delete this trip?', {
              action: {
                label: 'Delete',
                onClick: () => deleteTrip(),
                variant: 'danger',
              },
            })
          }
        >
          Delete trip
        </button>
      </div>
    </aside>
  );
};

export default TripInfoPanel;
