import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsTimeFormat,
  IsDateTimeFormat,
} from '../validators/time-format.validator';
// import { IsGreaterThanValidator } from '../validators/time-comparsion.validator';
import { IsValidServiceDuration } from '../validators/valid-duration.validator';
import { Transform } from 'class-transformer';

export class OrderTimeValidationDto {
  @ApiProperty({
    example: '15:30',
    description:
      'The requested date time for the order in the format  YYYY-MM-DD HH:mm.',
  })
  @IsDateTimeFormat({
    message: 'requestedDateTime must be in the format YYYY-MM-DD HH:mm.',
  })
  @IsNotEmpty({ message: 'requestedDateTime is required.' })
  requestedDateTime: string;

  @ApiProperty({
    example: '09:30',
    description: 'The opening time for order acceptance in the format HH:mm.',
  })
  @IsTimeFormat({ message: 'orderAcceptOpen must be in the format HH:mm.' })
  @IsNotEmpty({ message: 'orderAcceptOpen is required.' })
  orderAcceptOpen: string;

  @ApiProperty({
    example: '20:30',
    description: 'The closing time for order acceptance in the format HH:mm.',
  })
  @IsTimeFormat({ message: 'orderAcceptClose must be in the format HH:mm.' })
  @IsNotEmpty({ message: 'orderAcceptClose is required.' })
  // @Validate(IsGreaterThanValidator, ['orderAcceptOpen'], {
  //   message: 'orderAcceptClose must be greater than orderAcceptOpen.',
  // })
  orderAcceptClose: string;
  @ApiProperty({
    example: '60-75',
    description: 'The service preparation time in minutes.',
  })
  @IsNotEmpty({ message: 'Service duration is required.' })
  @IsValidServiceDuration({
    message:
      'Invalid service duration format. Use "min-max" or "max-min", with positive numbers.',
  })
  serviceDuration: string;

  @ApiPropertyOptional({
    example: '14:00',
    description: 'Optional current time for testing in the format HH:mm.',
  })
  @ApiProperty({
    example: 1,
    description: 'Allowed Next Days Order.',
  })
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  allowedNextDaysOrder?: number = 1;

  @IsOptional()
  currentTime?: string;
}
