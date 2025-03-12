import {model, property} from '@loopback/repository';

@model()
export class ErrorResponse {
  @property({
    type: 'number',
  })
  code?: number;

  @property({
    type: 'string',
  })
  message?: string;

  constructor(data?: Partial<ErrorResponse>) {
    Object.assign(this, data);
  }
}