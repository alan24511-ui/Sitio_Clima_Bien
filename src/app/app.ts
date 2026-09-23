import {Component, inject, ChangeDetectorRef} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './core/services/weather.service';
import { City } from './core/models/city.model';
import { CurrentWeather, AirQuality } from './core/models/weather.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
})
export class App {
  private weatherService = inject(WeatherService);
  private cdr = inject(ChangeDetectorRef);

  // ===== SECCIÓN ALAN (3 métodos: getCities, getCurrentWeather, getAirQuality) =====
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
        weather: this.weatherService.getCurrentWeather(
          this.alanCity.latitude,
          this.alanCity.longitude
        ),
        air: this.weatherService.getAirQuality(
          this.alanCity.latitude,
          this.alanCity.longitude
        )
      }).subscribe({
        next: (result) => {
          this.alanWeather = result.weather;
          this.alanAir = result.air;
          this.alanLoading = false;

          this.cdr.detectChanges();
        },

        error: () => {
          this.alanError =
            'Error al obtener el clima o la calidad del aire';

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
}