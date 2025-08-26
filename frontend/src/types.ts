export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Trip {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  userId?: number;
}

export interface Activity {
  id: number
  name: string;
  location: string;
  date: string;
  description: string;
}

