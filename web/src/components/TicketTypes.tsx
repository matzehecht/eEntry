import { FC, useCallback, useMemo } from 'react';
import { Typography, Box } from '@mui/material';
import { DataGrid, GridColumns, GridValueFormatterParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useGetTicketTypesQuery } from '../api/api.tickets';

export const TicketTypes: FC = () => {
  const { t } = useTranslation();

  const { data, isFetching } = useGetTicketTypesQuery();
  const parsedRows = useMemo(() => data?.map(({ id, name, valid: { from, until } }) => ({ from, id, name, until })) ?? [], [data]);

  const columns = useMemo<GridColumns<typeof parsedRows[number]>>(
    () => [
      { field: 'id', flex: 0.5, headerName: t('pages.adminTickets.types.columns.id') },
      { field: 'name', flex: 1, headerName: t('pages.adminTickets.types.columns.name') },
      {
        field: 'from',
        flex: 1,
        headerName: t('pages.adminTickets.types.columns.from'),
        valueFormatter: ({ value }: GridValueFormatterParams<string>) => new Date(Date.parse(value)).toLocaleString(),
      },
      {
        field: 'until',
        flex: 1,
        headerName: t('pages.adminTickets.types.columns.until'),
        valueFormatter: ({ value }: GridValueFormatterParams<string>) => new Date(Date.parse(value)).toLocaleString(),
      },
    ],
    [t]
  );

  const getRowId = useCallback((row: typeof parsedRows[number]) => row.id, []);

  return (
    <>
      <Typography variant="h5">{t('pages.adminTickets.types.title')}</Typography>
      <Box sx={{ height: 300, width: '100%' }}>
        <DataGrid
          autoPageSize
          columns={columns}
          disableSelectionOnClick
          getRowId={getRowId}
          loading={isFetching}
          pageSize={5}
          rows={parsedRows}
          rowsPerPageOptions={[5]}
        />
      </Box>
    </>
  );
};
