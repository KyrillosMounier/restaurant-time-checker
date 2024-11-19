import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderTimeValidationDto } from '../dtos/order-time-validation.dto';

// Define data examples to cover various cases
const orderTimeExamples = {
  validDelivery: {
    summary: 'Valid delivery request',
    value: {
      requestedDateTime: '2024-11-20 12:00',
      restaurantOpen: '09:00',
      restaurantClose: '22:00',
      orderAcceptOpen: '09:30',
      orderAcceptClose: '20:30',
      serviceDuration: '30-45',
      currentTime: '11:00',
    },
  },
  invalidPastTime: {
    summary: 'Requested time in the past',
    value: {
      requestedDateTime: '2024-11-15 12:00',
      restaurantOpen: '09:00',
      restaurantClose: '22:00',
      orderAcceptOpen: '09:30',
      orderAcceptClose: '20:30',
      serviceDuration: '30-45',
      currentTime: '14:00',
    },
  },
  invalidRestaurantHours: {
    summary: 'Requested time outside restaurant hours',
    value: {
      requestedDateTime: '2024-11-20 23:00',
      restaurantOpen: '09:00',
      restaurantClose: '22:00',
      orderAcceptOpen: '09:30',
      orderAcceptClose: '20:30',
      serviceDuration: '30-45',
      currentTime: '14:00',
    },
  },
  invalidAcceptanceHours: {
    summary: 'Requested time outside order acceptance hours',
    value: {
      requestedDateTime: '2024-11-20 21:00',
      restaurantOpen: '09:00',
      restaurantClose: '22:00',
      orderAcceptOpen: '09:30',
      orderAcceptClose: '20:30',
      serviceDuration: '30-45',
      currentTime: '14:00',
    },
  },
  invalidTimeRange: {
    summary: 'requestedDateTime is invalid datetime formate',
    value: {
      requestedDateTime: '2024-11-20 88:99',
      restaurantOpen: '09:00',
      restaurantClose: '22:00',
      orderAcceptOpen: '09:30',
      orderAcceptClose: '20:30',
      serviceDuration: '30-45',
      currentTime: '14:00',
    },
  },
};

export const ApiOrderTimeValidationOperation = ApiOperation({
  summary: 'Validate order time',
  description:
    'Validates the requested time for an order (pickup or delivery).',
});

export const ApiOrderTimeValidationBody = ApiBody({
  description: 'The payload containing order time details for validation.',
  type: OrderTimeValidationDto,
  examples: orderTimeExamples,
});

export const ApiOrderTimeValidationResponse = ApiResponse({
  status: 201,
  description: 'The time validation result.',
  schema: {
    example: { result: 60 }, // Valid time difference example
  },
});

export const ApiOrderTimeValidationResponse400 = ApiResponse({
  status: 400,
  description: 'Bad Request - Data is incorrect or validation failed.',
  schema: {
    example: {
      message: [],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
});
