import {Component, HostListener, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {LoginRequestModel} from '../../models/register-login/login-request.model';
import {LoginResponseModel} from '../../models/register-login/login-response.model';

interface CaptchaRow {
  id: number;
  emoji: string;
  placedEmoji: string | null;
}

@Component({
  selector: 'app-login-out-delete.component',
  standalone: false,
  templateUrl: './login-out-delete.component.html',
  styleUrls: ['./login-out-delete.component.css']
})
export class LoginOutDeleteComponent implements OnInit {
  email = '';
  password = '';
  captchaChoices: string[] = [];
  captchaRows: CaptchaRow[] = [];
  selectedCaptchaEmoji: string | null = null;
  private activeCaptchaEmoji: string | null = null;
  errorMessage = '';
  logoutMessage = '';
  showPassword = false; // Jelszó láthatóság állapota
  showForgotPassword = false;
  recoveryEmail = '';
  temporaryLoginCode = '';
  codeSent = false;
  recoveryMessage = '';
  recoveryError = '';
  showDeleteCodePrompt = false;
  deleteCode = '';
  deleteError = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadCaptcha();
  }

  loadCaptcha() {
    this.auth.getLoginCaptcha().subscribe({
      next: data => {
        this.captchaChoices = data.choices;
        this.captchaRows = data.rows.map((emoji, id) => ({
          id,
          emoji,
          placedEmoji: null
        }));
        this.selectedCaptchaEmoji = null;
        this.activeCaptchaEmoji = null;
      },
      error: () => {
        this.errorMessage = 'Hiba a CAPTCHA betöltésekor';
      }
    });
  }

  get isCaptchaComplete(): boolean {
    return this.captchaRows.every(row => row.placedEmoji !== null);
  }

  get isCaptchaSolved(): boolean {
    return this.isCaptchaComplete &&
      this.captchaRows.every(row => row.placedEmoji === row.emoji);
  }

  selectCaptchaEmoji(emoji: string): void {
    this.selectedCaptchaEmoji = emoji;
  }

  startCaptchaDrag(event: PointerEvent, emoji: string): void {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) {
      return;
    }

    event.preventDefault();
    this.activeCaptchaEmoji = emoji;
    this.selectedCaptchaEmoji = emoji;
  }

  @HostListener('document:pointerup', ['$event'])
  finishCaptchaDrag(event: PointerEvent): void {
    if (!this.activeCaptchaEmoji) {
      return;
    }

    const target = document.elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>('[data-captcha-row]');
    const rowId = target?.dataset['captchaRow'];
    const row = rowId === undefined
      ? undefined
      : this.captchaRows.find(candidate => candidate.id === Number(rowId));

    if (row) {
      this.placeCaptchaEmoji(row);
    }

    this.activeCaptchaEmoji = null;
  }

  placeSelectedEmoji(row: CaptchaRow): void {
    if (this.selectedCaptchaEmoji) {
      this.placeCaptchaEmoji(row);
    }
  }

  onCaptchaRowKeydown(event: KeyboardEvent, row: CaptchaRow): void {
    if ((event.key === 'Enter' || event.key === ' ') && this.selectedCaptchaEmoji) {
      event.preventDefault();
      this.placeSelectedEmoji(row);
    }
  }

  onLogin() {
    this.errorMessage = '';

    // Ha már kértünk ideiglenes kódot, azzal próbálunk belépni.
    if (this.codeSent) {
      if (!this.temporaryLoginCode.trim()) {
        this.errorMessage = 'Írd be az e-mailben kapott ideiglenes kódot!';
        return;
      }

      this.auth.loginWithTemporaryCode(
        this.recoveryEmail.trim(),
        this.temporaryLoginCode.trim(),
        this.captchaRows.map(row => row.placedEmoji ?? '')
      ).subscribe({
        next: response => this.finishLogin(response),
        error: err => {
          const msg = err?.error?.message;

          if (msg === 'INVALID_CAPTCHA') {
            this.errorMessage = 'Hibás CAPTCHA-válasz!';
          } else if (msg === 'INVALID_TEMPORARY_CODE') {
            this.errorMessage = 'Hibás, lejárt vagy már felhasznált ideiglenes kód!';
          } else {
            this.errorMessage = 'A belépés nem sikerült.';
          }

          this.loadCaptcha();
        }
      });

      return;
    }

    // Hagyományos belépés e-mail-címmel és jelszóval.
    const request: LoginRequestModel = {
      email: this.email,
      password: this.password,
      captchaAnswers: this.captchaRows.map(row => row.placedEmoji ?? '')
    };

    this.auth.login(request).subscribe({
      next: response => this.finishLogin(response),
      error: err => {
        const msg = err?.error?.message;

        if (msg === 'INVALID_EMAIL') {
          this.errorMessage = 'Hibás e-mail cím!';
        } else if (msg === 'INVALID_PASSWORD') {
          this.errorMessage = 'Hibás jelszó!';
        } else if (msg === 'INVALID_CAPTCHA') {
          this.errorMessage = 'Hibás CAPTCHA-válasz!';
        } else {
          this.errorMessage = 'Ismeretlen hiba történt.';
        }

        this.loadCaptcha();
      }
    });
  }

  togglePasswordVisibility() { // Jelszó láthatóság váltása
    this.showPassword = !this.showPassword;
  }

  onLogout() {
    this.auth.logout().subscribe(() => {
      alert(`Sikeres kijelentkezés ${this.userName}, viszont látásra!`);
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      this.router.navigate(['/login']);
    });
  }

  onDeleteAccount() {
    this.deleteError = '';
    if (this.showDeleteCodePrompt) {
      if (!/^[A-Za-z0-9]{6}$/.test(this.deleteCode)) {
        this.deleteError = 'A törlő kód pontosan 6 angol betűből és/vagy számból álljon.';
        return;
      }

      this.auth.deleteAccount(this.deleteCode).subscribe({
        next: () => {
          alert(`A fiók sikeresen törölve lett. ${this.userName} Viszont látásra!`);
          this.auth.clearSession();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          if (err.status === 400) {
            this.deleteError = 'Hibás törlő kód. Ellenőrizd a Profilom oldalon.';
          } else if (err.status === 401) {
            this.deleteError = 'Nem vagy bejelentkezve, ezért nem törölhető a fiók.';
          } else if (err.status === 404) {
            this.deleteError = 'Nem található a felhasználó.';
          } else {
            this.deleteError = 'Hiba történt a törlés során.';
          }
        }
      });
      return;
    }

    if (confirm(`Biztosan törölni szeretnéd a fiókodat "${this.userName}"? \n
    Először egy törlő kódot kell megadnod a Profilom oldalról. Végleges törlés esetén.`)) {
      this.deleteCode = '';
      this.showDeleteCodePrompt = true;
    }
  }

  get userName(): string | null {
    return this.auth.getUserName();
  }

  private finishLogin(response: LoginResponseModel) {
    localStorage.setItem('userName', response.name);
    localStorage.setItem('userEmail', response.email);
    localStorage.setItem('userId', String(response.id));

    if (response.accountId !== undefined && response.accountId !== null) {
      localStorage.setItem('accountId', String(response.accountId));
    }

    this.auth.setUser(response);
    this.errorMessage = '';

    // A belépési kód mezőinek ürítése.
    this.temporaryLoginCode = '';
    this.codeSent = false;
    this.recoveryMessage = '';

    alert(`Sikeres belépés: ${response.name}`);
    this.router.navigate(['/account-balance']);
  }

  requestLoginCode() {
    this.recoveryMessage = '';
    this.recoveryError = '';

    const email = this.recoveryEmail.trim();

    if (!email) {
      this.recoveryError = 'Add meg a regisztrációkor használt e-mail-címedet!';
      return;
    }

    this.auth.requestTemporaryLoginCode(email).subscribe({
      next: () => {
        this.recoveryEmail = email;
        this.email = email;
        this.codeSent = true;
        this.temporaryLoginCode = '';

        this.recoveryMessage =
          'Az ellenőrző e-mailt elküldtük a megadott e-mail-címre. A kód 3 percig érvényes.';

        this.loadCaptcha();
      },
      error: err => {
        const msg = err?.error?.message;

        if (msg === 'INVALID_EMAIL') {
          this.recoveryError =
            'Ez az e-mail-cím nem egyezik egy regisztrált címmel. Nem küldtünk kódot.';
        } else if (msg === 'EMAIL_SEND_FAILED') {
          this.recoveryError =
            'Az e-mail küldése nem sikerült. Próbáld meg később!';
        } else {
          this.recoveryError = 'Hiba történt a kód kérésekor.';
        }
      }
    });
  }

  private placeCaptchaEmoji(row: CaptchaRow): void {
    const emoji = this.activeCaptchaEmoji ?? this.selectedCaptchaEmoji;
    if (!emoji) {
      return;
    }

    row.placedEmoji = emoji;
    this.selectedCaptchaEmoji = null;
    this.activeCaptchaEmoji = null;
  }

}
