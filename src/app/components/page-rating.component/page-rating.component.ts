import {Component, OnInit} from '@angular/core';
import {PageModel} from '../../models/page.model';
import {PageService} from '../../services/page.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-page-rating',
  standalone: false,
  templateUrl: './page-rating.component.html',
  styleUrl: './page-rating.component.css'
})
export class PageRatingComponent implements OnInit {
  page?: PageModel;
  selectedValue = 0;
  showLoginPrompt = false;
  ratingError = '';
  submitting = false;

  constructor(
    private pageService: PageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPage(1).subscribe(data => this.page = data);
  }

  ratePage(): void {
    if (this.selectedValue < 1 || this.selectedValue > 6 || this.submitting) {
      return;
    }

    this.ratingError = '';
    this.submitting = true;
    this.pageService.ratePage(1, this.selectedValue).subscribe({
      next: updated => {
        this.page = updated;
        this.submitting = false;
      },
      error: err => {
        this.submitting = false;
        if (err.status === 401) {
          this.authService.clearSession();
          this.showLoginPrompt = true;
          return;
        }

        this.ratingError = 'Hiba történt az értékelés mentésekor.';
        console.error('Értékelési hiba:', err);
      }
    });
  }

  closeLoginPrompt(): void {
    this.showLoginPrompt = false;
  }

}
