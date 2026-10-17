import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdminUser } from '../../../models/admin-user';
import { AdminDonationSummary } from '../../../models/donation-response';
import { AdminTibberService } from '../../../services/admin-tibber.service';

type AdminSection = 'tibber-admin' | 'donations' | 'users';

@Component({
  selector: 'app-admin-tibber.component',
  standalone: false,
  templateUrl: './admin-tibber.component.html',
  styleUrl: './admin-tibber.component.css'
})
export class AdminTibberComponent implements OnInit {
  private readonly apiUrl = 'http://localhost:8080/api/admin-tibber';

  step: 1 | 2 = 1;
  name = '';
  firstPassword = '';
  secondPassword = '';
  authenticated = false;
  activeSection: AdminSection | null = null;
  selectedSection: AdminSection | null = null;
  sectionPassword = '';
  sessionReady = false;
  submitting = false;
  announcementLoading = false;
  announcement = '';
  announcementSaved = false;
  errorMessage = '';
  donations: AdminDonationSummary = { total: 0, donations: [] };
  donationsLoading = false;
  donationsError = '';
  users: AdminUser[] = [];
  usersLoading = false;
  usersError = '';

  constructor(
    private readonly http: HttpClient,
    private readonly adminTibberService: AdminTibberService
  ) {}

  ngOnInit(): void {
    this.http.get<{ authenticated: boolean; activeSection: AdminSection | null }>(
      `${this.apiUrl}/session`,
      { withCredentials: true }
    )
      .subscribe({
        next: ({ authenticated, activeSection }) => {
          this.authenticated = authenticated;
          if (authenticated) {
            this.activeSection = activeSection;
            this.loadActiveSection();
          }
        },
        error: () => this.errorMessage = 'Az adminisztrációs felület állapota nem ellenőrizhető.'
      })
      .add(() => this.sessionReady = true);
  }

  verifyFirstStep(): void {
    this.submitting = true;
    this.errorMessage = '';
    this.http.post(`${this.apiUrl}/step-one`, {
      name: this.name,
      password: this.firstPassword
    }, { withCredentials: true }).subscribe({
      next: () => {
        this.firstPassword = '';
        this.step = 2;
        this.submitting = false;
      },
      error: () => {
        this.errorMessage = 'A név vagy az első jelszó hibás.';
        this.submitting = false;
      }
    });
  }

  verifySecondStep(): void {
    this.submitting = true;
    this.errorMessage = '';
    this.http.post(`${this.apiUrl}/step-two`, {
      password: this.secondPassword
    }, { withCredentials: true }).subscribe({
      next: () => {
        this.secondPassword = '';
        this.authenticated = true;
        this.submitting = false;
        this.activeSection = null;
      },
      error: () => {
        this.errorMessage = 'A második jelszó hibás, vagy az első lépést újra el kell végezni.';
        this.submitting = false;
      }
    });
  }

  publishAnnouncement(): void {
    this.submitting = true;
    this.errorMessage = '';
    this.announcementSaved = false;
    this.http.put<{ message: string }>(`${this.apiUrl}/announcement`, {
      message: this.announcement
    }, { withCredentials: true }).subscribe({
      next: ({ message }) => {
        this.announcement = message;
        this.announcementSaved = true;
        this.submitting = false;
      },
      error: () => {
        this.errorMessage = 'Az információ publikálása nem sikerült.';
        this.submitting = false;
      }
    });
  }

  logout(): void {
    this.submitting = true;
    this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true,
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.authenticated = false;
        this.step = 1;
        this.name = '';
        this.activeSection = null;
        this.selectedSection = null;
        this.sectionPassword = '';
        this.announcementSaved = false;
        this.donations = { total: 0, donations: [] };
        this.donationsError = '';
        this.users = [];
        this.usersError = '';
        this.submitting = false;
      },
      error: () => {
        this.errorMessage = 'Az adminisztrátori kijelentkezés nem sikerült.';
        this.submitting = false;
      }
    });
  }

  selectSection(section: AdminSection): void {
    this.selectedSection = section;
    this.sectionPassword = '';
    this.errorMessage = '';
  }

  verifySectionPassword(): void {
    if (!this.selectedSection) {
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.http.post(`${this.apiUrl}/section/${this.selectedSection}/verify`, {
      password: this.sectionPassword
    }, { withCredentials: true }).subscribe({
      next: () => {
        this.activeSection = this.selectedSection;
        this.selectedSection = null;
        this.sectionPassword = '';
        this.submitting = false;
        this.loadActiveSection();
      },
      error: () => {
        this.errorMessage = 'A szekció jelszava hibás, vagy az adminisztrátori belépés lejárt.';
        this.submitting = false;
      }
    });
  }

  returnToSections(): void {
    this.submitting = true;
    this.errorMessage = '';
    this.http.post<void>(`${this.apiUrl}/section/lock`, {}, {
      withCredentials: true
    }).subscribe({
      next: () => {
        this.activeSection = null;
        this.announcement = '';
        this.donations = { total: 0, donations: [] };
        this.users = [];
        this.submitting = false;
      },
      error: () => {
        this.errorMessage = 'A szekció bezárása nem sikerült.';
        this.submitting = false;
      }
    });
  }

  private loadAnnouncement(): void {
    this.announcementLoading = true;
    this.http.get<{ message: string }>(`${this.apiUrl}/announcement`, {
      withCredentials: true
    }).subscribe({
      next: ({ message }) => {
        this.announcement = message;
        this.announcementLoading = false;
      },
      error: () => {
        this.errorMessage = 'A korábban mentett információ nem tölthető be.';
        this.announcementLoading = false;
      }
    });
  }

  loadDonations(): void {
    this.donationsLoading = true;
    this.donationsError = '';
    this.adminTibberService.getDonations().subscribe({
      next: donations => {
        this.donations = donations;
        this.donationsLoading = false;
      },
      error: () => {
        this.donationsError = 'Az adományok betöltése nem sikerült.';
        this.donationsLoading = false;
      }
    });
  }

  loadUsers(): void {
    this.usersLoading = true;
    this.usersError = '';
    this.adminTibberService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.usersLoading = false;
      },
      error: () => {
        this.usersError = 'A felhasználók betöltése nem sikerült.';
        this.usersLoading = false;
      }
    });
  }

  private loadActiveSection(): void {
    switch (this.activeSection) {
      case 'tibber-admin':
        this.loadAnnouncement();
        break;
      case 'donations':
        this.loadDonations();
        break;
      case 'users':
        this.loadUsers();
        break;
    }
  }
}
