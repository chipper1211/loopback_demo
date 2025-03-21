import {property} from '@loopback/repository';

export function FormattedDate() {
  return property({
    type: 'string',
    jsonSchema: {
      format: 'date-time',
    },
  });
}
