import MuiGrid from '../../../components/use-client/MuiGrid';
import { User } from '../../../models/user';
import { BlogComponent } from '../../BlogComponent';
import { PostCountStatsComponent } from './PostCountStatsComponent';
import { PostLengthStatsComponent } from './PostLengthStatsComponent';

export function UserStatsComponent({ user }: { user: User }) {
  return (
    <MuiGrid container columnSpacing={4} rowSpacing={6}>
      <MuiGrid item xs={7}>
        <MuiGrid container columnSpacing={4} rowSpacing={6}>
          <MuiGrid item xs={6}>
            <PostCountStatsComponent user={user} />
          </MuiGrid>
          <MuiGrid item xs={6}>
            <PostLengthStatsComponent user={user} />
          </MuiGrid>
        </MuiGrid>
      </MuiGrid>

      <MuiGrid item xs={5}>
        <BlogComponent
          posts={user.stats.longestPosts}
          expandAll={true}
          caption="Longest post"
          hideDashboardLink={true}
        />
      </MuiGrid>
    </MuiGrid>
  );
}
