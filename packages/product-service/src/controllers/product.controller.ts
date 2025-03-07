import {get} from '@loopback/rest';
import {Product, Order} from '../models';

export class ProductController {
  @get('/products')
  getProducts(): Product[] {
    return [
      new Product({
        id: 1,
        name: 'Phone',
        price: 500,
        orders: [
          new Order({id: 1, productId: 1, quantity: 2}),
          new Order({id: 2, productId: 1, quantity: 1}),
        ],
      }),
      new Product({
        id: 2,
        name: 'Laptop',
        price: 1200,
        orders: [new Order({id: 3, productId: 2, quantity: 4})],
      }),
    ];
  }
}
