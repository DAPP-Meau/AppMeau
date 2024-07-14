import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import React, { ReactNode } from "react"
import {
  PetRegistrationDocument,
  UserRegistrationDocument,
} from "@/services/models"
import { Button, Divider, MD3Theme, useTheme } from "react-native-paper"
import { ScrollView } from "react-native"

interface IPetDetailsProps {
  pet: PetRegistrationDocument
  owner: UserRegistrationDocument
}

interface TitleAndTextProps {
  title: string
  children: ReactNode
  style?: StyleProp<ViewStyle>
}

export default function PetDetails({ pet, owner }: IPetDetailsProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  function boolToSimNao(b: boolean) {
    return b ? "Sim" : "Não"
  }

  const machoFemea = () => {
    switch (pet.animal.sex) {
      case "female":
        return "Fêmea"
      case "male":
        return "Macho"
    }
  }

  const tamanho = () => {
    switch (pet.animal.size) {
      case "large":
        return "Grande"
      case "medium":
        return "Médio"
      case "small":
        return "Pequeno"
    }
  }

  const idade = () => {
    switch (pet.animal.age) {
      case "adult":
        return "Adulto"
      case "cub":
        return "Filhote"
      case "old":
        return "Idoso"
    }
  }

  function capitalize(s: string) {
    return s[0].toUpperCase() + s.slice(1)
  }

  /** A partir de uma lista de strings, adiciona pontos e virgulas entre
   * elementos e "e" entre os últimos dois elementos.
   */
  function createTextFromList<T>(list: Array<T>, emptyMsg: string) {
    return capitalize(
      list
        .filter((x) => x !== "") // Filtrar apenas as opções possíveis
        .flatMap((val, i, arr) => {
          // Colocar vírgulas e "e" na frase
          if (i < arr.length - 2) {
            return [val, "; "]
          } else if (i <= arr.length - 2) {
            return [val, " e "]
          } else {
            return val
          }
        })
        .join("") || emptyMsg, // Mesclar numa string ou mostrar emptyMsg
    ) // Capitalizar primeiro caractere 
  }

  const temperamento = (): string => {
    return createTextFromList(
      [
        pet.temperament.calm ? "calmo" : "",
        pet.temperament.guard ? "guarda" : "",
        pet.temperament.lazy ? "preguiçoso" : "",
        pet.temperament.loving ? "amoroso" : "",
        pet.temperament.playful ? "brincalhão" : "",
        pet.temperament.shy ? "tímido" : "",
      ],
      "nenhum!",
    )
  }

  const exigências = (): string => {
    return createTextFromList(
      [
        pet.adoptionRequirements.requireAdoptionTerm ? "Termo de adoção" : "",
        pet.adoptionRequirements.requireHousePhoto ? "fotos da casa" : "",
        pet.adoptionRequirements.requirePreviousVisit
          ? "visita prévia à casa"
          : "",
        pet.adoptionRequirements.requireMonitoring
          ? "acompanhamento pós adoção"
          : "",
      ],
      "nenhum!",
    )
  }

  const TitleAndText = ({ title, children, style }: TitleAndTextProps) => {
    return (
      <View style={[{ gap: 2, flex: 1 }, style]}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
      </View>
    )
  }

  return (
    <ScrollView>
      <View style={{ gap: 16 }}>
        <View style={{height:100, backgroundColor:"cyan"}}>
          <Text>Foto aqui!</Text>
        </View>
        <View style={{ paddingHorizontal: 20, gap: 16, paddingBottom: 100 }}>
          <Text style={styles.animalName}>{pet.animal.name}</Text>
          <View style={{ gap: 16 }}>
            <View style={{ flexDirection: "row", gap: 50 }}>
              <TitleAndText title="Sexo">
                <Text>{machoFemea()}</Text>
              </TitleAndText>
              <TitleAndText title="Porte">
                <Text>{tamanho()}</Text>
              </TitleAndText>
              <TitleAndText title="Idade">
                <Text>{idade()}</Text>
              </TitleAndText>
            </View>
            <View>
              <TitleAndText title="Localização" style={{ flex: 0 }}>
                <Text>
                  {owner.address.fullAddress +
                    " - " +
                    owner.address.city +
                    ", " +
                    owner.address.state}
                </Text>
              </TitleAndText>
            </View>
          </View>
          <Divider />
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
              <TitleAndText title="Castrado">
                <Text>{boolToSimNao(pet.health.neutered)}</Text>
              </TitleAndText>
              <TitleAndText title="Vermifugado">
                <Text>{boolToSimNao(pet.health.dewormed)}</Text>
              </TitleAndText>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
              <TitleAndText title="Vacinado">
                <Text>{boolToSimNao(pet.health.vaccinated)}</Text>
              </TitleAndText>
              <TitleAndText title="Doenças">
                <Text>{pet.health.sicknesses ? "" : "Nenhuma"}</Text>
              </TitleAndText>
            </View>
          </View>
          <Divider />
          <View style={{ flexDirection: "row" }}>
            <TitleAndText title="Temperamento">
              <Text>{temperamento()}</Text>
            </TitleAndText>
          </View>
          <Divider />
          <View style={{ flexDirection: "row" }}>
            <TitleAndText title="Exigências do doador">
              <Text>{exigências()}</Text>
            </TitleAndText>
          </View>
          <Divider />
          <View style={{ flexDirection: "row" }}>
            <TitleAndText title={"Mais Sobre " + pet.animal.name}>
              <Text>{pet.animal.story}</Text>
            </TitleAndText>
          </View>
          <Button mode="contained">
            <Text>Pretendo Adotar</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
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
  })
