import { Link, Tooltip } from '@mui/material';

/**
 * Render the user name with link to his blog.
 */
export function UserBlogLinkComponent({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}): JSX.Element {
  return (
    <Tooltip title={`Click to see ${userName}'s blog`}>
      <Link
        href={`/${encodeURIComponent(userId)}`}
        variant="body1"
        fontWeight="bold"
        underline="hover"
      >
        {userName}
      </Link>
    </Tooltip>
  );
}
