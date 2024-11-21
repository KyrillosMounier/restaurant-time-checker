import { Test, TestingModule } from '@nestjs/testing';
import { OrderTimeService } from './order-time.service';
import { OrderTimeValidationDto } from '../dtos/order-time-validation.dto';

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

  it('should return -2 if requested time is in the past', () => {
    const dto: OrderTimeValidationDto = {
      requestedDateTime: getRequestedDateTime('08:00'), // Time in the past
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      serviceDuration: '10-30', // Example pickup time range (10 to 30 minutes)
      currentTime: '10:00',
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(-2); // Requested time is in the past
  });

  it('should return 0 if requested date exceed next days order limit', () => {
    const dto: OrderTimeValidationDto = {
      requestedDateTime: getRequestedDateTimeNextDays('23:00', 5), // Outside restaurant hours
      allowedNextDaysOrder: 3,
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      serviceDuration: '10-30', // Example pickup time range
      currentTime: '10:00',
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(0); // Outside restaurant operating hours
  });

  it('should return -1 if requested time is outside order acceptance hours', () => {
    const dto: OrderTimeValidationDto = {
      requestedDateTime: getRequestedDateTime('21:30'), // Outside order accept hours
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      serviceDuration: '10-30', // Example pickup time range
      currentTime: '10:00',
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(-1); // Outside order acceptance hours
  });

  it('should return 0 if requested time is outside valid service duration', () => {
    const dto: OrderTimeValidationDto = {
      requestedDateTime: getRequestedDateTime('21:00'), // Outside valid service time range
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      serviceDuration: '10-30', // Example pickup time range
      currentTime: '10:00',
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(0); // Pickup time outside acceptable service duration range
  });

  it('should return time difference (60 m) if requested time is valid', () => {
    const dto: OrderTimeValidationDto = {
      requestedDateTime: getRequestedDateTime('15:00'), // Valid time
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      serviceDuration: '10-30', // Example pickup time range
      currentTime: '14:00',
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(60); // Time difference in minutes (15:00 - 14:00 = 60 mins)
  });

  it('should return 0 if requested time equals current time', () => {
    const dto: OrderTimeValidationDto = {
      requestedDateTime: getRequestedDateTime('10:00'), // Requested time is the same as current time
      orderAcceptOpen: '09:00',
      orderAcceptClose: '21:00',
      serviceDuration: '10-30', // Example pickup time range
      currentTime: '10:00',
    };

    const result = service.validateRequestTime(dto);
    expect(result).toBe(0); // Time difference is 0 minutes
  });
});

// Utility Function
function getRequestedDateTime(time: string): string {
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split('T')[0];
  return `${currentDateString} ${time}`;
}

function getRequestedDateTimeNextDays(time: string, days: number): string {
  const currentDate = new Date();

  // Add the number of days
  currentDate.setDate(currentDate.getDate() + days);

  // Format the date portion (YYYY-MM-DD)
  const currentDateString = currentDate.toISOString().split('T')[0];

  // Return the combined date and time
  return `${currentDateString} ${time}`;
}
