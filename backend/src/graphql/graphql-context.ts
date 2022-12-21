import { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { AuthenticationService } from '../services/authentication-service';
import { PostService } from '../services/post-service';

/**
 * The GraphQL context that will be send to GraphQL resolvers on every request.
 */
export interface GraphQLContext {
  /**
   * The authentication service which is responsible for providing SL token.
   */
  authenticationService: AuthenticationService;

  /**
   * The key-value cache which will be used by RESTDataSource for caching GET-requests.
   */
  cache?: KeyValueCache;

  /**
   * The function for constructing new PostService instance.
   * @param context
   * @returns
   */
  postServiceBuilder: (authenticationService: AuthenticationService, cache?: KeyValueCache) => PostService;
}
