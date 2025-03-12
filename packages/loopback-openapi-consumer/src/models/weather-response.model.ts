import {model, property} from '@loopback/repository';

@model()
export class WeatherResponse {
  @property({
    type: 'string',
  })
  city?: string;

  @property({
    type: 'number',
  })
  temperature?: number;

  @property({
    type: 'number',
  })
  humidity?: number;

  @property({
    type: 'number',
  })
  windSpeed?: number;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    format: 'date-time',
  })
  updatedAt?: string;

  constructor(data?: Partial<WeatherResponse>) {
    Object.assign(this, data);
  }
}