export interface AdminUser {
  id: number;
  name: string;
  email: string;
  preferredWeatherCity: string | null;
  showEmailInNavbar: boolean;
}
