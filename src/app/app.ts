import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WeatherService } from './core/services/weather.service';
import { City } from './core/models/city.model';
import { CurrentWeather, AirQuality } from './core/models/weather.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.html',
})
export class App {
  private weatherService = inject(WeatherService);
  private cdr = inject(ChangeDetectorRef);

  // =========================================================
  // =========================================================
  // INICIO SECCIÓN ALAN
  // MÉTODOS: getCities, getCurrentWeather, getAirQuality
  // =========================================================
  // =========================================================

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

    this.weatherService.getCities(this.alanCityName).subscribe({
      next: (cities) => {
        if (!cities.length) {
          this.alanError = 'Ciudad no encontrada';
          this.alanLoading = false;
          this.cdr.detectChanges();
          return;
        }

        this.alanCity = cities[0];

        forkJoin({
          weather: this.weatherService.getCurrentWeather(this.alanCity.latitude, this.alanCity.longitude),
          air: this.weatherService.getAirQuality(this.alanCity.latitude, this.alanCity.longitude),
        }).subscribe({
          next: (result) => {
            this.alanWeather = result.weather;
            this.alanAir = result.air;
            this.alanLoading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.alanError = 'Error al obtener el clima o la calidad del aire';
            this.alanLoading = false;
            this.cdr.detectChanges();
          },
        });
      },
      error: () => {
        this.alanError = 'Error al buscar la ciudad';
        this.alanLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // =========================================================
  // =========================================================
  // FIN SECCIÓN ALAN
  // =========================================================
  // =========================================================


  // =========================================================
  // =========================================================
  // INICIO SECCIÓN CHATO
  // MÉTODOS 4, 5 Y 6: getElevation, getMarineWeather, getHistoricalWeather
  // =========================================================
  // =========================================================

  chatoCityName = 'Monterrey';
  chatoCity: any = null;
  chatoLoading = false;

  elevation: any = null;
  marine: any = null;
  historical: any = null;
  startDate = '2026-09-15';
  endDate = '2026-09-20';

  // ---------------------------------------------------------
  // BÚSQUEDA DE CIUDAD (Chato)
  // ---------------------------------------------------------

  searchChato() {
    if (!this.chatoCityName.trim()) {
      return;
    }

    this.chatoLoading = true;

    this.weatherService.getCities(this.chatoCityName).subscribe({
      next: (cities) => {
        if (!cities.length) {
          this.chatoCity = null;
          this.elevation = null;
          this.marine = null;
          this.historical = null;
          this.chatoLoading = false;
          return;
        }

        this.chatoCity = cities[0];
        this.elevation = null;
        this.marine = null;
        this.historical = null;

        this.loadChatoWeather();
        this.chatoLoading = false;
      },
      error: (error) => {
        console.error('Error buscando ciudad:', error);
        this.chatoCity = null;
        this.chatoLoading = false;
      },
    });
  }

  // ---------------------------------------------------------
  // MÉTODO 4 — ELEVACIÓN
  // ---------------------------------------------------------

  loadElevation() {
    if (!this.chatoCity) return;

    this.weatherService.getElevation(this.chatoCity).subscribe({
      next: (data) => (this.elevation = data),
      error: (error) => console.error('Error en elevación:', error),
    });
  }

  // ---------------------------------------------------------
  // MÉTODO 5 — INFORMACIÓN MARINA
  // ---------------------------------------------------------

  loadMarineWeather() {
    if (!this.chatoCity) return;

    this.weatherService.getMarineWeather(this.chatoCity).subscribe({
      next: (data) => (this.marine = data),
      error: (error) => console.error('Error en información marina:', error),
    });
  }

  // ---------------------------------------------------------
  // EJECUTAR MÉTODOS 4 Y 5 JUNTOS
  // ---------------------------------------------------------

  loadChatoWeather() {
    this.loadElevation();
    this.loadMarineWeather();
  }

  // ---------------------------------------------------------
  // MÉTODO 6 — CLIMA HISTÓRICO
  // ---------------------------------------------------------

  loadHistorical() {
    if (!this.chatoCity) return;

    this.weatherService.getHistoricalWeather(this.chatoCity, this.startDate, this.endDate).subscribe({
      next: (data) => (this.historical = data),
      error: (error) => console.error('Error en clima histórico:', error),
    });
  }

  // ---------------------------------------------------------
  // PROCESAR RESULTADOS DEL MÉTODO 6
  // ---------------------------------------------------------

  getHistoricalDays() {
    if (!this.historical?.daily) return [];

    const daily = this.historical.daily;

    return daily.time.map((date: string, i: number) => ({
      date,
      max: daily.temperature_2m_max?.[i],
      min: daily.temperature_2m_min?.[i],
      precipitation: daily.precipitation_sum?.[i],
      wind: daily.wind_speed_10m_max?.[i],
    }));
  }

  // =========================================================
  // =========================================================
  // FIN SECCIÓN CHATO
  // =========================================================
  // =========================================================
}