import "@/styles/global.css";

import { Slot } from "expo-router";
import { StatusBar } from "react-native";

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
      <Slot />
    </>
  );
}
