import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { first, map, Observable } from 'rxjs';
import { CurrentWeather, AirQuality, Elevation, MarineWeather, HistoricalWeather, HistoricalForecast, ECMWFWeather } from '../models/weather.model';
import { City } from '../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private readonly http = inject(HttpClient);

  private readonly URL_GEOCODING =
    'https://geocoding-api.open-meteo.com/v1/search';

  private readonly URL_FORECAST =
    'https://api.open-meteo.com/v1/forecast';

  private readonly URL_AIR =
    'https://air-quality-api.open-meteo.com/v1/air-quality';

  private readonly URL_ELEVATION =
    'https://api.open-meteo.com/v1/elevation';

  private readonly URL_MARINE =
    'https://marine-api.open-meteo.com/v1/marine';

  // Método 6
  private readonly URL_HISTORICAL =
    'https://archive-api.open-meteo.com/v1/archive';

  // Método 7
  private readonly URL_HISTORICAL_FORECAST =
    'https://historical-forecast-api.open-meteo.com/v1/forecast';

  // Método 8
  private readonly URL_ECMWF =
    'https://api.open-meteo.com/v1/ecmwf';

  // MÉTODO 1 — CIUDADES

  getCities(name: string): Observable<City[]> {

    const params = new HttpParams()
      .set('name', name)
      .set('count', '5')
      .set('language', 'es')
      .set('format', 'json');

    return this.http
      .get<{ results?: City[] }>(
        this.URL_GEOCODING,
        { params }
      )
      .pipe(
        first(),
        map(data => data.results ?? [])
      );
  }

  // MÉTODO 2 — CLIMA ACTUAL

  getCurrentWeather(
    lat: number,
    lon: number
  ): Observable<CurrentWeather> {

    const params = new HttpParams()
      .set('latitude', lat)
      .set('longitude', lon)
      .set(
        'current',
        'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,is_day'
      )
      .set('timezone', 'auto');

    return this.http
      .get<any>(
        this.URL_FORECAST,
        { params }
      )
      .pipe(
        first(),
        map(data => ({
          time: data.current.time,
          temperature: data.current.temperature_2m,
          apparentTemperature:
            data.current.apparent_temperature,
          humidity:
            data.current.relative_humidity_2m,
          precipitation:
            data.current.precipitation,
          weatherCode:
            data.current.weather_code,
          windSpeed:
            data.current.wind_speed_10m,
          windDirection:
            data.current.wind_direction_10m,
          isDay:
            data.current.is_day === 1
        }))
      );
  }

  // MÉTODO 3 — CALIDAD DEL AIRE

  getAirQuality(
    lat: number,
    lon: number
  ): Observable<AirQuality> {

    const params = new HttpParams()
      .set('latitude', lat)
      .set('longitude', lon)
      .set(
        'current',
        'pm2_5,pm10,european_aqi'
      )
      .set('timezone', 'auto');

    return this.http
      .get<any>(
        this.URL_AIR,
        { params }
      )
      .pipe(
        first(),
        map(data => ({
          time: data.current.time,
          pm2_5: data.current.pm2_5,
          pm10: data.current.pm10,
          europeanAqi:
            data.current.european_aqi
        }))
      );
  }

  // MÉTODO 4 — ELEVACIÓN

  getElevation(
    city: City
  ): Observable<Elevation> {

    const params = new HttpParams()
      .set('latitude', city.latitude)
      .set('longitude', city.longitude);

    return this.http
      .get<Elevation>(
        this.URL_ELEVATION,
        { params }
      )
      .pipe(first());
  }

  // MÉTODO 5 — MARINE

  getMarineWeather(
    city: City
  ): Observable<MarineWeather> {

    const params = new HttpParams()
      .set('latitude', city.latitude)
      .set('longitude', city.longitude)
      .set(
        'hourly',
        'wave_height,wave_direction,wave_period'
      )
      .set('timezone', 'auto');

    return this.http
      .get<MarineWeather>(
        this.URL_MARINE,
        { params }
      )
      .pipe(first());
  }

  // MÉTODO 6 — CLIMA HISTÓRICO

  getHistoricalWeather(
    city: City,
    startDate: string,
    endDate: string
  ): Observable<HistoricalWeather> {

    const params = new HttpParams()
      .set('latitude', city.latitude)
      .set('longitude', city.longitude)
      .set('start_date', startDate)
      .set('end_date', endDate)
      .set(
        'daily',
        'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max'
      )
      .set('timezone', 'auto');

    return this.http
      .get<HistoricalWeather>(
        this.URL_HISTORICAL,
        { params }
      )
      .pipe(first());
  }

  // MÉTODO 7 — PRONÓSTICO HISTÓRICO

  getHistoricalForecast(
    city: City,
    startDate: string,
    endDate: string
  ): Observable<HistoricalForecast> {

    const params = new HttpParams()
      .set('latitude', city.latitude)
      .set('longitude', city.longitude)
      .set('start_date', startDate)
      .set('end_date', endDate)
      .set(
        'hourly',
        'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m'
      )
      .set('timezone', 'auto');

    return this.http
      .get<HistoricalForecast>(
        this.URL_HISTORICAL_FORECAST,
        { params }
      )
      .pipe(first());
  }

  // MÉTODO 8 — ECMWF

  getECMWF(
    city: City
  ): Observable<ECMWFWeather> {

    const params = new HttpParams()
      .set('latitude', city.latitude)
      .set('longitude', city.longitude)
      .set(
        'hourly',
        'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m'
      )
      .set('forecast_days', '10')
      .set('timezone', 'auto');

    return this.http
      .get<ECMWFWeather>(
        this.URL_ECMWF,
        { params }
      )
      .pipe(first());
  }

}