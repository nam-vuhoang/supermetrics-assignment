import { Avatar, Typography } from '@mui/material';
import { fontSize, width } from '@mui/system';
import { MaterialUtils } from '../utils/material/material-utils';

/**
 * Create an avatar with user name initials.
 * @param name
 * @returns
 */
export default function UserNameAvatar({
  name,
  width,
  fontSize,
}: {
  name: string;
  width?: number;
  fontSize?: number;
}): JSX.Element {
  const nameTokens = name.split(' ');
  const nameInitials = `${nameTokens[0][0]}${nameTokens[1][0]}`;
  return (
    <Avatar
      alt={name}
      sx={{ bgcolor: MaterialUtils.stringToColor(name), width, height: width }}
    >
      {MaterialUtils.conditionalNode(
        fontSize !== undefined,
        <Typography fontSize={fontSize}>{nameInitials}</Typography>,
        nameInitials
      )}
    </Avatar>
  );
}
