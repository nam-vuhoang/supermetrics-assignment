import Link from 'next/link';
import { MuiPaginationWithHref } from '../../../components/use-client/MuiPaginationWithHref';
import MuiAlert from '../../../components/use-client/MuiAlert';
import MuiBox from '../../../components/use-client/MuiBox';
import MuiButton from '../../../components/use-client/MuiButton';
import { Value } from '../../../components/use-client/Value';
import { environment } from '../../../environment/environment';
import { Post } from '../../../models/post';
import { PostServiceWithFetchApi } from '../../../services/post-service-with-fetch-api';
import { BlogComponent } from '../../BlogComponent';

const PAGE_SIZE = 15;

export default function Page({
  params,
  searchParams,
}: {
  params: { userId?: string };
  searchParams?: { page: string };
}) {
  const userId =
    params.userId && params.userId[0] && decodeURIComponent(params.userId[0]);
  const page = Number(searchParams?.page || '1');

  if (!Number.isInteger(page)) {
    return (
      <MuiAlert severity="warning">
        <p>
          Query param <Value>page</Value> must be an <Value>integer</Value> or{' '}
          <Value>undefined</Value>, but was: <Value>{page}</Value>.<br />
          <Link href={`/dashboard/${userId || ''}`} passHref legacyBehavior>
            <MuiButton>Show first page</MuiButton>
          </Link>
        </p>
      </MuiAlert>
    );
  }

  return InternalPage(page, userId);
}

async function InternalPage(pageNumber: number, userId?: string) {
  const { posts, pageCount } = await new PostServiceWithFetchApi(
    environment.backendUrl
  )
    .fetchPosts(pageNumber - 1, PAGE_SIZE, userId || null)
    .then((data: { posts: Post[]; totalPostCount: number }) => ({
      posts: data.posts,
      pageCount: Math.ceil(data.totalPostCount / PAGE_SIZE),
    }));

  const href=userId ? encodeURIComponent('/home/' + userId) : '';
  console.warn(href);

  return (
    <>
      <BlogComponent posts={posts} />
      <MuiBox
        sx={{ pt: 6 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {/* <MuiPaginationWithHref
        //   pageNumber={pageNumber}
        //   pageCount={pageCount}
        //   baseHref={userId ? encodeURIComponent('/home/' + userId) : ''}
  // />*/}
      </MuiBox>
    </>
  );
}
