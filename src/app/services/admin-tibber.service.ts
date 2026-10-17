import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminUser } from '../models/admin-user';
import { AdminDonationSummary } from '../models/donation-response';

@Injectable({
  providedIn: 'root'
})
export class AdminTibberService {
  private readonly apiUrl = 'http://localhost:8080/api/admin-tibber';

  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`, { withCredentials: true });
  }

  getDonations(): Observable<AdminDonationSummary> {
    return this.http.get<AdminDonationSummary>(`${this.apiUrl}/donations`, {
      withCredentials: true
    });
  }
}
