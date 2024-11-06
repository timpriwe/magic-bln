import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Events from '../components/Events';

export default function EventsPage() {
  return (
    <div>
      <Fab
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
      <Events />
    </div>
  );
}
