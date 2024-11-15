import { registerDecorator, ValidationOptions } from 'class-validator';
import * as moment from 'moment';

export function IsTimeFormat(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTimeFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          // Check if the value matches the HH:mm format and is a valid time
          return (
            typeof value === 'string' &&
            /^\d{2}:\d{2}$/.test(value) &&
            moment(value, 'HH:mm', true).isValid()
          );
        },
        defaultMessage(): string {
          // Return a default error message without referencing unused args
          return `${propertyName} must be in the format HH:mm`;
        },
      },
    });
  };
}
