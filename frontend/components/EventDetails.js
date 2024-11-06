import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const EVENT_DETAILS_QUERY = gql`
  query EVENT_DETAILS_QUERY($where: EventWhereUniqueInput!) {
    Event(where: $where) {
      id
      name
      time
      format
      description
      store {
        name
        adress
      }
      price
      participants {
        name
      }
    }
  }
`;

export default function EventDetails({ eventId, open, onClose }) {
  const { data, loading, error } = useQuery(EVENT_DETAILS_QUERY, {
    variables: { where: { id: eventId } }, // `where` benötigt das `id`-Feld
    skip: !eventId,
  });

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  const Event = data?.Event;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 2 }}>
        {Event ? (
          <>
            <Typography variant="h6" gutterBottom>
              {Event.name}
            </Typography>
            <Typography variant="body1">
              <strong>Zeit:</strong> {Event.time}
            </Typography>
            <Typography variant="body1">
              <strong>Format:</strong> {Event.format}
            </Typography>
            <Typography variant="body1">
              <strong>Beschreibung:</strong> {Event.description}
            </Typography>
            <Typography variant="body1">
              <strong>Ort:</strong> {Event.store?.name || 'Unbekannt'},{' '}
              {Event.store?.address || ''}
            </Typography>
            <Typography variant="body1">
              <strong>Preis:</strong> {(Event.price / 100).toFixed(2)} €
            </Typography>
            <Typography variant="body1">
              <strong>Teinehmer:</strong> {Event.participants.length}
            </Typography>
            {Event.participants.length > 0 ? (
              Event.participants.map((participant, index) => (
                <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                  - {participant.name}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" sx={{ ml: 2 }}>
                Keine Teilnehmer
              </Typography>
            )}
          </>
        ) : (
          <Typography>Keine Details verfügbar</Typography>
        )}
      </Box>
    </Drawer>
  );
}
