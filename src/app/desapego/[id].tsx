import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { DESAPEGO } from "@/utils/data/desapego";
import { formatCurrency } from "@/utils/functions/format-currency";

export default function Desapego() {
  const { id } = useLocalSearchParams();

  const desapego = DESAPEGO.filter((item) => item.id === id)[0];

  return (
    <ScrollView className="flex-1 p-4 ">
      <View>
        <Image
          source={{ uri: "https://picsum.photos/500" }}
          className="w-full h-72 rounded-lg"
          resizeMode="cover"
        />
        <View>
          <Text className="font-nunitoBold text-blue text-4xl mt-4">
            {desapego.title}
          </Text>
          <Text className=" font-nunitoBold text-blue text-xl mb-4">
            há
            <Text className="text-green"> 0.5 km </Text>
          </Text>
          <Text className=" font-nunitoBold text-blue text-3xl mb-8">
            {formatCurrency(desapego.price)}
          </Text>
          <Text className="font-nunitoBold text-blue text-2xl mb-2">
            Descrição
          </Text>
          <Text className="font-nunitoRegular text-dark text-xl mb-10 text-justify pr-4">
            {desapego.description}
          </Text>
          <View className="flex-row justify-between pr-4">
            <View>
              <Text className="font-nunitoBold text-blue text-2xl">
                Indicado para
              </Text>
              <Text className="font-nunitoRegular text-dark text-xl">
                {desapego.age}
              </Text>
            </View>

            <View>
              <Text className="font-nunitoBold text-blue text-2xl">
                Localização
              </Text>
              <Text className="font-nunitoRegular text-dark text-xl">
                Sudoeste
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className="mt-16 pb-20">
        <Text className="mb-12 font-nunitoBold text-blue text-2xl">
          Desapego de:
        </Text>
        <View className="flex-row items-center gap-4">
          <Image
            className="w-24 h-24 rounded-full"
            source={{ uri: "https://github.com/tamaramontijo.png" }}
          />
          <View>
            <Text className="font-nunitoBold text-xl mb-2">Tamara Montijo</Text>
            <Text className="font-nunitoLight">Último acesso há 2 minutos</Text>
            <Text className="font-nunitoRegular">
              No desapeguitos desde abril de 2024
            </Text>
          </View>
        </View>
        <TouchableOpacity className="w-28 h-28 absolute ml-[75%] mt-[10%]">
          <Link href={`https://wa.me/5561998257785`}>
            <Image source={require("@/assets/whatsapp.png")} className="w-28 h-28"/>
          </Link>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
