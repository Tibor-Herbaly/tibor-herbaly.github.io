import { Component } from '@angular/core';

@Component({
  selector: 'app-writings.component',
  standalone: false,
  templateUrl: './writings.component.html',
  styleUrl: './writings.component.css'
})
export class WritingsComponent {
  readonly writings = Array.from({ length: 6 }, (_, index) => index + 1);
  selectedWriting: number | null = null;

  openWriting(writing: number): void {
    this.selectedWriting = writing;
  }

  closeWriting(): void {
    this.selectedWriting = null;
  }
}
