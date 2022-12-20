import { Avatar, Typography } from '@mui/material';
import { MaterialUtils } from './material-utils';
import IfElseElement from './if-else-element';

/**
 * Create an avatar with user name initials.
 * @param name
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
      sx={{ bgcolor: MaterialUtils.stringToColor(name), width, height: width }}
    >
      <IfElseElement
        if={fontSize === undefined}
        then={nameInitials}
        else={<Typography fontSize={fontSize}>{nameInitials}</Typography>}
      />
    </Avatar>
  );
}
