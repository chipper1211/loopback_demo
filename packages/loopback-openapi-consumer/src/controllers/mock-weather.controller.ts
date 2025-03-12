import {get, param} from '@loopback/rest';

export class MockWeatherController {
  @get('/api/example/v1/weather/{city}')
  async getWeather(@param.path.string('city') city: string) {
    return {
      city: city,
      temperature: 22.5 + Math.random() * 10 - 5,
      humidity: 65 + Math.floor(Math.random() * 20 - 10),
      windSpeed: 5.2 + Math.random() * 3 - 1.5,
      description: ['Sunny', 'Partly cloudy', 'Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 5)],
      updatedAt: new Date().toISOString()
    };
  }

  @get('/api/example/v1/forecast/{city}')
  async getForecast(@param.path.string('city') city: string) {
    const forecast = [];
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      
      forecast.push({
        date: forecastDate.toISOString().split('T')[0],
        temperature: {
          min: 15 + Math.random() * 10,
          max: 25 + Math.random() * 10
        },
        humidity: 60 + Math.floor(Math.random() * 30),
        description: ['Sunny', 'Partly cloudy', 'Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 5)]
      });
    }
    
    return {
      city: city,
      forecast: forecast
    };
  }
}