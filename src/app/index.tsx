import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, FlatList, Text, useWindowDimensions, ActivityIndicator } from "react-native";
import { Search } from "lucide-react-native";
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

import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { fetchLocationAndCalculateDistance } from "@/utils/functions/locationUtils";
import { BottomSheetSignIn } from "@/components/bottomSheetSignIn";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { Loading } from "@/components/loading";

WebBrowser.maybeCompleteAuthSession();

export default function Home() {
  const { width } = useWindowDimensions();
  const numColumns = width > 850 ? 4 : width > 600 ? 3 : 2;

  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [desapegos, setDesapegos] = useState<Desapego[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const bottomSheetSignIn = useRef<BottomSheetModal>(null);
  const bottomSheetFilters = useRef<BottomSheetModal>(null);
  const snapPoints = ['70%'];

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then(() => {
        bottomSheetSignIn.current?.dismiss();
      });
    } else if (response?.type === "error") {
      console.log("erro");
    }
  }, [response]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserInfo(user);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsubscribe = fetchDesapegos();
    return () => unsubscribe();
  }, [category, searchQuery]);

  const fetchDesapegos = () => {
    setLoading(true);
    return onSnapshot(query(collection(db, 'desapego'), orderBy('createdAt', 'desc')), async (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Desapego));

      const desapegosWithDistance = await Promise.all(data.map(async (item) => {
        const { distance } = await fetchLocationAndCalculateDistance(item.cep);
        return { ...item, distance };
      }));

      const filteredByCategory = category && category !== 'Todos'
        ? desapegosWithDistance.filter(item => item.category === category)
        : desapegosWithDistance;

      const filteredBySearch = filteredByCategory.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const sortedByDistance = filteredBySearch.sort((a, b) => (a.distance || 0) - (b.distance || 0));

      setDesapegos(sortedByDistance);
      setLoading(false);
    });
  };

  const presentSignIn = async () => {
    bottomSheetSignIn.current?.present();
  };

  const toggleFiltersModal = async () => {
    bottomSheetFilters.current?.present();
  };

  const renderBackdrop = useCallback(
    (props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
  };

  return (
    <GestureHandlerRootView>
      <View className="p-2 flex-1">
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
            <Button title="Filtros" bgColor={'bg-primary-500'} onPress={toggleFiltersModal} />
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
        {loading ? (
          <Loading />
        ) : desapegos.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-gray-600 font-nunitoBold">
              Nenhum desapego encontrado. Convide seus amigos para o desapeguitos para aumentarmos o nosso acervo.
            </Text>
          </View>
        ) : (
          <FlatList
            data={desapegos}
            key={numColumns}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              userInfo ? (
                <Link href={`/desapego/${item.id}`} asChild>
                  <Card data={item} />
                </Link>
              ) : (
                <Card data={item} onPress={presentSignIn} />
              )
            )}
            numColumns={numColumns}
            horizontal={false}
            columnWrapperStyle={{ justifyContent: "space-around" }}
            contentContainerStyle={{ gap: 12, paddingBottom: 150 }}
          />
        )}

      </View>
      <BottomSheetModalProvider>
        <BottomSheetSignIn ref={bottomSheetSignIn} />
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
  );
}
