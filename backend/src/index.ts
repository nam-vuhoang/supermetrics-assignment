import { GraphQLServer } from './graphql/graphql-server';
import { MockAuthenticationService } from './services/mock-services/mock-authentication-service';
import { MockPostService } from './services/mock-services/mock-post-service';
import { PostGenerator } from './services/mock-services/post-generator';
import { Utils } from './utils/utils';
import { environment } from './environment/environment';

const { baseUrl, useMock, pageCount } = environment.dataServer;
let graphQLServer: GraphQLServer;
if (useMock) {
    const pagePosts = PostGenerator.generateSortedPostPages();
    const authenticationService = new MockAuthenticationService(() => Promise.resolve(Utils.generateRandomId(20)));
    const postService = new MockPostService(baseUrl, authenticationService, undefined, pageCount, pagePosts);
    graphQLServer = new GraphQLServer(authenticationService, () => postService);
} else {
    graphQLServer = new GraphQLServer();
}

const { url } = await graphQLServer.startStandaloneServer();

console.log(`🚀  GraphQL Server ready at: ${url}`);
