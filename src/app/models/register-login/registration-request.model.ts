export interface RegistrationRequestModel {

  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  captchaSelected: number[];
}
