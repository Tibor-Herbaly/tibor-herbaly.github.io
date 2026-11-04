import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Writing, WritingRequest, WritingSummary } from '../models/writing';

@Injectable({
  providedIn: 'root'
})
export class WritingService {
  private readonly publicApiUrl = 'http://localhost:8080/api/writings';
  private readonly adminApiUrl = 'http://localhost:8080/api/admin-tibber/writings';

  constructor(private readonly http: HttpClient) {}

  getPublishedWritings(): Observable<WritingSummary[]> {
    return this.http.get<WritingSummary[]>(this.publicApiUrl);
  }

  getWriting(id: number): Observable<Writing> {
    return this.http.get<Writing>(`${this.publicApiUrl}/${id}`);
  }

  getAdminWritings(): Observable<WritingSummary[]> {
    return this.http.get<WritingSummary[]>(this.adminApiUrl, { withCredentials: true });
  }

  createWriting(request: WritingRequest): Observable<Writing> {
    return this.http.post<Writing>(this.adminApiUrl, request, { withCredentials: true });
  }

  updateWriting(id: number, request: WritingRequest): Observable<Writing> {
    return this.http.put<Writing>(`${this.adminApiUrl}/${id}`, request, {
      withCredentials: true
    });
  }
}
