import { Test, TestingModule } from '@nestjs/testing';
import { OrderTimeController } from './order-time.controller';
import { OrderTimeService } from './order-time.service';
import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { OrderTimeValidationDto } from '../dtos/order-time-validation.dto';
import { INestApplication } from '@nestjs/common';
import { CustomValidationPipe } from '../validators/custom-validation.pipe';

describe('OrderTimeController', () => {
  let app: INestApplication;
  let service: OrderTimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderTimeController],
      providers: [OrderTimeService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new CustomValidationPipe());
    await app.init();

    service = module.get<OrderTimeService>(OrderTimeService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    const controller = app.get<OrderTimeController>(OrderTimeController);
    expect(controller).toBeDefined();
  });

  describe('POST /order-time', () => {
    it('should return valid response for pickup request', async () => {
      // Generate current date and set a random time for requestedDateTime
      const now = new Date();
      const hours = now.getHours() - 5; // past hour
      const minutes = now.getMinutes();
      now.setHours(hours, minutes, 0, 0); // Set time
      const requestedDateTime = now
        .toISOString()
        .slice(0, 16)
        .replace('T', ' '); // Format as YYYY-MM-DD HH:mm

      const dto: OrderTimeValidationDto = {
        requestedDateTime: requestedDateTime, // Use generated random date-time
        orderAcceptOpen: '09:30',
        orderAcceptClose: '20:30',
        serviceDuration: '60-75',
        currentTime: '14:00', // Optional, can be adjusted as needed
      };

      return request(app.getHttpServer())
        .post('/order-time')
        .send(dto)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body.result).toBe(-2); // Adjust based on your expected response
        });
    });

    it('should return 400 Bad Request when invalid time is provided', async () => {
      const dto: OrderTimeValidationDto = {
        requestedDateTime: 'invalid-time',
        orderAcceptOpen: '09:30',
        orderAcceptClose: '20:30',
        serviceDuration: '60-75',
        currentTime: '14:00',
      };
      return request(app.getHttpServer())
        .post('/order-time')
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toEqual([
            'requestedDateTime must be in the format YYYY-MM-DD HH:mm.',
          ]);
        });
    });

    it('should return 500 Internal Server Error when unexpected error occurs', async () => {
      const dto: OrderTimeValidationDto = {
        requestedDateTime: '2024-11-18 15:00',
        orderAcceptOpen: '09:30',
        orderAcceptClose: '20:30',
        serviceDuration: '60-75',
        currentTime: '14:00',
      };

      jest.spyOn(service, 'validateRequestTime').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      return request(app.getHttpServer())
        .post('/order-time')
        .send(dto)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect((res) => {
          expect(res.body.message).toBe('Internal server error');
        });
    });
  });
});
