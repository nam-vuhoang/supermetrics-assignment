import { ApolloError } from '@apollo/client';
import { Alert } from '@mui/material';
import { GetStaticProps } from 'next';
import { UserStats } from '../models/user-stats';
import { PostService } from '../services/post-service';
import { logger } from '../utils/logger';

interface PageProps {
  stats: UserStats[];
  error: any;
}

export const getStaticProps: GetStaticProps = async (context) => {
  return await PostService.getInstance()
    .getStats()
    .then((stats) => {
      return { props: { stats } };
    })
    .catch((error) => {
      logger.error(error);
      if (error instanceof ApolloError) {
        const apolloError = error as ApolloError;
        return {
          props: {
            error: `${apolloError.message}. ${JSON.stringify(apolloError)}`,
          },
        };
      }
      return { props: { error: `Unexpected error: JSON.stringify(error)` } };
    });
};

export default function Dashboard(props: PageProps) {
  const { stats, error } = props;

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return <>{JSON.stringify(stats)}</>;
}
