import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Ticket } from '@eentry/types';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import { Typography, Stack, Box, Button } from '@mui/material';
import { DataGrid, GridColumns, GridSelectionModel } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useDeleteTicketByIdMutation, useGetTicketsQuery, useGetTicketTypesQuery } from '../api/api.tickets';
import { useSnackbarNotification } from '../hooks/useSnackbarNotification';

export const Tickets: FC = () => {
  const { t } = useTranslation();

  const { data: tickets, isFetching: isFetchingTickets } = useGetTicketsQuery();
  const { data: ticketTypes, isFetching: isFetchingTicketTypes } = useGetTicketTypesQuery();

  const { showSuccessSnackbar, showErrorSnackbar } = useSnackbarNotification();

  const [deleteTicket, { isLoading: isLoadingDelete, isError: isErrorDelete, isSuccess: isSuccessDelete, reset: resetDelete }] =
    useDeleteTicketByIdMutation();

  const columns = useMemo<GridColumns<Ticket>>(
    () => [
      { field: 'id', flex: 2, headerName: t('pages.adminTickets.tickets.columns.id') },
      {
        field: 'type',
        flex: 2,
        headerName: t('pages.adminTickets.tickets.columns.type'),
        valueGetter: ({ value }) => ticketTypes?.find((type) => type.id === value)?.name,
      },
      {
        field: 'state',
        flex: 1,
        headerName: t('pages.adminTickets.tickets.columns.state'),
      },
      {
        field: 'lastModified',
        flex: 1.5,
        headerName: t('pages.adminTickets.tickets.columns.lastModified'),
      },
    ],
    [t, ticketTypes]
  );

  const getRowId = useCallback((row: Ticket) => row.id, []);

  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  const handleClearSelection = useCallback(() => setSelectionModel([]), []);

  const handleDelete = useCallback(() => {
    deleteTicket({ id: selectionModel[0].toString() });
  }, [deleteTicket, selectionModel]);
  useEffect(() => {
    if (isSuccessDelete) {
      showSuccessSnackbar(t('pages.adminTickets.tickets.success'));
      resetDelete();
    }
  }, [isSuccessDelete, resetDelete, showSuccessSnackbar, t]);
  useEffect(() => {
    if (isErrorDelete) {
      showErrorSnackbar(t('pages.adminTickets.tickets.error'));
      resetDelete();
    }
  }, [isErrorDelete, resetDelete, showErrorSnackbar, t]);

  return (
    <>
      <Typography variant="h5">{t('pages.adminTickets.tickets.title')}</Typography>
      <Stack direction="row" gap={2}>
        <Button disabled={selectionModel.length === 0} variant="outlined" onClick={handleClearSelection}>
          {t('pages.adminTickets.types.clearSelection')}
        </Button>
        <LoadingButton
          disabled={selectionModel.length === 0}
          loading={isLoadingDelete}
          startIcon={<DeleteIcon />}
          variant="outlined"
          onClick={handleDelete}
        >
          {t('pages.adminTickets.tickets.delete')}
        </LoadingButton>
      </Stack>
      <Box sx={{ height: 300, width: '100%' }}>
        <DataGrid
          autoHeight
          columns={columns}
          getRowId={getRowId}
          loading={isFetchingTickets || isFetchingTicketTypes}
          pageSize={50}
          rows={tickets || []}
          rowsPerPageOptions={[5]}
          selectionModel={selectionModel}
          onSelectionModelChange={setSelectionModel}
        />
      </Box>
    </>
  );
};
