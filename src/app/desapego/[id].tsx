import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Link, useLocalSearchParams } from "expo-router";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Desapego as DesapegoInterface } from "@/utils/data/desapego";
import { db } from "../../../firebaseConfig.js";
import { formatCurrency } from "@/utils/functions/format-currency";
import { fetchLocationAndCalculateDistance } from "@/utils/functions/locationUtils";
import axios from "axios";

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
    if (!desapego?.cep) return;

    const fetchNeighborhood = async () => {
      const bairro = await getNeighborhood(desapego.cep);
      setNeighborhood(bairro);
    };

    fetchNeighborhood();
  }, [desapego?.cep]);

  // Request user location and calculate distance to Desapego
  useEffect(() => {
    const calculateDistanceToDesapego = async () => {
      if (!desapego?.cep) return;
      
      const { distance, userCoordinates } = await fetchLocationAndCalculateDistance(desapego.cep);
      if (userCoordinates) {
        setUserLocation(userCoordinates);
      }
      if (distance !== null) {
        setDistance(distance);
      } else {
        setErrorMsg("Erro ao calcular distância");
      }
    };

    calculateDistanceToDesapego();
  }, [desapego?.cep]);

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

  // Function to fetch coordinates and neighborhood from google API
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

  return (
    <ScrollView className="flex-1 p-4">
      <View>
        <Image source={{ uri: desapego.imageUrl }} className="w-full h-72 rounded-lg" resizeMode="cover" />
        <View>
          <View className="flex flex-row items-end justify-between my-8">
          <Text className="font-nunitoBold text-blue text-4xl w-1/2 flex-wrap">{desapego.title}</Text>
          <Text className="font-nunitoBold text-blue text-xl">
            há <Text className="text-green">{distance ? `${distance.toFixed(1)} km` : '...'}</Text>
          </Text>
          </View>
          

          {
            (desapego.type === 'Venda') &&
             <Text className="font-nunitoBold text-blue text-3xl mb-8 text-right">R${formatCurrency(desapego.price)}</Text>
          }

          <Text className="font-nunitoBold text-blue text-2xl mb-2">Descrição</Text>
          <Text className="font-nunitoRegular text-dark text-xl mb-10 text-justify pr-4">{desapego.description}</Text>
          <View className="flex-row justify-between pr-4">
          {
            (desapego.age || desapego.size) &&
            <View>
            <Text className="font-nunitoBold text-blue text-2xl">Tamanho</Text>
            <Text className="font-nunitoRegular text-dark text-xl">{desapego.age} {desapego.size}</Text>
          </View>
          }
            
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
