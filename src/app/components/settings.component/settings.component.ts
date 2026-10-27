import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CitySearchResult } from '../../models/weather-response';
import { AuthService, CurrentUser } from '../../services/auth.service';
import {
  NAVBAR_COLORS,
  NavbarColor,
  NavbarColorService
} from '../../services/navbar-color.service';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  user: CurrentUser | null = null;
  cityQuery = '';
  cityResults: CitySearchResult[] = [];
  selectedCity: CitySearchResult | null = null;
  loading = true;
  searching = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  showEmailInNavbar = true;
  navbarColor: NavbarColor;
  readonly navbarColors = NAVBAR_COLORS;

  constructor(
    private authService: AuthService,
    private weatherService: WeatherService,
    private navbarColorService: NavbarColorService,
    private router: Router
  ) {
    this.navbarColor = this.navbarColorService.getColor();
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: user => {
        this.user = user;
        this.showEmailInNavbar = user.showEmailInNavbar !== false;
        this.authService.setUser(user);
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        if (err.status === 401) {
          this.router.navigate(['/login-out-delete']);
          return;
        }
        this.errorMessage = 'Nem sikerült betölteni a beállításokat.';
      }
    });
  }

  searchCities(): void {
    const query = this.cityQuery.trim();
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedCity = null;

    if (!query) {
      this.cityResults = [];
      this.errorMessage = 'Írj be egy városnevet.';
      return;
    }

    this.searching = true;
    this.weatherService.searchCities(query).subscribe({
      next: cities => {
        this.cityResults = cities;
        this.searching = false;
        if (cities.length === 0) {
          this.errorMessage = 'Nincs találat erre a városnévre.';
        }
      },
      error: err => {
        console.error('Városkeresési hiba:', err);
        this.cityResults = [];
        this.searching = false;
        this.errorMessage = 'A városkeresés nem sikerült. Próbáld újra később.';
      }
    });
  }

  selectCity(city: CitySearchResult): void {
    this.selectedCity = city;
    this.cityResults = [];
    this.errorMessage = '';
    this.successMessage = '';
  }

  saveCity(): void {
    if (!this.selectedCity || this.saving) {
      return;
    }

    const city = `${this.selectedCity.name},${this.selectedCity.country}`;
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.updatePreferredWeatherCity(city).subscribe({
      next: user => {
        this.user = user;
        this.authService.setUser(user);
        this.selectedCity = null;
        this.cityQuery = '';
        this.saving = false;
        this.successMessage = 'Az időjáráskártyán megjelenő város sikeresen mentve.';
      },
      error: err => {
        this.saving = false;
        if (err.status === 401) {
          this.router.navigate(['/login-out-delete']);
          return;
        }
        this.errorMessage = 'Nem sikerült elmenteni a várost. Próbáld újra.';
      }
    });
  }

  saveEmailVisibility(): void {
    if (this.saving) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.updateShowEmailInNavbar(this.showEmailInNavbar).subscribe({
      next: user => {
        this.user = user;
        this.showEmailInNavbar = user.showEmailInNavbar !== false;
        this.authService.setUser(user);
        this.saving = false;
        this.successMessage = 'Az e-mail-cím láthatósági beállítása sikeresen mentve.';
      },
      error: err => {
        this.saving = false;
        if (err.status === 401) {
          this.router.navigate(['/login-out-delete']);
          return;
        }
        this.errorMessage = 'Nem sikerült elmenteni a láthatósági beállítást. Próbáld újra.';
      }
    });
  }

  setNavbarColor(color: NavbarColor): void {
    this.navbarColorService.setColor(color);
    this.navbarColor = color;
  }

  cityLabel(city: CitySearchResult): string {
    return [city.name, city.state, city.country].filter(Boolean).join(', ');
  }
}
