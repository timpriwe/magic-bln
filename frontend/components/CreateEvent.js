import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Drawer,
} from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';

// Mutation für das Erstellen eines Events
const CREATE_EVENT_MUTATION = gql`
  mutation CREATE_EVENT_MUTATION(
    $name: String!
    $description: String!
    $price: Int!
    $time: String!
    $format: String!
    $storeId: ID!
  ) {
    createEvent(
      data: {
        name: $name
        description: $description
        price: $price
        time: $time
        format: $format
        store: { connect: { id: $storeId } }
      }
    ) {
      id
      name
    }
  }
`;

// Query für das Abrufen der Stores
const ALL_STORES_QUERY = gql`
  query ALL_STORES_QUERY {
    allStores {
      id
      name
    }
  }
`;

export default function CreateEvent({ onClose, open }) {
  const { data, loading, error } = useQuery(ALL_STORES_QUERY);
  const [createEvent] = useMutation(CREATE_EVENT_MUTATION);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [time, setTime] = useState('');
  const [format, setFormat] = useState('');
  const [storeId, setStoreId] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createEvent({
        variables: {
          name,
          description,
          price: parseInt(price),
          time,
          format,
          storeId,
        },
      });
      onClose(); // Schließe den Drawer nach dem Absenden des Formulars
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  if (loading) return <p>Loading stores...</p>;
  if (error) return <p>Error loading stores: {error.message}</p>;

  return (
    <Box sx={{ width: 400, padding: 2 }}>
      <form onSubmit={handleSubmit}>
        {/* Name des Events */}
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Box>

        {/* Beschreibung des Events */}
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            multiline
            rows={3}
          />
        </Box>

        {/* Preis des Events */}
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Box>

        {/* Zeitpunkt des Events */}
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Time"
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        {/* Format des Events */}
        {/* <Box sx={{ marginBottom: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Format</InputLabel>
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              label="Format"
              required
            >
              <MenuItem value="Standard">Standard</MenuItem>
              <MenuItem value="Pauper">Pauper</MenuItem>
              <MenuItem value="Modern">Modern</MenuItem>
              <MenuItem value="Pioneer">Pioneer</MenuItem>
              <MenuItem value="Legacy">Legacy</MenuItem>
              <MenuItem value="Vintage">Vintage</MenuItem>
              <MenuItem value="Commander">Commander</MenuItem>
              <MenuItem value="Highlander">Highlander</MenuItem>
              <MenuItem value="Sealed">Sealed</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
            </Select>
          </FormControl>
        </Box> */}

        {/* Store-Auswahl */}
        {/* <Box sx={{ marginBottom: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Store</InputLabel>
            <Select
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              label="Store"
              required
            >
              {data.allStores.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box> */}

        {/* Submit-Button */}
        <Button type="submit" variant="contained" color="primary">
          Create Event
        </Button>
      </form>
    </Box>
  );
}
