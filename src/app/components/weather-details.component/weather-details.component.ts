import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  CitySearchResult,
  DailyForecast,
  ForecastItem,
  WeatherDetailsResponse
} from '../../models/weather-response';
import {WeatherService} from '../../services/weather.service';

@Component({
  selector: 'app-weather-details',
  standalone: false,
  templateUrl: './weather-details.component.html',
  styleUrl: './weather-details.component.css'
})
export class WeatherDetailsComponent implements OnInit {
  @Input() city = 'Budapest';
  @Output() cityChange = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  searchCity = '';
  weatherDetails: WeatherDetailsResponse | null = null;
  dailyForecasts: DailyForecast[] = [];
  detailsLoading = false;
  detailsError = false;
  searchLoading = false;
  searchError = '';
  cityResults: CitySearchResult[] = [];
  private selectedCity: CitySearchResult | null = null;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.searchCity = this.city;
    this.loadWeatherDetails(this.city);
  }

  searchWeather(): void {
    const city = this.searchCity.trim();
    if (!city) {
      this.cityResults = [];
      this.searchError = 'Írj be egy városnevet.';
      return;
    }

    this.selectedCity = null;
    this.searchError = '';
    this.cityResults = [];
    this.searchLoading = true;

    this.weatherService.searchCities(city).subscribe({
      next: cities => {
        this.cityResults = cities;
        this.searchLoading = false;
        if (cities.length === 0) {
          this.searchError = 'Nincs találat erre a városnévre.';
        }
      },
      error: err => {
        console.error('Városkeresési hiba:', err);
        this.cityResults = [];
        this.searchLoading = false;
        this.searchError = 'A városkeresés nem sikerült. Próbáld újra később.';
      }
    });
  }

  selectCity(city: CitySearchResult): void {
    this.selectedCity = city;
    this.searchCity = city.name;
    this.cityResults = [];
    this.searchError = '';
    this.detailsLoading = true;
    this.detailsError = false;

    this.weatherService.getWeatherDetailsByCoordinates(city.lat, city.lon).subscribe({
      next: details => this.setWeatherDetails(details),
      error: err => {
        console.error('Részletes időjárás-lekérési hiba:', err);
        this.weatherDetails = null;
        this.dailyForecasts = [];
        this.detailsError = true;
        this.detailsLoading = false;
      }
    });
  }

  loadWeatherDetails(city: string): void {
    this.selectedCity = null;
    this.detailsLoading = true;
    this.detailsError = false;

    this.weatherService.getWeatherDetails(city).subscribe({
      next: details => this.setWeatherDetails(details),
      error: err => {
        console.error('Részletes időjárás-lekérési hiba:', err);
        this.weatherDetails = null;
        this.dailyForecasts = [];
        this.detailsError = true;
        this.detailsLoading = false;
      }
    });
  }

  retryWeatherDetails(): void {
    if (this.selectedCity) {
      this.selectCity(this.selectedCity);
      return;
    }

    this.loadWeatherDetails(this.searchCity);
  }

  get weatherDetailsIconUrl(): string {
    const icon = this.weatherDetails?.current.weather[0]?.icon;
    return icon ? this.weatherIconUrlFor(icon) : '';
  }

  weatherIconUrlFor(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  formatWeatherTime(timestamp: number, timezoneOffset = 0): string {
    const localTime = this.localWeatherDate(timestamp, timezoneOffset);
    return localTime.toLocaleString('hu-HU', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatWeatherDate(timestamp: number, timezoneOffset = 0): string {
    return this.localWeatherDate(timestamp, timezoneOffset).toLocaleDateString('hu-HU', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }

  formatWeatherClock(timestamp: number, timezoneOffset = 0): string {
    return this.localWeatherDate(timestamp, timezoneOffset).toLocaleTimeString('hu-HU', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private setWeatherDetails(details: WeatherDetailsResponse): void {
    this.weatherDetails = details;
    this.dailyForecasts = this.createDailyForecasts(
      details.forecast.list,
      details.forecast.city.timezone ?? 0
    );
    this.searchCity = details.current.name;
    this.cityChange.emit(details.current.name);
    this.detailsLoading = false;
  }

  private localWeatherDate(timestamp: number, timezoneOffset: number): Date {
    return new Date((timestamp + timezoneOffset) * 1000);
  }

  private createDailyForecasts(items: ForecastItem[], timezoneOffset: number): DailyForecast[] {
    const days = new Map<string, DailyForecast>();

    items.forEach(item => {
      const date = new Date((item.dt + timezoneOffset) * 1000);
      const dateKey = date.toISOString().slice(0, 10);
      const existing = days.get(dateKey);

      if (existing) {
        existing.min = Math.min(existing.min, item.main.temp_min);
        existing.max = Math.max(existing.max, item.main.temp_max);
        existing.precipitationChance = Math.max(existing.precipitationChance, item.pop ?? 0);
      } else {
        days.set(dateKey, {
          dateKey,
          label: date.toLocaleDateString('hu-HU', {
            timeZone: 'UTC',
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          }),
          min: item.main.temp_min,
          max: item.main.temp_max,
          condition: item.weather[0],
          precipitationChance: item.pop ?? 0
        });
      }
    });

    return Array.from(days.values()).slice(0, 5);
  }
}
