import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { patchActivity } from '../api/trips';
import { useModal } from '../context/ModalProvider';
import type { Activity, Trip } from '../types';
import { apiFetch } from '../utils/api';
import { calculateFractionalIndex, createDayArray } from '../utils/helpers';
import ActivityComponent from './Activity';
import DropIndicator from './DropIndicator';
import CreateActivityForm from './CreateActivityForm';

interface TripBoardProps {
  trip: Trip;
}

export default function TripBoard({ trip }: TripBoardProps) {
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModal();

  const days = createDayArray(trip.startDate, trip.endDate);
  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ['activities', trip.id],
    queryFn: () => apiFetch(`/trips/${trip.id}/activities`),
  });
  const [localActivities, setLocalActivities] =
    useState<Activity[]>(activities);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  useEffect(() => {
    setLocalActivities(activities);
  }, [activities]);

  /* --- Drag & Drop logic --- */
  const getNearestIndicator = (y: number, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;
    return indicators.reduce(
      (closest, el) => {
        const rect = el.getBoundingClientRect();
        const offset = y - (rect.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: el };
        }
        return closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      },
    ).element;
  };

  const handleDragStart = (activityId: number) => {
    setDraggingId(activityId);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    column: string,
  ) => {
    event.preventDefault();

    setActiveColumn(column);

    const indicators = Array.from(
      document.querySelectorAll(`[data-column="${column}"]`),
    ) as HTMLElement[];

    // Reset indicator style
    indicators.forEach((indicator) => {
      indicator.style.opacity = '0';
    });

    const nearest = getNearestIndicator(event.clientY, indicators);
    if (nearest) nearest.style.opacity = '1';
  };

  const handleDragLeave = () => {
    setActiveColumn(null);
    const indicators = Array.from(
      document.querySelectorAll(`[data-column]`),
    ) as HTMLElement[];
    indicators.forEach((indicator) => {
      indicator.style.opacity = '0';
    });
  };

  const handleDragEnd = (
    event: React.DragEvent<HTMLDivElement>,
    column: string,
  ) => {
    event.preventDefault();

    if (draggingId === null) return;

    const indicators = Array.from(
      document.querySelectorAll(`[data-column="${column}"]`),
    ) as HTMLElement[];

    const nearest = getNearestIndicator(event.clientY, indicators);
    const beforeId = nearest?.dataset.before;

    setLocalActivities((prev) => {
      const copy = [...prev];
      const dragged = copy.find((a) => a.id === draggingId);

      if (!dragged) return prev;

      // Update dragged activity's column
      dragged.date = column;

      // Remove from current list
      const filtered = copy.filter((a) => a.id !== draggingId);

      // Figure out new fractional position
      const colActivities = filtered
        .filter((a) => a.date === column)
        .sort((a, b) => a.position - b.position);

      let newPos: number;

      if (!beforeId || beforeId === '-1') {
        // Drop at end
        newPos = colActivities.length
          ? colActivities[colActivities.length - 1].position + 1
          : 0;
      } else {
        const beforeActivity = colActivities.find(
          (a) => a.id === Number(beforeId),
        );

        if (!beforeActivity) return prev;

        const index = colActivities.indexOf(beforeActivity);
        const beforePos =
          index > 0 ? colActivities[index - 1].position : undefined;
        const afterPos = beforeActivity.position;

        newPos = calculateFractionalIndex(beforePos, afterPos);
      }

      // Assign new position
      dragged.position = newPos;

      // Add back into array
      filtered.push(dragged);

      updateActivityMutation.mutate(dragged);

      return filtered;
    });

    setDraggingId(null);
    setActiveColumn(null);

    indicators.forEach((indicator) => {
      indicator.style.opacity = '0';
    });
  };

  /* --- Mutations --- */
  const updateActivityMutation = useMutation({
    mutationFn: patchActivity,
    onMutate: async (updatedActivity: Activity) => {
      await queryClient.cancelQueries({ queryKey: ['activities', trip.id] });

      const previous = queryClient.getQueryData<Activity[]>([
        'activities',
        trip.id,
      ]);

      // Optimisically update local cache
      queryClient.setQueryData<Activity[]>(['activities', trip.id], (old) => {
        if (!old) return old;
        return old.map((a) =>
          a.id === updatedActivity.id ? updatedActivity : a,
        );
      });

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['activities', trip.id], context.previous);
      }

      openModal(
        <>
          <p>Please try again.</p>

          <button onClick={closeModal} className="btn btn--primary mt-8">
            Okay
          </button>
        </>,
        'There was an error updating the activity.',
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', trip.id] });
    },
  });

  return (
    <div className="flex h-dvh gap-4 overflow-x-auto p-4 whitespace-nowrap">
      {days.map((day) => {
        const colActivities = localActivities
          .filter((a) => a.date === day)
          .sort((a, b) => a.position - b.position);

        const nextPosition = colActivities.length
          ? colActivities[colActivities.length - 1].position + 1
          : 0;

        return (
          <div
            key={day}
            onDragOver={(e) => handleDragOver(e, day)}
            onDrop={(e) => handleDragEnd(e, day)}
            onDragLeave={handleDragLeave}
            className={`w-64 shrink-0 rounded bg-gray-100 p-2 transition-colors ${
              activeColumn === day ? 'bg-gray-200' : 'bg-gray-100'
            }`}
          >
            <h3 className="mb-2 font-medium">
              {new Date(day).toLocaleDateString()}
            </h3>
            {colActivities.map((activity) => (
              <div key={activity.id}>
                <DropIndicator beforeId={activity.id} column={day} />
                <ActivityComponent
                  activity={activity}
                  onDragStart={() => handleDragStart(activity.id)}
                />
              </div>
            ))}
            <DropIndicator beforeId={null} column={day} />

            <CreateActivityForm
              position={nextPosition}
              date={day}
              tripId={trip.id}
            />
          </div>
        );
      })}
    </div>
  );
}
