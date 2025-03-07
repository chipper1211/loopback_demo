import {Entity, hasMany, model, property} from '@loopback/repository';
import {Order} from './order.model';

@model()
export class Product extends Entity {
  @property({id: true})
  id: number;

  @property()
  name: string;

  @property()
  price: number;

  @hasMany(() => Order)
  orders: Order[];

  constructor(data?: Partial<Product>) {
    super(data);
  }
}
