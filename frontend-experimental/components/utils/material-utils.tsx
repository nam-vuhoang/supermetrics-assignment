import { Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';

export class MaterialUtils {
  // https://mui.com/material-ui/react-avatar/
  static stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  private static stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: MaterialUtils.stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  static formatAvatar(name: string): JSX.Element {
    return <Avatar {...MaterialUtils.stringAvatar(name)} />;
  }

  static ButtonLike = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    paddingLeft: 0,
  }));

  static conditionalNode(condition: any, node: ReactNode) {
    return condition ? node : <></>;
  }
}
