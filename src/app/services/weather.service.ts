import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CitySearchResult,
  WeatherDetailsResponse,
  WeatherResponse
} from '../models/weather-response';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private readonly apiUrl = 'http://localhost:8080/api/weather/current';

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<WeatherResponse> {
    const params = new HttpParams().set('city', city);

    return this.http.get<WeatherResponse>(
      this.apiUrl,
      { params }
    );
  }

  getWeatherDetails(city: string): Observable<WeatherDetailsResponse> {
    const params = new HttpParams().set('city', city);

    return this.http.get<WeatherDetailsResponse>(
      'http://localhost:8080/api/weather/details',
      { params }
    );
  }

  searchCities(city: string): Observable<CitySearchResult[]> {
    const params = new HttpParams().set('city', city);

    return this.http.get<CitySearchResult[]>(
      'http://localhost:8080/api/weather/cities',
      { params }
    );
  }

  getWeatherDetailsByCoordinates(lat: number, lon: number): Observable<WeatherDetailsResponse> {
    const params = new HttpParams()
      .set('lat', lat)
      .set('lon', lon);

    return this.http.get<WeatherDetailsResponse>(
      'http://localhost:8080/api/weather/details/by-coordinates',
      { params }
    );
  }
}
