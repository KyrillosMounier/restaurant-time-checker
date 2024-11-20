import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsTimeFormat,
  IsDateTimeFormat,
} from '../validators/time-format.validator';
// import { IsGreaterThanValidator } from '../validators/time-comparsion.validator';
import { IsValidServiceDuration } from '../validators/valid-duration.validator';

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
    example: '09:00',
    description: 'The opening time of the restaurant in the format HH:mm.',
  })
  @IsTimeFormat({ message: 'restaurantOpen must be in the format HH:mm.' })
  @IsNotEmpty({ message: 'restaurantOpen is required.' })
  restaurantOpen: string;

  @ApiProperty({
    example: '22:00',
    description: 'The closing time of the restaurant in the format HH:mm.',
  })
  @IsTimeFormat({ message: 'restaurantClose must be in the format HH:mm.' })
  @IsNotEmpty({ message: 'restaurantClose is required.' })
  // @Validate(IsGreaterThanValidator, ['restaurantOpen'], {
  //   message: 'restaurantClose must be greater than restaurantOpen.',
  // })
  restaurantClose: string;

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
  @IsOptional()
  currentTime?: string;
}
