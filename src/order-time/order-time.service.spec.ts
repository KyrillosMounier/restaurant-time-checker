import { Test, TestingModule } from '@nestjs/testing';
import { OrderTimeService } from './order-time.service';
import {
  OrderTimeValidationDto,
  OrderType,
} from '../dtos/order-time-validation.dto';

describe('OrderTimeService', () => {
  let service: OrderTimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderTimeService],
    }).compile();

    service = module.get<OrderTimeService>(OrderTimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return -3 if requested time is in the past', () => {
    const dto: OrderTimeValidationDto = {
      orderType: OrderType.PICKUP,
      requestedTime: '08:00', // Time in the past relative to mockNow
      restaurantOpen: '09:00',
      restaurantClose: '22:00',
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      pickupMin: 10,
      pickupMax: 30,
      deliveryMin: 10,
      deliveryMax: 30,
      currentTime: '10:00', // Pass current time for testing
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(-3); // Requested time is in the past
  });

  it('should return -2 if requested time is outside restaurant hours', () => {
    const dto: OrderTimeValidationDto = {
      orderType: OrderType.PICKUP,
      requestedTime: '23:00', // Outside restaurant hours
      restaurantOpen: '09:00',
      restaurantClose: '22:00',
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      pickupMin: 10,
      pickupMax: 30,
      deliveryMin: 10,
      deliveryMax: 30,
      currentTime: '10:00', // Pass current time for testing
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(-2); // Outside restaurant operating hours
  });

  it('should return -1 if requested time is outside order acceptance hours', () => {
    const dto: OrderTimeValidationDto = {
      orderType: OrderType.PICKUP,
      requestedTime: '21:30', // Outside order accept hours
      restaurantOpen: '09:00',
      restaurantClose: '22:00',
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      pickupMin: 10,
      pickupMax: 30,
      deliveryMin: 10,
      deliveryMax: 30,
      currentTime: '10:00', // Pass current time for testing
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(-1); // Outside order acceptance hours
  });

  it('should return 0 if requested time is outside pickup range', () => {
    const dto: OrderTimeValidationDto = {
      orderType: OrderType.PICKUP,
      requestedTime: '21:00', // Outside valid pickup time range
      restaurantOpen: '09:00',
      restaurantClose: '22:00',
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      pickupMin: 10,
      pickupMax: 30,
      deliveryMin: 10,
      deliveryMax: 30,
      currentTime: '10:00', // Pass current time for testing
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(0); // Pickup time outside acceptable range
  });

  it('should return 0 if requested time is outside delivery range', () => {
    const dto: OrderTimeValidationDto = {
      orderType: OrderType.DELIVERY,
      requestedTime: '20:55', // Outside valid delivery time range
      restaurantOpen: '09:00',
      restaurantClose: '22:00',
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      pickupMin: 10,
      pickupMax: 30,
      deliveryMin: 10,
      deliveryMax: 30,
      currentTime: '10:00', // Pass current time for testing
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(0); // Delivery time outside acceptable range
  });

  it('should return time difference (60 m) if requested time is valid', () => {
    const dto: OrderTimeValidationDto = {
      orderType: OrderType.PICKUP,
      requestedTime: '15:00', // Valid time
      restaurantOpen: '09:00',
      restaurantClose: '22:00',
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      pickupMin: 10,
      pickupMax: 30,
      deliveryMin: 10,
      deliveryMax: 30,
      currentTime: '14:00', // Pass current time for testing
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(60); // Time difference in minutes (15:00 - 14:00 = 60 mins)
  });

  // Additional Advanced Test Cases

  it('should return 0 if requested time equals current time', () => {
    const dto: OrderTimeValidationDto = {
      orderType: OrderType.PICKUP,
      requestedTime: '10:00', // Requested time is the same as current time
      restaurantOpen: '09:00',
      restaurantClose: '22:00',
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      pickupMin: 10,
      pickupMax: 30,
      deliveryMin: 10,
      deliveryMax: 30,
      currentTime: '10:00', // Current time
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(0); // Time difference is 0 minutes
  });

  it('should return 0 if requested time is exactly at the orderAcceptClose time', () => {
    const dto: OrderTimeValidationDto = {
      orderType: OrderType.PICKUP,
      requestedTime: '21:00', // Requested time is exactly at order accept close time
      restaurantOpen: '09:00',
      restaurantClose: '22:00',
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      pickupMin: 10,
      pickupMax: 30,
      deliveryMin: 10,
      deliveryMax: 30,
      currentTime: '10:00',
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(0); // Outside order acceptance hours
  });

  it('should return 0 if requested time is outside delivery range', () => {
    const dto: OrderTimeValidationDto = {
      orderType: OrderType.DELIVERY,
      requestedTime: '20:55', // Outside valid delivery time range
      restaurantOpen: '09:00',
      restaurantClose: '22:00',
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      pickupMin: 10,
      pickupMax: 30,
      deliveryMin: 10,
      deliveryMax: 30,
      currentTime: '10:00', // Pass current time for testing
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(0); // Delivery time outside acceptable range
  });

  it('should return -3 as requestedTime is in the past ', () => {
    const dto: OrderTimeValidationDto = {
      orderType: OrderType.PICKUP,
      requestedTime: '14:59', // Just 1 minute before currentTime
      restaurantOpen: '09:00',
      restaurantClose: '22:00',
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      pickupMin: 10,
      pickupMax: 30,
      deliveryMin: 10,
      deliveryMax: 30,
      currentTime: '15:00',
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(-3);
  });

  it('should return time (155 min) difference if requested time is valid', () => {
    const dto: OrderTimeValidationDto = {
      orderType: OrderType.DELIVERY,
      requestedTime: '16:35', // Valid time
      restaurantOpen: '09:00',
      restaurantClose: '22:00',
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      pickupMin: 10,
      pickupMax: 30,
      deliveryMin: 60,
      deliveryMax: 75,
      currentTime: '14:00', // Pass current time for testing
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(155); // Time difference in minutes (16:35 - 14:00 = 155 mins)
  });
});
