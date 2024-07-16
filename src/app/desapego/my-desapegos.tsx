import { Card } from "@/components/card";
import { DESAPEGO } from "@/utils/data/desapego";
import { Link } from "expo-router";
import { FlatList, View } from "react-native";

export default function MyDesapegos() {
    return (
        <View className="py-8 px-2">
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
          columnWrapperStyle={{ justifyContent: "space-around" }}
          contentContainerStyle={{ gap: 12 }}
        /> 
        </View>
    )
}