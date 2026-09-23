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

export interface AirQuality {
    time: string;
    pm2_5: number;
    pm10: number;
    europeanAqi: number;
}