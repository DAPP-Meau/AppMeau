import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import React, { ReactNode } from "react"
import {
  PetRegistrationDocument,
  UserRegistrationDocument,
} from "@/services/models"
import { Button, Card, Divider, MD3Theme, Paragraph, Title, useTheme } from "react-native-paper"
import { ScrollView } from "react-native"
import { Link } from "expo-router"
import Colors from "@/constants/Colors"

interface IPetCardsProps {
  pet?: PetRegistrationDocument
  owner?: UserRegistrationDocument
  id?:string
}

interface TitleAndTextProps {
  title: string
  children: ReactNode
  style?: StyleProp<ViewStyle>
}

export default function PetCard({ pet, owner, id }: IPetCardsProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  const machoFemea = (pet: PetRegistrationDocument) => {
    switch (pet.animal.sex) {
      case "female":
        return "Fêmea"
      case "male":
        return "Macho"
    }
  }

  const tamanho = (pet: PetRegistrationDocument) => {
    switch (pet.animal.size) {
      case "large":
        return "Grande"
      case "medium":
        return "Médio"
      case "small":
        return "Pequeno"
    }
  }

  const idade = (pet: PetRegistrationDocument) => {
    switch (pet.animal.age) {
      case "adult":
        return "Adulto"
      case "cub":
        return "Filhote"
      case "old":
        return "Idoso"
    }
  }


  const endereco = (owner: UserRegistrationDocument): string => {
    return (
      owner.address.fullAddress +
      " - " +
      owner.address.city +
      ", " +
      owner.address.state
    )
  }

  if (pet && owner) {

    return (
      <ScrollView>
        <TouchableOpacity>
          <Link href={`pets/${id}`} asChild>
            <Card style={{ margin: 16, borderRadius: 10 }}>
              <Card.Content style={{  backgroundColor: Colors.tintLight.yellow1}}>
                <Title >{pet.animal.name}</Title>
              </Card.Content>
              <Card.Cover
                source={
                  pet.animal.picture_uid
                    ? { uri: pet.animal.picture_uid }
                    : require("@/assets/images/Meau_marca_2.png")
                }
                style={{ height: 150 }}
                resizeMode="cover"
              />
              <Card.Content style={{ paddingHorizontal: 20, gap: 16, paddingBottom: 20 }}>
                <View style={{ gap: 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 50, }}>
                    <Text>{machoFemea(pet)}</Text>
                    <Text>{tamanho(pet)}</Text>
                    <Text>{idade(pet)}</Text>
                  </View>
                  <View>
                    <Text style={{ textAlign: 'center' }}>
                      {endereco(owner)}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </Link>
        </TouchableOpacity>

      </ScrollView>
    )
  } else {
    <View>
      <Text>Erro</Text>
    </View>
  }
}

const TitleAndText = ({ title, children, style }: TitleAndTextProps) => {
  const theme = useTheme()
  return (
    <View style={style}>
      <Title>{title}</Title>
      <Paragraph>{children}</Paragraph>
    </View>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    baseColor: {
      color: theme.colors.onBackground,
    },
    sectionTitle: {
      textTransform: "uppercase",
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: "bold",
    },
    animalName: {
      textTransform: "capitalize",
      fontWeight: "bold",
      fontSize: 16,
    },
    photo: {
      height: 150,
      width: "100%"
    }
  })
