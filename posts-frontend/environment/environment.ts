import { EnvironmentUtils } from '../utils/environment-utils';

// process environment variables cannot be inlined via dynamic lookups:
// https://nextjs.org/docs/basic-features/environment-variables
export const environment = {
  appName: EnvironmentUtils.requireStringEnvParam(
    'NEXT_PUBLIC_APP_NAME',
  ),
  backendUrl: EnvironmentUtils.requireStringEnvParam(
    'NEXT_PUBLIC_BACKEND_URL',
  ),
};
