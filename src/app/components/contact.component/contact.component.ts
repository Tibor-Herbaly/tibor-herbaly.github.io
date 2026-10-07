import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-contact.component',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  form = { name: '', email: '', subject: '', phone: '', message: '' };
  statusMessage = '';
  statusColor = 'black';

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (!this.form.name || !this.form.email || !this.form.message) {
      this.statusMessage = "Kérlek, tölts ki minden kötelező mezőt!";
      this.statusColor = "red";
      this.hideStatusAfterDelay();
      return;
    }

    this.http.post<any>('http://localhost:8080/api/contact', this.form).subscribe({
      next: (response) => {
        this.statusMessage = response.message;
        this.statusColor = "green";
        this.form = { name: '', email: '', subject: '', phone: '', message: '' }; // ürítjük
        this.hideStatusAfterDelay();
      },
      error: (err) => {
        this.statusMessage = err.error?.message || "Hiba történt az üzenet küldése során!";
        this.statusColor = "red";
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
