"use client";

import { GoogleMap, LoadScript, Polygon, Autocomplete } from "@react-google-maps/api";
import { useState, useRef } from "react";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const initialCenter = { lat: -12.0464, lng: -77.0428 }; // Lima, Perú

const GoogleMapComponent = () => {
  const [center, setCenter] = useState(initialCenter);
  const [polygonPath, setPolygonPath] = useState<google.maps.LatLngLiteral[]>([]);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Función para generar un polígono circular si Google no proporciona uno
  const generateCircularPolygon = (lat: number, lng: number, radius: number, points = 20) => {
    const path: google.maps.LatLngLiteral[] = [];
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * 2 * Math.PI; // Ángulo en radianes
      path.push({
        lat: lat + (radius / 111) * Math.cos(angle), // 111 km ≈ 1° latitud
        lng: lng + (radius / (111 * Math.cos(lat * (Math.PI / 180)))) * Math.sin(angle),
      });
    }
    path.push(path[0]); // Cierra el polígono
    return path;
  };

  // Manejar selección de un lugar en el autocompletado
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.geometry) {
        const newCenter = {
          lat: place.geometry.location?.lat() || initialCenter.lat,
          lng: place.geometry.location?.lng() || initialCenter.lng,
        };

        setCenter(newCenter);

        // Verificar si el lugar tiene una geometría de polígono definida
        const geometry = place.geometry;
        if (geometry && geometry.viewport) {
          const ne = geometry.viewport.getNorthEast();
          const sw = geometry.viewport.getSouthWest();

          const polygonPath = [
            { lat: ne.lat(), lng: sw.lng() },
            { lat: ne.lat(), lng: ne.lng() },
            { lat: sw.lat(), lng: ne.lng() },
            { lat: sw.lat(), lng: sw.lng() },
            { lat: ne.lat(), lng: sw.lng() },
          ];

          setPolygonPath(polygonPath);
        } else {
          // Si no hay polígono predefinido, generamos un polígono circular
          setPolygonPath(generateCircularPolygon(newCenter.lat, newCenter.lng, 2)); // 2 km de radio
        }
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string} libraries={["places"]}>
      <div>
        {/* Input de búsqueda */}
        <Autocomplete onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)} onPlaceChanged={onPlaceChanged}>
          <input type="text" placeholder="Buscar ubicación..." className="border p-2 w-full mb-2" />
        </Autocomplete>

        {/* Mapa con Polígono */}
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
          {polygonPath.length > 0 && (
            <Polygon
              paths={polygonPath}
              options={{
                fillColor: "blue",
                fillOpacity: 0.2,
                strokeColor: "blue",
                strokeOpacity: 0.6,
                strokeWeight: 2,
              }}
            />
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default GoogleMapComponent;
