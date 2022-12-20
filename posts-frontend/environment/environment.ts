import { EnvironmentUtils } from './environment-utils';

// [IMPORTANT] Process environment variables cannot be inlined via dynamic lookups!!!
// See more https://nextjs.org/docs/basic-features/environment-variables
export const environment = {
  appName: EnvironmentUtils.requireStringEnvParam(
    'NEXT_PUBLIC_APP_NAME',
    process.env.NEXT_PUBLIC_APP_NAME
  ),
  backendUrl: EnvironmentUtils.requireStringEnvParam(
    'NEXT_PUBLIC_BACKEND_URL',
    process.env.NEXT_PUBLIC_BACKEND_URL
  ),
  fontend: {
    blogPageRefreshIntervalInSeconds: EnvironmentUtils.requireIntegerEnvParam(
      'NEXT_PUBLIC_BLOG_PAGE_REFRESH_INTERVAL_IN_SECONDS',
      process.env.NEXT_PUBLIC_BLOG_PAGE_REFRESH_INTERVAL_IN_SECONDS
    ),
    dashboardPageRefreshIntervalInSeconds: EnvironmentUtils.requireIntegerEnvParam(
      'NEXT_PUBLIC_DASHBOARD_PAGE_REFRESH_INTERVAL_IN_SECONDS',
      process.env.NEXT_PUBLIC_DASHBOARD_PAGE_REFRESH_INTERVAL_IN_SECONDS
    ),
  }
};
