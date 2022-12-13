import { Alert } from '@mui/material';
import { GetStaticProps } from 'next';
import { UserStatsTableComponent } from '../../components/user-stats-table-component';
import { environment } from '../../environment/environment';
import { UserStats } from '../../models/user-stats';
import { PostService } from '../../services/post-service';
import { logger } from '../../utils/logger';

interface PageProps {
  stats: UserStats[];
  error: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  return await new PostService(environment.backendUrl)
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

  return <UserStatsTableComponent stats={stats} />;
}
