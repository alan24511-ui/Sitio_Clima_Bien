

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './core/service/weather.service';
import { PreviousRunsData, SingleRunData } from './core/models/weather.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html'
})
export class App {
  private weatherService = inject(WeatherService);

  cityName = 'Monterrey';
  runDate = '2026-09-20T00:00';

  city: any;
  loading = false;

  // Variables ficticias para evitar bloqueos del HTML base
  weather: any = {};
  air: any = null;
  elevation: any = null;
  marine: any = null;

  // Propiedades para tus dos métodos
  previousRunsData?: PreviousRunsData;
  singleRunData?: SingleRunData;

  searchCity() {
    this.loading = true;

    this.weatherService.getCities(this.cityName).subscribe({
      next: (cities: any[]) => {
        if (!cities.length) {
          this.loading = false;
          this.city = null;
          return;
        }

        this.city = cities[0];

        // 1. Ejecución de Previous Runs
        this.weatherService
          .getPreviousRuns(this.city.latitude, this.city.longitude)
          .subscribe({
            next: (data) => {
              this.previousRunsData = data;
              this.loading = false; // Desactivar spinner
            },
            error: (err) => {
              console.error('Error en getPreviousRuns:', err);
              this.loading = false;
            }
          });

        // 2. Ejecución de Single Run
        this.fetchSingleRun();
      },
      error: (error: any) => {
        console.error('Error al buscar ciudad:', error);
        this.loading = false;
      }
    });
  }

  fetchSingleRun() {
    if (!this.city) return;

    this.weatherService
      .getSingleRun(this.city.latitude, this.city.longitude, this.runDate)
      .subscribe({
        next: (data) => (this.singleRunData = data),
        error: (err) => console.error('Error en getSingleRun:', err)
      });
  }
}