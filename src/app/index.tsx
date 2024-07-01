import { useState } from "react";
import { View, FlatList} from "react-native";
import { Search } from "lucide-react-native";
import { Link } from "expo-router";


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
          <Input style="h-14">
            <Input.Field placeholder="Buscar produto" returnKeyType="search" />
            <Search color={colors.primary[500]} />
          </Input>
          <Button title="Filtros" bgColor={'bg-primary-500'}/>
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
        renderItem={({ item }) => (
          <Link href={`/desapego/${item.id}`} asChild>
            <Card data={item} />
          </Link>
        )}
        numColumns={2}
        horizontal={false}
        columnWrapperStyle={{ justifyContent: "space-between"}}
        contentContainerStyle={{ gap: 12, paddingBottom: 150 }}
      />
    </View>
  );
}
