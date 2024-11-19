/**
 * Parses a time string in HH:mm format to a Date object.
 * Handles edge cases like "24:00" by treating it as the end of the day (23:59:59).
 *
 * @param timeString - The time string in HH:mm format (e.g., "14:30").
 * @param currentTime - (Optional) A reference Date object used to align the parsed time to the same date.
 * @returns Date - A new Date object with the parsed time.
 */
export function parseTime(timeString: string, currentTime?: Date): Date {
  const [hours, minutes] = timeString
    .split(':')
    .map((str) => parseInt(str, 10));
  const date = currentTime ? new Date(currentTime.getTime()) : new Date();

  if (hours === 24 && minutes === 0) {
    // Interpret "24:00" as the last second of the day (23:59:59).
    date.setHours(23, 59, 59, 59);
  } else {
    // Set the time to the parsed hours and minutes.
    date.setHours(hours, minutes, 0, 0);
  }

  return date;
}

/**
 * Adds a specified number of minutes to a given Date object.
 * Ensures that the original Date object remains unmodified.
 * Handles edge cases like "HH:59:59" to roll over correctly.
 *
 * @param minutesToAdd - The number of minutes to add.
 * @param specificDate - (Optional) A reference Date object to add minutes to; defaults to the current date and time.
 * @returns Date - A new Date object with the added minutes.
 */
export function addMinutesToTime(
  minutesToAdd: number,
  specificDate?: Date,
): Date {
  const date = specificDate ? new Date(specificDate.getTime()) : new Date(); // Clone the date to avoid mutation
  date.setMinutes(date.getMinutes() + minutesToAdd); // Add the minutes

  // Check if the time reaches HH:59:59.59, roll over to the next second/hour if necessary
  if (date.getSeconds() === 59 && date.getMilliseconds() === 59) {
    date.setSeconds(0, 0); // Roll over to the next minute and reset milliseconds
    date.setMinutes(date.getMinutes() + 1); // Adjust minutes to account for the rollover
  }

  return date;
}

/**
 * Parses a date-time string in "YYYY-MM-DD HH:mm" format into a Date object.
 * Handles cases like "24:00" by treating it as the last second of the day (23:59:59).
 *
 * @param requestedDateTime - The date-time string to parse.
 * @returns Date - A new Date object representing the parsed date-time.
 */
export function parseRequestedDateTime(requestedDateTime: string): Date {
  if (requestedDateTime.endsWith('24:00')) {
    // Replace "24:00" with "23:59:59" to represent the same day.
    requestedDateTime = requestedDateTime.replace('24:00', '23:59:59');
  }
  return new Date(requestedDateTime.replace(' ', 'T')); // Convert to ISO format.
}

/**
 * Validates if a given time falls within a specified time range.
 * Times are compared as "minutes since the start of the day" to simplify the logic.
 *
 * @param requestedDateTime - The Date object to validate.
 * @param startTime - The start of the time range in "HH:mm" format.
 * @param endTime - The end of the time range in "HH:mm" format.
 * @returns boolean - True if the time is within the range, false otherwise.
 */
export function isTimeWithinSpecificHours(
  requestedDateTime: Date,
  startTime: string,
  endTime: string,
): boolean {
  const requestedMinutes =
    requestedDateTime.getHours() * 60 + requestedDateTime.getMinutes();
  const [startHours, startMinutes] = startTime
    .split(':')
    .map((t) => parseInt(t, 10));
  const [endHours, endMinutes] = endTime.split(':').map((t) => parseInt(t, 10));

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  return (
    requestedMinutes >= startTotalMinutes && requestedMinutes <= endTotalMinutes
  );
}
