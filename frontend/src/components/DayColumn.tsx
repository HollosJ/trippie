import type { Activity } from '../types';

interface DayColumnProps {
  title: string;
  activities: Activity[];
}

export default function DayColumn({ title, activities }: DayColumnProps) {
  return (
    <div className="min-w-72 max-w-72">
      <h2>{title}</h2>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>{activity.name}</li>
        ))}
      </ul>
    </div>
  );
}
