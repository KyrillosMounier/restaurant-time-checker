import { Test, TestingModule } from '@nestjs/testing';
import { OrderTimeController } from './order-time.controller';
import { OrderTimeService } from './order-time.service';
import * as request from 'supertest'; // Correct 'supertest' import
import { HttpStatus } from '@nestjs/common';
import {
  OrderTimeValidationDto,
  OrderType,
} from '../dtos/order-time-validation.dto';
import { INestApplication } from '@nestjs/common';
import { CustomValidationPipe } from '../validators/custom-validation.pipe';

describe('OrderTimeController', () => {
  let app: INestApplication; // Declare app variable for NestJS application
  let service: OrderTimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderTimeController],
      providers: [OrderTimeService], // No mocking of the service
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new CustomValidationPipe()); // Initialize the NestJS app
    await app.init(); // Start the app

    service = module.get<OrderTimeService>(OrderTimeService); // Get the actual service
  });

  afterEach(async () => {
    await app.close(); // Ensure app is closed after tests
  });

  it('should be defined', () => {
    const controller = app.get<OrderTimeController>(OrderTimeController);
    expect(controller).toBeDefined();
  });

  describe('POST /order-time', () => {
    it('should return valid response for pickup request', async () => {
      const dto: OrderTimeValidationDto = {
        orderType: OrderType.PICKUP,
        requestedTime: '15:00', // Use valid time format
        restaurantOpen: '09:00',
        restaurantClose: '22:00',
        orderAcceptOpen: '09:30',
        orderAcceptClose: '20:30',
        pickupMin: 15,
        pickupMax: 30,
        deliveryMin: 15,
        deliveryMax: 60,
        currentTime: '14:00',
      };

      // Send POST request using 'supertest' to the correct path
      return request(app.getHttpServer()) // Make sure you use app.getHttpServer() for the request
        .post('/order-time')
        .send(dto)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body.result).toBeGreaterThanOrEqual(0); // Adjust this depending on your expected response
        });
    });

    it('should return 400 Bad Request when invalid time is provided', async () => {
      const dto: OrderTimeValidationDto = {
        orderType: OrderType.PICKUP,
        requestedTime: 'invalid_time', // Invalid time format to trigger the validation error
        restaurantOpen: '09:00',
        restaurantClose: '22:00',
        orderAcceptOpen: '09:30',
        orderAcceptClose: '20:30',
        pickupMin: 15,
        pickupMax: 30,
        deliveryMin: 15,
        deliveryMax: 60,
        currentTime: '14:00',
      };
      return request(app.getHttpServer())
        .post('/order-time')
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST) // Expect 400 status code
        .expect((res) => {
          expect(res.body.message).toEqual([
            'requestedTime must be in the format HH:mm.',
          ]); // Match validation error message
        });
    });

    it('should return 500 Internal Server Error when unexpected error occurs', async () => {
      const dto: OrderTimeValidationDto = {
        orderType: OrderType.PICKUP,
        requestedTime: '15:00',
        restaurantOpen: '09:00',
        restaurantClose: '22:00',
        orderAcceptOpen: '09:30',
        orderAcceptClose: '20:30',
        pickupMin: 15,
        pickupMax: 30,
        deliveryMin: 15,
        deliveryMax: 60,
        currentTime: '14:00',
      };

      // Directly simulate an unexpected error inside the actual service
      jest.spyOn(service, 'validateRequestTime').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      return request(app.getHttpServer())
        .post('/order-time')
        .send(dto)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR) // Expect 500 status code
        .expect((res) => {
          expect(res.body.message).toBe('Internal server error');
        });
    });
  });
});
