import React, { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Blocks } from "lucide-react-native";
import { GoogleAuthProvider, signInWithCredential, signOut } from "firebase/auth";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from "../../firebaseConfig";
import { colors } from "@/styles/colors";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Button } from "./button";

WebBrowser.maybeCompleteAuthSession();

export const BottomSheetSignIn = forwardRef<BottomSheetModalMethods, {}>((_props, ref: ForwardedRef<BottomSheetModalMethods>) => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID
  });

  const [user, setUser] = useState(auth.currentUser);

  const snapPoints = ['70%'];

  useEffect(() => {
    // Atualiza o estado do usuário se a autenticação mudar
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          // Fecha o BottomSheet após o login
          (ref as any)?.current?.dismiss();
        })
        .catch((error) => {
          console.error("Erro durante o login:", error);
        });
    }
  }, [response]);

  const renderBackdrop = React.useCallback(
    (props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
    >
      <View className="flex-1 items-center pb-24">
        <View className="flex-1 items-center justify-center">
          <Blocks color={colors.primary[500]} />
          <Text className="font-nunitoBold text-purple-600 text-xl">DESAPEGUITOS</Text>
        </View>

        {user ? (
          <Button
            title="Sign Out"
            bgColor={"bg-black"}
            onPress={async () => {
              await signOut(auth);
              setUser(null); // Atualiza o estado do usuário
              (ref as any)?.current?.dismiss(); // Fecha o BottomSheet
            }}
          />
        ) : (
          <>
            <View className="flex-1 items-center justify-center">
              <Text className="font-nunitoBold text-xl">
                Por favor, faça login para continuar
              </Text>
            </View>
            <GoogleSigninButton
              style={{ borderRadius: 10, width: 200 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={() => promptAsync()}
            />
            <Text className="font-nunitoBold text-blue my-10">
              Talvez mais tarde
            </Text>
          </>
        )}
      </View>
    </BottomSheetModal>
  );
});
