import { Ticket, TicketType } from '@eentry/types';
import { api } from './api';
import { TAG_TICKET, TAG_TICKETTYPE } from './api.tickets.tags';

const endpointsAuth = api.injectEndpoints({
  endpoints: (builder) => ({
    checkin: builder.mutation<Ticket, { id: string }>({
      invalidatesTags: (result) => (result ? [{ id: result.id, type: TAG_TICKET }] : []),
      query: ({ id }) => ({
        method: 'POST',
        url: `tickets/${id}/checkin`,
      }),
    }),
    checkout: builder.mutation<Ticket, { id: string }>({
      invalidatesTags: (result) => (result ? [{ id: result.id, type: TAG_TICKET }] : []),
      query: ({ id }) => ({
        method: 'POST',
        url: `tickets/${id}/checkout`,
      }),
    }),
    getTicketById: builder.query<Ticket, { id: string }>({
      providesTags: (result) => (result ? [{ id: result.id, type: TAG_TICKET }] : []),
      query: ({ id }) => ({
        url: `tickets/${id}`,
      }),
    }),
    getTicketTypeById: builder.query<TicketType, { id: number }>({
      providesTags: (result) => (result ? [{ id: result.id, type: TAG_TICKETTYPE }] : []),
      query: ({ id }) => ({
        url: `tickettypes/${id}`,
      }),
    }),
  }),
});

export const { useGetTicketByIdQuery, useGetTicketTypeByIdQuery, useCheckinMutation } = endpointsAuth;
