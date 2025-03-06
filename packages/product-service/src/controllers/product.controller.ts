import {get} from '@loopback/rest';
import {Product} from '../models';

export class ProductController {
  @get('/products')
  getProducts(): Product[] {
    return [
      new Product({id: 1, name: 'Phone', price: 500}),
      new Product({id: 2, name: 'Laptop', price: 1200}),
      new Product({id: 3, name: 'Desktop', price: 1600})
    ];
  }
}
