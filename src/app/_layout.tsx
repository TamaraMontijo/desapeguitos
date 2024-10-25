import "@/styles/global.css";

import React, { useEffect, useRef, useState } from "react";
import { StatusBar, TouchableOpacity, View, Text } from "react-native";

import { Tabs, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Blocks, ChevronLeft, Home, Info, List } from "lucide-react-native";

import { colors } from "@/styles/colors";
import { Loading } from "@/components/loading";

import {
  useFonts,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import CreateAddButton from "@/components/create-ad-button";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { BottomSheetSignIn } from "@/components/bottomSheetSignIn";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_700Bold,
  });
  const [user, setUser] = useState<User | null>(null);
  
  // Ref do BottomSheet
  const bottomSheetRef = useRef<BottomSheetModalMethods>(null);

  useEffect(() => {
    // Monitora mudanças de estado do usuário
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Cleanup da subscrição
    return () => unsubscribe();
  }, []);

  // Função para abrir o BottomSheet
  const openBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.present();
    }
  };

  if (!fontsLoaded) {
    return <Loading />;
  }


  return (
    <GestureHandlerRootView>
    <BottomSheetModalProvider>
      <StatusBar barStyle="light-content" />
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: `DESAPEGUITOS`,
            headerStyle: {
              height: 120
            },
            headerTitle: () => (
              <View className="flex-row items-center justify-center w-full">
                <View className="flex-row items-center">
                  <Blocks size={22} color="white" />
                  <Text className="ml-3 text-white font-nunitoBold text-2xl">DESAPEGUITOS</Text>
                </View>
              </View>
            ),
            headerRight: () =>
              user ? (
                <TouchableOpacity
                  onPress={openBottomSheet}
                  style={{ marginRight: 20 }}
                >
                  <Info size={24} color="white" />
                </TouchableOpacity>
              ) : null,
            headerTintColor: "white",
            headerTitleStyle: {
              fontSize: 20,
              fontFamily: "Nunito_700Bold",
            },
            headerBackground: () => (
              <LinearGradient
                colors={[colors.primary[500], colors.primary[400]]}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            ),
            tabBarLabel: "Início",
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
            tabBarAccessibilityLabel: "Home",
            tabBarButton: (props) => <TouchableOpacity {...props} />,
            tabBarInactiveTintColor: "gray",
            tabBarActiveTintColor: colors.primary[500],
          }}
        />
        <Tabs.Screen
          name="desapego/create"
          options={{
            headerStyle: {
              height: 120
            },
            headerTitle: (props) => (
              <View className="flex-row items-center">
                <Blocks size={22} color="white" />
                <Text className=" ml-3 color-white font-nunitoBold text-2xl">Criar Anúncio</Text>
              </View>
            ),
            headerTintColor: "white",
            headerTitleStyle: {
              fontSize: 20,
              fontFamily: "Nunito_700Bold",
            },
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 10 }}
              >
                <ChevronLeft size={24} color="white" />
              </TouchableOpacity>
            ),
            headerBackground: () => (
              <LinearGradient
                colors={[colors.primary[500], colors.primary[400]]}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            ),
            tabBarLabel: "",
            tabBarIcon: () => <CreateAddButton />,
            tabBarAccessibilityLabel: "Criar Desapego",
            tabBarButton: (props) => <TouchableOpacity {...props} />,
            tabBarInactiveTintColor: "gray",
            tabBarActiveTintColor: colors.primary[500],
          }}
        />
        <Tabs.Screen
          name="desapego/[id]"
          options={{
            headerStyle: {
              height: 120
            },
            headerTitle: (props) => (
              <View className="flex-row items-center">
                <Blocks size={22} color="white" />
                <Text className=" ml-3 color-white font-nunitoBold text-2xl" >DESAPEGUITOS</Text>
              </View>
            ),
            headerTintColor: "white",
            headerTitleStyle: {
              fontSize: 20,
              fontFamily: "Nunito_700Bold",
            },
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 10 }}
              >
                <ChevronLeft size={24} color="white" />
              </TouchableOpacity>
            ),
            headerBackground: () => (
              <LinearGradient
                colors={[colors.primary[500], colors.primary[400]]}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            ),
            href: null,
          }}
        />
        <Tabs.Screen
          name="desapego/my-desapegos"
          options={{
            tabBarLabel: "Meus Desapeguitos",
            tabBarIcon: ({ color, size }) => <List color={color} size={size} />,
            headerStyle: {
              height: 120
            },
            tabBarActiveTintColor: colors.primary[500],
            headerTitle: (props) => (
              <View className="flex-row items-center">
                <Blocks size={22} color="white" />
                <Text className=" ml-3 color-white font-nunitoBold text-2xl" >MEUS DESAPEGUITOS</Text>
              </View>
            ),
            headerTintColor: "white",
            headerTitleStyle: {
              fontSize: 20,
              fontFamily: "Nunito_700Bold",
            },
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 10 }}
              >
                <ChevronLeft size={24} color="white" />
              </TouchableOpacity>
            ),
            headerBackground: () => (
              <LinearGradient
                colors={[colors.primary[500], colors.primary[400]]}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            ),
          }}
        />
      </Tabs>
      <BottomSheetSignIn ref={bottomSheetRef} />
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
