import React, { useState } from 'react';
import { Fab, Drawer } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Events from '../components/Events';
import CreateEvent from '../components/CreateEvent';

export default function EventsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  return (
    <div>
      <Fab
        onClick={handleDrawerOpen}
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

      <Drawer
        sx={{}}
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
      >
        <CreateEvent onClose={handleDrawerClose} />
      </Drawer>
    </div>
  );
}
