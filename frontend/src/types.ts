export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Trip {
  id: number;
  name: string;
  emoji: string | null;
  startDate: string;
  endDate: string;
  userId: number;
  activities?: Activity[];
}

export interface TripWithActivitiesByDate {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  userId: number;
  activities: Record<string, Activity[]>;
}

export interface Activity {
  id: number;
  name: string;
  location: string | null;
  description: string | null;
  date: string;
  position: number;
  tripId: number;
}

export interface Emoji {
  label: string;
  emoji: string;
}
