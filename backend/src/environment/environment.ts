import dotenv from "dotenv";

dotenv.config({ path: "env/configuration.env" });

export const environment = {
  graphqlServer: {
    port: parseInt(process.env.PORT),
  },
  dataServer: {
    baseUrl: process.env.DATA_SERVER_BASE_URL,
    clientInfo: {
      client_id: process.env.DATA_SERVER_CLIENT_ID,
      email: process.env.DATA_SERVER_CLIENT_EMAIL,
      name: process.env.DATA_SERVER_CLIENT_NAME,
    },
    pageCount: parseInt(process.env.DATA_POSTS_MAX_PAGE_COUNT),
  },
};
