import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';

interface ContactCaptcha {
  pairs: string[];
  firstPosition: number;
  secondPosition: number;
  instruction: string;
}

@Component({
  selector: 'app-contact.component',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  form = { name: '', email: '', subject: '', phone: '', message: '' };
  statusMessage = '';
  statusColor = 'black';
  captchaPairs: string[] = [];
  captchaInstruction = '';
  captchaFirst = '';
  captchaSecond = '';
  captchaLoading = false;
  captchaLoaded = false;

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadCaptcha();
  }

  loadCaptcha(): void {
    this.captchaLoading = true;
    this.captchaLoaded = false;
    this.auth.getContactCaptcha().subscribe({
      next: (captcha: ContactCaptcha) => {
        this.captchaPairs = captcha.pairs;
        this.captchaInstruction = captcha.instruction;
        this.captchaFirst = '';
        this.captchaSecond = '';
        this.captchaLoaded = true;
        this.captchaLoading = false;
      },
      error: () => {
        this.captchaLoading = false;
        this.statusMessage = 'Nem sikerült betölteni a captchát. Kérlek, próbáld újra.';
        this.statusColor = 'red';
      }
    });
  }

  onSubmit() {
    if (!this.form.name || !this.form.email || !this.form.subject || !this.form.message) {
      this.statusMessage = "Kérlek, tölts ki minden kötelező mezőt!";
      this.statusColor = "red";
      this.hideStatusAfterDelay();
      return;
    }

    this.http.post<any>('http://localhost:8080/api/contact', {
      ...this.form,
      captchaFirst: this.captchaFirst,
      captchaSecond: this.captchaSecond
    }, { withCredentials: true }).subscribe({
      next: (response) => {
        this.statusMessage = response.message;
        this.statusColor = "green";
        this.form = { name: '', email: '', subject: '', phone: '', message: '' }; // ürítjük
        this.loadCaptcha();
        this.hideStatusAfterDelay();
      },
      error: (err) => {
        this.statusMessage = err.error?.message === 'INVALID_CONTACT_CAPTCHA'
          ? 'A captcha megoldása nem megfelelő vagy lejárt. Új feladatot kaptál; az űrlap tartalma megmaradt.'
          : err.error?.message || "Hiba történt az üzenet küldése során!";
        this.statusColor = "red";
        this.loadCaptcha();
        this.hideStatusAfterDelay();
      }
    });
  }

  private hideStatusAfterDelay() {
    setTimeout(() => {
      this.statusMessage = '';
    }, 3000);
  }

}
