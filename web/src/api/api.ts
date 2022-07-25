import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tagsAuth } from './api.auth.tags';
import { tagsEvent } from './api.event.tags';
import { tagsTickets } from './api.tickets.tags';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' }),
  endpoints: () => ({}),
  reducerPath: 'api',
  tagTypes: [...tagsAuth, ...tagsEvent, ...tagsTickets],
});
