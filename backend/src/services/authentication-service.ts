import { RESTDataSource } from "@apollo/datasource-rest";
import { AccessToken } from "../models/access-token";

export class AuthenticationService extends RESTDataSource {
  constructor(public baseURL: string) {
    super();
    this.memoizeGetRequests = false;
  }

  async register(clientInfo: { client_id: string; email: string; name: string }): Promise<AccessToken> {
    return this.post<AccessToken>("register", {
      body: clientInfo,
    });
  }
}
