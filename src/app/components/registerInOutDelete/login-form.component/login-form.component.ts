import { Component } from '@angular/core';
import {LoginRequestModel} from '../../../models/login-request.model';
import {LoginResponseModel} from '../../../models/login-response.model';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login-form.component',
  standalone: false,
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {

  loginData: LoginRequestModel = {
    email: '',
    password: ''
  };

  currentUser: LoginResponseModel | null = null; // ide mentjük a backendből jövő adatot

  constructor(private http: HttpClient) {}

  onLogin() {
    this.http.post<LoginResponseModel>("http://localhost:8080/api/auth/login", this.loginData)
      .subscribe({
        next: (res) => {
          this.currentUser = res; // backendből jövő user adat
          // alert-et opcionálisan megtarthatod
          alert("Sikeres belépés! Üdv, " + res.name);

          // pl. localStorage-be is mentheted
          localStorage.setItem('currentUser', JSON.stringify(res));
        },
        error: (err) => {
          alert("Hiba történt: " + err.error);
        }
      });
  }

}
