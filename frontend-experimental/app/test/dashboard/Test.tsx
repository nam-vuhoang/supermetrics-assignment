'use client';

import { Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Utils } from '../../../utils/utils';

export default function Test() {
  const router = useRouter();
  const [id, setId] = useState('');

  // const userId = searchParams?.userId;

  return (
    <>
      {/* <h1>Hello, {users.length}</h1> */}
      <Button
        onClick={() =>
          router.replace('test/dashboard', { forceOptimisticNavigation: true })
        }
      >
        Dashboard
      </Button>
      <Button
        onClick={() =>
          router.replace('test/dashboard?userId=user_1', {
            forceOptimisticNavigation: true,
          })
        }
      >
        Test
      </Button>
      <Link
        href="#"
        onClick={() => router.replace('test/dashboard?userId=user_1')}
      >
        Test
      </Link>
      <br/>
      <Link href="test/dashboard?userId=user_1" shallow>
        Shallow 1
      </Link>
      <br/>
      <Link href="test/dashboard?userId=user_2" shallow>
        Shallow 2
      </Link>
      <br/>
      <h1>{id}</h1>
      <Button onClick={() => setId(Utils.getRandomInt(100).toString())}>Change ID</Button>
    </>
  );
}
