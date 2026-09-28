import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { forkJoin } from 'rxjs';

import { WeatherService } from './core/services/weather.service';
import { City } from './core/models/city.model';

import {
  CurrentWeather,
  AirQuality,
  PreviousRunsData,
  SingleRunData
} from './core/models/weather.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet],
  templateUrl: './app.html'
})
export class App {

  private weather = inject(WeatherService);
  private cdr = inject(ChangeDetectorRef);

  // ============================================================
  // ALAN — MÉTODOS 1-3
  // ============================================================

  alanCityName = 'Monterrey';
  alanCity?: City;
  alanWeather?: CurrentWeather;
  alanAir?: AirQuality;

  alanLoading = false;
  alanError = '';

  // ============================================================
  // CHATO — MÉTODOS 4-6
  // ============================================================

  chatoCityName = 'Monterrey';
  chatoCity: City | null = null;

  chatoLoading = false;

  elevation: any = null;
  marine: any = null;
  historical: any = null;

  startDate = '2026-09-15';
  endDate = '2026-09-20';

  // ============================================================
  // KARLA — MÉTODOS 7-8
  // ============================================================

  cityName = 'Monterrey';
  city: City | null = null;

  loading = false;

  historicalForecast: any = null;
  ecmwf: any = null;

  // ============================================================
  // CAROL — MÉTODOS 9-10
  // ============================================================

  runDate = '2026-09-20T00:00';

  previousRunsData?: PreviousRunsData;
  singleRunData?: SingleRunData;

  // ============================================================
  // BÚSQUEDA PRINCIPAL
  // MÉTODOS 1-10
  // ============================================================

  searchAlan() {

    const name = this.alanCityName.trim();

    if (!name) {
      this.alanError = 'Escribe el nombre de una ciudad.';
      return;
    }

    console.log('Buscando ciudad:', name);

    // ==========================================================
    // ESTADO INICIAL
    // ==========================================================

    this.alanLoading = true;
    this.alanError = '';

    this.alanCity = undefined;
    this.alanWeather = undefined;
    this.alanAir = undefined;

    // Limpiar ciudad avanzada
    this.chatoCity = null;
    this.city = null;

    // Limpiar resultados anteriores
    this.clearAllAdvancedData();

    // ==========================================================
    // MÉTODO 1 — BUSCAR CIUDAD
    // ==========================================================

    this.weather.getCities(name).subscribe({

      next: cities => {

        console.log('Ciudades encontradas:', cities);

        if (!cities.length) {

          this.alanError = 'Ciudad no encontrada.';

          this.alanLoading = false;

          this.chatoCity = null;
          this.city = null;

          this.cdr.detectChanges();

          return;
        }

        // ======================================================
        // SELECCIONAR PRIMERA CIUDAD
        // ======================================================

        const selectedCity = cities[0];

        console.log('Ciudad seleccionada:', selectedCity);

        // ======================================================
        // IMPORTANTE
        // TODA LA APP UTILIZA LA MISMA CIUDAD
        // ======================================================

        this.alanCity = selectedCity;
        this.chatoCity = selectedCity;
        this.city = selectedCity;

        // ======================================================
        // MÉTODOS 2 Y 3
        // CLIMA + CALIDAD DEL AIRE
        // ======================================================

        forkJoin({

          weather: this.weather.getCurrentWeather(
            selectedCity.latitude,
            selectedCity.longitude
          ),

          air: this.weather.getAirQuality(
            selectedCity.latitude,
            selectedCity.longitude
          )

        }).subscribe({

          next: result => {

            console.log('Método 2 - Clima:', result.weather);
            console.log('Método 3 - Calidad del aire:', result.air);

            this.alanWeather = result.weather;
            this.alanAir = result.air;

            this.alanLoading = false;

            this.cdr.detectChanges();
          },

          error: error => {

            console.error(
              'Error obteniendo clima o calidad del aire:',
              error
            );

            this.alanError =
              'Error al obtener el clima o la calidad del aire.';

            this.alanLoading = false;

            this.cdr.detectChanges();
          }

        });

        // ======================================================
        // MÉTODO 4 — ELEVACIÓN
        // ======================================================

        this.loadElevation();

        // ======================================================
        // MÉTODO 5 — MARINE
        // ======================================================

        this.loadMarineWeather();

        // ======================================================
        // MÉTODO 9 — PREVIOUS RUNS
        // ======================================================

        this.loadPreviousRuns();

        // ======================================================
        // MÉTODO 10 — SINGLE RUN
        // ======================================================

        this.fetchSingleRun();

        this.cdr.detectChanges();
      },

      error: error => {

        console.error(
          'Error buscando ciudad:',
          error
        );

        this.alanError =
          'Error al buscar la ciudad.';

        this.alanLoading = false;

        this.alanCity = undefined;
        this.alanWeather = undefined;
        this.alanAir = undefined;

        this.chatoCity = null;
        this.city = null;

        this.clearAllAdvancedData();

        this.cdr.detectChanges();
      }

    });
  }

  // ============================================================
  // MÉTODO 4 — ELEVACIÓN
  // ============================================================

  loadElevation() {

    if (!this.chatoCity) {

      console.error(
        'No hay ciudad seleccionada para el método 4.'
      );

      return;
    }

    console.log(
      'Método 4 - Consultando elevación:',
      this.chatoCity.name
    );

    this.weather.getElevation(this.chatoCity).subscribe({

      next: data => {

        console.log(
          'Método 4 - Datos recibidos:',
          data
        );

        this.elevation = data;

        this.cdr.detectChanges();
      },

      error: error => {

        console.error(
          'Error en método 4 - Elevación:',
          error
        );

        this.elevation = null;

        this.cdr.detectChanges();
      }

    });
  }

  // ============================================================
  // MÉTODO 5 — INFORMACIÓN MARINA
  // ============================================================

  loadMarineWeather() {

    if (!this.chatoCity) {

      console.error(
        'No hay ciudad seleccionada para el método 5.'
      );

      return;
    }

    console.log(
      'Método 5 - Consultando información marina:',
      this.chatoCity.name
    );

    this.weather.getMarineWeather(this.chatoCity).subscribe({

      next: data => {

        console.log(
          'Método 5 - Datos recibidos:',
          data
        );

        this.marine = data;

        this.cdr.detectChanges();
      },

      error: error => {

        console.error(
          'Error en método 5 - Marine:',
          error
        );

        this.marine = null;

        this.cdr.detectChanges();
      }

    });
  }

  // ============================================================
  // MÉTODO 6 — CLIMA HISTÓRICO
  // ============================================================

  loadHistorical() {

    if (!this.chatoCity) {

      console.error(
        'No hay ciudad seleccionada para el método 6.'
      );

      return;
    }

    if (!this.startDate || !this.endDate) {

      console.error(
        'Debes seleccionar ambas fechas.'
      );

      return;
    }

    if (this.startDate > this.endDate) {

      console.error(
        'La fecha inicial no puede ser mayor que la fecha final.'
      );

      return;
    }

    console.log(
      'Método 6 - Consultando:',
      this.chatoCity.name,
      this.startDate,
      this.endDate
    );

    this.historical = null;

    this.weather.getHistoricalWeather(
      this.chatoCity,
      this.startDate,
      this.endDate
    ).subscribe({

      next: data => {

        console.log(
          'Método 6 - Datos recibidos:',
          data
        );

        this.historical = data;

        this.cdr.detectChanges();
      },

      error: error => {

        console.error(
          'Error en método 6 - Clima histórico:',
          error
        );

        this.historical = null;

        this.cdr.detectChanges();
      }

    });
  }

  // ============================================================
  // MÉTODO 6 — FORMATEAR DÍAS
  // ============================================================

  getHistoricalDays() {

    const d = this.historical?.daily;

    if (!d || !d.time) {
      return [];
    }

    return d.time.map(
      (date: string, i: number) => ({

        date,

        max:
          d.temperature_2m_max?.[i],

        min:
          d.temperature_2m_min?.[i],

        precipitation:
          d.precipitation_sum?.[i],

        wind:
          d.wind_speed_10m_max?.[i]

      })
    );
  }

  // ============================================================
  // MÉTODO 7 — PRONÓSTICO HISTÓRICO
  // ============================================================

  loadHistoricalForecast() {

    if (!this.chatoCity) {

      console.error(
        'No hay ciudad seleccionada para el método 7.'
      );

      return;
    }

    if (!this.startDate || !this.endDate) {

      console.error(
        'Debes seleccionar ambas fechas.'
      );

      return;
    }

    if (this.startDate > this.endDate) {

      console.error(
        'La fecha inicial no puede ser mayor que la fecha final.'
      );

      return;
    }

    console.log(
      'Método 7 - Consultando:',
      this.chatoCity.name,
      this.startDate,
      this.endDate
    );

    this.historicalForecast = null;

    this.weather.getHistoricalForecast(
      this.chatoCity,
      this.startDate,
      this.endDate
    ).subscribe({

      next: data => {

        console.log(
          'Método 7 - Datos recibidos:',
          data
        );

        this.historicalForecast = data;

        this.cdr.detectChanges();
      },

      error: error => {

        console.error(
          'Error en método 7 - Pronóstico histórico:',
          error
        );

        this.historicalForecast = null;

        this.cdr.detectChanges();
      }

    });
  }

  // ============================================================
  // MÉTODO 7 — FORMATEAR HORAS
  // ============================================================

  getHistoricalForecastHours() {

    const h = this.historicalForecast?.hourly;

    if (!h || !h.time) {
      return [];
    }

    return h.time.map(
      (time: string, i: number) => ({

        time,

        temperature:
          h.temperature_2m?.[i],

        humidity:
          h.relative_humidity_2m?.[i],

        precipitation:
          h.precipitation?.[i],

        weatherCode:
          h.weather_code?.[i],

        wind:
          h.wind_speed_10m?.[i],

        windDirection:
          h.wind_direction_10m?.[i]

      })
    );
  }

  // ============================================================
  // MÉTODO 8 — ECMWF
  // ============================================================

  loadECMWF() {

    if (!this.chatoCity) {

      console.error(
        'No hay ciudad seleccionada para el método 8.'
      );

      return;
    }

    console.log(
      'Método 8 - Consultando ECMWF:',
      this.chatoCity.name
    );

    this.ecmwf = null;

    this.weather.getECMWF(
      this.chatoCity
    ).subscribe({

      next: data => {

        console.log(
          'Método 8 - Datos recibidos:',
          data
        );

        this.ecmwf = data;

        this.cdr.detectChanges();
      },

      error: error => {

        console.error(
          'Error en método 8 - ECMWF:',
          error
        );

        this.ecmwf = null;

        this.cdr.detectChanges();
      }

    });
  }

  // ============================================================
  // MÉTODO 8 — FORMATEAR HORAS ECMWF
  // ============================================================

  getECMWFHours() {

    const h = this.ecmwf?.hourly;

    if (!h || !h.time) {
      return [];
    }

    return h.time.map(
      (time: string, i: number) => ({

        time,

        temperature:
          h.temperature_2m?.[i],

        humidity:
          h.relative_humidity_2m?.[i],

        precipitation:
          h.precipitation?.[i],

        weatherCode:
          h.weather_code?.[i],

        wind:
          h.wind_speed_10m?.[i],

        windDirection:
          h.wind_direction_10m?.[i]

      })
    );
  }

  // ============================================================
  // MÉTODO 9 — PREVIOUS RUNS
  // ============================================================

  loadPreviousRuns() {

    if (!this.chatoCity) {

      console.error(
        'No hay ciudad seleccionada para el método 9.'
      );

      return;
    }

    console.log(
      'Método 9 - Consultando Previous Runs:',
      this.chatoCity.name
    );

    this.previousRunsData = undefined;

    this.weather.getPreviousRuns(
      this.chatoCity.latitude,
      this.chatoCity.longitude
    ).subscribe({

      next: data => {

        console.log(
          'Método 9 - Datos recibidos:',
          data
        );

        this.previousRunsData = data;

        this.cdr.detectChanges();
      },

      error: error => {

        console.error(
          'Error en método 9 - Previous Runs:',
          error
        );

        this.previousRunsData = undefined;

        this.cdr.detectChanges();
      }

    });
  }

  // ============================================================
  // MÉTODO 10 — SINGLE RUN
  // ============================================================

  fetchSingleRun() {

    if (!this.chatoCity) {

      console.error(
        'No hay ciudad seleccionada para el método 10.'
      );

      return;
    }

    if (!this.runDate) {

      console.error(
        'Debes indicar una fecha para el método 10.'
      );

      return;
    }

    console.log(
      'Método 10 - Consultando Single Run:',
      this.chatoCity.name,
      this.runDate
    );

    this.singleRunData = undefined;

    this.weather.getSingleRun(
      this.chatoCity.latitude,
      this.chatoCity.longitude,
      this.runDate
    ).subscribe({

      next: data => {

        console.log(
          'Método 10 - Datos recibidos:',
          data
        );

        this.singleRunData = data;

        this.cdr.detectChanges();
      },

      error: error => {

        console.error(
          'Error en método 10 - Single Run:',
          error
        );

        this.singleRunData = undefined;

        this.cdr.detectChanges();
      }

    });
  }

  // ============================================================
  // SEARCH CITY — COMPATIBILIDAD
  // ============================================================

  searchCity() {

    const name = this.cityName.trim();

    if (!name) {
      return;
    }

    this.loading = true;

    this.weather.getCities(name).subscribe({

      next: cities => {

        if (!cities.length) {

          this.city = null;
          this.chatoCity = null;

          this.clearAllAdvancedData();

          this.loading = false;

          this.cdr.detectChanges();

          return;
        }

        this.city = cities[0];
        this.chatoCity = cities[0];

        this.clearAdvancedResults();

        this.loadECMWF();
        this.loadPreviousRuns();
        this.fetchSingleRun();

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: error => {

        console.error(
          'Error buscando ciudad:',
          error
        );

        this.city = null;
        this.chatoCity = null;

        this.clearAllAdvancedData();

        this.loading = false;

        this.cdr.detectChanges();
      }

    });
  }

  // ============================================================
  // LIMPIAR RESULTADOS
  // ============================================================

  private clearAdvancedResults() {

    this.elevation = null;
    this.marine = null;
    this.historical = null;
    this.historicalForecast = null;
    this.ecmwf = null;

    this.previousRunsData = undefined;
    this.singleRunData = undefined;
  }

  private clearAllAdvancedData() {

    this.elevation = null;
    this.marine = null;
    this.historical = null;
    this.historicalForecast = null;
    this.ecmwf = null;

    this.previousRunsData = undefined;
    this.singleRunData = undefined;
  }
}