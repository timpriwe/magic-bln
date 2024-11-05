import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

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
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'time',
      headerName: 'Time',
      flex: 1,
    },
    {
      field: 'format',
      headerName: 'Format',
      flex: 1,
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      flex: 0.2,
      renderCell: (params) => {
        // Den Preis durch 100 teilen und das Euro-Zeichen anhängen
        const priceInEuros = (params.value / 100).toFixed(2);  // auf 2 Dezimalstellen runden
        return `${priceInEuros} €`; // Preis mit Euro-Zeichen anzeigen
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

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 100px)', // Dynamische Höhe für vollen Viewport
        width: '100%',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
