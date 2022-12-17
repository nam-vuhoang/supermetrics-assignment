import DefaultTags from '../../theme/DefaultTags';
import { APP_TITLE } from '../../theme/theme-definitions';

/**
 * Overwrites upper-level head.
 * @returns 
 */
export default function Head() {
  return (
    <>
      <DefaultTags />
      <title>{`${APP_TITLE} - Dashboard`}</title>
    </>
  );
}
