import { View, Image, Text } from "react-native";

export function Loading() {
  return (
    <View className="flex-1 justify-center items-center" >
      <Image
        source={require('../assets/loading.gif')}
        className="w-1/5 h-1/5"
      />
      <Text>Carregando</Text>
    </View>
  );
}
