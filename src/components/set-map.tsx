/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import type { UseFormReturnType } from '@mantine/form';
import { MapContainer, type MapContainerProps, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import { Button, Group, Text, Box } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface SetMapProps extends Omit<MapContainerProps, 'center' | 'zoom'> {
  form: UseFormReturnType<any>;
  center?: [number, number];
  zoom?: number;
}

interface MarkerPosition {
  lat: number;
  lng: number;
}

function MapEventHandler({
  form,
  onMarkerSet,
}: {
  form: UseFormReturnType<any>;
  onMarkerSet: (position: MarkerPosition) => void;
}) {
  const map = useMapEvents({
    dblclick(e) {
      // Prevent default zoom behavior on double click
      e.originalEvent.preventDefault();

      const { lat, lng } = e.latlng;
      form.setFieldValue('latitude', lat);
      form.setFieldValue('longitude', lng);
      onMarkerSet({ lat, lng });

      // Center and zoom to the selected location
      map.setView([lat, lng], 16, { animate: true });
    },
  });

  return null;
}

export default function SetMap({
  form,
  center = [40.3774, 49.8542], // Baku coordinates (more accurate)
  zoom = 13,
  ...props
}: SetMapProps) {
  const [markerPosition, setMarkerPosition] = useState<MarkerPosition | null>(null);

  // Initialize marker position from form values if they exist
  useEffect(() => {
    const lat = form.getValues().latitude;
    const lng = form.getValues().longitude;

    if (lat && lng && typeof lat === 'number' && typeof lng === 'number') {
      setMarkerPosition({ lat, lng });
    }
  }, [form]);

  const handleMarkerSet = (position: MarkerPosition) => {
    setMarkerPosition(position);
  };

  const handleRemoveMarker = () => {
    setMarkerPosition(null);
    form.setFieldValue('latitude', null);
    form.setFieldValue('longitude', null);
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      doubleClickZoom={false} // Disable default double-click zoom
      style={{ height: '400px', width: '100%', borderRadius: '8px' }}
      {...props}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapEventHandler form={form} onMarkerSet={handleMarkerSet} />

      {markerPosition && (
        <Marker position={[markerPosition.lat, markerPosition.lng]}>
          <Popup closeButton={false} minWidth={200}>
            <Box p='xs'>
              <Text size='sm' fw={600} mb='xs'>
                Selected Location
              </Text>
              <Text size='xs' c='dimmed' mb='xs'>
                Lat: {markerPosition.lat.toFixed(6)}
                <br />
                Lng: {markerPosition.lng.toFixed(6)}
              </Text>
              <Group gap='xs' justify='center'>
                <Button
                  size='xs'
                  color='red'
                  variant='light'
                  leftSection={<IconTrash size={12} />}
                  onClick={handleRemoveMarker}
                >
                  Remove
                </Button>
              </Group>
            </Box>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
