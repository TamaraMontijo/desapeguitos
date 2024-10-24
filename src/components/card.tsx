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
import { Tag } from "./tag";

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
  category: string;
};

type DesapegoProps = TouchableOpacityProps & {
  data: DesapegoDataProps;
};

export const Card = forwardRef<TouchableOpacity, DesapegoProps>(
  ({ data, ...rest }, ref) => {
    const [distance, setDistance] = useState<number | null>(null);
    const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        const { userCoordinates, distance } = await fetchLocationAndCalculateDistance(data.cep);
        setUserLocation(userCoordinates);
        setDistance(distance);
      };

      fetchData();
    }, [data.cep]);

    const getTagColor = (type: string) => {
      switch (type) {
        case 'Venda':
          return '#00AFA9'; // verde
        case 'Troca':
          return '#FFCC37'; // amarelo
        case 'Doação':
          return '#F88323'; // laranja
        default:
          return '#000'; // fallback
      }
    };
    return (
      <TouchableOpacity
        ref={ref}
        style={{
          width: 200,
          borderWidth: 2,
          borderColor: 'rgba(0, 0, 0, 0.3)',
          shadowColor: '#000',
          padding: 5,
          alignItems: 'center',
          borderRadius: 10,
        }}
        {...rest}
      >
        <Tag text={data.type} backgroundColor={getTagColor(data.type)} />
        <View className="pt-1 relative">
          <Image
            source={{ uri: data.imageUrl }}
            className="w-52 h-44 rounded-t-lg"
            style={{ zIndex: -1 }}
          />
          <View className="max-w-full">
            <View>
              <Text className=" font-nunitoBold text-blue mt-1">{data.title}</Text>
              <View className="flex justify-between">
                <Text className="text-green font-nunitoBold">há {distance ? `${distance.toFixed(1)} km` : '...'}</Text>
                <Text className="text-green font-nunitoBold">R${data.price}</Text>
              </View>

            </View>
            <Text className="text-blue font-nunitoBold">{data.age}</Text>
            <View className="w-44 mb-1">
              <Text className="font-nunitoRegular">{data.description}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);
