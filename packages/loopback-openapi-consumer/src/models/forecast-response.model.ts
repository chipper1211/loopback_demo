import {model, property} from '@loopback/repository';

@model()
export class ForecastDay {
  @property({
    type: 'string',
    format: 'date',
  })
  date?: string;

  @property({
    type: 'object',
  })
  temperature?: {
    min: number;
    max: number;
  };

  @property({
    type: 'number',
  })
  humidity?: number;

  @property({
    type: 'string',
  })
  description?: string;
}

@model()
export class ForecastResponse {
  @property({
    type: 'string',
  })
  city?: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  forecast?: ForecastDay[];

  constructor(data?: Partial<ForecastResponse>) {
    Object.assign(this, data);
  }
}