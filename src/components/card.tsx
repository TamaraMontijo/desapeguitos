import { calculateDistance, Coordinates, fetchLocationAndCalculateDistance, getCoordinatesFromCEP } from "@/utils/functions/locationUtils";
import { forwardRef, useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableOpacityProps,
  ImageProps,
} from "react-native";

type DesapegoDataProps = {
  id: string;
  cep: string;
  description: string;
  imageUrl: string;
  itensToExchange: string;
  price: number;
  title: string;
  type: 'Venda' | 'Troca' | 'Doação';
  whatsappNumber: string;
  gender?: string;
  age?: string;
};

type DesapegoProps = TouchableOpacityProps & {
  data: DesapegoDataProps;
  userLocation: Coordinates;
};

export const Card = forwardRef<TouchableOpacity, DesapegoProps>(
  ({ data, ...rest }, ref) => {
    const [distance, setDistance] = useState<number | null>(null);

    
    
    return (
      <TouchableOpacity
        ref={ref}
        className="w-52 border-solid border-2 drop-shadow-lg border-dark/30 items-center rounded-lg"
        {...rest}
      >
        <View className="pt-1">
          <Image
            source={{ uri: data.imageUrl }}
            className="w-48 h-44 rounded-t-lg"
          />
          <View className="flex-row justify-between">
            <Text className=" font-nunitoBold text-blue mt-1">{data.title}</Text>
            <Text className="text-green font-nunitoBold">{distance ? `${distance.toFixed(1)} km` : '...'}</Text>    
          </View>
          <Text className="text-blue font-nunitoBold">{data.age}</Text>
          <View className="w-44 mb-1">
            <Text className="font-nunitoRegular">{data.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);
