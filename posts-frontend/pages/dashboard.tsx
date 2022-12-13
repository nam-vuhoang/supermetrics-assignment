import { Alert } from '@mui/material';
import { GetStaticProps } from 'next';
import { UserStatsTableView } from '../components/user-stats-table-view';
import { UserStats } from '../models/user-stats';
import { PostService } from '../services/post-service';
import { logger } from '../utils/logger';

interface PageProps {
  stats: UserStats[];
  error: any;
}

export const getStaticProps: GetStaticProps = async (context) => {
  return await PostService.getInstance()
    .fetchStats()
    .then((stats) => {
      return { props: { stats } };
    })
    .catch((error) => {
      logger.error(error);
      return {
        props: {
          error: `Unexpected error: ${JSON.stringify(error, undefined, 2)}`,
        },
      };
    });
};

export default function Dashboard(props: PageProps) {
  const { stats, error } = props;

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return <UserStatsTableView stats={stats} />;
}
