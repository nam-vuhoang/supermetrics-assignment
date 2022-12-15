import { KeyValueCache } from "@apollo/utils.keyvaluecache";
import { AuthenticationService } from "../services/authentication-service";
import { PostService } from "../services/post-service";

export interface GraphQLContext {
  authenticationService: AuthenticationService;
  postServiceProvider: (context: GraphQLContext) => PostService;
  cache?: KeyValueCache;
}