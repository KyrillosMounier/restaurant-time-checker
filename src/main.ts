import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './validators/custom-validation.pipe';
import { HttpExceptionFilter } from './http-exception.filter';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Restaurant Time Checker API')
    .setDescription('API to process check for restaurant  order time')
    .setVersion('1.0')
    .addTag('Restaurant')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  const port = process.env.PORT ?? 3000;

  console.log('run on port', port);
  console.log('swagger Docs on /api-docs');

  await app.listen(port);
}
bootstrap();
