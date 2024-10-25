import { Card } from "@/components/card";
import { Desapego } from "@/utils/data/desapego";
import { Link } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { FlatList, View, Text, useWindowDimensions } from "react-native";
import { auth, db } from "../../../firebaseConfig";
import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'; // Import correto
import { BottomSheetSignIn } from "@/components/bottomSheetSignIn";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Loading } from "@/components/loading";

export default function MyDesapegos() {
  const { width } = useWindowDimensions();
  const numColumns = width > 850 ? 4 : width > 600 ? 3 : 2;
  
  const [user, setUser] = useState<User | null>(null);
  const [desapegos, setDesapegos] = useState<Desapego[]>([]);
  const [loading, setLoading] = useState(true);
  
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
          setLoading(false);  // Finaliza o estado de carregamento após os desapegos serem recebidos
        });

        return () => unsubscribeDesapegos();
      } else {
        // Abre o BottomSheet se o usuário não estiver logado
        bottomSheetSignIn.current?.present(); 
        setLoading(false);  // Finaliza o estado de carregamento se o usuário não estiver logado
      }
    });

    // Cleanup: desinscreve o observador de autenticação quando o componente é desmontado
    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View className="flex-1 items-center justify-center pt-8 pb-4">
          {loading ? (
            <Loading />
          ) : desapegos.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-center text-gray-600 font-nunitoBold">
                Adicione anúncios e vizualize aqui
              </Text>
            </View>
          ) : (
            <FlatList
              data={desapegos}
              key={numColumns}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Link href={`/desapego/${item.id}`} asChild>
                  <Card data={item} />
                </Link>
              )}
              numColumns={numColumns}
              horizontal={false}
              columnWrapperStyle={{ justifyContent: "space-around" }}
              contentContainerStyle={{ gap: 12 }}
            />
          )}
        </View>

        <BottomSheetSignIn ref={bottomSheetSignIn} />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

