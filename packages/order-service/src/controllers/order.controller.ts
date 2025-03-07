import {get} from '@loopback/rest';
import {Order} from '../models';

export class OrderController {
  @get('/orders')
  getOrders(): Order[] {
    return [
      new Order({id: 1, productId: 1, quantity: 2}),
      new Order({id: 2, productId: 2, quantity: 1}),
    ];
  }
}
