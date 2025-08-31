import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { patchActivity } from '../api/trips';
import type { Activity as IActivity, Trip } from '../types';
import {
  calculateFractionalIndex,
  groupActivitiesByDate,
} from '../utils/helpers';
import Activity from './Activity';
import DayColumn from './DayColumn';

interface TripBoardProps {
  trip: Trip;
}

export default function TripBoard({ trip }: TripBoardProps) {
  const [data, setData] = useState(
    groupActivitiesByDate(trip as Trip & { activities: IActivity[] })
  );

  const [activeId, setActiveId] = useState<number | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const updateActivity = useMutation({
    mutationFn: async (activity: IActivity) => await patchActivity(activity),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );

  function findContainer(id: string) {
    // first, check if id is a column/date
    if (id in data) return id;

    // otherwise, look for activity in data
    return Object.keys(data).find((date) =>
      data[date].some((activity) => activity.id === Number(id))
    );
  }

  function findActivity(id: number) {
    for (const date in data) {
      const activity = data[date].find((a) => a.id === id);

      if (activity) return activity;
    }
    return undefined;
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;

    setActiveId(id as number);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) setActiveColumnId(over.id.toString());
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveColumnId(null);
      return;
    }

    const activeId = Number(active.id);

    const activeContainer = findContainer(active.id.toString());
    const overContainer = findContainer(over.id.toString());
    if (!activeContainer || !overContainer) return;

    setData((prev) => {
      const previousClone = { ...prev };
      const activeItems = [...previousClone[activeContainer]];
      const overItems = [...previousClone[overContainer]];

      const activeIndex = activeItems.findIndex((item) => item.id === activeId);
      const overIndex = overItems.findIndex(
        (item) => item.id === Number(over.id)
      );

      let movedItem = activeItems[activeIndex];

      if (activeContainer === overContainer) {
        // --- Dropped in the same column ---
        console.log('SAME COL');
        activeItems.splice(activeIndex, 1);
        const newIndex = overIndex >= 0 ? overIndex : activeItems.length;

        const prevItem = activeItems[newIndex - 1];
        const nextItem = activeItems[newIndex];
        const newPosition = calculateFractionalIndex(prevItem, nextItem);

        movedItem = { ...movedItem, position: newPosition };
        activeItems.splice(newIndex, 0, movedItem);

        previousClone[activeContainer] = activeItems;
      } else {
        // --- Dropped in a different column ---
        console.log('DIFF COL');
        activeItems.splice(activeIndex, 1);

        let newIndex = overIndex >= 0 ? overIndex : overItems.length;

        // If we are dragging over the last item in the column, append to end
        if (overIndex === overItems.length - 1) {
          const activeRect = active.rect.current.translated;
          const overRect = over.rect;

          if (activeRect && overRect) {
            const isBelowLast = activeRect.top > overRect.top + overRect.height;

            if (isBelowLast) {
              newIndex = overItems.length;
            }
          }
        }

        const prevItem = overItems[newIndex - 1];
        const nextItem = overItems[newIndex];
        const newPosition = calculateFractionalIndex(prevItem, nextItem);

        movedItem = {
          ...movedItem,
          position: newPosition,
          date: overContainer,
        };
        overItems.splice(newIndex, 0, movedItem);

        previousClone[activeContainer] = activeItems;
        previousClone[overContainer] = overItems;
      }
      updateActivity.mutate(movedItem);
      return previousClone;
    });

    setActiveId(null);
    setActiveColumnId(null);
  }

  return (
    <div className='flex whitespace-nowrap h-dvh overflow-x-auto'>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {Object.keys(data).map((date) => (
          <DayColumn
            key={date}
            title={date}
            activities={data[date]}
            activeId={activeId}
            active={activeColumnId === date}
          />
        ))}
        <DragOverlay>
          {activeId ? (
            <Activity activity={findActivity(activeId)} className='shadow-xl' />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
