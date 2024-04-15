import { Text, View, Image, TouchableOpacity, TouchableOpacityProps, ImageProps } from "react-native";

type DesapegoDataProps = {
  title: string
  description: string
  thumbnail: ImageProps
  age: string
}

type DesapegoProps = TouchableOpacityProps & {
  data: DesapegoDataProps
}

export function Card({ data, ...rest }: DesapegoProps) {
  return (
    <TouchableOpacity className="w-52 border-solid border-2 drop-shadow-lg border-purple-500 items-center rounded-lg" {...rest}>
      <View className="px-2 pt-1 items-center">
      <Image source={{ uri: 'https://picsum.photos/700' }} className="w-48 h-44 rounded-t-lg"/>
      <View className='flex-row py-2 gap-16'>
        <Text className='text-blue font-nunitoBold'>1 ano +</Text>
        <Text className='text-green font-nunitoBold'>0.5 km</Text>
      </View>
      <View className='w-44'>
      <Text className='font-nunitoRegular'>
        {data.description}
      </Text>
      </View>
      </View>
      
    </TouchableOpacity>
  )
}