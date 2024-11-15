import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsNumberGreaterOrEqualValidator
  implements ValidatorConstraintInterface
{
  validate(value: number, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (typeof value !== 'number' || typeof relatedValue !== 'number') {
      return true; // Let other validations handle non-number values
    }

    return value >= relatedValue; // Allow equal values
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be greater than or equal to ${args.constraints[0]}`;
  }
}
