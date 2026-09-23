import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './core/services/weather.service';
import { City } from './core/models/city.model';
import { CurrentWeather, AirQuality } from './core/models/weather.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
})
export class App {
  private weatherService = inject(WeatherService);

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

    this.weatherService.getCities(this.alanCityName).subscribe({
      next: (cities) => {
        if (!cities.length) {
          this.alanError = 'Ciudad no encontrada';
          this.alanLoading = false;
          return;
        }

        this.alanCity = cities[0];

        this.weatherService
          .getCurrentWeather(this.alanCity.latitude, this.alanCity.longitude)
          .subscribe((data) => (this.alanWeather = data));

        this.weatherService
          .getAirQuality(this.alanCity.latitude, this.alanCity.longitude)
          .subscribe((data) => (this.alanAir = data));

        this.alanLoading = false;
      },
      error: () => {
        this.alanError = 'Error al buscar la ciudad';
        this.alanLoading = false;
      },
    });
  }
  // ===== FIN SECCIÓN ALAN =====
}