
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface NewsCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  color: string;
  searchQuery?: string;
}

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  author?: string;
  description?: string;
  thumbnail?: string;
}

interface RssResponse {
  status: string;
  message?: string;
  feed?: {
    title?: string;
  };
  items?: NewsItem[];
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  selectedCategory: NewsCategory | undefined;

  newsItems: NewsItem[] = [];
  loading = false;
  errorMessage = '';
  feedTitle = '';

  private requestNumber = 0;

  categories: NewsCategory[] = [
    {
      id: 'magyar-es-nemzetkozi',
      title: 'Magyar és nemzetközi hírek',
      description: 'Magyarország és a világ legfontosabb eseményei.',
      icon: 'bi-globe-europe-africa',
      path: '/news/magyar-es-nemzetkozi',
      color: 'blue',
      searchQuery: 'magyarországi és nemzetközi hírek'
    },
    {
      id: 'urkutatas-es-nasa',
      title: 'Űrkutatás és NASA',
      description: 'Bolygók, galaxisok, rakétaindítások és űrmissziók.',
      icon: 'bi-stars',
      path: '/space-science',
      color: 'purple'
    },
    {
      id: 'autos-es-motoros',
      title: 'Autós és motoros hírek',
      description: 'Autók, motorok, közlekedés és motorsport.',
      icon: 'bi-car-front-fill',
      path: '/news/autos-es-motoros',
      color: 'red',
      searchQuery: 'autó motor autóipar motorsport'
    },
    {
      id: 'informatika-es-ai',
      title: 'Informatika és mesterséges intelligencia',
      description: 'AI, programozás, alkalmazások és technológia.',
      icon: 'bi-cpu-fill',
      path: '/news/informatika-es-ai',
      color: 'cyan',
      searchQuery: 'informatika mesterséges intelligencia technológia'
    },
    {
      id: 'sporthirek',
      title: 'Sporthírek',
      description: 'Labdarúgás, Forma–1 és más sportágak.',
      icon: 'bi-trophy-fill',
      path: '/news/sporthirek',
      color: 'green',
      searchQuery: 'sporthírek labdarúgás Forma 1'
    },
    {
      id: 'tudomany-termeszet-egeszseg',
      title: 'Tudomány, természet és egészség',
      description: 'Felfedezések, állatvilág, környezet és egészség.',
      icon: 'bi-heart-pulse-fill',
      path: '/news/tudomany-termeszet-egeszseg',
      color: 'orange',
      searchQuery: 'tudomány természet környezet egészség'
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const categoryId = params.get('category');

      this.selectedCategory = categoryId
        ? this.categories.find(category => category.id === categoryId)
        : undefined;

      this.newsItems = [];
      this.errorMessage = '';
      this.feedTitle = '';

      if (this.selectedCategory?.searchQuery) {
        void this.loadNews(this.selectedCategory);
      }
    });
  }


  private async loadNews(category: NewsCategory): Promise<void> {
    const currentRequest = ++this.requestNumber;

    this.loading = true;
    this.errorMessage = '';
    this.newsItems = [];
    this.feedTitle = 'Google Hírek';

    const rssUrl =
      'https://news.google.com/rss/search?q=' +
      encodeURIComponent(category.searchQuery ?? '') +
      '&hl=hu&gl=HU&ceid=HU%3Ahu';

    // RSS lekérése ingyenes CORS-proxyn keresztül.
    const proxyUrl = 'https://proxy.cors.dev/' + rssUrl;

    try {
      const response = await fetch(proxyUrl, {
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }

      const xmlText = await response.text();
      const xml = new DOMParser().parseFromString(
        xmlText,
        'application/xml'
      );

      if (xml.querySelector('parsererror')) {
        throw new Error('A kapott RSS-adat nem olvasható XML.');
      }

      if (currentRequest !== this.requestNumber) {
        return;
      }

      const items = Array.from(xml.querySelectorAll('item'));

      this.newsItems = items
        .map(item => {
          const getText = (selector: string): string =>
            item.querySelector(selector)?.textContent?.trim() ?? '';

          const rawDescription = getText('description');

          // A külső RSS-leírásból egyszerű szöveget készítünk.
          const descriptionDocument = new DOMParser().parseFromString(
            rawDescription,
            'text/html'
          );

          return {
            title: getText('title'),
            link: getText('link'),
            pubDate: getText('pubDate'),
            description:
              descriptionDocument.body.textContent?.trim() ?? ''
          } as NewsItem;
        })
        .filter(item => !!item.title && !!item.link)
        .slice(0, 10);

      if (this.newsItems.length === 0) {
        this.errorMessage =
          'A hírcsatorna elérhető, de most nem találtunk híreket.';
      }

    } catch (error) {
      if (currentRequest === this.requestNumber) {
        console.error('Hírbetöltési hiba:', error);

        this.errorMessage =
          'A hírek betöltése nem sikerült. ' +
          'Lehet, hogy a hírcsatorna vagy a közvetítő szolgáltatás ' +
          'átmenetileg nem elérhető.';
      }
    } finally {
      if (currentRequest === this.requestNumber) {
        this.loading = false;
      }
    }
  }


  formatDate(dateString: string): string {
    if (!dateString) {
      return '';
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  retryLoading(): void {
    if (this.selectedCategory?.searchQuery) {
      void this.loadNews(this.selectedCategory);
    }
  }
}
