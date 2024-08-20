import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { Blocks, Radius, Search } from "lucide-react-native";
import { Link } from "expo-router";


import { colors } from "@/styles/colors";
import { CATEGORIES, DESAPEGO } from "@/utils/data/desapego";

import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { CategoryLabel } from "@/components/category-label";
import { Card } from "@/components/card";


import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'

import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  User
} from 'firebase/auth'
import { auth } from '../../firebaseConfig'


import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

WebBrowser.maybeCompleteAuthSession()

export default function Home() {
  // BOTTOM SHEET
  const [isOpen, setIsOpen] = useState(false)

  const bottomSheetSignIn = React.useRef<BottomSheetModal>(null);

  const bottomSheetFilters = React.useRef<BottomSheetModal>(null);

  const snapPoints = ['70%']

  async function presentSignIn() {
    bottomSheetSignIn.current?.present()
  }

  async function toggleFiltersModal() {
    bottomSheetFilters.current?.present()
  }

  const renderBackdrop = useCallback(
		(props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[]
	);

  // AUTH
  const [userInfo, setUserInfo] = React.useState<User | null>();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID
  })
  
  useEffect(() => {
    if (response?.type == "success") {
      const { id_token } = response.params
      const credential = GoogleAuthProvider.credential(id_token)
      
      bottomSheetSignIn.current?.present()
      setIsOpen(false)

      signInWithCredential(auth, credential)
    }

    if (response?.type == "error") {
      console.log("erro")
    }
  }, [response])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
        setUserInfo(user)
    });

    return () => unsub();
  }, [])


  const [category, setCategory] = useState(CATEGORIES[0]);

  function handleCategorySelect(selectedCategory: string) {
    setCategory(selectedCategory);
  }

  return (
    <>
      <GestureHandlerRootView>
      <View className="p-2">
        <View className="p-3">
          <View className="flex-row w-full gap-2 items-center justify-between">
            <Input style="h-14">
              <Input.Field placeholder="Buscar produto" returnKeyType="search" />
              <Search color={colors.primary[500]} />
            </Input>
            <Button title="Filtros" bgColor={'bg-primary-500'} onPress={toggleFiltersModal}/>
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
            userInfo ?
            (<Link href={`/desapego/${item.id}`} asChild>
              <Card data={item} />
            </Link>) : 
            
            (
              <Card data={item} onPress={presentSignIn}/>)
          )}
          numColumns={2}
          horizontal={false}
          columnWrapperStyle={{ justifyContent: "space-around" }}
          contentContainerStyle={{ gap: 12, paddingBottom: 150}}
        />    
      </View>



        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetSignIn}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
          >
            <View className='flex-1 items-center pb-24'>
              <View className="flex-1 items-center justify-center">
              <Blocks color={colors.primary[500]}/>
              <Text className="font-nunitoBold text-purple-600 text-xl">DESAPEGUITOS</Text>
              </View>
              <GoogleSigninButton  
              style={{ borderRadius: 10, width: 200}}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={() => promptAsync()} 
              />
              <Text className="font-nunitoBold text-blue my-10">Talvez mais tarde</Text>
            </View>
          </BottomSheetModal>
          <BottomSheetModal
            ref={bottomSheetFilters}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
          >
            <View className='flex-1 items-center justify-center'>
              <Text>EM BREVE VOCÊ PODERÁ FILTRAR POR DESAPEGUITOS</Text>
              <Button title="Sign Out" bgColor={"bg-black"} onPress={async () => await signOut(auth)} />
            </View>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}
