import Alert from '../../../components/use-client/Alert';
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
      <Alert severity="error">
        <p>
          Query param <Value>page</Value> must be an <Value>integer</Value> or{' '}
          <Value>undefined</Value>, but was: <Value>{page}</Value>.
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
