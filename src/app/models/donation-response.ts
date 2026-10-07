export interface DonationResponseModel {

  amount: number;
  date: string;
}

export interface DonationSummary {
  total: number;
  donations: DonationResponseModel[];
}
