import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DonationRequestModel} from '../models/donation-request';
import {Observable} from 'rxjs';
import {DonationSummary} from '../models/donation-response';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  private apiUrl = 'http://localhost:8080/api/donations';

  constructor(private http: HttpClient) { }

  addDonation(donation: DonationRequestModel): Observable<any> {
    return this.http.post(this.apiUrl, donation);
  }

  getDonationsSummary(): Observable<DonationSummary> {
    return this.http.get<DonationSummary>(this.apiUrl);
  }
}
