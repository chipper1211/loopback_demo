import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {WeatherApiDataSource} from '../datasources/weather-api.datasource';
import {ForecastResponse} from '../models/forecast-response.model';
import { WeatherResponse } from '../models/weather-response.model';

export interface WeatherApiService {
  getWeatherByCity(city: string): Promise<WeatherResponse>;
  getForecastByCity(city: string): Promise<ForecastResponse>;
}

export class WeatherApiServiceProvider implements Provider<WeatherApiService> {
  constructor(
    @inject('datasources.weatherApi')
    protected dataSource: WeatherApiDataSource = new WeatherApiDataSource(),
  ) {}

  value(): Promise<WeatherApiService> {
    return getService(this.dataSource);
  }
}