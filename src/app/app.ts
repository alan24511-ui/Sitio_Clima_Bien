import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { WeatherService } from './core/services/weather.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  private weatherService = inject(WeatherService);

  cityName = 'Monterrey';
  city: any = null;
  loading = false;

  elevation: any = null;
  marine: any = null;
  historical: any = null;
  historicalForecast: any = null;
  ecmwf: any = null;

  startDate = '2026-09-15';
  endDate = '2026-09-20';

  // MÉTODO 1 — CIUDADES
  searchCity() {
    if (!this.cityName.trim()) return;

    this.loading = true;

    this.weatherService.getCities(this.cityName).subscribe({
      next: cities => {
        if (!cities.length) {
          this.city = null;
          this.elevation = null;
          this.marine = null;
          this.historical = null;
          this.historicalForecast = null;
          this.ecmwf = null;
          this.loading = false;
          return;
        }

        this.city = cities[0];
        this.elevation = null;
        this.marine = null;
        this.historical = null;
        this.historicalForecast = null;
        this.ecmwf = null;

        this.loadChatoWeather();
        this.loading = false;
      },
      error: error => {
        console.error('Error buscando ciudad:', error);
        this.city = null;
        this.loading = false;
      }
    });
  }

  // MÉTODO 4 — ELEVACIÓN
  loadElevation() {
    if (!this.city) return;

    this.weatherService.getElevation(this.city).subscribe({
      next: data => this.elevation = data,
      error: error => console.error('Error en elevación:', error)
    });
  }

  // MÉTODO 5 — MARINE
  loadMarineWeather() {
    if (!this.city) return;

    this.weatherService.getMarineWeather(this.city).subscribe({
      next: data => this.marine = data,
      error: error => console.error('Error en información marina:', error)
    });
  }

  // MÉTODO 6 — CLIMA HISTÓRICO
  loadHistorical() {
    if (!this.city) return;

    this.weatherService
      .getHistoricalWeather(this.city, this.startDate, this.endDate)
      .subscribe({
        next: data => this.historical = data,
        error: error => console.error('Error en clima histórico:', error)
      });
  }

  // MÉTODO 7 — PRONÓSTICO HISTÓRICO
  loadHistoricalForecast() {
    if (!this.city) return;

    this.weatherService
      .getHistoricalForecast(this.city, this.startDate, this.endDate)
      .subscribe({
        next: data => this.historicalForecast = data,
        error: error => console.error('Error en pronóstico histórico:', error)
      });
  }

  // MÉTODO 8 — ECMWF
  loadECMWF() {
    if (!this.city) return;

    this.weatherService.getECMWF(this.city).subscribe({
      next: data => this.ecmwf = data,
      error: error => console.error('Error en ECMWF:', error)
    });
  }

  // EJECUTAR 4, 5 Y 8
  loadChatoWeather() {
    this.loadElevation();
    this.loadMarineWeather();
    this.loadECMWF();
  }

  // PROCESAR MÉTODO 6
  getHistoricalDays() {
    if (!this.historical?.daily) return [];

    const daily = this.historical.daily;

    return daily.time.map((date: string, i: number) => ({
      date,
      max: daily.temperature_2m_max?.[i],
      min: daily.temperature_2m_min?.[i],
      precipitation: daily.precipitation_sum?.[i],
      wind: daily.wind_speed_10m_max?.[i]
    }));
  }

  // PROCESAR MÉTODO 7
  getHistoricalForecastHours() {
    if (!this.historicalForecast?.hourly) return [];

    const hourly = this.historicalForecast.hourly;

    return hourly.time.map((time: string, i: number) => ({
      time,
      temperature: hourly.temperature_2m?.[i],
      humidity: hourly.relative_humidity_2m?.[i],
      precipitation: hourly.precipitation?.[i],
      weatherCode: hourly.weather_code?.[i],
      wind: hourly.wind_speed_10m?.[i],
      windDirection: hourly.wind_direction_10m?.[i]
    }));
  }

  // PROCESAR MÉTODO 8
  getECMWFHours() {
    if (!this.ecmwf?.hourly) return [];

    const hourly = this.ecmwf.hourly;

    return hourly.time.map((time: string, i: number) => ({
      time,
      temperature: hourly.temperature_2m?.[i],
      humidity: hourly.relative_humidity_2m?.[i],
      precipitation: hourly.precipitation?.[i],
      weatherCode: hourly.weather_code?.[i],
      wind: hourly.wind_speed_10m?.[i],
      windDirection: hourly.wind_direction_10m?.[i]
    }));
  }
}