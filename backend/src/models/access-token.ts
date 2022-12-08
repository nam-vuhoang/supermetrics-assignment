export class AccessToken {
  client_id: string;
  email: string;
  sl_token: string;

  getToken(): string {
    return this.sl_token;
  }
}

