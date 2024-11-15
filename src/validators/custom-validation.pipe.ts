import {
  ValidationPipe,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors
          .map((error) => {
            // Extracting constraints (error messages) for each field
            return Object.values(error.constraints || {});
          })
          .flat(); // Flatten to a single array of messages

        return new BadRequestException(messages);
      },
    });
  }
}
