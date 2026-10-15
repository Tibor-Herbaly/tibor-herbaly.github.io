export interface WeatherResponse {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;
  windSpeed: number;
}

export interface WeatherDetailsResponse {
  current: CurrentWeatherData;
  forecast: ForecastWeatherData;
}

export interface CitySearchResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

export interface CurrentWeatherData {
  name: string;
  sys: {
    country?: string;
    sunrise?: number;
    sunset?: number;
  };
  coord?: {
    lat?: number;
    lon?: number;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  weather: WeatherCondition[];
  visibility?: number;
  wind?: {
    speed?: number;
    deg?: number;
    gust?: number;
  };
  clouds?: {
    all?: number;
  };
  dt: number;
  timezone?: number;
}

export interface ForecastWeatherData {
  list: ForecastItem[];
  city: {
    name: string;
    country?: string;
    sunrise?: number;
    sunset?: number;
    timezone?: number;
    coord?: {
      lat?: number;
      lon?: number;
    };
  };
}

export interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: CurrentWeatherData['main'] & {
    temp_kf?: number;
  };
  weather: WeatherCondition[];
  clouds?: {
    all?: number;
  };
  wind?: CurrentWeatherData['wind'];
  visibility?: number;
  pop?: number;
  rain?: {
    '3h'?: number;
  };
  snow?: {
    '3h'?: number;
  };
  sys?: {
    pod?: string;
  };
}

export interface WeatherCondition {
  id?: number;
  main?: string;
  description: string;
  icon: string;
}

export interface DailyForecast {
  dateKey: string;
  label: string;
  min: number;
  max: number;
  condition: WeatherCondition;
  precipitationChance: number;
}
