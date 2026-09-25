import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { PreviousRunsData, SingleRunData } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);

  // Método base para buscar coordenadas por nombre de ciudad
  getCities(cityName: string): Observable<any[]> {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=es&format=json`;
    return this.http.get<any>(url).pipe(
      map((response) => response.results || [])
    );
  }

  // Método 9: Ejecuciones anteriores 
  getPreviousRuns(lat: number, lon: number): Observable<PreviousRunsData> {
    const url = `https://previous-runs-api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,wind_speed_10m`;
    return this.http.get<PreviousRunsData>(url);
  }

  // Método 10: Ejecución unica 
  getSingleRun(lat: number, lon: number, runDate: string): Observable<SingleRunData> {
    const url = `https://single-runs-api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&run=${runDate}&hourly=temperature_2m,precipitation,wind_speed_10m`;
    return this.http.get<SingleRunData>(url);
  }
}