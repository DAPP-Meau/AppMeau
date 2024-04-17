import React, { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import Colors from "@/constants/Colors";
import { useState } from "react";
import {
  Adoption,
  Animal,
  ageOptions,
  healthOptions,
  sexOptions,
  sizeOptions,
  speciesOptions,
  temperamentOptions,
} from "@/services/models";
import { CheckBoxGroup, RadioButtonGroup } from "../elements/forms";

export default function Adopt() {
  const [animal, setAnimal] = useState<Animal>({
    name: "",
    species: "dog",
    sex: "female",
    size: "small",
    age: "cub",
    temperament: "calm",
    health: new Set<healthOptions>(),
    sicknesses: "",
  });

  const [adopt, setAdopt] = useState<Adoption>({
    requireAdoptionTerm: false,
    requireHousePhoto: false,
    requirePreviousVisit: false,
    requireMonitoring: false,
  });

  return (
    <View style={{ width: "100%", marginVertical: 16 }}>
      <Text style={styles.sectionTitle}>Adoção</Text>

      <TextInput
        style={styles.input}
        label="Nome do animal"
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
        <RadioButtonGroup
          title="Temperamento"
          value={animal.temperament}
          onChange={(newValue) => {
            setAnimal((oldState) => ({
              ...oldState,
              temperament: newValue as temperamentOptions,
            }));
          }}
          options={[
            { text: "Calmo", key: "calm" },
            { text: "Guarda", key: "guard" },
            { text: "Preguiçoso", key: "lazy" },
            { text: "Amoroso", key: "loving" },
            { text: "Brincalhão", key: "playful" },
            { text: "Tímido", key: "shy" },
          ]}
        />
      </View>

      <TextInput
        style={styles.input}
        label="Doenças do animal"
        onChangeText={(newValue) => {
          setAnimal((oldState) => ({
            ...oldState,
            sicknesses: newValue,
          }));
        }}
      />

      <View style={styles.sectionView}>
        <Text style={styles.subSectionTitle}>Exigências para a adoção</Text>
        <CheckBoxGroup
          title="Termo de adoção"
          value={adopt.requireAdoptionTerm}
          onPress={(x) => setAdopt((oldState) => ({...oldState, requireAdoptionTerm: x})) }
        />
        <CheckBoxGroup
          title="Fotos da casa"
          value={adopt.requireHousePhoto}
          onPress={(x) => setAdopt((oldState) => ({...oldState, requireHousePhoto: x})) }
        />
        <CheckBoxGroup
          title="Visita prévia ao animal"
          value={adopt.requirePreviousVisit}
          onPress={(x) => setAdopt((oldState) => ({...oldState, requirePreviousVisit: x})) }
        />
        <CheckBoxGroup
          title="Acompanhamento pós adoção"
          value={adopt.requireMonitoring}
          onPress={(x) => setAdopt((oldState) => ({...oldState, requireMonitoring: x})) }
        />
      </View>
      <View style={styles.sectionView}>
        <Text style={styles.subSectionTitle}>Sobre o animal</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.text.gray4}
          label="Compartilhe a história do animal"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    textTransform: "capitalize",
    color: "#434343",
    fontFamily: "Roboto_Medium",
  },
  subSectionTitle: {
    fontSize: 12,
    textTransform: "uppercase",
    color: "#f7a800",
  },
  infoText: {
    fontSize: 12,
    textTransform: "uppercase",
    color: "#f7a800",
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
    backgroundColor: "#ddd",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  photoText: {
    textAlign: "center",
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
});
