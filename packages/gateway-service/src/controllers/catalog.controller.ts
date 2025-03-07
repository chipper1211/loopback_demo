import {get} from '@loopback/rest';
import axios from 'axios';
import {HttpErrors} from '@loopback/rest';

export class CatalogController {
  
  @get('/products-with-orders')
  async getProductsWithOrders(): Promise<any[]> {
    try {
      // Fetch products from product-service
      let productsResponse;
      try {
        productsResponse = await axios.get('http://127.0.0.1:3000/products');
      } catch (error) {
        console.error('Failed to connect to product-service:', error.message);
        throw new HttpErrors.ServiceUnavailable('Product service is unavailable');
      }
      
      const products = productsResponse.data;

      // Fetch orders from order-service
      let ordersResponse;
      try {
        ordersResponse = await axios.get('http://127.0.0.1:3001/orders');
      } catch (error) {
        console.error('Failed to connect to order-service:', error.message);
        throw new HttpErrors.ServiceUnavailable('Order service is unavailable');
      }
      
      const orders = ordersResponse.data;

      // Combine products with their respective orders
      const combined = products.map((product: any) => {
        const productOrders = orders.filter((order: any) => order.productId === product.id);
        return {
          ...product,
          orders: productOrders,
        };
      });

      return combined;

    } catch (error) {
      if (error instanceof HttpErrors.HttpError) {
        throw error;
      }
      console.error('Unexpected error:', error);
      throw new HttpErrors.InternalServerError('Internal Server Error');
    }
  }
}