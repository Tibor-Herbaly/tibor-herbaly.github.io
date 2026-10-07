import {Component, OnInit} from '@angular/core';
import {PageModel} from '../../models/page.model';
import {PageService} from '../../services/page.service';

@Component({
  selector: 'app-page-rating',
  standalone: false,
  templateUrl: './page-rating.component.html',
  styleUrl: './page-rating.component.css'
})
export class PageRatingComponent implements OnInit {
  page?: PageModel;
  selectedValue = 0;

  constructor(private pageService: PageService) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPage(1).subscribe(data => this.page = data);
  }

  ratePage(): void {
    if (this.selectedValue >= 1 && this.selectedValue <= 6) {
      this.pageService.ratePage(1, this.selectedValue).subscribe(updated => this.page = updated);
    }
  }

}
