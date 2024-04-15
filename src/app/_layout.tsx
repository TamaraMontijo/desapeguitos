import "@/styles/global.css";

import React from "react";
import { StatusBar, TouchableOpacity, View, Text } from "react-native";

import { Tabs } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Blocks, ChevronLeft, Home } from "lucide-react-native";

import { colors } from "@/styles/colors";
import { Loading } from "@/components/loading";

import {
  useFonts,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: `DESAPEGUITOS`,
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
                onPress={() => console.log("go back")}
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
            tabBarLabel: "Início",
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
            tabBarAccessibilityLabel: "Home",
            tabBarButton: (props) => <TouchableOpacity {...props} />,
            tabBarInactiveTintColor: "gray",
            tabBarActiveTintColor: colors.primary[500],
          }}
        />
      </Tabs>
    </>
  );
}
