import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { Blocks, Search } from "lucide-react-native";
import { Link } from "expo-router";


import { colors } from "@/styles/colors";
import { CATEGORIES, Desapego } from "@/utils/data/desapego";

import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { CategoryLabel } from "@/components/category-label";
import { Card } from "@/components/card";


import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
import { auth, db } from '../../firebaseConfig'


import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { fetchLocationAndCalculateDistance } from "@/utils/functions/locationUtils";

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
  const [userInfo, setUserInfo] = useState<User | null>();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID
  })
  
  useEffect(() => {
    if (response?.type == "success") {
      const { id_token } = response.params
      const credential = GoogleAuthProvider.credential(id_token)
      
      signInWithCredential(auth, credential).then(() => {
        // Fecha o modal após o login bem-sucedido
        bottomSheetSignIn.current?.dismiss();
      });
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

  const [desapegos, setDesapegos] = useState<Desapego[]>([]);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const unsubscribe = onSnapshot(query(
      collection(db, 'desapego'),
      orderBy('createdAt', 'desc')
    ), async (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Desapego));
  
      const desapegosWithDistance = await Promise.all(
        data.map(async (item) => {
          const { distance } = await fetchLocationAndCalculateDistance(item.cep);
          return {
            ...item,
            distance
          };
        })
      );
  
      // Filtro por categoria
      let filteredByCategory = desapegosWithDistance;

      if (category && category !== 'Todos') {
        filteredByCategory = desapegosWithDistance.filter(
          (item) => item.category === category
        );
      }
  
      // Ordenar por distância
      const sortedByDistance = filteredByCategory.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  
      setDesapegos(sortedByDistance);
    });
  
    return () => unsubscribe();
  }, [category]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(
      collection(db, 'desapego'),
      orderBy('createdAt', 'desc')
    ), async (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Desapego));
  
      const desapegosWithDistance = await Promise.all(
        data.map(async (item) => {
          const { distance } = await fetchLocationAndCalculateDistance(item.cep);
          return {
            ...item,
            distance
          };
        })
      );
  
      let filteredByCategory = desapegosWithDistance;
  
      if (category && category !== 'Todos') {
        filteredByCategory = desapegosWithDistance.filter(
          (item) => item.category === category
        );
      }
  
      // Filtro por título do produto
      const filteredBySearch = filteredByCategory.filter((item) => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
      // Ordenar por distância
      const sortedByDistance = filteredBySearch.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  
      setDesapegos(sortedByDistance);
    });
  
    return () => unsubscribe();
  }, [category, searchQuery]);
  
  

  return (
    <>
      <GestureHandlerRootView>
      <View className="p-2">
        <View className="p-3">
          <View className="flex-row w-full gap-2 items-center justify-between">
            <Input style="h-14">
              <Input.Field 
                placeholder="Buscar produto" 
                returnKeyType="search" 
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
              />
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
          data={desapegos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            userInfo ?
            (<Link href={`/desapego/${item.id}`} asChild>
              <Card data={item} />
            </Link>) : 
            
            (
              <Card data={item} onPress={presentSignIn} />)
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
            </View>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}
