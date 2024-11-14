// Events.js
import { useQuery } from '@apollo/client';
import { Fab, Drawer } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useState } from 'react';
import EventDetails from './EventDetails';
import CreateEvent from './CreateEvent';
import { ALL_EVENTS_QUERY } from '../lib/queries';

export default function Events() {
  const { data, error, loading } = useQuery(ALL_EVENTS_QUERY);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isCreateEventMode, setIsCreateEventMode] = useState(false);

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'time', headerName: 'Time', flex: 1 },
    { field: 'format', headerName: 'Format', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      flex: 0.2,
      renderCell: (params) => {
        const priceInEuros = (params.value / 100).toFixed(2);
        return `${priceInEuros} €`;
      },
    },
  ];

  const rows =
    data?.allEvents.map((event) => ({
      id: event.id,
      name: event.name,
      time: event.time,
      format: event.format,
      location: event.store?.name || 'Unbekannt',
      price: event.price,
    })) || [];

  const handleRowClick = (params) => {
    setSelectedEventId(params.id);
    setIsCreateEventMode(false);
    setDrawerOpen(true);
  };

  const handleCreateEventClick = () => {
    setIsCreateEventMode(true);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedEventId(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 70px)',
        width: '100%',
      }}
    >
      <DataGrid
        sx={{
          [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]:
            {
              outline: 'none',
            },
          [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
            {
              outline: 'none',
            },
          cursor: 'pointer',
        }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        onRowClick={handleRowClick}
      />

      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
        {isCreateEventMode ? (
          <CreateEvent onClose={handleCloseDrawer} />
        ) : (
          <EventDetails eventId={selectedEventId} />
        )}
      </Drawer>

      <Fab
        onClick={handleCreateEventClick}
        sx={{
          position: 'fixed',
          bottom: (theme) => theme.spacing(10),
          right: (theme) => theme.spacing(4),
        }}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
