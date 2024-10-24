import { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { Alert, View, Text, Button } from "react-native";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import * as WebBrowser from 'expo-web-browser';
import { Blocks } from "lucide-react-native";
import { colors } from "@/styles/colors";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential, signOut, deleteUser, OAuthProvider } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import * as AppleAuthentication from 'expo-apple-authentication';

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
          (ref as any)?.current?.dismiss();
        })
        .catch((error) => {
          console.error("Erro durante o login:", error);
        });
    }
  }, [response]);

  const handleAppleLogin = async () => {
    try {
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const { identityToken } = appleCredential;

      if (identityToken) {
        const provider = new OAuthProvider('apple.com');
        provider.addScope('email');
        provider.addScope('name');
        const credential = provider.credential({ idToken: identityToken });
        const { user } = await signInWithCredential(auth, credential);
      }
    } catch (error: any) {
      if (error.code !== 'ERR_CANCELED') {
        alert(error.message);
      }
    }
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja deletar sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Deletar", onPress: handleDeleteAccount, style: "destructive" },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAccount = async () => {
    if (user) {
      try {
        await deleteUser(user);
        setUser(null);
        (ref as any)?.current?.dismiss();
      } catch (error) {
        console.error("Erro ao deletar conta:", error);
      }
    }
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
    >
      <View className="flex-1 items-center pb-24">
        <View className="flex-1 items-center justify-center">
          <Blocks color={colors.primary[500]} />
          <Text className="font-nunitoBold text-purple-600 text-xl">DESAPEGUITOS</Text>
        </View>

        {user ? (
          <>
            <Button
              title="Sair"
              onPress={async () => {
                await signOut(auth);
                setUser(null);
                (ref as any)?.current?.dismiss();
              }}
            />
            <Button
              title="Deletar Conta"
              onPress={confirmDeleteAccount}
            />
          </>
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
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={5}
              style={{ width: 200, height: 44, marginTop: 20 }}
              onPress={handleAppleLogin}
            />
            <Text className="font-nunitoBold text-blue my-10" onPress={() => (ref as any)?.current?.dismiss()}>
              Talvez mais tarde
            </Text>
          </>
        )}
      </View>
    </BottomSheetModal>
  );
});
