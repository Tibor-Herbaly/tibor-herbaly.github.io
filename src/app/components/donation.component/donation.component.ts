import {Component, OnInit} from '@angular/core';
import {DonationSummary} from '../../models/donation-response';
import {DonationService} from '../../services/donation.service';
import {DonationRequestModel} from '../../models/donation-request';

@Component({
  selector: 'app-donation.component',
  standalone: false,
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.css'
})
export class DonationComponent implements OnInit {

  name: string = '';
  amount: number | null = null;
  summary: DonationSummary = { total: 0, donations: [] };
  loading = false;

  constructor(private donationService: DonationService) {}

  ngOnInit(): void {
    this.loadDonations();
  }

  loadDonations(): void {
    this.donationService.getDonationsSummary().subscribe({
      next: (data) => this.summary = data,
      error: (err) => console.error('Hiba az adatok betöltésekor:', err)
    });
  }

  donate(): void {
    if (!this.name.trim()) {
      alert('Kérlek, add meg a neved!');
      return;
    }

    if (!this.amount || this.amount < 2200 || this.amount > 18000) {
      alert('Az adomány összege 2200 és 18000 Ft között lehet!');
      return;
    }

    const donation: DonationRequestModel = {
      donorName: this.name.trim(),
      amount: this.amount
    };

    this.loading = true;
    this.donationService.addDonation(donation).subscribe({
      next: () => {
        this.name = '';
        this.amount = null;
        this.loadDonations();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Hiba történt az adomány mentésekor!');
        this.loading = false;
      }
    });
  }
}

