import {get, param} from '@loopback/rest';
import axios from 'axios';
import {HttpErrors} from '@loopback/rest';
import { authenticate } from '@loopback/authentication';
import { requireRoles } from '../decorators/role-authorization';
import {RoleEnum} from '../enums/role.enum';
import { inject } from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security'

@authenticate('jwt')
export class CatalogController {
  
  constructor(
    @inject(SecurityBindings.USER)
    private currentUser: UserProfile,
  ) {}
  
  @requireRoles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
  @get('/products-with-users')
  async getProductsWithUsers(): Promise<any[]> {
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

    // Fetch users from user-service
    let usersResponse;
    try {
      usersResponse = await axios.get('http://127.0.0.1:3002/users');
    } catch (error) {
      console.error('Failed to connect to user-service:', error.message);
      throw new HttpErrors.ServiceUnavailable('User service is unavailable');
    }
    
    const users = usersResponse.data;

    // Fetch orders from order-service
    let ordersResponse;
    try {
      ordersResponse = await axios.get('http://127.0.0.1:3001/orders');
    } catch (error) {
      console.error('Failed to connect to order-service:', error.message);
      throw new HttpErrors.ServiceUnavailable('Order service is unavailable');
    }
    
    const orders = ordersResponse.data;

    const combined = products.map((product: any) => {
      const productOrders = orders.filter((order: any) => order.productId === product.id);
      
      const productUsers = users.filter((user: any) => user.id === product.id);
      
      return {
        ...product,
        orders: productOrders,
        users: productUsers
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


  @requireRoles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN, RoleEnum.SUBSCRIBER])
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

@requireRoles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
@get('/weather/{city}')
async getWeatherByCity(
  @param.path.string('city') city: string
): Promise<any> {
  try {
    // Fetch weather data from weather-service
    let weatherResponse;
    try {
      weatherResponse = await axios.get(`http://127.0.0.1:3004/api/example/v1/weather/${city}`);
    } catch (error) {
      console.error('Failed to connect to weather-service:', error.message);
      throw new HttpErrors.ServiceUnavailable('Weather service is unavailable');
    }
    
    return weatherResponse.data;
  } catch (error) {
    if (error instanceof HttpErrors.HttpError) {
      throw error;
    }
    console.error('Unexpected error:', error);
    throw new HttpErrors.InternalServerError('Internal Server Error');
  }
}

@requireRoles([RoleEnum.SUPERADMIN, RoleEnum.ADMIN])
@get('/forecast/{city}')
async getForecastByCity(
  @param.path.string('city') city: string
): Promise<any> {
  try {
    // Fetch forecast data from weather-service
    let forecastResponse;
    try {
      forecastResponse = await axios.get(`http://127.0.0.1:3004/api/example/v1/forecast/${city}`);
    } catch (error) {
      console.error('Failed to connect to weather-service:', error.message);
      throw new HttpErrors.ServiceUnavailable('Weather service is unavailable');
    }
    
    return forecastResponse.data;
  } catch (error) {
    if (error instanceof HttpErrors.HttpError) {
      throw error;
    }
    console.error('Unexpected error:', error);
    throw new HttpErrors.InternalServerError('Internal Server Error');
  }
}

}