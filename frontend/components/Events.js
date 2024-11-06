// Events.js
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Box from '@mui/material/Box';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useState } from 'react';
import EventDetails from './EventDetails'; // Import der neuen EventDetails-Komponente

const ALL_EVENTS_QUERY = gql`
  query ALL_EVENTS_QUERY {
    allEvents {
      id
      name
      time
      format
      store {
        name
      }
      price
    }
  }
`;

export default function Events() {
  const { data, error, loading } = useQuery(ALL_EVENTS_QUERY);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
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

      {/* Einbindung der EventDetails-Komponente */}
      <EventDetails
        eventId={selectedEventId}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </Box>
  );
}
