import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { parseTime } from '../utils/time-util';

@ValidatorConstraint({ async: false })
export class IsGreaterThanValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (!value || !relatedValue) {
      return true; // If one value is missing, let other validations handle it
    }

    const valueTime = parseTime(value);
    const relatedTime = parseTime(relatedValue);

    return valueTime > relatedTime;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be greater than ${args.constraints[0]}`;
  }
}
