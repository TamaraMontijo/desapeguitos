import { View, Text } from "react-native";

import { Search } from "lucide-react-native";

import Header from "@/components/header";
import { Input } from "@/components/input";
import { colors } from "@/styles/colors";
import { Button } from "@/components/button";

export default function Home() {
  return (
    <>
      <Header title="DESAPEGUITOS" />
      <View className="flex-1 items-center justify-center">
        
        <Text>Home</Text>
        <Input>
          <Input.Field placeholder="Buscar produto" returnKeyType="search" />
          <Search color={colors.purple[500]}/>
        </Input>
        <Button title="Filtros"/>
      </View>
    </>
  );
}
