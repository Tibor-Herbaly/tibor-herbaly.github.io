import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface ProfileUser {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  user: ProfileUser | null = null;

  newName = '';
  newEmail = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  resetEmail = '';
  resetCode = '';
  resetNewPassword = '';
  resetConfirmPassword = '';
  passwordResetCodeSent = false;
  accountDeletionCode = '';

  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  // A tényleges, szerveren tárolt profil lekérése
  loadProfile(): void {
    this.loading = true;
    this.clearMessages();

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.newName = user.name;
        this.newEmail = user.email;
        this.resetEmail = user.email;

        this.authService.setUser(user);
        this.authService.getAccountDeletionCode().subscribe({
          next: ({ code }) => {
            this.accountDeletionCode = code;
            this.loading = false;
          },
          error: (err) => this.handleError(
            err,
            'Nem sikerült betölteni a fióktörlési kódot.'
          )
        });
      },
      error: (err) => {
        this.loading = false;

        if (err.status === 401) {
          this.errorMessage =
            'A profil megtekintéséhez be kell jelentkezned.';
          this.router.navigate(['/login']);
        } else {
          this.errorMessage =
            'Nem sikerült betölteni a profilodat.';
        }
      }
    });
  }

  // Profilnév módosítása
  updateName(): void {
    this.clearMessages();

    if (!this.newName.trim()) {
      this.errorMessage = 'A név nem lehet üres!';
      return;
    }

    this.loading = true;

    this.authService.updateProfileName(this.newName.trim()).subscribe({
      next: (user) => {
        this.user = user;
        this.newName = user.name;
        this.authService.setUser(user);

        this.successMessage = 'A profilnév sikeresen módosult!';
        this.loading = false;
      },
      error: (err) => this.handleError(err, 'Nem sikerült módosítani a nevet.')
    });
  }

  // E-mail-cím módosítása
  updateEmail(): void {
    this.clearMessages();

    if (!this.newEmail.trim()) {
      this.errorMessage = 'Az e-mail-cím megadása kötelező!';
      return;
    }

    this.loading = true;

    this.authService.updateProfileEmail(this.newEmail.trim()).subscribe({
      next: (user) => {
        this.user = user;
        this.newName = user.name;
        this.newEmail = user.email;
        this.authService.setUser(user);

        this.successMessage = 'Az e-mail-cím sikeresen módosult!';
        this.loading = false;
      },
      error: (err) => this.handleError(
        err,
        'Nem sikerült módosítani az e-mail-címet.'
      )
    });
  }

  // Jelszó módosítása
  updatePassword(): void {
    this.clearMessages();

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Minden jelszómezőt ki kell tölteni!';
      return;
    }

    if (this.newPassword.length < 8) {
      this.errorMessage = 'Az új jelszó legalább 8 karakter legyen!';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Az új jelszavak nem egyeznek!';
      return;
    }

    this.loading = true;

    this.authService.updateProfilePassword(
      this.currentPassword,
      this.newPassword
    ).subscribe({
      next: () => {
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

        this.successMessage = 'A jelszó sikeresen módosult!';
        this.loading = false;
      },
      error: (err) => this.handleError(
        err,
        'Nem sikerült módosítani a jelszót.'
      )
    });
  }

  requestPasswordResetCode(): void {
    this.clearMessages();
    this.passwordResetCodeSent = false;

    if (!this.user || this.resetEmail !== this.user.email) {
      this.errorMessage = 'Csak a fiókodhoz tartozó e-mail-cím használható.';
      return;
    }

    this.loading = true;
    this.authService.requestProfilePasswordResetCode(this.resetEmail).subscribe({
      next: () => {
        this.passwordResetCodeSent = true;
        this.resetCode = '';
        this.resetNewPassword = '';
        this.resetConfirmPassword = '';
        this.successMessage = 'A jelszó-visszaállító kódot elküldtük az e-mail-címedre.';
        this.loading = false;
      },
      error: (err) => this.handleError(
        err,
        'Nem sikerült elküldeni a jelszó-visszaállító kódot.'
      )
    });
  }

  resetPassword(): void {
    this.clearMessages();

    if (!this.user || this.resetEmail !== this.user.email) {
      this.errorMessage = 'Csak a fiókodhoz tartozó e-mail-cím használható.';
      return;
    }

    if (!/^\d{10}$/.test(this.resetCode)) {
      this.errorMessage = 'A kód pontosan 10 számjegyből álljon.';
      return;
    }

    if (this.resetNewPassword.length < 8) {
      this.errorMessage = 'Az új jelszó legalább 8 karakter legyen!';
      return;
    }

    if (this.resetNewPassword !== this.resetConfirmPassword) {
      this.errorMessage = 'Az új jelszavak nem egyeznek!';
      return;
    }

    this.loading = true;
    this.authService.resetProfilePassword(
      this.resetEmail,
      this.resetCode,
      this.resetNewPassword,
      this.resetConfirmPassword
    ).subscribe({
      next: () => {
        this.resetCode = '';
        this.resetNewPassword = '';
        this.resetConfirmPassword = '';
        this.passwordResetCodeSent = false;
        this.successMessage = 'A jelszó sikeresen megváltozott!';
        this.loading = false;
      },
      error: (err) => this.handleError(
        err,
        'Nem sikerült megváltoztatni a jelszót.'
      )
    });
  }

  private handleError(err: any, fallback: string): void {
    this.loading = false;

    const message = err?.error?.message;

    const messages: Record<string, string> = {
      INVALID_NAME: 'A megadott név nem megfelelő.',
      INVALID_EMAIL: 'Érvénytelen e-mail-cím.',
      EMAIL_ALREADY_EXISTS: 'Ez az e-mail-cím már használatban van.',
      CURRENT_PASSWORD_INCORRECT: 'A jelenlegi jelszó hibás.',
      PASSWORD_TOO_SHORT: 'Az új jelszó legalább 8 karakter legyen.',
      PASSWORD_UNCHANGED: 'Az új jelszó nem egyezhet meg a régivel.',
      INVALID_PASSWORD: 'Ellenőrizd a megadott jelszavakat.',
      NOT_LOGGED_IN: 'Lejárt a bejelentkezésed. Jelentkezz be újra.',
      INVALID_RESET_CODE: 'A megadott kód hibás, lejárt vagy már felhasználtad.',
      RESET_CODE_EXPIRED: 'A kód lejárt. Kérj egy új jelszó-visszaállító kódot.',
      EMAIL_SEND_FAILED: 'Nem sikerült elküldeni az e-mailt. Próbáld meg később.',
      ACCOUNT_EMAIL_MISMATCH: 'Csak a fiókodhoz tartozó e-mail-cím használható.'
    };

    this.errorMessage = messages[message] || fallback;
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
