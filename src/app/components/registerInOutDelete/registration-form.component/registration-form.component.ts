import { Component } from '@angular/core';
import {RegistrationRequestModel} from '../../../models/registration-request.model';
import {HttpClient} from '@angular/common/http';
import {RegistrationResponseModel} from '../../../models/registration-response.model';

@Component({
  selector: 'app-register.component',
  standalone: false,
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.css'
})
export class RegistrationFormComponent {

  registrationData: RegistrationRequestModel = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post<RegistrationResponseModel>("http://localhost:8080/api/auth/register", this.registrationData)
      .subscribe({
        next: (res) => {
          alert("Sikeres regisztráció! Üdv, " + res.name);
        },
        error: (err) => {
          alert("Hiba történt: " + err.status);
        }
      });
  }


}
