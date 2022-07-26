import { FC, useCallback, useMemo, useState, useEffect } from 'react';
import { Device } from '@eentry/types';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Checkbox, Stack, Typography } from '@mui/material';
import { DataGrid, GridColumns, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useDeleteDeviceMutation, useGetDevicesQuery } from '../api/api.devices';
import { useOpen } from '../hooks/useOpen';
import { useSnackbarNotification } from '../hooks/useSnackbarNotification';
import { DeviceDialog } from './DeviceDialog';

export const Devices: FC = () => {
  const { t } = useTranslation();
  const { showSuccessSnackbar, showErrorSnackbar } = useSnackbarNotification();

  const columns = useMemo<GridColumns<Device>>(
    () => [
      { field: 'id', flex: 0.5, headerName: t('pages.adminDashboard.devices.columns.id') },
      { field: 'name', flex: 1, headerName: t('pages.adminDashboard.devices.columns.name') },
      {
        field: 'roles',
        flex: 1,
        headerName: t('pages.adminDashboard.devices.columns.roles'),
      },
      {
        field: 'revoked',
        flex: 0.5,
        headerName: t('pages.adminDashboard.devices.columns.revoked'),
        renderCell: ({ value }: GridRenderCellParams<boolean>) => <Checkbox checked={value} disabled readOnly />,
      },
    ],
    [t]
  );

  const getRowId = useCallback((row: Device) => row.id, []);

  const { data, isFetching } = useGetDevicesQuery({});
  const [deleteDevice, { isLoading, isSuccess, isError, reset }] = useDeleteDeviceMutation();

  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  const handleClearSelection = useCallback(() => setSelectionModel([]), []);

  const handleRevoke = useCallback(() => {
    deleteDevice({ id: Number(selectionModel[0]) });
  }, [deleteDevice, selectionModel]);
  useEffect(() => {
    if (isSuccess) {
      showSuccessSnackbar(t('pages.adminDashboard.devices.revokeSuccess'));
      reset();
    }
  }, [isSuccess, reset, showSuccessSnackbar, t]);
  useEffect(() => {
    if (isError) {
      showErrorSnackbar(t('pages.adminDashboard.devices.revokeError'));
      reset();
    }
  }, [isError, reset, showErrorSnackbar, t]);

  const [openNew, handleOpenNew, handleCloseNew] = useOpen(false);

  return (
    <>
      <Typography variant="h5">{t('pages.adminDashboard.devices.title')}</Typography>
      <Stack direction="row" gap={2}>
        <Button disabled={selectionModel.length === 0} variant="outlined" onClick={handleClearSelection}>
          {t('pages.adminDashboard.devices.clearSelection')}
        </Button>
        <LoadingButton disabled={selectionModel.length === 0} loading={isLoading} variant="contained" onClick={handleRevoke}>
          {t('pages.adminDashboard.devices.revoke')}
        </LoadingButton>
        <Button variant="contained" onClick={handleOpenNew}>
          {t('pages.adminDashboard.devices.newButton')}
        </Button>
      </Stack>
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          autoPageSize
          columns={columns}
          getRowId={getRowId}
          loading={isFetching}
          pageSize={5}
          rows={data || []}
          rowsPerPageOptions={[5]}
          selectionModel={selectionModel}
          onSelectionModelChange={setSelectionModel}
        />
      </Box>
      <DeviceDialog open={openNew} onClose={handleCloseNew} />
    </>
  );
};
