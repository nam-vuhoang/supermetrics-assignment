import DefaultTags from './theme/DefaultTags';
import { APP_TITLE } from './theme/theme-definitions';

export default function Head() {
  return (
    <>
      <DefaultTags />
      <title>{APP_TITLE}</title>
    </>
  );
}
