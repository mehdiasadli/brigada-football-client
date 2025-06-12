/* eslint-disable @typescript-eslint/no-explicit-any */
import 'leaflet/dist/leaflet.css';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  type MapContainerProps,
  type MarkerProps,
  type PopupProps,
} from 'react-leaflet';

import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type Venue = {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
};

interface MapProps extends MapContainerProps {
  venue: Venue | Venue[];
  markerProps?: MarkerProps;
  popupProps?: PopupProps;
  renderPopup?: (venue: Venue) => React.ReactNode;
}

export function Map({ venue, markerProps, popupProps, renderPopup, ...props }: MapProps) {
  const venues = Array.isArray(venue) ? venue : [venue];
  const center =
    venues.length > 1
      ? ([
          venues.reduce((acc, v) => acc + v.latitude, 0) / venues.length,
          venues.reduce((acc, v) => acc + v.longitude, 0) / venues.length,
        ] as [number, number])
      : ([venues[0].latitude, venues[0].longitude] as [number, number]);

  return (
    <MapContainer center={center} zoom={13} {...props}>
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      {venues.map((v) => (
        <Marker key={v.name} position={[v.latitude, v.longitude]} {...markerProps}>
          <Popup autoClose closeButton={false} closeOnClick closeOnEscapeKey keepInView {...popupProps}>
            {renderPopup ? renderPopup(v) : v.name}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
