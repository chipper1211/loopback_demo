import {Entity, model, property} from '@loopback/repository';

@model()
export class Product extends Entity {
  @property({id: true})
  id: number;

  @property()
  name: string;

  @property()
  price: number;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}
