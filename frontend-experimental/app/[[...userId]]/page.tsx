// 'use client';

// import { Alert, Box, Link, Pagination, PaginationItem } from '@mui/material';
// import { useSearchParams } from 'next/navigation';
// import React, { ReactNode, use } from 'react';
// import { environment } from '../../../posts-frontend/environment/environment';
// import { Post } from '../../../posts-frontend/models/post';
// import { PostService } from '../../../posts-frontend/services/post-service';
// import { BlogComponent } from '../BlogComponent';

// const PAGE_SIZE = 15;

// interface ParamsType {
//   userId: string[];
// }

// interface PageProps {
//   posts: Post[];
//   userId: string | null;
//   pageNumber: number;
//   pageCount: number;
// }

// export async function fetchDataOnClientSide(
//   backendUrl: string,
//   userIdParam: string | null,
//   pageParam: string | null
// ): Promise<PageProps | null> {
//   console.info(`fetchDataOnClientSide()`);
//   const pageNumber = Number(pageParam || '1');
//   if (Number.isInteger(pageNumber)) {
//     throw new Error('Invalid page number');
//   }

//   const userId = userIdParam ? decodeURIComponent(userIdParam) : null;
//   return new PostService(backendUrl)
//     .fetchPosts(pageNumber - 1, PAGE_SIZE, userId)
//     .then((data: { posts: Post[]; totalPostCount: number }) => ({
//       posts: data.posts,
//       pageCount: Math.ceil(data.totalPostCount / PAGE_SIZE),
//       userId,
//       pageNumber,
//     }));
// }

// export default function Home(
//   ): ReactNode {
//   const searchParams = useSearchParams();

//   const data = use(
//     fetchDataOnClientSide(
//       environment.backendUrl,
//       searchParams.get('userId'),
//       searchParams.get('page'),
//     )
//   );

//   if (!data) {
//     return <Alert severity="info">Loading...</Alert>;
//   }

//   const { posts, pageCount, userId, pageNumber } = data;

//   const href = userId ? encodeURIComponent(userId) : '';

//   return (
//     <>
//       <BlogComponent posts={posts} />
//       <Box
//         sx={{ pt: 6 }}
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//       >
//         <Pagination
//           page={pageNumber}
//           count={pageCount}
//           showFirstButton
//           showLastButton
//           renderItem={(item) => (
//             <PaginationItem
//               component={Link}
//               href={item.page === 1 ? href : `${href}?page=${item.page}`}
//               {...item}
//             />
//           )}
//         />
//       </Box>
//     </>
//   );
// }


export function Test() {
  return <>Test</>;
}