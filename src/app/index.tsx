import { useState } from "react";
import { View, SectionList, FlatList, Text } from "react-native";

import { Search } from "lucide-react-native";

import { colors } from "@/styles/colors";
import { CATEGORIES, DESAPEGO } from "@/utils/data/desapego";

import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { CategoryLabel } from "@/components/category-label";
import { Card } from "@/components/card";

export default function Home() {
  const [category, setCategory] = useState(CATEGORIES[0]);

  function handleCategorySelect(selectedCategory: string) {
    setCategory(selectedCategory);
  }

  return (
    <View className="p-2">
    <View className="p-3">
      <View className="flex-row w-full gap-2 items-center justify-between">
        <Input>
          <Input.Field placeholder="Buscar produto" returnKeyType="search" />
          <Search color={colors.primary[500]} />
        </Input>
        <Button title="Filtros" />
      </View>
      <View className="flex-row">
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <CategoryLabel
              title={item}
              isSelected={item === category}
              onPress={() => handleCategorySelect(item)}
            />
          )}
          horizontal
          className="max-h-10 mb-5"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        />
      </View>
      
    </View>
    <FlatList
    data={DESAPEGO}
    keyExtractor={(item) => item.title}
    renderItem={({ item }) => <Card data={item}/>}
    numColumns={2}
    horizontal={false}
    columnWrapperStyle={{justifyContent: 'space-between', gap: 2}}
    contentContainerStyle={{gap: 4}}
  />
  </View>
  );
}
