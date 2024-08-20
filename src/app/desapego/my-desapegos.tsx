import { Card } from "@/components/card";
import { DESAPEGO } from "@/utils/data/desapego";
import { EXPO_PUBLIC_FIREBASE_CONFIG } from "@env";
import { Link } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { FlatList, View } from "react-native";

export default function MyDesapegos() {
  // onAuthStateChanged(FIREBASE_AUTH, (user) => if (user) {

  // } else {

  // })

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