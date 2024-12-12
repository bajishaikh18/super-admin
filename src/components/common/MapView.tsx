import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export const MapView = ({
    address,
    latitude,
    longitude
  }:{
  address: string,
  latitude?: string,
  longitude?: string
}
) => {
  const [markerPos, setMarkerPos] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const handleGeocode = async (address: string) => {
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        setMarkerPos({
          lat: location.lat,
          lng: location.lng,
        });
      } else {
        console.error("Geocoding failed:", data.status);
        alert("Address not found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching geocode:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    if (!markerPos) {
      if (longitude && latitude) {
        setMarkerPos({ lat: Number(latitude), lng: Number(longitude) });
      } else {
        handleGeocode(address);
      }
    }
  }, [longitude, latitude, address]);
  return (
    <div style={{ height: "300px" }}>
      {markerPos && (
        <APIProvider
          apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY!}
          onLoad={() => console.log("Maps API has loaded.")}
        >
          <Map defaultZoom={13} defaultCenter={markerPos}>
            <Marker position={markerPos}></Marker>
          </Map>
        </APIProvider>
      )}
    </div>
  );
};
