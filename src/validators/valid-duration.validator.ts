import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Validator Constraint for the ServiceDuration
@ValidatorConstraint({ async: false })
export class IsValidServiceDurationConstraint
  implements ValidatorConstraintInterface
{
  validate(serviceDuration: string): boolean {
    const regex = /^\d+-\d+$/; // Matches the "min-max" or "max-min" format
    if (!regex.test(serviceDuration)) {
      return false;
    }

    // Extract min and max
    const [first, second] = serviceDuration.split('-').map(Number);

    // Both values must be positive
    return first > 0 && second > 0;
  }

  defaultMessage(): string {
    return 'Service duration must be in the format "min-max" or "max-min", where both are positive numbers.';
  }
}

// Decorator to use the custom constraint
export function IsValidServiceDuration(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidServiceDurationConstraint,
    });
  };
}
