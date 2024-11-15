import {
  ApiOrderTimeValidationOperation,
  ApiOrderTimeValidationBody,
  ApiOrderTimeValidationResponse,
  ApiOrderTimeValidationResponse400,
} from './swagger-order-time.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { OrderTimeService } from './order-time.service';
import { OrderTimeValidationDto } from '../dtos/order-time-validation.dto';

@Controller('order-time')
export class OrderTimeController {
  constructor(private readonly orderTimeService: OrderTimeService) {}

  @Post()
  @ApiOrderTimeValidationOperation
  @ApiOrderTimeValidationBody
  @ApiOrderTimeValidationResponse
  @ApiOrderTimeValidationResponse400
  validateTime(@Body() data: OrderTimeValidationDto): { result: number } {
    const result = this.orderTimeService.validateRequestTime(data);
    return { result };
  }
}
