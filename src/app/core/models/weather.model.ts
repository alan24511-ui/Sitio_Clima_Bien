export interface Elevation {
  elevation: number[];
  generationtime_ms?: number;
  utc_offset_seconds?: number;
  timezone?: string;
  timezone_abbreviation?: string;
}

export interface MarineWeather {
  latitude: number;
  longitude: number;
  generationtime_ms?: number;
  utc_offset_seconds?: number;
  timezone?: string;
  timezone_abbreviation?: string;

  hourly_units?: {
    time?: string;
    wave_height?: string;
    wave_direction?: string;
    wave_period?: string;
  };

  hourly?: {
    time: string[];
    wave_height?: number[];
    wave_direction?: number[];
    wave_period?: number[];
  };
}

export interface HistoricalWeather {
  latitude: number;
  longitude: number;
  generationtime_ms?: number;
  utc_offset_seconds?: number;
  timezone?: string;
  timezone_abbreviation?: string;

  daily_units?: {
    time?: string;
    temperature_2m_max?: string;
    temperature_2m_min?: string;
    precipitation_sum?: string;
    wind_speed_10m_max?: string;
  };

  daily?: {
    time: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_sum?: number[];
    wind_speed_10m_max?: number[];
  };
}