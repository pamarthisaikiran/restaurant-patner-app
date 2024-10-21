// src/components/Map.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const Map = ({ setLocation, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition || [51.505, -0.09]); // Default to London

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        setLocation(e.latlng.lat, e.latlng.lng); // Update parent component with the new coordinates
      },
    });

    return position === null ? null : (
      <Marker position={position} icon={L.icon({ iconUrl: '/path/to/marker-icon.png' })}>
        <Popup>You are here!</Popup>
      </Marker>
    );
  };

  return (
    <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }} scrollWheelZoom>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default Map;
