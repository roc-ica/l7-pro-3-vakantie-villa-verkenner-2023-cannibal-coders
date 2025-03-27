import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaUtensils, FaShoppingBag, FaLandmark, FaCoffee } from 'react-icons/fa';

interface PropertyMapProps {
  address: string;
  location: string;
  country: string;
}

interface NearbyPlace {
  name: string;
  distance: number;
  category: string;
  coordinates: [number, number];
}

const placeTypes = [
  { 
    id: 'restaurant', 
    label: 'Restaurants', 
    icon: FaUtensils, 
    keywords: ['restaurant', 'food', 'dining']
  },
  { 
    id: 'shopping', 
    label: 'Shopping', 
    icon: FaShoppingBag, 
    keywords: ['supermarket', 'shopping_mall', 'store', 'shop', 'retail']
  },
  { 
    id: 'attraction', 
    label: 'Attractions', 
    icon: FaLandmark, 
    keywords: ['museum', 'theatre', 'tourist_attraction', 'art_gallery', 'landmark']
  },
  { 
    id: 'cafe', 
    label: 'Cafes', 
    icon: FaCoffee, 
    keywords: ['cafe', 'coffee', 'bar']
  },
];

// Fix for the default marker icon issue in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Create custom icon
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Add this new component for map fitting
const MapUpdater: React.FC<{ coordinates: [number, number] }> = ({ coordinates }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(coordinates, 15);
  }, [coordinates, map]);

  return null;
};

const PropertyMap: React.FC<PropertyMapProps> = ({ address, location, country }) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        // Use exact address from database for geocoding
        const fullAddress = `${address}`; // Just use the database address
        console.log('Searching for address:', fullAddress);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `format=json&` +
          `q=${encodeURIComponent(fullAddress)}&` +
          `addressdetails=1&` +
          `limit=1`
        );
        
        const data = await response.json();
        console.log('Geocoding response:', data);
        
        if (data && data[0]) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          console.log('Found coordinates:', [lat, lon]);
          setCoordinates([lat, lon]);
        } else {
          // If exact address fails, try with location and country
          const fallbackSearch = `${location}, ${country}`;
          console.log('Trying fallback search:', fallbackSearch);
          
          const fallbackResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
            `format=json&` +
            `q=${encodeURIComponent(fallbackSearch)}&` +
            `limit=1`
          );
          
          const fallbackData = await fallbackResponse.json();
          
          if (fallbackData && fallbackData[0]) {
            setCoordinates([parseFloat(fallbackData[0].lat), parseFloat(fallbackData[0].lon)]);
          } else {
            setCoordinates([52.1326, 5.2913]); // Netherlands center as last resort
            setLoadError('Could not find exact location on map');
          }
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
        setLoadError('Error loading map location');
        setCoordinates([52.1326, 5.2913]);
      }
    };

    if (address) {
      fetchCoordinates();
    }
  }, [address]); // Only depend on address

  const searchNearbyPlaces = async (type: string) => {
    if (!coordinates) return;

    setSelectedType(type);
    setNearbyPlaces([]); // Clear previous results
    setIsSearching(true); // Start loading

    try {
      const selectedType = placeTypes.find(t => t.id === type);
      if (!selectedType) {
        setIsSearching(false);
        return;
      }

      // Search for all keywords related to this type
      const searchPromises = selectedType.keywords.map(keyword =>
        fetch(
          `https://nominatim.openstreetmap.org/search?` + 
          `format=json&` +
          `q=${keyword}&` +
          `viewbox=${coordinates[1]-0.05},${coordinates[0]-0.05},${coordinates[1]+0.05},${coordinates[0]+0.05}&` +
          `bounded=1&` +
          `limit=5`
        ).then(res => res.json())
      );

      const results = await Promise.all(searchPromises);
      const allPlaces = results.flat();
      
      // Remove duplicates and process places
      const uniquePlaces = Array.from(new Set(allPlaces.map(place => place.place_id)))
        .map(id => allPlaces.find(place => place.place_id === id))
        .filter(place => place && place.lat && place.lon)
        .map((place: any) => ({
          name: place.display_name.split(',')[0],
          distance: calculateDistance(
            coordinates[0],
            coordinates[1],
            parseFloat(place.lat),
            parseFloat(place.lon)
          ),
          category: type,
          coordinates: [parseFloat(place.lat), parseFloat(place.lon)] as [number, number]
        }))
        .filter(place => place.distance <= 2000) // Increase search radius to 2km
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10); // Limit to 10 closest results

      setNearbyPlaces(uniquePlaces);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      setNearbyPlaces([]);
    } finally {
      setIsSearching(false); // End loading
    }
  };

  // Add this helper function to calculate distance between coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  if (!coordinates) {
    return (
      <div className="h-[350px] bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Search buttons - Updated styling */}
      <div className="flex flex-wrap gap-2 relative">
        {placeTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => searchNearbyPlaces(type.id)}
            disabled={isSearching}
            className={`
              flex items-center px-4 py-2 rounded-lg transition-all duration-9200
              ${isSearching && selectedType === type.id ? 'opacity-75 cursor-wait' : ''}
              ${selectedType === type.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <type.icon className={`mr-2 ${selectedType === type.id ? 'text-white' : 'text-blue-600'}`} />
            {type.label}
            {isSearching && selectedType === type.id && (
              <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>
        ))}
      </div>

      {/* Map container - Updated height */}
      <div className="h-[350px] w-full rounded-lg overflow-hidden relative">
        <MapContainer
          key={coordinates ? `${coordinates[0]}-${coordinates[1]}` : 'loading'}
          center={coordinates || [52.1326, 5.2913]}
          zoom={15}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {coordinates && (
            <>
              <MapUpdater coordinates={coordinates} />
              <Marker position={coordinates} icon={customIcon}>
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-gray-900">{address}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {location}, {country}
                    </p>
                  </div>
                </Popup>
              </Marker>
            </>
          )}

          {/* Search radius */}
          <Circle
            center={coordinates}
            radius={1500}
            pathOptions={{
              color: '#2563eb',
              fillColor: '#3b82f6',
              fillOpacity: 0.1,
              weight: 1
            }}
          />

          {/* Nearby places */}
          {nearbyPlaces.map((place, index) => (
            <Marker 
              key={index} 
              position={place.coordinates}
              icon={L.divIcon({
                className: 'bg-transparent border-0',
                html: `
                  <div class="w-4 h-4 bg-white rounded-full border-2 border-blue-600 shadow-md">
                    <div class="absolute w-2 h-2 bg-blue-600 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                `,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
              })}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-gray-900">{place.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {place.distance < 1000 
                      ? `${Math.round(place.distance)} meters away`
                      : `${(place.distance/1000).toFixed(1)} km away`}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Loading overlay */}
        {isSearching && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1000]">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-gray-700">Searching nearby places...</p>
            </div>
          </div>
        )}
      </div>

      {/* Error message - Updated styling */}
      {loadError && (
        <div className="text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded-md">
          {loadError}
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
