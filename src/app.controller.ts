import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiOperation({
    summary: 'Health Check',
    description: 'Returns the health status of the app.',
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
