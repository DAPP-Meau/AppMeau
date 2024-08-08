import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Card, MD3Theme, useTheme } from "react-native-paper";
import { Image } from "expo-image";
import { FirebaseAppContext } from "@/services/firebaseAppContext";
import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import { PetAndOwnerDocument } from "@/services/actions"

interface IPetCardsProps {
  petAndOwner: PetAndOwnerDocument;
  proOnRefresh: () => void;
}


interface InterestedUser {
  id: string;
  fullName: string;
  picture_uid: string;
}

export default function UserCard({ petAndOwner }: IPetCardsProps) {
  const pet = petAndOwner.pet.data;
  const theme = useTheme();
  const styles = makeStyles(theme);

  const firebaseApp = useContext(FirebaseAppContext);
  const db = getFirestore(firebaseApp);
  const [interestedUsers, setInterestedUsers] = useState<InterestedUser[]>([]);

  useEffect(() => {
    // Função para buscar usuários interessados no pet
    const fetchInterestedUsers = async () => {
      try {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        const usersList: InterestedUser[] = [];

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const userId = doc.id;
          if (pet.interested.includes(userId)) {
            usersList.push({
              id: userId,
              fullName: userData.person?.fullName || "Usuário sem nome",
              picture_uid: userData.person?.picture_uid || "", // Adicione uma URL de imagem padrão se necessário
            });
          }
        });

        setInterestedUsers(usersList);
      } catch (error) {
        console.error("Erro ao buscar usuários interessados:", error);
      }
    };

    fetchInterestedUsers();
  }, [pet.interested]);

  const blurhash =
    "fSSh}iWVo~ofbxofX=WBaJj?nzj@rna#f6j?aef6vva}kCj@WYayV=ayaxj[ocfQ";

  return (
    <>
      {interestedUsers.map((user) => (
        <Card
          key={user.id} // Usando uid como chave única para o mapa
          style={styles.card}
          onPress={() => {
            // TODO: implementar funcionalidade de chat
          }}
        >
          <View style={styles.chatContainer}>
            <Image
              style={styles.userImage}
              source={{ uri: user.picture_uid }}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
            />
            <Text style={styles.userName}>{user.fullName}</Text>
          </View>
        </Card>
      ))}
    </>
  );
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    card: {
      marginVertical: 5,
      marginHorizontal: 18,
      backgroundColor: theme.colors.surface,
      padding: 10,
    },
    chatContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    userImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    userName: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.onSurface,
    },
  });
