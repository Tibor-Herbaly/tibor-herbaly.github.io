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
  screenshots?: { src: string; alt: string }[];
}

@Component({
  selector: 'app-android-app',
  standalone: false,
  templateUrl: './android-app.component.html',
  styleUrl: './android-app.component.css'
})

export class AndroidAppComponent {

  readonly galleryVisibility: Record<string, boolean> = {};
  private readonly weatherAppScreenshots = [
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

  isGalleryOpen(appName: string): boolean {
    return this.galleryVisibility[appName] ?? false;
  }

  toggleGallery(appName: string): void {
    this.galleryVisibility[appName] = !this.isGalleryOpen(appName);
  }

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
      version: '1.1.0',
      icon: '🌤️',
      features: [
        'Aktuális időjárási adatok',
        'Városkeresés',
        'Részletes időjárási információk'
      ],
      screenshots: this.weatherAppScreenshots,
      downloadUrl: 'https://github.com/Tibor-Herbaly/tibor-herbaly.github.io/releases/download/v1.1.0/app-release_v1.1.0_WeatherApp.apk',
      fileName: 'WeatherApp-1.1.0.apk'
    },
    {
      name: 'Blaue Power',
      description: 'Saját fejlesztésű Android játék.',
      category: 'Játék',
      version: '1.1.2',
      icon: '🎮',
      features: [
        'Ügyességi, és logikai',
        'Pontgyűjtés, érem tábla',
        'Szórakozás és izgalom offline is'
      ],
      screenshots: [
        {
          src: 'assets/platform-game/platform-game-1.png',
          alt: 'Blaue Power képernyőkép 1'
        },
        {
          src: 'assets/platform-game/platform-game-2.png',
          alt: 'Blaue Power képernyőkép 2'
        },
        {
          src: 'assets/platform-game/platform-game-3.png',
          alt: 'Blaue Power képernyőkép 3'
        },
        {
          src: 'assets/platform-game/platform-game-4.png',
          alt: 'Blaue Power képernyőkép 4'
        },
        {
          src: 'assets/platform-game/platform-game-5.png',
          alt: 'Blaue Power képernyőkép 5'
        }
      ],
      downloadUrl: 'https://github.com/Tibor-Herbaly/tibor-herbaly.github.io/releases/download/v1.1.2/app-release_148_PlatformG_Blaue_P.apk',
      fileName: 'PlatformGame.apk'
    },
    {
      name: 'SmartToDo',
      description: 'Okos, ügyes emlékeztető alkalmazás, amely segít a feladatok nyomon követésében.',
      category: 'Hétköznapi',
      version: '1.0.0',
      icon: '📝',
      features: [
        'Feladatok létrehozása és kezelése',
        'Emlékeztetők beállítása',
        'Ciklus kezelés és prioritások beállítása'
      ],
      screenshots: [
        {
          src: 'assets/smart-todo/smart_todo-1.png',
          alt: 'SmartToDo kép 1'
        },
        {
          src: 'assets/smart-todo/smart_todo-alarm.png',
          alt: 'SmartToDo alarm beállítás képernyő.'
        },
        {
          src: 'assets/smart-todo/smart_todo-calendar.png',
          alt: 'SmartToDo calendar nézet képernyő.'
        },
        {
          src: 'assets/smart-todo/smart_todo-widget.png',
          alt: 'SmartToDo widget képernyő.'
        }
      ],
      downloadUrl: 'https://github.com/Tibor-Herbaly/tibor-herbaly.github.io/releases/download/v1.0.0/app-release_SmartTodo.apk',
      fileName: 'smart-todo.apk'
    },
    {
      name: 'Wall Shooter Game',
      description: 'A célt kell eltalálni akadályok között, hogy pontot szerezzünk.',
      category: 'Játék',
      version: '1.0.0',
      icon: '🎯',
      features: [
        'Célzás és lövés',
        'Akadályok és pontszerzés',
        'Szórakoztató és kihívást jelentő játékmenet'
      ],
      screenshots: [
        {
          src: 'assets/wall-shooter/wall-shooter-1.png',
          alt: 'Wall Shooter Game képernyőkép 1'
        }
      ],
      downloadUrl: '',
      fileName: 'app-release.apk'
    },
    {
      name: 'Mi van körülöttem ?',
      description: 'A közelben található helyek felfedezése térképen.',
      category: 'Térkép',
      version: '1.0.0',
      icon: '🗺️',
      features: [
        'Térképes megjelenítés',
        'Közeli helyek keresése',
        'Helyalapú funkciók'
      ],
      screenshots: [
        {
          src: 'assets/nearby-places/nearby-places.png',
          alt: 'Mi van körülöttem? képernyőkép'
        }
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
