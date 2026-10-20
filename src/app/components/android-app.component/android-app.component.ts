import {Component} from '@angular/core';

interface AndroidApp {
  name: string;
  description: string;
  category: string;
  version: string;
  icon: string;
  features: string[];
  downloadUrl: string;
  fileName: string;
}

@Component({
  selector: 'app-android-app',
  standalone: false,
  templateUrl: './adroid-app.component.html',
  styleUrl: './android-app.component.css'
})

export class AndroidAppComponent {

  showWeatherGallery = false;
  readonly weatherAppScreenshots = [
    {
      src: 'assets/weather-app/weather-app-1.png',
      alt: 'WeatherApp képernyőkép 1'
    },
    {
      src: 'assets/weather-app/weather-app-2.png',
      alt: 'WeatherApp képernyőkép 2'
    },
    {
      src: 'assets/weather-app/weather-app-3.png',
      alt: 'WeatherApp képernyőkép 3'
    },
    {
      src: 'assets/weather-app/weather-app-map.png',
      alt: 'WeatherApp képernyőkép map'
    },
    {
      src: 'assets/weather-app/weather-app-settings.png',
      alt: 'WeatherApp képernyőkép Settings'
    }
  ];

  // A biztonsági ablak állapota
  showDownloadConfirmation = false;

// Az alkalmazás, amelyet le szeretne tölteni a látogató
  selectedAppForDownload: AndroidApp | null = null;

// A letöltés gomb megnyomásakor megnyitjuk a biztonsági ablakot
  requestDownload(app: AndroidApp): void {
    this.selectedAppForDownload = app;
    this.showDownloadConfirmation = true;
  }

// Jóváhagyás nélkül bezárjuk az ablakot
  cancelDownload(): void {
    this.showDownloadConfirmation = false;
    this.selectedAppForDownload = null;
  }

// Sikeres jóváhagyás után bezárjuk az ablakot
  confirmDownload(): void {
    if (!this.selectedAppForDownload?.downloadUrl) {
      return;
    }

    const downloadUrl = this.selectedAppForDownload.downloadUrl;

    this.showDownloadConfirmation = false;
    this.selectedAppForDownload = null;

    window.location.href = downloadUrl;
  }

  searchText = '';
  selectedCategory = 'Mindegyik';

  // Az alkalmazások adatai.
  // A downloadUrl mezőbe a saját GitHub Release letöltési linkjét kell írni!
  apps: AndroidApp[] = [
    {
      name: 'WeatherApp',
      description: 'Időjárás-lekérdezés magyar és külföldi városokra.',
      category: 'Időjárás',
      version: '1.0.0',
      icon: '🌤️',
      features: [
        'Aktuális időjárási adatok',
        'Városkeresés',
        'Részletes időjárási információk'
      ],
      downloadUrl: 'https://github.com/Tibor-Herbaly/tibor-herbaly.github.io/releases/download/v1.0.0/app-release_146_WeaterApp.apk',
      fileName: 'WeatherApp.apk'
    },
    {
      name: 'Tibber Game',
      description: 'Saját fejlesztésű Android-játékok gyűjteménye.',
      category: 'Játék',
      version: '1.0.0',
      icon: '🎮',
      features: [
        'Ügyességi és logikai játékok',
        'Pontgyűjtés',
        'Szórakozás offline is, ha az alkalmazás támogatja'
      ],
      downloadUrl: '',
      fileName: 'app-release.apk'
    },
    {
      name: 'Mi van körülöttem?',
      description: 'A közelben található helyek felfedezése térképen.',
      category: 'Térkép',
      version: '1.0.0',
      icon: '🗺️',
      features: [
        'Térképes megjelenítés',
        'Közeli helyek keresése',
        'Helyalapú funkciók'
      ],
      downloadUrl: '',
      fileName: 'app-release.apk'
    }
  ];

  get categories(): string[] {
    return [
      'Mindegyik',
      ...new Set(this.apps.map(app => app.category))
    ];
  }

  get filteredApps(): AndroidApp[] {
    const search = this.searchText.trim().toLowerCase();

    return this.apps.filter(app => {
      const matchesCategory =
        this.selectedCategory === 'Mindegyik' ||
        app.category === this.selectedCategory;

      const matchesSearch =
        !search ||
        app.name.toLowerCase().includes(search) ||
        app.description.toLowerCase().includes(search) ||
        app.category.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }

  trackByName(index: number, app: AndroidApp): string {
    return app.name;
  }
}
