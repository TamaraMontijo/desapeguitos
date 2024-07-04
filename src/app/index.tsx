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

import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'

import { 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signInWithCredential,
  signOut
} from 'firebase/auth'
import { auth } from '../../firebaseConfig'

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";

WebBrowser.maybeCompleteAuthSession()

export default function Home() {
  // AUTH
  const [userInfo, setUserInfo] = React.useState();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '',
    iosClientId: '',
    webClientId: '',
  })

  React.useEffect(() => {
    if (response?.type == "success") {
      const { id_token } = response.params
      const credential = GoogleAuthProvider.credential(id_token)

      signInWithCredential(auth, credential)
    } 

    if (response?.type == "error") {
      console.log("erro")
    }
  }, [response])

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(JSON.stringify(user, null, 2))
        // setUserInfo(user)
      } else {
        console.log("User is not Autheticated")
      }
    });

    return () => unsub();
  }, [])


  const [category, setCategory] = useState(CATEGORIES[0]);

  function handleCategorySelect(selectedCategory: string) {
    setCategory(selectedCategory);
  }

  return (
    <View className="p-2">
      <View className='flex-1 items-center justify-center m-10'>
        <Button title="Sign Out"bgColor={"bg-black"} onPress={async () => await signOut(auth)}/> 
        <Button title="Sign in" onPress={() => promptAsync()} bgColor={"bg-primary-500"}/>
        
      </View>
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
