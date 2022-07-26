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
    deleteTicketById: builder.mutation<Ticket, { id: string }>({
      invalidatesTags: (_, error, args) => (!error ? [TAG_TICKET, { id: args.id, type: TAG_TICKET }] : []),
      query: ({ id }) => ({
        method: 'DELETE',
        url: `tickets/${id}`,
      }),
    }),
    deleteTicketTypeById: builder.mutation<void, { id: number }>({
      invalidatesTags: (_, error, args) => (!error ? [TAG_TICKETTYPE, { id: args.id, type: TAG_TICKETTYPE }] : []),
      query: ({ id }) => ({
        method: 'DELETE',
        url: `tickettypes/${id}`,
      }),
    }),
    getCheckinCount: builder.query<number, void>({
      providesTags: [TAG_TICKET],
      query: () => ({
        url: `tickets`,
      }),
      transformResponse: (tickets: Ticket[]) => {
        const filteredTickets = tickets.filter(({ state }) => state === 'CHECKEDIN');

        return filteredTickets.length;
      },
    }),
    getTicketById: builder.query<Ticket, { id: string }>({
      providesTags: (result) => (result ? [{ id: result.id, type: TAG_TICKET }] : []),
      query: ({ id }) => ({
        url: `tickets/${id}`,
      }),
    }),
    getTickets: builder.query<Ticket[], void>({
      providesTags: (result) => (result ? result.map((r) => ({ id: r.id, type: TAG_TICKET })) : []),
      query: () => ({
        url: `tickets`,
      }),
    }),
    getTicketTypeById: builder.query<TicketType, { id: number }>({
      providesTags: (result) => (result ? [{ id: result.id, type: TAG_TICKETTYPE }] : []),
      query: ({ id }) => ({
        url: `tickettypes/${id}`,
      }),
    }),
    getTicketTypes: builder.query<TicketType[], void>({
      providesTags: (result) => (result ? [TAG_TICKETTYPE, ...result.map((r) => ({ id: r.id, type: TAG_TICKETTYPE }))] : []),
      query: () => ({
        url: 'tickettypes',
      }),
    }),
  }),
});

export const {
  useGetTicketByIdQuery,
  useGetTicketTypeByIdQuery,
  useCheckinMutation,
  useGetCheckinCountQuery,
  useGetTicketTypesQuery,
  useDeleteTicketTypeByIdMutation,
  useGetTicketsQuery,
  useDeleteTicketByIdMutation,
} = endpointsAuth;
