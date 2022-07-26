import { BaseDevice, Device, OneTimeDevice, Ticket } from '@eentry/types';
import { api } from './api';
import { TAG_DEVICE } from './api.devices.tags';

const endpointsAuth = api.injectEndpoints({
  endpoints: (builder) => ({
    deleteDevice: builder.mutation<Device, { id: Device['id'] }>({
      invalidatesTags: (result) => (result ? [{ id: result.id, type: TAG_DEVICE }] : []),
      query: ({ id }) => ({
        method: 'DELETE',
        url: `devices/${id}`,
      }),
    }),
    getDeviceById: builder.query<Ticket, { id: Device['id'] }>({
      providesTags: (result) => (result ? [{ id: result.id, type: TAG_DEVICE }] : []),
      query: ({ id }) => ({
        url: `devices/${id}`,
      }),
    }),
    getDevices: builder.query<Device[], { revoked?: boolean }>({
      providesTags: (result) => (result ? [TAG_DEVICE, ...result.map((r) => ({ id: r.id, type: TAG_DEVICE }))] : []),
      query: ({ revoked }) => ({
        params: { revoked },
        url: `devices`,
      }),
    }),
    getRoles: builder.query<string[], void>({
      query: () => ({
        url: `roles`,
      }),
    }),
    postDevice: builder.mutation<OneTimeDevice, BaseDevice>({
      invalidatesTags: [TAG_DEVICE],
      query: (baseDevice) => ({
        body: baseDevice,
        method: 'POST',
        url: `devices`,
      }),
    }),
  }),
});

export const { useGetDevicesQuery, usePostDeviceMutation, useDeleteDeviceMutation, useGetRolesQuery } = endpointsAuth;
