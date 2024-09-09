// locationUtils.ts
import axios from 'axios';
import * as Location from 'expo-location';
import { useState } from 'react';
import { Desapego as DesapegoInterface } from "@/utils/data/desapego";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
const [distance, setDistance] = useState<number | null>(null);
const [errorMsg, setErrorMsg] = useState<string | null>(null);
const [desapego, setDesapego] = useState<DesapegoInterface | null>(null);

export async function getCoordinatesFromCEP(cep: string): Promise<Coordinates | null> {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: cep,
        key: process.env.EXPO_PUBLIC_GEOCODING_API_KEY,
      },
    });
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return { latitude: location.lat, longitude: location.lng };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar coordenadas para o CEP:', error);
    return null;
  }
}

export function calculateDistance(loc1: Coordinates, loc2: Coordinates): number {
  const toRadians = (degree: number) => (degree * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km
  const dLat = toRadians(loc2.latitude - loc1.latitude);
  const dLon = toRadians(loc2.longitude - loc1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(loc1.latitude)) * Math.cos(toRadians(loc2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export async function fetchLocationAndCalculateDistance(
    cep: string
  ): Promise<{ userCoordinates: Coordinates | null; distance: number | null }> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permissão de acesso à localização negada');
      }
  
      const location = await Location.getCurrentPositionAsync({});
      const userCoordinates: Coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
  
      const desapegoCoordinates = await getCoordinatesFromCEP(cep);
      if (desapegoCoordinates) {
        const distanceKm = calculateDistance(userCoordinates, desapegoCoordinates);
        return { userCoordinates, distance: distanceKm };
      }
  
      return { userCoordinates, distance: null };
    } catch (error) {
      console.error('Erro ao buscar localização ou calcular distância:', error);
      return { userCoordinates: null, distance: null };
    }
  }
