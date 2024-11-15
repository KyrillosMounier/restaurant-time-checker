import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderTimeModule } from './order-time/order-time.module';

@Module({
  imports: [OrderTimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
