import { AccessTime } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import moment from 'moment';
import { Moment } from 'moment';

/**
 * Render the humanized time different string (compared to now)
 * with tooltip which shows the actual time.
 *
 */
export default function TimeDiffComponent({
  time,
}: {
  time: Moment;
}): JSX.Element {
  const timeString = time.format('dddd, D MMMM YYYY [at] LT');
  const diff = moment().diff(time);
  const diffString = moment.duration(diff).humanize();

  return (
    <Tooltip title={timeString}>
      <span>
        <AccessTime sx={{ fontSize: 14 }} />
        {` ${diffString} ago`}
      </span>
    </Tooltip>
  );
}
