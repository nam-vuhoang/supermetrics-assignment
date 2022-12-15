import { KeyValueCache } from "@apollo/utils.keyvaluecache";
import { AuthenticationService } from "../services/authentication-service";

export interface GraphQLContext {
  authenticationService: AuthenticationService;
  cache?: KeyValueCache;
}