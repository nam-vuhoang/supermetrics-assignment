import { Visibility } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useState } from 'react';

export const MAX_SHORT_MESSAGE_LENGTH = 150;

/**
 * Render the full message or shorted message depending on state.
 */
export default function ShortMessageComponent({
  message,
  expand,
}: {
  message: string;
  expand: boolean;
}) {
  const [displayFull, setDisplayFull] = useState(expand);

  if (!displayFull && message.length > MAX_SHORT_MESSAGE_LENGTH) {
    const shortMessage = message.substring(
      0,
      message.lastIndexOf(' ', MAX_SHORT_MESSAGE_LENGTH)
    );

    if (message !== shortMessage) {
      return (
        <>
          {shortMessage}
          {' ... '}
          <IconButton
            size="small"
            onClick={() => setDisplayFull(true)}
            aria-label="see more"
          >
            <Visibility />
          </IconButton>
        </>
      );
    }
  }

  return message;
}
