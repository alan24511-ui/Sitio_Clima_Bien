import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { WeatherService } from './core/services/weather.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html'
})
export class App {

  private weatherService = inject(WeatherService);


  // =========================================================
  // PARTE COMPARTIDA
  // GET CITIES
  // =========================================================

  cityName = 'Monterrey';

  city: any = null;

  loading = false;


  searchCity() {

    if (!this.cityName.trim()) {
      return;
    }

    this.loading = true;

    this.weatherService.getCities(this.cityName).subscribe({

      next: cities => {

        if (!cities.length) {

          this.city = null;

          this.elevation = null;
          this.marine = null;
          this.historical = null;

          this.loading = false;

          return;
        }


        // Seleccionar la primera ciudad encontrada

        this.city = cities[0];


        // Limpiar resultados anteriores

        this.elevation = null;
        this.marine = null;
        this.historical = null;


        // Ejecutar los métodos de Chato

        this.loadChatoWeather();

        this.loading = false;

      },


      error: error => {

        console.error(
          'Error buscando ciudad:',
          error
        );

        this.city = null;

        this.loading = false;

      }

    });

  }


  // =========================================================
  // =========================================================
  // INICIO SECCIÓN CHATO
  // MÉTODOS 4, 5 Y 6
  // =========================================================
  // =========================================================


  // ---------------------------------------------------------
  // VARIABLES DE CHATO
  // ---------------------------------------------------------

  elevation: any = null;

  marine: any = null;

  historical: any = null;

  startDate = '2026-09-15';

  endDate = '2026-09-20';


  // =========================================================
  // MÉTODO 4 — ELEVACIÓN
  // =========================================================

  loadElevation() {

    if (!this.city) {
      return;
    }

    this.weatherService
      .getElevation(this.city)
      .subscribe({

        next: data => {

          this.elevation = data;

        },

        error: error => {

          console.error(
            'Error en elevación:',
            error
          );

        }

      });

  }


  // =========================================================
  // MÉTODO 5 — INFORMACIÓN MARINA
  // =========================================================

  loadMarineWeather() {

    if (!this.city) {
      return;
    }

    this.weatherService
      .getMarineWeather(this.city)
      .subscribe({

        next: data => {

          this.marine = data;

        },

        error: error => {

          console.error(
            'Error en información marina:',
            error
          );

        }

      });

  }


  // =========================================================
  // EJECUTAR MÉTODOS 4 Y 5
  // =========================================================

  loadChatoWeather() {

    this.loadElevation();

    this.loadMarineWeather();

  }


  // =========================================================
  // MÉTODO 6 — CLIMA HISTÓRICO
  // =========================================================

  loadHistorical() {

    if (!this.city) {
      return;
    }

    this.weatherService
      .getHistoricalWeather(
        this.city,
        this.startDate,
        this.endDate
      )
      .subscribe({

        next: data => {

          this.historical = data;

        },

        error: error => {

          console.error(
            'Error en clima histórico:',
            error
          );

        }

      });

  }


  // =========================================================
  // PROCESAR RESULTADOS DEL MÉTODO 6
  // =========================================================

  getHistoricalDays() {

    if (!this.historical?.daily) {
      return [];
    }

    const daily = this.historical.daily;

    return daily.time.map(
      (date: string, i: number) => ({

        date,

        max:
          daily.temperature_2m_max?.[i],

        min:
          daily.temperature_2m_min?.[i],

        precipitation:
          daily.precipitation_sum?.[i],

        wind:
          daily.wind_speed_10m_max?.[i]

      })
    );

  }


  // =========================================================
  // =========================================================
  // FIN SECCIÓN CHATO
  // MÉTODOS 4, 5 Y 6
  // =========================================================
  // =========================================================

}