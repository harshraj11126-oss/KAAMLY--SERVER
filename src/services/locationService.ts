import { UserLocation } from '../types';
import { INDIA_STATES_DATA } from '../data/indiaLocations';

export interface LocationDetectionResult {
  success: boolean;
  location?: UserLocation;
  errorMessage?: string;
  errorCode?: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'NOT_SUPPORTED';
}

export async function detectCurrentLocation(): Promise<LocationDetectionResult> {
  if (!navigator.geolocation) {
    return {
      success: false,
      errorCode: 'NOT_SUPPORTED',
      errorMessage: 'Geolocation is not supported by your device or browser.'
    };
  }

  return new Promise((resolve) => {
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Privacy protection: Obscure coordinates to neighborhood level (~1.1km)
        const blurredLat = Math.round(latitude * 100) / 100;
        const blurredLon = Math.round(longitude * 100) / 100;

        try {
          // Reverse geocode via OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en',
                'User-Agent': 'Kaamly-App/1.0'
              }
            }
          );

          if (res.ok) {
            const data = await res.json();
            const address = data.address || {};

            const detectedStateName = address.state || '';
            const detectedDistrictName = address.state_district || address.county || '';
            const detectedCityName = address.city || address.town || address.village || address.suburb || address.municipality || '';
            const detectedLocality = address.suburb || address.neighbourhood || address.residential || address.road || '';

            // Match against Indian State records
            const matchedState = INDIA_STATES_DATA.find(
              s =>
                s.name.toLowerCase() === detectedStateName.toLowerCase() ||
                detectedStateName.toLowerCase().includes(s.name.toLowerCase()) ||
                s.name.toLowerCase().includes(detectedStateName.toLowerCase())
            );

            const finalState = matchedState ? matchedState.name : (detectedStateName || 'Karnataka');
            const finalDistrict = detectedDistrictName || (matchedState?.districts[0]?.name || 'Bengaluru Urban');
            const finalCity = detectedCityName || (matchedState?.districts[0]?.cities[0] || 'Bengaluru');
            const finalLocality = detectedLocality || 'Current Area';

            resolve({
              success: true,
              location: {
                latitude: blurredLat,
                longitude: blurredLon,
                state: finalState,
                district: finalDistrict,
                city: finalCity,
                locality: finalLocality,
                isGPS: true
              }
            });
            return;
          }
        } catch (fetchErr) {
          console.warn('Reverse geocoding network error, falling back to approximation:', fetchErr);
        }

        // Fallback if reverse geocode is slow or offline
        resolve({
          success: true,
          location: {
            latitude: blurredLat,
            longitude: blurredLon,
            state: 'Detected via GPS',
            district: 'Local District',
            city: 'Nearby City',
            locality: 'Approximate Location',
            isGPS: true
          }
        });
      },
      (err) => {
        let code: LocationDetectionResult['errorCode'] = 'POSITION_UNAVAILABLE';
        let msg = 'Unable to determine your current location. Please choose manually.';

        if (err.code === err.PERMISSION_DENIED) {
          code = 'PERMISSION_DENIED';
          msg = 'Location permission was denied. Please allow location access or select your city manually.';
        } else if (err.code === err.TIMEOUT) {
          code = 'TIMEOUT';
          msg = 'Location request timed out. Please check your GPS or choose your city manually.';
        }

        resolve({
          success: false,
          errorCode: code,
          errorMessage: msg
        });
      },
      options
    );
  });
}
