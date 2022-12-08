import { RESTDataSource } from "@apollo/datasource-rest";
import { KeyValueCache } from "@apollo/utils.keyvaluecache";
import { Post } from "../models/post";

interface RawPostData {
  page: number;
  posts: Array<Post>;
}

export class PostService extends RESTDataSource {
  override baseURL = "https://api.supermetrics.com/assignment";

  static readonly MIN_PAGE = 1;
  static readonly MAX_PAGE = 10;

  private token: string;

  constructor(options: { token: string; cache: KeyValueCache }) {
    super(options); // this sends our server's `cache` through
    this.token = options.token;
    this.memoizeGetRequests = true;
  }

  async fetchPosts(): Promise<Post[]> {
    const pageIndexes = Array.from(Array(PostService.MAX_PAGE).keys()); // from 0 to N-1;
    const pagePromises$: Promise<Post[]>[] = pageIndexes.map((i) => this.fetchPostsByPage(i));
    return Promise.all(pagePromises$).then((data) => data.flat());
  }

  async fetchPostsByPage(pageIndex: number): Promise<Post[]> {
    const pageNumber = pageIndex + 1;
    return this.get<RawPostData>("posts", {
      params: {
        sl_token: this.token,
        pageIndex: pageNumber.toString(),
      },
    }).then((data) => {
      if (data.page !== pageNumber) {
        throw new Error(`Invalid data: expected page ${pageNumber}, but got page ${data.page}.`);
      }
      return data.posts;
    });
  }

  async fetchPostsByUser(userId: string): Promise<Post[]> {
    const pages$: Promise<Post[]>[] = [];
    for (let i = PostService.MIN_PAGE; i <= PostService.MAX_PAGE; ++i) {
      pages$.push(this.fetchPostsByPageAndUser(i, userId));
    }
    return Promise.all(pages$).then((data) => data.flat());
  }

  async fetchPostsByPageAndUser(pageIndex: number, userId: string): Promise<Post[]> {
    return this.fetchPostsByPage(pageIndex).then((posts) => posts.filter((p) => p.from_id === userId));
  }
}
