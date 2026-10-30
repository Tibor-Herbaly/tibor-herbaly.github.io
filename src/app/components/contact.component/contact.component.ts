import { Component, HostListener, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';

interface CaptchaRow {
  id: number;
  emoji: string;
  placedEmoji: string | null;
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
  captchaChoices: string[] = [];
  captchaRows: CaptchaRow[] = [];
  selectedCaptchaEmoji: string | null = null;
  captchaLoading = false;
  captchaLoaded = false;
  private activeCaptchaEmoji: string | null = null;

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadCaptcha();
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

  loadCaptcha(): void {
    this.captchaLoading = true;
    this.captchaLoaded = false;
    this.auth.getContactCaptcha().subscribe({
      next: captcha => {
        this.captchaChoices = captcha.choices;
        this.captchaRows = captcha.rows.map((emoji, id) => ({
          id,
          emoji,
          placedEmoji: null
        }));
        this.selectedCaptchaEmoji = null;
        this.activeCaptchaEmoji = null;
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
      captchaAnswers: this.captchaRows.map(row => row.placedEmoji)
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

  private placeCaptchaEmoji(row: CaptchaRow): void {
    const emoji = this.activeCaptchaEmoji ?? this.selectedCaptchaEmoji;
    if (!emoji) {
      return;
    }

    row.placedEmoji = emoji;
    this.selectedCaptchaEmoji = null;
    this.activeCaptchaEmoji = null;
  }

  private hideStatusAfterDelay() {
    setTimeout(() => {
      this.statusMessage = '';
    }, 3000);
  }

}
