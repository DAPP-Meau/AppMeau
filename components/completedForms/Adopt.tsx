import React, {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import Colors from "@/constants/Colors";
import { useState } from "react";
import {
  Adoption,
  Animal,
  sexOptions,
  ageOptions,
  sizeOptions,
  speciesOptions,
  AdoptionRegistrationForm,
} from "@/services/models";
import { CheckBoxGroup, RadioButtonGroup } from "@/components/elements/forms";
import { MD3Theme } from "react-native-paper/lib/typescript/types";

export interface AdoptProps {
  onSubmit?: (
    form: AdoptionRegistrationForm,
    e?: GestureResponderEvent
  ) => boolean;
}

export default function Adopt({ onSubmit }: AdoptProps) {
  const [animal, setAnimal] = useState<Animal>({
    name: "",
    species: "dog",
    sex: "female",
    size: "small",
    age: "cub",
    temperament: {
      calm: false,
      guard: false,
      lazy: false,
      loving: false,
      playful: false,
      shy: false,
    },
    health: {
      dewormed: false,
      neutered: false,
      sick: false,
      vaccinated: false,
    },
    sicknesses: "",
    story: "",
  });

  const [adopt, setAdopt] = useState<Adoption>({
    requireAdoptionTerm: false,
    requireHousePhoto: false,
    requirePreviousVisit: false,
    requireMonitoring: false,
  });

  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={{ width: "100%", marginVertical: 16 }}>
      <Text style={styles.sectionTitle}>Adoção</Text>

      <TextInput
        label="Nome do animal"
        placeholder="Nome"
        onChangeText={(newValue) => {
          setAnimal((oldState) => ({
            ...oldState,
            name: newValue,
          }));
        }}
      />

      <View style={styles.sectionView}>
        <Text style={styles.infoText}>Fotos do animal</Text>
        <TouchableOpacity style={styles.photoPlaceholder}>
          <Text style={styles.photoText}>Adicionar Fotos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionView}>
        <RadioButtonGroup
          title="Espécie"
          value={animal.species}
          onChange={(newValue) => {
            setAnimal((oldState) => ({
              ...oldState,
              species: newValue as speciesOptions,
            }));
          }}
          options={[
            { text: "Cachorro", key: "dog" },
            { text: "Gato", key: "cat" },
          ]}
        />
        <RadioButtonGroup
          title="Sexo"
          value={animal.sex}
          onChange={(newValue) => {
            setAnimal((oldState) => ({
              ...oldState,
              sex: newValue as sexOptions,
            }));
          }}
          options={[
            { text: "Macho", key: "male" },
            { text: "Fêmea", key: "female" },
          ]}
        />
        <RadioButtonGroup
          title="Tamanho"
          value={animal.size}
          onChange={(newValue) => {
            setAnimal((oldState) => ({
              ...oldState,
              size: newValue as sizeOptions,
            }));
          }}
          options={[
            { text: "Pequeno", key: "small" },
            { text: "Médio", key: "medium" },
            { text: "Grande", key: "large" },
          ]}
        />
        <RadioButtonGroup
          title="Idade"
          value={animal.age}
          onChange={(newValue) => {
            setAnimal((oldState) => ({
              ...oldState,
              age: newValue as ageOptions,
            }));
          }}
          options={[
            { text: "Filhote", key: "cub" },
            { text: "Adulto", key: "adult" },
            { text: "Idoso", key: "old" },
          ]}
        />

        <Text style={styles.subSectionTitle}>Temperamento</Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          <CheckBoxGroup
            title="Calmo"
            value={animal.temperament.calm}
            style={styles.checkBox}
            onPress={(x) =>
              setAnimal((oldState) => ({
                ...oldState,
                temperament: { ...oldState.temperament, calm: x },
              }))
            }
          />
          <CheckBoxGroup
            title="Guarda"
            value={animal.temperament.guard}
            style={styles.checkBox}
            onPress={(x) =>
              setAnimal((oldState) => ({
                ...oldState,
                temperament: { ...oldState.temperament, guard: x },
              }))
            }
          />
          <CheckBoxGroup
            title="Preguiçoso"
            value={animal.temperament.lazy}
            style={styles.checkBox}
            onPress={(x) =>
              setAnimal((oldState) => ({
                ...oldState,
                temperament: { ...oldState.temperament, lazy: x },
              }))
            }
          />
          <CheckBoxGroup
            title="Amoroso"
            value={animal.temperament.loving}
            style={styles.checkBox}
            onPress={(x) =>
              setAnimal((oldState) => ({
                ...oldState,
                temperament: { ...oldState.temperament, loving: x },
              }))
            }
          />
          <CheckBoxGroup
            title="Brincalhão"
            value={animal.temperament.playful}
            style={styles.checkBox}
            onPress={(x) =>
              setAnimal((oldState) => ({
                ...oldState,
                temperament: { ...oldState.temperament, playful: x },
              }))
            }
          />
          <CheckBoxGroup
            title="Tímido"
            value={animal.temperament.shy}
            style={styles.checkBox}
            onPress={(x) =>
              setAnimal((oldState) => ({
                ...oldState,
                temperament: { ...oldState.temperament, shy: x },
              }))
            }
          />
        </View>
      </View>

      <Text style={styles.subSectionTitle}>Temperamento</Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <CheckBoxGroup
          title="Vermifugado"
          value={animal.health.dewormed}
          style={styles.checkBox}
          onPress={(x) =>
            setAnimal((oldState) => ({
              ...oldState,
              health: { ...oldState.health, dewormed: x },
            }))
          }
        />
        <CheckBoxGroup
          title="Castrado"
          value={animal.health.neutered}
          style={styles.checkBox}
          onPress={(x) =>
            setAnimal((oldState) => ({
              ...oldState,
              health: { ...oldState.health, neutered: x },
            }))
          }
        />
        <CheckBoxGroup
          title="Doente"
          value={animal.health.sick}
          style={styles.checkBox}
          onPress={(x) =>
            setAnimal((oldState) => ({
              ...oldState,
              health: { ...oldState.health, sick: x },
            }))
          }
        />
        <CheckBoxGroup
          title="Vacinado"
          value={animal.health.vaccinated}
          style={styles.checkBox}
          onPress={(x) =>
            setAnimal((oldState) => ({
              ...oldState,
              health: { ...oldState.health, vaccinated: x },
            }))
          }
        />
      </View>

      <TextInput
        label="Doenças do animal"
        placeholder="Digite as doenças"
        disabled={!animal.health.sick}
        onChangeText={(newValue) => {
          setAnimal((oldState) => ({
            ...oldState,
            sicknesses: newValue,
          }));
        }}
        value={!animal.health.sick ? "" : animal.sicknesses}
      />

      <View style={styles.sectionView}>
        <Text style={styles.subSectionTitle}>Exigências para a adoção</Text>
        <CheckBoxGroup
          title="Termo de adoção"
          value={adopt.requireAdoptionTerm}
          onPress={(x) =>
            setAdopt((oldState) => ({ ...oldState, requireAdoptionTerm: x }))
          }
        />
        <CheckBoxGroup
          title="Fotos da casa"
          value={adopt.requireHousePhoto}
          onPress={(x) =>
            setAdopt((oldState) => ({ ...oldState, requireHousePhoto: x }))
          }
        />
        <CheckBoxGroup
          title="Visita prévia ao animal"
          value={adopt.requirePreviousVisit}
          onPress={(x) =>
            setAdopt((oldState) => ({ ...oldState, requirePreviousVisit: x }))
          }
        />
        <CheckBoxGroup
          title="Acompanhamento pós adoção"
          value={adopt.requireMonitoring}
          onPress={(x) =>
            setAdopt((oldState) => ({ ...oldState, requireMonitoring: x }))
          }
        />
      </View>

      <View style={styles.sectionView}>
        <Text style={styles.subSectionTitle}>Sobre o animal</Text>
        <TextInput
          label="Compartilhe a história do animal"
          placeholder="Escreva a história do seu animal"
          multiline
          onChangeText={(newValue) => {
            setAnimal((oldState) => ({
              ...oldState,
              story: newValue,
            }));
          }}
        />
      </View>

      <Button
        mode="contained"
        onPress={(e) => onSubmit?.({ ...animal, ...adopt }, e)}
      >
        <Text>Submit</Text>
      </Button>
    </View>
  );
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    sectionTitle: {
      fontSize: 16,
      textTransform: "capitalize",
      color: "#434343",
      fontFamily: "Roboto_Medium",
    },
    subSectionTitle: {
      fontSize: 12,
      textTransform: "uppercase",
      color: theme.colors.primary,
    },
    infoText: {
      fontSize: 12,
      textTransform: "uppercase",
      color: theme.colors.primary,
      fontFamily: "Roboto_Regular",
    },
    input: {
      fontSize: 14,
      backgroundColor: "transparent",
      fontFamily: "Roboto_Regular",
    },
    radioButtonText: {
      textAlignVertical: "center",
    },
    radioButtonGroup: {
      width: "100%",
      justifyContent: "space-evenly",
      flexDirection: "row",
      alignContent: "center",
    },
    photoPlaceholder: {
      width: "100%",
      height: 150,
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    photoText: {
      textAlign: "center",
      color: theme.colors.onPrimaryContainer,
    },
    button: {
      width: "80%",
      height: 40,
      backgroundColor: Colors.tintLight.blue1,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 2,
      elevation: 4,
    },
    buttonText: {
      color: Colors.text.gray2,
      fontSize: 12,
      fontFamily: "Roboto_Regular",
      fontWeight: "normal",
    },
    sectionView: { gap: 16, paddingVertical: 24 },
    checkBox: {
      width: "33%",
    },
  });
