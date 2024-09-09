import { useEffect, useState } from "react";
import axios from "axios";
import * as Location from 'expo-location';
import { doc, getDoc } from "firebase/firestore";
import { Link, useLocalSearchParams } from "expo-router";
import { formatCurrency } from "@/utils/functions/format-currency";
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Desapego as DesapegoInterface } from "@/utils/data/desapego";
import { db } from "../../../firebaseConfig.js";

// Interface for storing the location data
interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function Desapego() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [desapego, setDesapego] = useState<DesapegoInterface | null>(null);
  const [neighborhood, setNeighborhood] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch Desapego data
  useEffect(() => {
    if (!id) return;

    const fetchDesapego = async () => {
      try {
        const docRef = doc(db, 'desapego', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDesapego({ id: docSnap.id, ...docSnap.data() } as DesapegoInterface);
        } else {
          console.log("Documento não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar desapego:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesapego();
  }, [id]);

  // Fetch Neighborhood once Desapego is loaded
  useEffect(() => {
    if (!desapego) return;

    const fetchNeighborhood = async () => {
      const bairro = await getNeighborhood(desapego.cep);
      setNeighborhood(bairro);
    };

    fetchNeighborhood();
  }, [desapego]);

  // Request user location and calculate distance to Desapego
  useEffect(() => {
    const fetchLocationAndCalculateDistance = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permissão de acesso à localização negada');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const userCoordinates = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        };
        setUserLocation(userCoordinates);

        if (desapego) {
          const desapegoCoordinates = await getCoordinatesFromCEP(desapego.cep);
          if (desapegoCoordinates) {
            const distanceKm = calculateDistance(userCoordinates, desapegoCoordinates);
            setDistance(distanceKm);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar localização:", error);
      }
    };

    fetchLocationAndCalculateDistance();
  }, [desapego]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!desapego) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Desapego não encontrado.</Text>
      </View>
    );
  }

  // Function to fetch coordinates and neighborhood from ViaCEP API
  async function getNeighborhood(cep: string): Promise<string | null> {
     try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: cep,
        key: process.env.EXPO_PUBLIC_GEOCODING_API_KEY,
      },
    });

    if (response.data.status === 'OK') {
      const result = response.data.results[0];
      const neighborhoodComponent = result.address_components.find((component: any) =>
        component.types.includes('sublocality') || component.types.includes('neighborhood')
      );
      return neighborhoodComponent ? neighborhoodComponent.long_name : null;
    } else {
      console.error(`Google API error: ${response.data.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Failed to fetch data for CEP ${cep}:`, error);
    return null;
  }
  }

  async function getCoordinatesFromCEP(cep: string): Promise<Coordinates | null> {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${process.env.EXPO_PUBLIC_GEOCODING_API_KEY}`);
      if (response.data.status === "OK") {
        const location = response.data.results[0].geometry.location;
        return { latitude: location.lat, longitude: location.lng };
      }
      console.error('Erro ao buscar coordenadas para o CEP:', response.data);
      return null;
    } catch (error) {
      console.error(`Erro ao buscar coordenadas do CEP: ${cep}`, error);
      return null;
    }
  }

  function calculateDistance(loc1: Coordinates, loc2: Coordinates): number {
    const toRadians = (degree: number) => (degree * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(loc2.latitude - loc1.latitude);
    const dLon = toRadians(loc2.longitude - loc1.longitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(loc1.latitude)) * Math.cos(toRadians(loc2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  return (
    <ScrollView className="flex-1 p-4">
      <View>
        <Image source={{ uri: desapego.imageUrl }} className="w-full h-72 rounded-lg" resizeMode="cover" />
        <View>
          <Text className="font-nunitoBold text-blue text-4xl mt-4">{desapego.title}</Text>
          <Text className="font-nunitoBold text-blue text-xl mb-4">
            há <Text className="text-green">{distance ? `${distance.toFixed(1)} km` : '...'}</Text>
          </Text>
          <Text className="font-nunitoBold text-blue text-3xl mb-8">{formatCurrency(desapego.price)}</Text>
          <Text className="font-nunitoBold text-blue text-2xl mb-2">Descrição</Text>
          <Text className="font-nunitoRegular text-dark text-xl mb-10 text-justify pr-4">{desapego.description}</Text>
          <View className="flex-row justify-between pr-4">
            <View>
              <Text className="font-nunitoBold text-blue text-2xl">Tamanho</Text>
              <Text className="font-nunitoRegular text-dark text-xl">{desapego.age} {desapego.size}</Text>
            </View>
            <View>
              <Text className="font-nunitoBold text-blue text-2xl">Localização</Text>
              <Text className="font-nunitoRegular text-dark text-xl">{neighborhood || 'Carregando bairro...'}</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="mt-16 pb-20">
        <Text className="mb-12 font-nunitoBold text-blue text-2xl">Desapego de:</Text>
        <View className="flex-row items-center gap-4">
          <Image className="w-24 h-24 rounded-full" source={{ uri: `${desapego.userPhoto}` }} />
          <View>
            <Text className="font-nunitoBold text-xl mb-2">{desapego.userName}</Text>
            <Text className="font-nunitoLight">Último acesso há 2 minutos</Text>
            <Text className="font-nunitoRegular">No desapeguitos desde abril de 2024</Text>
          </View>
        </View>
        <TouchableOpacity className="w-28 h-28 absolute ml-[75%] mt-[10%]">
          <Link href={`https://wa.me/${desapego.whatsappNumber}`}>
            <Image source={require("@/assets/whatsapp.png")} className="w-28 h-28" />
          </Link>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
