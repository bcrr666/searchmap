"use client";

import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import { useState, useRef } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const initialCenter = {
  lat: -12.0464, // Latitud inicial (Lima, Perú)
  lng: -77.0428, // Longitud inicial
};

const GoogleMapComponent = () => {
  const [center, setCenter] = useState(initialCenter);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Función para manejar la selección de un lugar
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        setCenter({
          lat: place.geometry.location?.lat() || initialCenter.lat,
          lng: place.geometry.location?.lng() || initialCenter.lng,
        });
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string} libraries={["places"]}>
      <div>
        {/* Input de búsqueda */}
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            placeholder="Buscar ubicación..."
            className="border p-2 w-full mb-2"
          />
        </Autocomplete>

        {/* Mapa */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default GoogleMapComponent;
