import { FC } from 'react';
import { Stack, Divider } from '@mui/material';
import { Tickets } from '../components/Tickets';
import { TicketTypes } from '../components/TicketTypes';

export const AdminTickets: FC = () => {
  return (
    <>
      <Stack gap={2}>
        <TicketTypes />
        <Divider />
        <Tickets />
      </Stack>
    </>
  );
};
