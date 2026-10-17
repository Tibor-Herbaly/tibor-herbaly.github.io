export interface DonationResponseModel {

  amount: number;
  date: string;
}

export interface DonationSummary {
  total: number;
  donations: DonationResponseModel[];
}

export interface AdminDonationResponse {
  amount: number;
  date: string;
  donorName: string;
}

export interface AdminDonationSummary {
  total: number;
  donations: AdminDonationResponse[];
}
