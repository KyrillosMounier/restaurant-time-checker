import {
  IsEnum,
  IsNotEmpty,
  IsInt,
  Min,
  Validate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsTimeFormat } from '../validators/time-format.validator';
import { IsGreaterThanValidator } from '../validators/time-comparsion.validator';
import { IsNumberGreaterOrEqualValidator } from '../validators/number-comparsion.validator';

export enum OrderType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
}

export class OrderTimeValidationDto {
  @ApiProperty({
    enum: OrderType,
    example: OrderType.PICKUP,
    description: 'Type of order, either "pickup" or "delivery".',
  })
  @IsEnum(OrderType, {
    message: 'orderType must be either "pickup" or "delivery".',
  })
  @IsNotEmpty({ message: 'orderType is required.' })
  orderType: OrderType;

  @ApiProperty({
    example: '15:30',
    description: 'The requested time for the order in the format HH:mm.',
  })
  @IsTimeFormat({ message: 'requestedTime must be in the format HH:mm.' })
  @IsNotEmpty({ message: 'requestedTime is required.' })
  requestedTime: string;

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
  @Validate(IsGreaterThanValidator, ['restaurantOpen'], {
    message: 'restaurantClose must be greater than restaurantOpen.',
  })
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
  @Validate(IsGreaterThanValidator, ['orderAcceptOpen'], {
    message: 'orderAcceptClose must be greater than orderAcceptOpen.',
  })
  orderAcceptClose: string;

  @ApiProperty({
    example: 15,
    description: 'The minimum time in minutes for pickup preparation.',
  })
  @IsInt({ message: 'pickupMin must be an integer.' })
  @Min(0, { message: 'pickupMin must be at least 0.' })
  @IsNotEmpty({ message: 'pickupMin is required.' })
  @Type(() => Number)
  pickupMin: number;

  @ApiProperty({
    example: 30,
    description: 'The maximum time in minutes for pickup preparation.',
  })
  @IsInt({ message: 'pickupMax must be an integer.' })
  @Min(0, { message: 'pickupMax must be at least 0.' })
  @Validate(IsNumberGreaterOrEqualValidator, ['pickupMin'], {
    message: 'pickupMax must be greater than or equal to pickupMin.',
  })
  @IsNotEmpty({ message: 'pickupMax is required.' })
  @Type(() => Number)
  pickupMax: number;

  @ApiProperty({
    example: 15,
    description: 'The minimum time in minutes for delivery preparation.',
  })
  @IsInt({ message: 'deliveryMin must be an integer.' })
  @Min(0, { message: 'deliveryMin must be at least 0.' })
  @IsNotEmpty({ message: 'deliveryMin is required.' })
  @Type(() => Number)
  deliveryMin: number;

  @ApiProperty({
    example: 60,
    description: 'The maximum time in minutes for delivery preparation.',
  })
  @IsInt({ message: 'deliveryMax must be an integer.' })
  @Min(0, { message: 'deliveryMax must be at least 0.' })
  @Validate(IsNumberGreaterOrEqualValidator, ['deliveryMin'], {
    message: 'deliveryMax must be greater than or equal to deliveryMin.',
  })
  @IsNotEmpty({ message: 'deliveryMax is required.' })
  @Type(() => Number)
  deliveryMax: number;

  @ApiPropertyOptional({
    example: '14:00',
    description: 'Optional current time for testing in the format HH:mm.',
  })
  @IsOptional()
  currentTime?: string;
}
