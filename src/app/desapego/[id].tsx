import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Desapego(){
  const id = useLocalSearchParams()

  console.log(id)
  return (
    <View className="flex-1">
      <Text>oi</Text>
    </View>
  )
}