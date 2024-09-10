import React from 'react';
import { User } from 'firebase/auth';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View, Text } from 'react-native';
import { router } from 'expo-router';

interface ProtectedRouteProps {
  userInfo: User | null;
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ userInfo, bottomSheetRef, children }) => {
  if (!userInfo) {
    // Se não estiver logado, exibe o modal de login
    bottomSheetRef.current?.present();
    return (
      <View>
        <Text>Você precisa fazer login para acessar esta página.</Text>
      </View>
    );
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
