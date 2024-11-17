import { Injectable } from '@nestjs/common';
import {
  OrderTimeValidationDto,
  OrderType,
} from '../dtos/order-time-validation.dto';
import { addMinutesToTime, parseTime } from '../utils/time-util';

@Injectable()
export class OrderTimeService {
  validateRequestTime(data: OrderTimeValidationDto): number {
    const currentTime = data.currentTime
      ? parseTime(data.currentTime, new Date()) // Parse currentTime as Date
      : new Date();
    console.log('Current Time (Now):', this.formatDateInTimeZone(currentTime));

    // Parse requested time as Date object (ensure same reference date as currentTime)
    let requestedTime = parseTime(data.requestedTime, currentTime);

    // Adjust requestedTime if it's earlier than currentTime (possibly user meant PM)
    if (requestedTime.getHours() <= 12 && requestedTime < currentTime) {
      console.log('conver to 24 h');
      const nextDayRequestedTime = new Date(requestedTime);
      nextDayRequestedTime.setHours(nextDayRequestedTime.getHours() + 12);

      // Check if converting to PM makes it valid
      if (nextDayRequestedTime > currentTime) {
        console.log(
          `Adjusting requested time from ${this.formatDateInTimeZone(
            requestedTime,
          )} to ${this.formatDateInTimeZone(nextDayRequestedTime)} (PM assumed)`,
        );
        requestedTime = nextDayRequestedTime;
      }
    }
    console.log('Requested Time:', this.formatDateInTimeZone(requestedTime));

    // Parse all other time fields (ensure same reference date as currentTime)
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

    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('Local Time Zone:', localTimeZone);

    // Check if requested time is in the past after adjustment
    if (requestedTime < currentTime) {
      console.log('Error: Requested time is in the past');
      return -3; // Error code for requested time being in the past
    }

    // Validate if the requested time is within restaurant operating hours
    if (
      requestedTime < restaurantOpenTime ||
      requestedTime > restaurantCloseTime
    ) {
      console.log(
        `Error: Requested time is outside restaurant hours (Open: ${restaurantOpenTime}, Close: ${restaurantCloseTime})`,
      );
      return -2; // Outside restaurant operating hours
    }

    // Validate if the requested time is within order acceptance hours
    if (
      requestedTime < orderAcceptOpenTime ||
      requestedTime > orderAcceptCloseTime
    ) {
      console.log(
        `Error: Requested time is outside order acceptance hours (Open: ${orderAcceptOpenTime}, Close: ${orderAcceptCloseTime})`,
      );
      return -1; // Outside order acceptance hours
    }

    // Pickup validation
    if (data.orderType === OrderType.PICKUP) {
      const minPickupTimeFromNow = addMinutesToTime(
        data.pickupMin,
        currentTime,
      );
      const maxPickupTimeFromOrderClose = addMinutesToTime(
        -data.pickupMin,
        orderAcceptCloseTime,
      );
      console.log(
        `Pickup Validation: Min Pickup Time (Now + ${data.pickupMin} minutes): ${this.formatDateInTimeZone(
          minPickupTimeFromNow,
        )}`,
      );
      console.log(
        `Pickup Validation: Max Pickup Time (Order Close - ${data.pickupMin} minutes): ${this.formatDateInTimeZone(
          maxPickupTimeFromOrderClose,
        )}`,
      );

      if (
        requestedTime < minPickupTimeFromNow ||
        requestedTime > maxPickupTimeFromOrderClose
      ) {
        console.log('Error: Requested time is outside valid pickup range');
        return 0; // Pickup time outside acceptable range
      }
    }

    // Delivery validation
    if (data.orderType === OrderType.DELIVERY) {
      const minDeliveryTimeFromNow = addMinutesToTime(
        data.deliveryMin,
        currentTime,
      );
      const maxDeliveryTimeFromOrderClose = addMinutesToTime(
        -data.deliveryMin,
        orderAcceptCloseTime,
      );
      console.log(
        `Delivery Validation: Min Delivery Time (Now + ${data.deliveryMin} minutes): ${this.formatDateInTimeZone(
          minDeliveryTimeFromNow,
        )}`,
      );
      console.log(
        `Delivery Validation: Max Delivery Time (Order Close - ${data.deliveryMin} minutes): ${this.formatDateInTimeZone(
          maxDeliveryTimeFromOrderClose,
        )}`,
      );

      if (
        requestedTime < minDeliveryTimeFromNow ||
        requestedTime > maxDeliveryTimeFromOrderClose
      ) {
        console.log('Error: Requested time is outside valid delivery range');
        return 0; // Delivery time outside acceptable range
      }
    }

    const timeDifferenceInMinutes = Math.floor(
      (requestedTime.getTime() - currentTime.getTime()) / 60000,
    );
    console.log(
      'Time Difference (Requested Time - Current Time):',
      timeDifferenceInMinutes,
    );

    return timeDifferenceInMinutes >= 0 ? timeDifferenceInMinutes : 0;
  }

  // Helper function to format the date in the correct time zone for console logs
  private formatDateInTimeZone(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      timeZoneName: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
}
