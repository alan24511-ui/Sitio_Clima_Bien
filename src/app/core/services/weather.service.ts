import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { first, map, Observable } from 'rxjs';
import { City } from '../models/city.model';
import { CurrentWeather } from '../models/weather.model';
import { AirQuality } from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly http = inject(HttpClient);

  private readonly URL_GEOCODING = 'https://geocoding-api.open-meteo.com/v1/search';
  private readonly URL_FORECAST = 'https://api.open-meteo.com/v1/forecast';
  private readonly URL_AIR_QUALITY = 'https://air-quality-api.open-meteo.com/v1/air-quality';

  // MÉTODO 1: nombre de ciudad -> lista de coincidencias con coordenadas
  getCities(name: string): Observable<City[]> {

    const params = new HttpParams()
      .set('name', name)
      .set('count', '5')
      .set('language', 'es')
      .set('format', 'json');

    return this.http.get<{ results?: City[] }>(this.URL_GEOCODING, { params })
      .pipe(
        first(),
        map(data => data.results ?? [])
      );
  }

  // MÉTODO 2: tiempo actual de un punto (lat/lon)
  getCurrentWeather(lat: number, lon: number): Observable<CurrentWeather> {

    const params = new HttpParams()
      .set('latitude', lat)
      .set('longitude', lon)
      .set('current', 'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,is_day')
      .set('timezone', 'auto');

    return this.http.get(this.URL_FORECAST, { params })
      .pipe(
        first(),
        map((data: any) => this.parseCurrentWeather(data))
      );
  }

  // Método privado: traduce el JSON crudo de Open-Meteo al modelo CurrentWeather
  private parseCurrentWeather(data: any): CurrentWeather {

    const current = data['current'];

    return {
      time: current['time'],
      temperature: current['temperature_2m'],
      apparentTemperature: current['apparent_temperature'],
      humidity: current['relative_humidity_2m'],
      precipitation: current['precipitation'],
      weatherCode: current['weather_code'],
      windSpeed: current['wind_speed_10m'],
      windDirection: current['wind_direction_10m'],
      isDay: current['is_day'] === 1
    };
  }
  
  // MÉTODO 3: calidad del aire de un punto (lat/lon)
getAirQuality(lat: number, lon: number): Observable<AirQuality> {

    const params = new HttpParams()
        .set('latitude', lat)
        .set('longitude', lon)
        .set('current', 'pm2_5,pm10,european_aqi')
        .set('timezone', 'auto');

    return this.http.get(this.URL_AIR_QUALITY, { params })
        .pipe(
            first(),
            map((data: any) => this.parseAirQuality(data))
        );
}

private parseAirQuality(data: any): AirQuality {

    const current = data['current'];

    return {
        time: current['time'],
        pm2_5: current['pm2_5'],
        pm10: current['pm10'],
        europeanAqi: current['european_aqi']
    };
}
}