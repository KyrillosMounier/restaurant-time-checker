/**
 * Parses a time string in HH:mm format to a Date object
 * @param timeString - The time string in HH:mm format
 * @returns Date - The corresponding Date object with hours and minutes set to the given time
 */
export function parseTime(timeString: string, currentTime?: Date): Date {
  const [hours, minutes] = timeString
    .split(':')
    .map((str) => parseInt(str, 10));

  // Ensure the date for both currentTime and requestedTime is the same.
  const date = currentTime ? new Date(currentTime.getTime()) : new Date(); // Clone currentTime to avoid mutation
  date.setHours(hours, minutes, 0, 0); // Set hours and minutes
  return date;
}

/**
 * add minutes to the current time
 * @param minutesToAdd - The number of minutes
 * @param specificDate - (optional) ThspecificDate
 * @returns Date - The corresponding Date object with hours and minutes set to the given time
 */
// Helper function to add minutes to the current time
// Helper function to add minutes to a date object (does not modify the original date object)
export function addMinutesToTime(
  minutesToAdd: number,
  specificDate?: Date,
): Date {
  const oldDate = specificDate ? new Date(specificDate.getTime()) : new Date(); // Create a copy of the date
  oldDate.setMinutes(oldDate.getMinutes() + minutesToAdd); // Add minutes to the copied date
  return oldDate;
}
