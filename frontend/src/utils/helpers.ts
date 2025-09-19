export const formatDate = (date: Date) => date.toISOString().split('T')[0];

export function createDayArray(startDate: string, endDate: string) {
  const arr: string[] = [];
  const current = new Date(startDate);

  while (current <= new Date(endDate)) {
    arr.push(current.toISOString());
    current.setDate(current.getDate() + 1);
  }

  return arr;
}

export function calculateFractionalIndex(
  beforePosition?: number,
  afterPosition?: number,
) {
  // No existing items in the column
  if (beforePosition === undefined && afterPosition === undefined) return 1;
  // First item in the column
  else if (beforePosition === undefined) return afterPosition! - 1;
  // Last item in the column
  else if (afterPosition === undefined) return beforePosition + 1;
  // Between 2 items
  else return (beforePosition + afterPosition) / 2;
}
