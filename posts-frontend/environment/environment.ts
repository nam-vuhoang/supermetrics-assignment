import { requireStringEnvParam } from '../utils/environment-utils';

// process environment variables cannot be inlined via dynamic lookups:
// https://nextjs.org/docs/basic-features/environment-variables
export const environment = {
  appName: requireStringEnvParam('NEXT_PUBLIC_APP_NAME', process.env.NEXT_PUBLIC_APP_NAME),
  backendUrl: requireStringEnvParam('NEXT_PUBLIC_ACKEND_URL', process.env.NEXT_PUBLIC_BACKEND_URL),
};
