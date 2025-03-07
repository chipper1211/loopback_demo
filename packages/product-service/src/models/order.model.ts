import {Entity, model, property} from '@loopback/repository';

@model()
export class Order extends Entity {
  @property({id: true})
  id: number;

  @property()
  productId: number;

  @property()
  quantity: number;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}
