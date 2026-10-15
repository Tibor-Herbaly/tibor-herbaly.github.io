
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SpaceNews,
  SpaceScienceService
} from '../../services/space-science.service';

@Component({
  selector: 'app-space-science',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './space-science.component.html',
  styleUrls: ['./space-science.component.css']
})
export class SpaceScienceComponent implements OnInit {

  news: SpaceNews[] = [];

  searchText = '';
  selectedCategory = 'all';

  loading = false;
  errorMessage = '';

  currentPage = 1;
  hasSearched = false;

  readonly categories = [
    { value: 'all', label: '🌌 Minden téma', query: 'space exploration' },
    { value: 'planets', label: '🪐 Bolygók és Mars', query: 'Mars planet exploration' },
    { value: 'astronomy', label: '🔭 Csillagászat', query: 'astronomy galaxies stars' },
    { value: 'earth', label: '🌍 Föld és környezet', query: 'Earth science climate' },
    { value: 'rockets', label: '🚀 Rakéták és űrmissziók', query: 'NASA rocket space mission' },
    { value: 'technology', label: '🛰️ Űrtechnológia', query: 'space technology satellite' }
  ];

  constructor(
    private spaceScienceService: SpaceScienceService
  ) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.loading = true;
    this.errorMessage = '';
    this.hasSearched = true;

    const category = this.categories.find(
      item => item.value === this.selectedCategory
    );

    const query = this.searchText.trim() ||
      category?.query ||
      'space exploration';

    this.spaceScienceService
      .searchNews(query, this.currentPage)
      .subscribe({
        next: results => {
          this.news = results;
          this.loading = false;

          if (results.length === 0) {
            this.errorMessage =
              'Nem található megjeleníthető tartalom. Próbálj másik keresést!';
          }
        },
        error: error => {
          console.error('NASA API hiba:', error);

          this.news = [];
          this.loading = false;
          this.errorMessage =
            'A NASA adatainak betöltése nem sikerült. ' +
            'Ellenőrizd az internetkapcsolatot, majd próbáld újra!';
        }
      });
  }

  search(): void {
    this.currentPage = 1;
    this.loadNews();
  }

  changeCategory(): void {
    this.searchText = '';
    this.currentPage = 1;
    this.loadNews();
  }

  nextPage(): void {
    this.currentPage++;
    this.loadNews();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadNews();

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  openSource(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  shortDescription(description: string): string {
    const cleanText = description.replace(/<[^>]*>/g, ' ').trim();

    if (cleanText.length <= 230) {
      return cleanText;
    }

    return cleanText.substring(0, 230) + '...';
  }
}
