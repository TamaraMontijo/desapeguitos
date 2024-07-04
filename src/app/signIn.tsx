import React, { useRef, useState } from 'react';
import { View } from "react-native";


import { Button } from "@/components/button";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider }  from '@gorhom/bottom-sheet'


export default function SignIn(promptAsync: () => void) {  
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  // BOTTOM SHEET
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = ['50%']

  async function presentModal() {
    bottomSheetModalRef.current?.present()
    setIsOpen(true)
  }

  return (
    <View className='flex-1 items-center justify-center'>
      <Button title="Sign in" isLoading={isAuthenticating} onPress={presentModal} bgColor={"bg-primary-500"}/>
    </View>
    // <GestureHandlerRootView>
    // <BottomSheetModalProvider>
    
    // <BottomSheetModal
    //   ref={bottomSheetModalRef}
    //   index={0}
    //   snapPoints={snapPoints}
    // >
    //   <View className='flex-1 items-center justify-center'>
    //     <Button title='Sign In With Google' bgColor={'bg-black'} onPress={() => promptAsync()}></Button>
    //   </View>
    // </BottomSheetModal>
    // </BottomSheetModalProvider>
    // </GestureHandlerRootView>
  )
}