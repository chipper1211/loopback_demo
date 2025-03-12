import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'weatherApi',
  connector: 'rest',
  baseURL: 'http://localhost:3000/api/example/v1',
  crud: false,
  options: {
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
    },
  },
  operations: [
    {
      template: {
        method: 'GET',
        url: 'http://localhost:3000/api/example/v1/weather/{city}',
        responsePath: '$',
      },
      functions: {
        getWeatherByCity: ['city'],
      },
    },
    {
      template: {
        method: 'GET',
        url: 'http://localhost:3000/api/example/v1/forecast/{city}',
        responsePath: '$',
      },
      functions: {
        getForecastByCity: ['city'],
      },
    },
  ],
};

@lifeCycleObserver('datasource')
export class WeatherApiDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'weatherApi';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.weatherApi', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}