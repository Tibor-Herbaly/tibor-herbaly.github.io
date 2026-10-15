import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginRequestModel} from '../models/register-login/login-request.model';
import {LoginResponseModel} from '../models/register-login/login-response.model';
import {RegistrationRequestModel} from '../models/register-login/registration-request.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  private loggedInUser?: any;

  constructor(private http: HttpClient) {}

  // Közös felhasználói állapot, amelyre a navbar is feliratkozik.
  private currentUserSubject = new BehaviorSubject<any>(null);

  readonly currentUser$ = this.currentUserSubject.asObservable();

  getCaptcha(): Observable<{ question: string }> {
    return this.http.get<{ question: string }>(`${this.apiUrl}/captcha`, { withCredentials: true });
  }

  login(request: LoginRequestModel): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>(`${this.apiUrl}/login`, request, { withCredentials: true });
  }

  register(request: RegistrationRequestModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, request);
  }

  verifyCode(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, payload, { responseType: 'text' });
  }

  getCurrentUser(): Observable<{id:number, name:string, email:string}> {
    return this.http.get<{id:number, name:string, email:string}>(`${this.apiUrl}/me`, { withCredentials: true });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  deleteAccount(): Observable<string> {
    const email = localStorage.getItem('userEmail');
    return this.http.delete(`${this.apiUrl}/delete`, {
      body: { email: email },
      responseType: 'text', // ha szöveget vársz vissza
      withCredentials: true
    });
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  clearSession(): void {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('accountId');
    this.loggedInUser = undefined;
    this.currentUserSubject.next(null);
  }

  setUser(user: any) {
    // tárold belső változóban
    this.loggedInUser = user;
    this.currentUserSubject.next(user);

    // és localStorage-be mint string
    if (user) {
      if (user.accountId !== undefined && user.accountId !== null) {
        localStorage.setItem('accountId', String(user.accountId));
      }
      if (user.id !== undefined && user.id !== null) {
        localStorage.setItem('userId', String(user.id));
      }
      if (user.name) {
        localStorage.setItem('userName', user.name);
      }
      if (user.email) {
        localStorage.setItem('userEmail', user.email);
      }
    }
  }

  getUser(): any | undefined {
    if (this.loggedInUser) return this.loggedInUser;

    // Ha nincs belső user, megpróbáljuk localStorage-ból visszaállítani (opcionális)
    const uid = localStorage.getItem('userId');
    const aid = localStorage.getItem('accountId');
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    if (uid || aid || name || email) {
      this.loggedInUser = {
        id: uid ? Number(uid) : undefined,
        accountId: aid ? Number(aid) : undefined,
        name,
        email
      };
      return this.loggedInUser;
    }

    return undefined;
  }

  requestTemporaryLoginCode(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/request-temporary-login-code`,
      { email },
      { withCredentials: true }
    );
  }

  loginWithTemporaryCode(
    email: string,
    code: string,
    captcha: string
  ): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>(
      `${this.apiUrl}/login-with-temporary-code`,
      { email, code, captcha },
      { withCredentials: true }
    );
  }


  // Profilnév módosítása
  updateProfileName(name: string) {
    return this.http.put<{
      id: number;
      name: string;
      email: string;
    }>(
      `${this.apiUrl}/profile/name`,
      { name },
      { withCredentials: true }
    );
  }

  // E-mail-cím módosítása
  updateProfileEmail(newEmail: string) {
    return this.http.put<{
      id: number;
      name: string;
      email: string;
    }>(
      `${this.apiUrl}/profile/email`,
      { newEmail },
      { withCredentials: true }
    );
  }

  // Jelszó módosítása
  updateProfilePassword(currentPassword: string, newPassword: string) {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/profile/password`,
      { currentPassword, newPassword },
      { withCredentials: true }
    );
  }


}
