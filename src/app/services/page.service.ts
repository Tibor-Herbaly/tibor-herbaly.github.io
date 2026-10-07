import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PageModel} from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  private apiUrl = 'http://localhost:8080/api/pages';

  constructor(private http: HttpClient) {}

  getPage(id: number): Observable<PageModel> {
    return this.http.get<PageModel>(`${this.apiUrl}/${id}`);
  }

  ratePage(id: number, value: number): Observable<PageModel> {
    return this.http.post<PageModel>(`${this.apiUrl}/${id}/rate?value=${value}`, {});
  }


}
