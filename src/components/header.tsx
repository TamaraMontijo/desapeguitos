import { Blocks } from "lucide-react-native"
import { View, Text } from "react-native"

type Props = {
  title: string
}
export default function Header({title}: Props) {
  return (
    <View className="bg-primary-500 h-[12%] justify-end items-center p-4">  
        <View className="flex-row items-center gap-4">
          <Blocks color="white" />
          <Text className="text-white text-xl font-bold">DESAPEGUITOS</Text>
        </View>
    </View>

  )
}