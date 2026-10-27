import { Component, OnInit } from '@angular/core';
import {RegistrationRequestModel} from '../../models/register-login/registration-request.model';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-register.', // .component nélkül legyen !
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  email = '';
  name = '';
  password = '';
  confirmPassword = '';
  showConfirmPassword = false;
  verificationCode = '';
  successMessage = '';
  errorMessage = '';
  verificationPhase = false; // Kódmező láthatósága
  wrongAttempts = 0;
  maxAttempts = 3;
  showPassword = false; // Jelszó láthatóság állapota, most nem működik.
  captchaPairs: string[] = [];
  captchaInstruction = '';
  captchaFirst = '';
  captchaSecond = '';
  captchaLoading = false;
  captchaLoaded = false;

  constructor(private auth: AuthService) {
  }

  ngOnInit(): void {
    this.loadRegisterCaptcha();
  }

  loadRegisterCaptcha(): void {
    this.captchaLoading = true;
    this.captchaLoaded = false;
    this.auth.getRegisterCaptcha().subscribe({
      next: captcha => {
        this.captchaPairs = captcha.pairs;
        this.captchaInstruction = captcha.instruction;
        this.captchaFirst = '';
        this.captchaSecond = '';
        this.captchaLoaded = true;
        this.captchaLoading = false;
      },
      error: () => {
        this.errorMessage = 'Nem sikerült betölteni a CAPTCHA-t. Próbáld újra.';
        this.captchaLoading = false;
      }
    });
  }

  togglePasswordVisibility() { // Jelszó láthatóság váltása
    this.showPassword = !this.showPassword;
  }

  /** ✅ Jelszó erősség ellenőrzés */
  isPasswordStrong(): boolean {
    const hasLetter = /[A-Za-z]/.test(this.password);
    const hasNumber = /[0-9]/.test(this.password);
    const longEnough = this.password.length >= 4;
    return hasLetter && hasNumber && longEnough;
  }

  // A két jelszó egyezik-e?
  passwordsMatch(): boolean {
    return this.password !== '' &&
      this.confirmPassword !== '' &&
      this.password === this.confirmPassword;
  }

  onRegister() {
    if (!this.isPasswordStrong()) {
      // A két jelszó ellenőrzése
      if (!this.passwordsMatch()) {
        this.errorMessage = 'A két jelszó nem egyezik!';
        this.successMessage = '';
        return;
      }
      this.errorMessage = 'A jelszó nem elég erős!';
      this.successMessage = '';
      return;
    }

    const request: RegistrationRequestModel = {
      email: this.email,
      name: this.name,
      password: this.password,
      confirmPassword: this.confirmPassword,
      captchaFirst: this.captchaFirst,
      captchaSecond: this.captchaSecond
    };

    this.auth.register(request).subscribe({
      next: res => {
        console.log('Backend válasz:', res);
        this.successMessage = 'Ellenőrizd az e-mail fiókodat — regisztrációs kódot küldtünk!';
        this.errorMessage = '';
        this.verificationPhase = true;
      },

      error: err => {
        console.error('Hiba:', err);

        const message = err.error?.message || '';

        if (
          err.status === 409 ||
          message.toLowerCase().includes('already exists') ||
          message.toLowerCase().includes('már regisztrálva') ||
          message.toLowerCase().includes('már létezik')
        ) {
          this.errorMessage =
            'Ez az e-mail-cím már regisztrálva van ! Kérlek, használj másik címet, vagy jelentkezz be.';
        } else {
          this.errorMessage = message === 'INVALID_REGISTER_CAPTCHA'
            ? 'A CAPTCHA-válasz nem megfelelő. Próbáld újra.'
            : message === 'PASSWORDS_DO_NOT_MATCH'
              ? 'A két jelszó nem egyezik!'
            : message || 'Hiba a regisztráció során...';
        }

        this.successMessage = '';
        this.loadRegisterCaptcha();
      }

    });
  }

  onVerifyCode() {
    this.auth.verifyCode({
      email: this.email,
      code: this.verificationCode,
      name: this.name,
      password: this.password
    }).subscribe({
      next: () => {
        this.successMessage = 'Sikeres ellenőrzés! Üdvözlő e-mail hamarosan érkezik.';
        this.errorMessage = '';
        this.verificationPhase = false;
        this.wrongAttempts = 0;
        this.email = this.name = this.password = this.verificationCode = '';
        this.email = this.name = this.password =
          this.confirmPassword = this.verificationCode = '';
      },
      error: err => {
        this.wrongAttempts++;
        const remaining = this.maxAttempts - this.wrongAttempts;

        if (remaining <= 0) {
          this.errorMessage = 'Túl sok sikertelen próbálkozás. A regisztráció zárolva.';
          this.verificationPhase = false;
        } else {
          this.errorMessage =
            (err.error?.message || 'Hibás kód.') +
            ` Még ${remaining} próbálkozásod van.`;
        }

        this.successMessage = '';
      }
    });
  }

}
