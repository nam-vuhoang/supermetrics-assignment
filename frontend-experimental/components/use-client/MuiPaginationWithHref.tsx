'use client';

import { Pagination, PaginationItem } from '@mui/material';
import Link from 'next/link';

function PageItemRender({
  baseHref,
  pageNumber,
}: {
  baseHref: string;
  pageNumber: number;
}) {

}

export default function MuiPaginationWithHref({
  baseHref,
  pageNumber,
  pageCount,
}: {
  baseHref: string;
  pageNumber: number;
  pageCount: number;
}): React.ReactNode {
  return (
    // <Pagination
    //   page={pageNumber}
    //   count={pageCount}
    //   showFirstButton
    //   showLastButton
    //   renderItem={(item) => (
    //     <PaginationItem
    //       component={Link}
    //       href={item.page === 1 ? baseHref : `${baseHref}?page=${item.page}`}
    //       {...item}
    //     />
    //   )}
    // />
    <></>
  );
}
