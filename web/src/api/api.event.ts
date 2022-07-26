import { BaseEvent, Event } from '@eentry/types';
import { api } from './api';
import { TAG_EVENT } from './api.event.tags';

const endpointsAuth = api.injectEndpoints({
  endpoints: (builder) => ({
    deleteImage: builder.mutation<Event, void>({
      invalidatesTags: [TAG_EVENT],
      query: () => ({
        method: 'DELETE',
        url: 'event/image',
      }),
    }),
    getEvent: builder.query<Event, void>({
      providesTags: [TAG_EVENT],
      query: () => ({
        url: 'event',
      }),
    }),
    patchEvent: builder.mutation<Event, BaseEvent>({
      invalidatesTags: [TAG_EVENT],
      query: (event) => ({
        body: event,
        method: 'PATCH',
        url: 'event',
      }),
    }),
  }),
});

export const { useGetEventQuery, usePatchEventMutation, useDeleteImageMutation } = endpointsAuth;
