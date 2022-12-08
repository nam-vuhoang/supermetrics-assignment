import { RESTDataSource } from "@apollo/datasource-rest";

interface ClientToken {
  client_id: string;
  email: string;
  sl_token: string;
}

export class AuthenticationService extends RESTDataSource {
  override baseURL = "https://api.supermetrics.com/assignment";

  async getToken(): Promise<string> {
    return this.post<ClientToken>("register", {
      body: {
        client_id: "ju16a6m81mhid5ue1z3v2g0uh",
        email: "nam.vuhoang@gmail.com",
        name: "Nam Vu",
      },
    }).then((clientToken) => clientToken.sl_token);
  }
}
