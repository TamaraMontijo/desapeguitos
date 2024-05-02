import { Alert, Text } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { useState } from "react";
import { Button } from "@/components/button";
import { colors } from "@/styles/colors";

const iosClientID = process.env.IOS_CLIENT_ID
const webClientID = process.env.WEB_CLIENT_ID


GoogleSignin.configure({
  scopes: ['email', 'profile'],
  webClientId: webClientID,
  iosClientId: iosClientID
})

export default function SignIn() {  
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  async function handleGoogleSignIn() {
    try {
      setIsAuthenticating(true)
      const { idToken } = await GoogleSignin.signIn()

      if(idToken){
      } else {
        Alert.alert('Não foi possível conectar-se a sua conta google')
        setIsAuthenticating(false)
      }
    } catch (error) {
      Alert.alert('Não foi possível conectar-se a sua conta google')
      setIsAuthenticating(false)
    }
  }

  return (
    <Button title="Sign in" isLoading={isAuthenticating} onPress={handleGoogleSignIn} bgColor={colors.primary[500]} />
  )
}