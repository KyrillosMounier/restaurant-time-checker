import { Module } from '@nestjs/common';
import { OrderTimeService } from './order-time.service';
import { OrderTimeController } from './order-time.controller';

@Module({
  controllers: [OrderTimeController],
  providers: [OrderTimeService],
})
export class OrderTimeModule {}
