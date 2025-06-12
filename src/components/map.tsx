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
  const validVenues = venues.filter(
    (v) =>
      v &&
      typeof v.latitude === 'number' &&
      typeof v.longitude === 'number' &&
      !isNaN(v.latitude) &&
      !isNaN(v.longitude)
  );
  const defaultCenter = (props.center as [number, number]) || [40.3774, 49.8542];

  const center: [number, number] =
    validVenues.length > 0
      ? validVenues.length > 1
        ? [
            validVenues.reduce((acc, v) => acc + v.latitude, 0) / validVenues.length,
            validVenues.reduce((acc, v) => acc + v.longitude, 0) / validVenues.length,
          ]
        : [validVenues[0].latitude, validVenues[0].longitude]
      : defaultCenter;

  const zoom = validVenues.length > 0 ? props.zoom || 13 : 10;

  return (
    <MapContainer center={center} zoom={zoom} {...props}>
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      {validVenues.map((v) => (
        <Marker key={v.id || v.name} position={[v.latitude, v.longitude]} {...markerProps}>
          <Popup autoClose closeButton={false} closeOnClick closeOnEscapeKey keepInView {...popupProps}>
            {renderPopup ? renderPopup(v) : v.name}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
