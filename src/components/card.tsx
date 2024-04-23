import { forwardRef } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableOpacityProps,
  ImageProps,
} from "react-native";

type DesapegoDataProps = {
  title: string;
  description: string;
  thumbnail: ImageProps;
  age: string;
};

type DesapegoProps = TouchableOpacityProps & {
  data: DesapegoDataProps;
};

export const Card = forwardRef<TouchableOpacity, DesapegoProps>(
  ({ data, ...rest }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        className="w-52 border-solid border-2 drop-shadow-lg border-dark/30 items-center rounded-lg"
        {...rest}
      >
        <View className="pt-1">
          <Image
            source={{ uri: "https://picsum.photos/400" }}
            className="w-48 h-44 rounded-t-lg"
          />
          <Text className=" font-nunitoBold text-blue mt-1">{data.title}</Text>
          <View className="flex-row py-2 gap-16 justify-between">
            <Text className="text-blue font-nunitoBold">{data.age}</Text>
            <Text className="text-green font-nunitoBold">0.5 km</Text>
          </View>
          <View className="w-44 mb-1">
            <Text className="font-nunitoRegular">{data.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);
