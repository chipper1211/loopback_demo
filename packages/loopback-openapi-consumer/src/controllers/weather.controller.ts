import {inject, service} from '@loopback/core';
import {get, param} from '@loopback/rest';
import {WeatherApiService} from '../services/weather-api.service';

export class WeatherController {
  constructor(
    @inject('services.WeatherApiService')
    private weatherService: WeatherApiService,
  ) {}

  @get('/weather/{city}')
  async getWeather(@param.path.string('city') city: string) {
    return this.weatherService.getWeatherByCity(city);
  }

  @get('/forecast/{city}')
  async getForecast(@param.path.string('city') city: string) {
    return this.weatherService.getForecastByCity(city);
  }
}