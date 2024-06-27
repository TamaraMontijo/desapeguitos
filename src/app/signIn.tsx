import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, Text, View } from "react-native";

import { colors } from "@/styles/colors";
import { Button } from "@/components/button";

import BottomSheet, { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { BottomSheetProvider } from '@gorhom/bottom-sheet/lib/typescript/contexts';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function SignIn() {  
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = ['50%']

  async function presentModal() {
    bottomSheetModalRef.current?.present()
    setIsOpen(true)
  }

  return (
    <GestureHandlerRootView>
    <BottomSheetModalProvider>
    <View className='flex-1 items-center justify-center'>
      <Button title="Sign in" isLoading={isAuthenticating} onPress={presentModal} bgColor={"bg-primary-500"}/>
    </View>
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
    >
      <View className='flex-1 items-center justify-center'>
        <Button title='Sign In With Google' bgColor={'bg-black'}></Button>
      </View>
    </BottomSheetModal>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}