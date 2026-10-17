import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home.component',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  announcement = '';
  announcementLoadFailed = false;

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<{ message: string }>('http://localhost:8080/api/announcements/home')
      .subscribe({
        next: ({ message }) => this.announcement = message,
        error: () => this.announcementLoadFailed = true
      });
  }
}
