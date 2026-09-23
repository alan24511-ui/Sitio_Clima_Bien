import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { first, Observable } from 'rxjs';
import { Elevation, MarineWeather, HistoricalWeather } from '../models/weather.model';

import { City } from '../models/city.model';



@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly http = inject(HttpClient);

  // MÉTODO 4
  private readonly URL_ELEVATION =
    'https://api.open-meteo.com/v1/elevation';

  // MÉTODO 5
  private readonly URL_MARINE =
    'https://marine-api.open-meteo.com/v1/marine';

  // MÉTODO 6
  private readonly URL_HISTORICAL =
    'https://archive-api.open-meteo.com/v1/archive';

  // MÉTODO 4: elevación de una ciudad seleccionada
  getElevation(city: City): Observable<Elevation> {
    const params = new HttpParams()
      .set('latitude', city.latitude)
      .set('longitude', city.longitude);

    return this.http
      .get<Elevation>(this.URL_ELEVATION, { params })
      .pipe(first());
  }

  // MÉTODO 5: información marina de una ciudad seleccionada
  getMarineWeather(city: City): Observable<MarineWeather> {
    const params = new HttpParams()
      .set('latitude', city.latitude)
      .set('longitude', city.longitude)
      .set('hourly', 'wave_height,wave_direction,wave_period')
      .set('timezone', 'auto');

    return this.http
      .get<MarineWeather>(this.URL_MARINE, { params })
      .pipe(first());
  }

  // MÉTODO 6: clima histórico
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
      .get<HistoricalWeather>(this.URL_HISTORICAL, { params })
      .pipe(first());
  }
}