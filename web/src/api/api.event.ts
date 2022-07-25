import { Event } from '@eentry/types';
import { api } from './api';
import { TAG_EVENT } from './api.event.tags';

const endpointsAuth = api.injectEndpoints({
  endpoints: (builder) => ({
    getEvent: builder.query<Event, void>({
      providesTags: [TAG_EVENT],
      query: () => ({
        url: 'event',
      }),
    }),
  }),
});

export const { useGetEventQuery } = endpointsAuth;
