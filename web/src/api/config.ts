import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? ''}/`;

type Config = {
  disableConfirmOtherTimeframe: boolean;
};

export const config = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' }),
  endpoints: (builder) => ({
    getConfig: builder.query<Config, void>({
      query: () => ({
        url: `config.json`,
      }),
    }),
  }),
  reducerPath: 'config',
});
