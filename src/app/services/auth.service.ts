import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginRequestModel} from '../models/register-login/login-request.model';
import {LoginResponseModel} from '../models/register-login/login-response.model';
import {RegistrationRequestModel} from '../models/register-login/registration-request.model';
import { BehaviorSubject } from 'rxjs';
import { NavbarColorService } from './navbar-color.service';

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  preferredWeatherCity?: string | null;
  showEmailInNavbar?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  private loggedInUser?: any;

  constructor(
    private http: HttpClient,
    private navbarColorService: NavbarColorService
  ) {}

  // Közös felhasználói állapot, amelyre a navbar is feliratkozik.
  private currentUserSubject = new BehaviorSubject<any>(null);

  readonly currentUser$ = this.currentUserSubject.asObservable();

  getCaptcha(): Observable<{
    pairs: string[];
    firstPosition: number;
    secondPosition: number;
    instruction: string;
  }> {
    return this.http.get<{
      pairs: string[];
      firstPosition: number;
      secondPosition: number;
      instruction: string;
    }>(`${this.apiUrl}/captcha`, { withCredentials: true });
  }

  getRegisterCaptcha(): Observable<{
    emojis: string[];
    instruction: string;
  }> {
    return this.http.get<{
      emojis: string[];
      instruction: string;
    }>(`${this.apiUrl}/register-captcha`, { withCredentials: true });
  }

  getContactCaptcha(): Observable<{
    choices: string[];
    rows: string[];
  }> {
    return this.http.get<{
      choices: string[];
      rows: string[];
    }>(`${this.apiUrl}/contact-captcha`, { withCredentials: true });
  }

  login(request: LoginRequestModel): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>(`${this.apiUrl}/login`, request, { withCredentials: true });
  }

  register(request: RegistrationRequestModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, request, { withCredentials: true });
  }

  verifyCode(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, payload, { responseType: 'text' });
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.apiUrl}/me`, { withCredentials: true });
  }

  updatePreferredWeatherCity(city: string): Observable<CurrentUser> {
    return this.http.put<CurrentUser>(
      `${this.apiUrl}/settings/weather-city`,
      { city },
      { withCredentials: true }
    );
  }

  updateShowEmailInNavbar(showEmailInNavbar: boolean): Observable<CurrentUser> {
    return this.http.put<CurrentUser>(
      `${this.apiUrl}/settings/navbar-email`,
      { showEmailInNavbar },
      { withCredentials: true }
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  deleteAccount(code: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete`, {
      body: { code },
      responseType: 'text', // ha szöveget vársz vissza
      withCredentials: true
    });
  }

  getAccountDeletionCode(): Observable<{ code: string }> {
    return this.http.get<{ code: string }>(
      `${this.apiUrl}/profile/delete-code`,
      { withCredentials: true }
    );
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  clearSession(): void {
    this.navbarColorService.setUser(null);
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('accountId');
    this.loggedInUser = undefined;
    this.currentUserSubject.next(null);
  }

  setUser(user: any) {
    this.navbarColorService.setUser(user?.id ?? null);
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
    captchaFirst: string,
    captchaSecond: string
  ): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>(
      `${this.apiUrl}/login-with-temporary-code`,
      { email, code, captchaFirst, captchaSecond },
      { withCredentials: true }
    );
  }


  // Profilnév módosítása
  updateProfileName(name: string) {
    return this.http.put<CurrentUser>(
      `${this.apiUrl}/profile/name`,
      { name },
      { withCredentials: true }
    );
  }

  // E-mail-cím módosítása
  updateProfileEmail(newEmail: string) {
    return this.http.put<CurrentUser>(
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

  requestProfilePasswordResetCode(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/profile/password-reset-code`,
      { email },
      { withCredentials: true }
    );
  }

  resetProfilePassword(
    email: string,
    code: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/profile/password-reset`,
      { email, code, newPassword, confirmPassword },
      { withCredentials: true }
    );
  }


}
