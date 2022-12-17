import Link from 'next/link';
import Alert from '../../../components/use-client/MuiAlert';
import MuiButton from '../../../components/use-client/MuiButton';
import { Value } from '../../../components/use-client/Value';

export default function Page({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams?: { page: string };
}) {
  const userId = params.userId && params.userId[0];
  const page = Number(searchParams?.page || '1');

  if (!Number.isInteger(page)) {
    return (
      <Alert severity="warning">
        <p>
          Query param <Value>page</Value> must be an <Value>integer</Value> or{' '}
          <Value>undefined</Value>, but was: <Value>{page}</Value>.<br />
          <Link href={`/dashboard/${userId || ''}`} passHref legacyBehavior>
            <MuiButton>Show first page</MuiButton>
          </Link>
        </p>
      </Alert>
    );
  }

  return InternalPage(decodeURIComponent(userId), page - 1);
}

function InternalPage(userId?: string, pageIndex?: number) {
  return (
    <>
      <h1>
        User: <Value>{userId}</Value>
      </h1>
      <h1>
        Page: <Value>{pageIndex}</Value>
      </h1>
    </>
  );
}
