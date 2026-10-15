export interface LoginResponseModel {

  id: number;
  name: string;
  email: string;
  token?: string; // ha később JWT token is lesz, opcionális
  accountId: number;
}
