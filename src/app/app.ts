
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { forkJoin } from 'rxjs';

import { WeatherService } from './core/services/weather.service';
import { City } from './core/models/city.model';
import { CurrentWeather, AirQuality } from './core/models/weather.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  private weather = inject(WeatherService);
  private cdr = inject(ChangeDetectorRef);

  // ===== ALAN: MÉTODOS 1-3 =====
  alanCityName = 'Monterrey';
  alanCity?: City;
  alanWeather?: CurrentWeather;
  alanAir?: AirQuality;
  alanLoading = false;
  alanError = '';

  searchAlan() {
    this.alanLoading = true;
    this.alanError = '';
    this.alanCity = undefined;
    this.alanWeather = undefined;
    this.alanAir = undefined;

    this.weather.getCities(this.alanCityName).subscribe({
      next: cities => {
        if (!cities.length) {
          this.alanError = 'Ciudad no encontrada';
          this.alanLoading = false;
          this.cdr.detectChanges();
          return;
        }

        this.alanCity = cities[0];

        forkJoin({
          weather: this.weather.getCurrentWeather(
            this.alanCity.latitude,
            this.alanCity.longitude
          ),
          air: this.weather.getAirQuality(
            this.alanCity.latitude,
            this.alanCity.longitude
          )
        }).subscribe({
          next: result => {
            this.alanWeather = result.weather;
            this.alanAir = result.air;
            this.alanLoading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.alanError = 'Error al obtener el clima o la calidad del aire';
            this.alanLoading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.alanError = 'Error al buscar la ciudad';
        this.alanLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ===== CHATO: MÉTODOS 4-6 =====
  chatoCityName = 'Monterrey';
  chatoCity: City | null = null;
  chatoLoading = false;

  elevation: any = null;
  marine: any = null;
  historical: any = null;

  startDate = '2026-09-15';
  endDate = '2026-09-20';

  searchChato() {
    if (!this.chatoCityName.trim()) return;

    this.chatoLoading = true;

    this.weather.getCities(this.chatoCityName).subscribe({
      next: cities => {
        if (!cities.length) {
          this.chatoCity = null;
          this.clearChatoData();
          this.chatoLoading = false;
          return;
        }

        this.chatoCity = cities[0];
        this.clearChatoData();
        this.loadChatoWeather();
        this.chatoLoading = false;
      },
      error: error => {
        console.error('Error buscando ciudad:', error);
        this.chatoCity = null;
        this.clearChatoData();
        this.chatoLoading = false;
      }
    });
  }

  loadElevation() {
    if (!this.chatoCity) return;

    this.weather.getElevation(this.chatoCity).subscribe({
      next: data => this.elevation = data,
      error: error => console.error('Error en elevación:', error)
    });
  }

  loadMarineWeather() {
    if (!this.chatoCity) return;

    this.weather.getMarineWeather(this.chatoCity).subscribe({
      next: data => this.marine = data,
      error: error => console.error('Error en información marina:', error)
    });
  }

  loadHistorical() {
    if (!this.chatoCity) return;

    this.weather.getHistoricalWeather(
      this.chatoCity,
      this.startDate,
      this.endDate
    ).subscribe({
      next: data => this.historical = data,
      error: error => console.error('Error en clima histórico:', error)
    });
  }

  loadChatoWeather() {
    this.loadElevation();
    this.loadMarineWeather();
  }

  getHistoricalDays() {
    const d = this.historical?.daily;
    if (!d) return [];

    return d.time.map((date: string, i: number) => ({
      date,
      max: d.temperature_2m_max?.[i],
      min: d.temperature_2m_min?.[i],
      precipitation: d.precipitation_sum?.[i],
      wind: d.wind_speed_10m_max?.[i]
    }));
  }

  // ===== KARLA: MÉTODOS 7-8 =====
  cityName = 'Monterrey';
  city: City | null = null;
  loading = false;

  historicalForecast: any = null;
  ecmwf: any = null;

  searchCity() {
    if (!this.cityName.trim()) return;

    this.loading = true;

    this.weather.getCities(this.cityName).subscribe({
      next: cities => {
        if (!cities.length) {
          this.clearKarlaData();
          this.loading = false;
          return;
        }

        this.city = cities[0];
        this.clearKarlaData();
        this.loadECMWF();
        this.loading = false;
      },
      error: error => {
        console.error('Error buscando ciudad:', error);
        this.clearKarlaData();
        this.loading = false;
      }
    });
  }

  loadHistoricalForecast() {
    if (!this.city) return;

    this.weather.getHistoricalForecast(
      this.city,
      this.startDate,
      this.endDate
    ).subscribe({
      next: data => this.historicalForecast = data,
      error: error =>
        console.error('Error en pronóstico histórico:', error)
    });
  }

  loadECMWF() {
    if (!this.city) return;

    this.weather.getECMWF(this.city).subscribe({
      next: data => this.ecmwf = data,
      error: error => console.error('Error en ECMWF:', error)
    });
  }

  getHistoricalForecastHours() {
    const h = this.historicalForecast?.hourly;
    if (!h) return [];

    return h.time.map((time: string, i: number) => ({
      time,
      temperature: h.temperature_2m?.[i],
      humidity: h.relative_humidity_2m?.[i],
      precipitation: h.precipitation?.[i],
      weatherCode: h.weather_code?.[i],
      wind: h.wind_speed_10m?.[i],
      windDirection: h.wind_direction_10m?.[i]
    }));
  }

  getECMWFHours() {
    const h = this.ecmwf?.hourly;
    if (!h) return [];

    return h.time.map((time: string, i: number) => ({
      time,
      temperature: h.temperature_2m?.[i],
      humidity: h.relative_humidity_2m?.[i],
      precipitation: h.precipitation?.[i],
      weatherCode: h.weather_code?.[i],
      wind: h.wind_speed_10m?.[i],
      windDirection: h.wind_direction_10m?.[i]
    }));
  }

  private clearChatoData() {
    this.elevation = null;
    this.marine = null;
    this.historical = null;
  }

  private clearKarlaData() {
    this.city = null;
    this.historicalForecast = null;
    this.ecmwf = null;
  }
}

