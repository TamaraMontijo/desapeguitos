import { Card } from "@/components/card";
import { Desapego } from "@/utils/data/desapego";
import { Link } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { FlatList, View, Text } from "react-native";
import { auth, db } from "../../../firebaseConfig";
import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'; // Import correto
import { BottomSheetSignIn } from "@/components/bottomSheetSignIn";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function MyDesapegos() {
  const [user, setUser] = useState<User | null>(null);
  const [desapegos, setDesapegos] = useState<Desapego[]>([]);
  
  // Referência para o BottomSheetModal
  const bottomSheetSignIn = useRef<BottomSheetModal>(null);

  useEffect(() => {
    // Configura o observador para mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Atualiza o estado do usuário logado
        
        // Consulta os desapegos do usuário logado
        const userDesapegosQuery = query(
          collection(db, 'desapego'),
          where('userId', '==', currentUser.uid)
        );

        const unsubscribeDesapegos = onSnapshot(userDesapegosQuery, (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Desapego));
          setDesapegos(data);
        });

        return () => unsubscribeDesapegos();
      } else {
        // Abre o BottomSheet se o usuário não estiver logado
        bottomSheetSignIn.current?.present(); // Chama o método 'present' da referência
      }
    });

    // Cleanup: desinscreve o observador de autenticação quando o componente é desmontado
    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView>
    <BottomSheetModalProvider>
      <View className="py-8 px-2">
        <FlatList
          data={desapegos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/desapego/${item.id}`} asChild>
              <Card data={item} />
            </Link>
          )}
          numColumns={2}
          horizontal={false}
          columnWrapperStyle={{ justifyContent: "space-around" }}
          contentContainerStyle={{ gap: 12 }}
        />
      </View>

      <BottomSheetSignIn ref={bottomSheetSignIn} />
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
