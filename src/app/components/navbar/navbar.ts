import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {WeatherService} from '../../services/weather.service';
import {WeatherResponse} from '../../models/weather-response';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  searchQuery: string = '';

  isLoggedIn = false;
  userName = '';
  userEmail = '';
  showEmailInNavbar = true;

  // ===== IDŐJÁRÁS =====
  weather: WeatherResponse | null = null;
  weatherCity = 'Budapest';
  weatherLoading = false;
  weatherError = false;
  weatherDetailsOpen = false;
  private weatherRequestId = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private weatherService: WeatherService
  ) {
  }

  ngOnInit(): void {

    // Feliratkozás a közös felhasználói állapotra.
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userName = user?.name || '';
      this.userEmail = user?.email || '';
      this.showEmailInNavbar = user?.showEmailInNavbar !== false;
      const preferredCity = user?.preferredWeatherCity?.trim() || 'Budapest';
      if (preferredCity !== this.weatherCity) {
        this.weatherCity = preferredCity;
        this.loadWeather();
      }
    });

    // A szerver ellenőrzi a tényleges bejelentkezést.
    this.authService.getCurrentUser().subscribe({
      next: user => {
        this.authService.setUser(user);
      },
      error: () => {
        this.authService.clearSession();
      }
    });

    // Aktuális időjárás lekérése.
    this.loadWeather();
  }

  // ===== IDŐJÁRÁS LEKÉRÉSE =====
  loadWeather(): void {
    const requestId = ++this.weatherRequestId;
    this.weatherLoading = true;
    this.weatherError = false;

    this.weatherService.getCurrentWeather(this.weatherCity).subscribe({
      next: response => {
        if (requestId !== this.weatherRequestId) {
          return;
        }
        this.weather = response;
        this.weatherLoading = false;
      },
      error: err => {
        if (requestId !== this.weatherRequestId) {
          return;
        }
        console.error('Időjárás-lekérési hiba:', err);
        this.weather = null;
        this.weatherError = true;
        this.weatherLoading = false;
      }
    });
  }

  // Az OpenWeather ikon képének címe.
  get weatherIconUrl(): string {
    if (!this.weather?.icon) {
      return '';
    }

    return `https://openweathermap.org/img/wn/${this.weather.icon}@2x.png`;
  }

  openWeatherDetails(): void {
    this.weatherDetailsOpen = true;
  }

  closeWeatherDetails(): void {
    this.weatherDetailsOpen = false;
  }

  weatherIconUrlFor(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  onWeatherCityChanged(city: string): void {
    this.weatherCity = city;
    this.loadWeather();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.finishLogout();
      },
      error: err => {
        console.error('Kijelentkezési hiba:', err);

        // A helyi felhasználói adatokat akkor is töröljük,
        // ha a szerver már lejártnak tekinti a munkamenetet.
        this.finishLogout();
      }
    });
  }

  private finishLogout(): void {
    this.authService.clearSession();
    this.isLoggedIn = false;
    this.userName = '';
    this.userEmail = '';

    this.router.navigate(['/home']);
  }

  siteSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      return;
    }

// Korábbi kiemelések eltávolítása.
    document.querySelectorAll('mark').forEach(mark => {
      const parent = mark.parentNode;

      if (parent) {
        parent.replaceChild(
          document.createTextNode(mark.textContent || ''),
          mark
        );
        parent.normalize();
      }
    });

// Szövegek keresése az oldalon.
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );

    let found = 0;
    const matchingNodes: Text[] = [];

    while (walker.nextNode()) {
      const node = walker.currentNode as Text;

      // Navigációban és űrlapokban ne jelöljünk ki szöveget.
      if (node.parentElement?.closest(
        'nav, script, style, input, textarea, button'
      )) {
        continue;
      }

      if ((node.nodeValue || '').toLowerCase().includes(query)) {
        matchingNodes.push(node);
      }
    }

    matchingNodes.forEach(node => {
      const originalText = node.nodeValue || '';
      const escapedQuery = query.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

      const fragment = document.createDocumentFragment();
      const regex = new RegExp(escapedQuery, 'gi');

      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(originalText)) !== null) {
        fragment.appendChild(
          document.createTextNode(
            originalText.slice(lastIndex, match.index)
          )
        );

        const mark = document.createElement('mark');
        mark.textContent = match[0];
        mark.style.backgroundColor = '#fff176';

        fragment.appendChild(mark);

        lastIndex = match.index + match[0].length;
        found++;
      }

      fragment.appendChild(
        document.createTextNode(originalText.slice(lastIndex))
      );

      node.parentNode?.replaceChild(fragment, node);
    });

    if (found === 0) {
      alert('Nincs találat.');
    }
  }
}
