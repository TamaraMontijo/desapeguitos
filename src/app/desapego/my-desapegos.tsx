import { Card } from "@/components/card";
import { Desapego } from "@/utils/data/desapego";
import { EXPO_PUBLIC_FIREBASE_CONFIG } from "@env";
import { Link } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { FlatList, View } from "react-native";
import { auth, db } from "../../../firebaseConfig";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export default function MyDesapegos() {
  const [user, setUser] = useState<User | null>(null);
  const [desapegos, setDesapegos] = useState<Desapego[]>([]);

  useEffect(() => {
    // Configura o observador para mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Cria uma consulta para filtrar os desapegos criados pelo usuário logado
        const userDesapegosQuery = query(
          collection(db, 'desapego'),
          where('userId', '==', currentUser.uid)
        );

        // Usa onSnapshot para escutar mudanças nos documentos que satisfazem a consulta
        const unsubscribeDesapegos = onSnapshot(userDesapegosQuery, (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Desapego));
          setDesapegos(data);
        });
        // Cleanup da consulta dos desapegos
        return () => unsubscribeDesapegos();
      } else {
        // Usuário não está logado
        setDesapegos([]);  // Limpa os desapegos quando o usuário desloga
      }
    });

    // Cleanup: desinscreve o observador de autenticação quando o componente é desmontado
    return () => unsubscribe();
  }, []);

  return (
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
  )
}