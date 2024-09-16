import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
  type MapCameraChangedEvent,
} from '@vis.gl/react-google-maps';

import { IoMdLocate } from 'react-icons/io';

const Me = () => {
  return (
    <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow shadow-blue-500 animate-pulse" />
  );
};

const Locator = () => {
  const map = useMap('map');
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);

  const goToUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (!map) {
          return;
        }
        map.panTo({ lat: position.coords.latitude, lng: position.coords.longitude });
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        map.setZoom(26);
      });
    }
  }, [map, setUserLocation]);

  useEffect(() => {
    goToUserLocation();
  }, [goToUserLocation]);

  return (
    <>
      <button
        onClick={() => goToUserLocation()}
        className="absolute top-14 right-[10px] shadow-slate-400 shadow bg-white p-1"
      >
        <IoMdLocate className="w-8 h-8 fill-blue-500" />
      </button>
      {userLocation && (
        <AdvancedMarker position={userLocation}>
          <Me />
        </AdvancedMarker>
      )}
    </>
  );
};

export const GoogleMaps = ({ apiKey }: { apiKey: string }) => {
  const center = useMemo(() => ({ lat: 22.4747061, lng: 88.3642162 }), []);
  const zoom = useMemo(() => 15, []);

  return (
    <section className="w-full h-[500px]">
      <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
          id="map"
          gestureHandling={'greedy'}
          defaultZoom={zoom}
          defaultCenter={center}
          mapId={'4e06f8f1228c0ba9'}
          onCameraChanged={(ev: MapCameraChangedEvent) =>
            console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
          }
          className="relative w-full h-full"
        >
          <Locator />
        </Map>
      </APIProvider>
    </section>
  );
};
