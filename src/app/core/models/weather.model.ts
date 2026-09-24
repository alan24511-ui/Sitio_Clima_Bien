// MÉTODO 1 — CIUDADES

export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  timezone?: string;
}

// MÉTODO 2 — CLIMA ACTUAL

export interface CurrentWeather {

  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  isDay: boolean;
}

// MÉTODO 3 — CALIDAD DEL AIRE

export interface AirQuality {
  time: string;
  pm2_5: number;
  pm10: number;
  europeanAqi: number;
}

// MÉTODO 4 — ELEVACIÓN

export interface Elevation {
  elevation: number[];
}

// MÉTODO 5 — MARINE

export interface MarineWeather {

  latitude?: number;
  longitude?: number;
  elevation?: number;
  timezone?: string;

  hourly?: {
    time: string[];
    wave_height?: number[];
    wave_direction?: number[];
    wave_period?: number[];
  };

  hourly_units?: {
    wave_height?: string;
    wave_direction?: string;
    wave_period?: string;
  };
}

// MÉTODO 6 — CLIMA HISTÓRICO

export interface HistoricalWeather {

  latitude?: number;
  longitude?: number;
  elevation?: number;
  timezone?: string;

  daily: {
    time: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_sum?: number[];
    wind_speed_10m_max?: number[];
  };

  daily_units?: {
    temperature_2m_max?: string;
    temperature_2m_min?: string;
    precipitation_sum?: string;
    wind_speed_10m_max?: string;
  };
}

// MÉTODO 7 — PRONÓSTICO HISTÓRICO

export interface HistoricalForecast {

  latitude?: number;
  longitude?: number;
  elevation?: number;
  timezone?: string;

  hourly: {
    time: string[];
    temperature_2m?: number[];
    relative_humidity_2m?: number[];
    precipitation?: number[];
    weather_code?: number[];
    wind_speed_10m?: number[];
    wind_direction_10m?: number[];
  };

  hourly_units?: {
    temperature_2m?: string;
    relative_humidity_2m?: string;
    precipitation?: string;
    wind_speed_10m?: string;
    wind_direction_10m?: string;
  };
}

// MÉTODO 8 — ECMWF
export interface ECMWFWeather {
  latitude?: number;
  longitude?: number;
  elevation?: number;
  timezone?: string;

  hourly: {
    time: string[];
    temperature_2m?: number[];
    relative_humidity_2m?: number[];
    precipitation?: number[];
    weather_code?: number[];
    wind_speed_10m?: number[];
    wind_direction_10m?: number[];
  };

  hourly_units?: {
    temperature_2m?: string;
    relative_humidity_2m?: string;
    precipitation?: string;
    wind_speed_10m?: string;
    wind_direction_10m?: string;
  };
}