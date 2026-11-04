import { Component, OnInit } from '@angular/core';
import { Writing, WritingSummary } from '../../../models/writing';
import { WritingService } from '../../../services/writing.service';

@Component({
  selector: 'app-writings.component',
  standalone: false,
  templateUrl: './writings.component.html',
  styleUrl: './writings.component.css'
})
export class WritingsComponent implements OnInit {
  writings: WritingSummary[] = [];
  selectedWriting: Writing | null = null;
  loading = true;
  errorMessage = '';
  detailLoading = false;

  constructor(private readonly writingService: WritingService) {}

  ngOnInit(): void {
    this.writingService.getPublishedWritings().subscribe({
      next: writings => {
        this.writings = writings;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Az írások betöltése nem sikerült.';
        this.loading = false;
      }
    });
  }

  openWriting(writing: WritingSummary): void {
    this.detailLoading = true;
    this.errorMessage = '';
    this.writingService.getWriting(writing.id).subscribe({
      next: detail => {
        this.selectedWriting = detail;
        this.detailLoading = false;
      },
      error: () => {
        this.errorMessage = 'A kiválasztott írás betöltése nem sikerült.';
        this.detailLoading = false;
      }
    });
  }

  closeWriting(): void {
    this.selectedWriting = null;
  }
}
