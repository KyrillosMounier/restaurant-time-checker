import { Injectable } from '@nestjs/common';
import { OrderTimeValidationDto } from '../dtos/order-time-validation.dto';
import {
  addMinutesToTime,
  isTimeWithinSpecificHours,
  parseRequestedDateTime,
  parseTime,
} from '../utils/time-util';

@Injectable()
export class OrderTimeService {
  /**
   * Validates the requested order time based on multiple conditions:
   * 1. Ensures the requested time is not in the past.
   * 2. Validates the time falls within restaurant operating hours.
   * 3. Validates the time is within order acceptance hours.
   * 4. Ensures delivery/pickup times meet minimum and maximum constraints.
   *
   * The validation focuses only on the time component (hours and minutes), ignoring the date.
   *
   * @param data - The DTO containing time-related data for validation.
   * @returns {number} Validation result:
   * - -3: Requested time is in the past.
   * - -2: Requested time is outside restaurant operating hours.
   * - -1: Requested time is outside order acceptance hours.
   * - 0: Requested time is outside delivery/pickup valid range.
   * - Positive integer: Valid time, representing the difference in minutes from now.
   */
  validateRequestTime(data: OrderTimeValidationDto): number {
    const currentTime = data.currentTime
      ? parseTime(data.currentTime) // Parse provided current time for consistency in testing
      : new Date();
    console.log('Current Time (Now):', this.formatDateInTimeZone(currentTime));

    // Parse requested time as a Date object (ensures time comparisons use consistent dates)
    const requestedDateTime = parseRequestedDateTime(data.requestedDateTime);
    console.log(
      'Requested Time:',
      this.formatDateInTimeZone(requestedDateTime),
    );

    // Parse other time fields using the same date reference as currentTime
    const orderAcceptOpenTime = parseTime(data.orderAcceptOpen, currentTime);
    const orderAcceptCloseTime = parseTime(data.orderAcceptClose, currentTime);
    console.log(
      'Order Accept Open Time:',
      this.formatDateInTimeZone(orderAcceptOpenTime),
    );
    console.log(
      'Order Accept Close Time:',
      this.formatDateInTimeZone(orderAcceptCloseTime),
    );

    const restaurantOpenTime = parseTime(data.restaurantOpen, currentTime);
    const restaurantCloseTime = parseTime(data.restaurantClose, currentTime);
    console.log(
      'Restaurant Open Time:',
      this.formatDateInTimeZone(restaurantOpenTime),
    );
    console.log(
      'Restaurant Close Time:',
      this.formatDateInTimeZone(restaurantCloseTime),
    );

    console.log(
      'Local Time Zone:',
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );

    // Check if requested time is in the past
    if (requestedDateTime < currentTime) {
      console.log('Error: Requested time is in the past');
      return -3; // Error: Requested time is in the past
    }

    // Validate if the requested time falls within restaurant operating hours
    if (
      !isTimeWithinSpecificHours(
        requestedDateTime,
        data.restaurantOpen,
        data.restaurantClose,
      )
    ) {
      console.log(
        `Error: Requested time is outside restaurant hours (Open: ${this.formatDateInTimeZone(
          restaurantOpenTime,
        )}, Close: ${this.formatDateInTimeZone(restaurantCloseTime)})`,
      );
      return -2; // Error: Outside restaurant operating hours
    }

    // Validate if the requested time falls within order acceptance hours
    if (
      !isTimeWithinSpecificHours(
        requestedDateTime,
        data.orderAcceptOpen,
        data.orderAcceptClose,
      )
    ) {
      console.log(
        `Error: Requested time is outside order acceptance hours (Open: ${this.formatDateInTimeZone(
          orderAcceptOpenTime,
        )}, Close: ${this.formatDateInTimeZone(orderAcceptCloseTime)})`,
      );
      return -1; // Error: Outside order acceptance hours
    }

    const [first, second] = data.serviceDuration.split('-').map(Number);

    // Ensure min and max are correctly assigned
    const serviceMin = Math.min(first, second);
    // const serviceMax = Math.max(first, second);
    // Delivery/pickup validation
    const minDeliveryTimeFromNow = addMinutesToTime(serviceMin, currentTime);
    const maxDeliveryTimeFromOrderClose = addMinutesToTime(
      -serviceMin,
      orderAcceptCloseTime,
    );

    console.log(
      `Delivery Validation: Min Delivery Time (Now + ${serviceMin} minutes): ${this.formatDateInTimeZone(
        minDeliveryTimeFromNow,
      )}`,
    );
    console.log(
      `Delivery Validation: Max Delivery Time (Order Close - ${serviceMin} minutes): ${this.formatDateInTimeZone(
        maxDeliveryTimeFromOrderClose,
      )}`,
    );

    // Validate requested time against delivery/pickup range (time-only comparison)
    if (
      !isTimeWithinSpecificHours(
        requestedDateTime,
        this.formatTimeString(minDeliveryTimeFromNow),
        this.formatTimeString(maxDeliveryTimeFromOrderClose),
      )
    ) {
      console.log('Error: Requested time is outside valid delivery range');
      return 0; // Error: Delivery time outside acceptable range
    }

    // Calculate the time difference in minutes
    const timeDifferenceInMinutes = Math.floor(
      (requestedDateTime.getTime() - currentTime.getTime()) / 60000,
    );
    console.log(
      'Time Difference (Requested Time - Current Time):',
      timeDifferenceInMinutes,
    );

    // Return the time difference if valid
    return timeDifferenceInMinutes >= 0 ? timeDifferenceInMinutes : 0;
  }

  /**
   * Formats a `Date` object as a time string (HH:mm).
   * @param date - The date to format.
   * @returns {string} The formatted time string.
   */
  private formatTimeString(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Formats a `Date` object as a localized string with time zone info.
   * @param date - The date to format.
   * @returns {string} The formatted date-time string.
   */
  private formatDateInTimeZone(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZoneName: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
}
