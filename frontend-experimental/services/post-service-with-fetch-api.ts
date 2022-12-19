import { Variables } from 'graphql-request';
import { logger } from '../utils/logger';
import { PostService } from './post-service';

export class PostServiceWithFetchApi extends PostService {
  constructor(protected backendUrl: string) {
    super(backendUrl);
  }

  protected fetchQuery<T>(query: string, variables?: Variables): Promise<T> {
    return fetch(this.backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
      .then((res) => res.json()) // Promise<any>
      .then((res: any) => {
        if (res.errors) {
          throw new Error(res.message);
        }
        return res.data;
      })
      .finally(() => logger.debug('[GraphQL+FetchAPI] Done.'));
  }
}
