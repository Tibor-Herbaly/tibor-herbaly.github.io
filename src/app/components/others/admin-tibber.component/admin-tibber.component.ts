import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  SecurityContext,
  ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AdminUser } from '../../../models/admin-user';
import { AdminDonationSummary } from '../../../models/donation-response';
import { Writing, WritingRequest, WritingSummary } from '../../../models/writing';
import { AdminTibberService } from '../../../services/admin-tibber.service';
import { WritingService } from '../../../services/writing.service';

type AdminSection = 'tibber-admin' | 'donations' | 'users' | 'writings';

@Component({
  selector: 'app-admin-tibber.component',
  standalone: false,
  templateUrl: './admin-tibber.component.html',
  styleUrl: './admin-tibber.component.css'
})
export class AdminTibberComponent implements OnInit {
  private readonly apiUrl = 'http://localhost:8080/api/admin-tibber';

  private writingEditor?: ElementRef<HTMLElement>;

  @ViewChild('writingEditor')
  set writingEditorElement(element: ElementRef<HTMLElement> | undefined) {
    this.writingEditor = element;
    if (element) {
      this.setWritingEditorContent(this.writingContent);
    }
  }

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
  writings: WritingSummary[] = [];
  writingsLoading = false;
  writingsError = '';
  editingWriting: Writing | null = null;
  writingEditorOpen = false;
  writingTitle = '';
  writingDate = this.today();
  writingExcerpt = '';
  writingCoverImage = '';
  writingContent = '';
  writingSaving = false;
  writingSaved = false;

  constructor(
    private readonly http: HttpClient,
    private readonly adminTibberService: AdminTibberService,
    private readonly writingService: WritingService,
    private readonly sanitizer: DomSanitizer
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
        this.writings = [];
        this.editingWriting = null;
        this.writingEditorOpen = false;
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
        this.writings = [];
        this.editingWriting = null;
        this.writingEditorOpen = false;
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

  loadWritings(): void {
    this.writingsLoading = true;
    this.writingsError = '';
    this.writingService.getAdminWritings().subscribe({
      next: writings => {
        this.writings = writings;
        this.writingsLoading = false;
      },
      error: () => {
        this.writingsError = 'Az írások betöltése nem sikerült.';
        this.writingsLoading = false;
      }
    });
  }

  createWriting(): void {
    this.editingWriting = null;
    this.writingEditorOpen = true;
    this.writingTitle = '';
    this.writingDate = this.today();
    this.writingExcerpt = '';
    this.writingCoverImage = '';
    this.writingContent = '';
    this.writingSaved = false;
    this.writingsError = '';
  }

  editWriting(summary: WritingSummary): void {
    this.writingEditorOpen = true;
    this.writingsError = '';
    this.writingSaved = false;
    this.writingsLoading = true;
    this.writingService.getWriting(summary.id).subscribe({
      next: writing => {
        this.editingWriting = writing;
        this.writingTitle = writing.title;
        this.writingDate = writing.publishedDate;
        this.writingExcerpt = writing.excerpt;
        this.writingCoverImage = writing.coverImage ?? '';
        this.writingContent = writing.contentHtml;
        if (this.writingEditor) {
          this.setWritingEditorContent(writing.contentHtml);
        }
        this.writingsLoading = false;
      },
      error: () => {
        this.writingsError = 'A kiválasztott írás betöltése nem sikerült.';
        this.writingsLoading = false;
      }
    });
  }

  updateWritingContent(event: Event): void {
    this.writingContent = (event.currentTarget as HTMLElement).innerHTML;
    this.writingSaved = false;
  }

  handleWritingPaste(event: ClipboardEvent): void {
    const clipboard = event.clipboardData;
    const imageFiles = clipboard
      ? Array.from(clipboard.items)
          .filter(item => item.type.startsWith('image/'))
          .map(item => item.getAsFile())
          .filter((file): file is File => file !== null)
      : [];
    if (imageFiles.length === 0 || !this.writingEditor) {
      return;
    }

    event.preventDefault();
    const pastedContent = document.createElement('div');
    const pastedHtml = clipboard?.getData('text/html') ?? '';
    pastedContent.innerHTML =
      this.sanitizer.sanitize(SecurityContext.HTML, pastedHtml) ?? '';
    if (!pastedContent.hasChildNodes()) {
      pastedContent.textContent = clipboard?.getData('text/plain') ?? '';
    }

    let pastedImages = Array.from(pastedContent.querySelectorAll('img'));
    while (pastedImages.length < imageFiles.length) {
      const image = document.createElement('img');
      pastedContent.appendChild(image);
      pastedImages.push(image);
    }

    const editor = this.writingEditor.nativeElement;
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
    const insertionRange = range && editor.contains(range.commonAncestorContainer)
      ? range
      : document.createRange();
    if (!range || !editor.contains(range.commonAncestorContainer)) {
      insertionRange.selectNodeContents(editor);
      insertionRange.collapse(false);
    }

    insertionRange.deleteContents();
    const fragment = document.createDocumentFragment();
    while (pastedContent.firstChild) {
      fragment.appendChild(pastedContent.firstChild);
    }
    insertionRange.insertNode(fragment);
    insertionRange.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(insertionRange);
    this.writingContent = editor.innerHTML;
    this.writingSaved = false;

    imageFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== 'string') {
          this.writingsError = 'A beillesztett kép feldolgozása nem sikerült.';
          return;
        }
        pastedImages[index].src = reader.result;
        this.writingContent = editor.innerHTML;
      };
      reader.onerror = () => {
        this.writingsError = 'A beillesztett kép feldolgozása nem sikerült.';
      };
      reader.readAsDataURL(file);
    });
  }

  saveWriting(): void {
    const request: WritingRequest = {
      title: this.writingTitle,
      publishedDate: this.writingDate,
      excerpt: this.writingExcerpt,
      coverImage: this.writingCoverImage,
      contentHtml: this.writingContent
    };
    this.writingSaving = true;
    this.writingsError = '';
    this.writingSaved = false;
    const save = this.editingWriting
      ? this.writingService.updateWriting(this.editingWriting.id, request)
      : this.writingService.createWriting(request);
    save.subscribe({
      next: writing => {
        this.editingWriting = writing;
        this.writingTitle = writing.title;
        this.writingDate = writing.publishedDate;
        this.writingExcerpt = writing.excerpt;
        this.writingCoverImage = writing.coverImage ?? '';
        this.writingContent = writing.contentHtml;
        this.writingSaved = true;
        this.writingSaving = false;
        this.loadWritings();
      },
      error: () => {
        this.writingsError = 'Az írás mentése nem sikerült.';
        this.writingSaving = false;
      }
    });
  }

  cancelWritingEdit(): void {
    this.editingWriting = null;
    this.writingEditorOpen = false;
    this.writingSaved = false;
    this.writingsError = '';
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
      case 'writings':
        this.loadWritings();
        break;
    }
  }

  private today(): string {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
      .toISOString()
      .slice(0, 10);
  }

  private setWritingEditorContent(content: string): void {
    if (this.writingEditor) {
      this.writingEditor.nativeElement.innerHTML =
        this.sanitizer.sanitize(SecurityContext.HTML, content) ?? '';
    }
  }
}
