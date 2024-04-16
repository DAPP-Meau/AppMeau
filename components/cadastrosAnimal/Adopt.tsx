import React, { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Checkbox, RadioButton, TextInput } from "react-native-paper"
import Colors from "@/constants/Colors"
import { useMemo, useState } from "react"

enum Species {
  gato,
  cachorro,
}

enum Sex {
  male,
  female,
}

enum Size {
  small,
  medium,
  large,
}

enum Idade {
  cub,
  adult,
  old,
}

enum Temperament {
  playful,
  shy,
  calm,
  guard,
  loving,
  lazy,
}

enum Health {
  vaccinated,
  dewormed,
  neutered,
  sick,
}

export default function Adopt() {
  const [name, setName] = useState("")
  const [species, setSpecies] = useState<Species | undefined>(undefined)
  const [sex, setSex] = useState<Sex | undefined>(undefined)
  const [size, setSize] = useState<Size | undefined>(undefined)
  const [idade, setIdade] = useState<Idade | undefined>(undefined)
  const [temperament, setTemperament] = useState<Temperament | undefined>(
    undefined
  )
  const [health, setHealth] = useState<Health | undefined>(undefined)
  const [sickness, setSickness] = useState("")
  const [adoptionTerm, setAdoptionTerm] = useState(false)
  const [housePhoto, setHousePhoto] = useState(false)
  const [requireVisit, setRequireVisit] = useState(false)
  const [monitoring, setMonitoring] = useState(false)

  return (
    <View style={{ width: "100%", marginVertical: 16 }}>
      <Text style={styles.sectionTitle}>Adoção</Text>

      <TextInput
        style={styles.input}
        label="Nome do animal"
      />

      <View style={styles.sectionView}>
        <Text style={styles.infoText}>Fotos do animal</Text>
        <TouchableOpacity style={styles.photoPlaceholder}>
          <Text style={styles.photoText}>Adicionar Fotos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionView}>
        <RadioButtonGroups
          title="Espécie"
          myvar={species}
          setVar={setSpecies}
          details={[
            { value: "Cachorro", setTo: Species.cachorro },
            { value: "Gato", setTo: Species.gato },
          ]}
        />
        <RadioButtonGroups
          title="Sexo"
          myvar={sex}
          setVar={setSex}
          details={[
            { value: "Macho", setTo: Sex.male },
            { value: "Fêmea", setTo: Sex.female },
          ]}
        />
        <RadioButtonGroups
          title="Porte"
          myvar={size}
          setVar={setSize}
          details={[
            { value: "Pequeno", setTo: Size.small },
            { value: "Médio", setTo: Size.medium },
            { value: "Grande", setTo: Size.large },
          ]}
        />
        <RadioButtonGroups
          title="Idade"
          myvar={idade}
          setVar={setIdade}
          details={[
            { value: "Filhote", setTo: Idade.cub },
            { value: "Adulto", setTo: Idade.adult },
            { value: "Idoso", setTo: Idade.old },
          ]}
        />
        <RadioButtonGroups
          title="Temperamento"
          myvar={temperament}
          setVar={setTemperament}
          details={[
            { value: "Brincalhão", setTo: Temperament.playful },
            { value: "Tímido", setTo: Temperament.shy },
            { value: "Calmo", setTo: Temperament.calm },
            { value: "Guarda", setTo: Temperament.guard },
            { value: "Amoroso", setTo: Temperament.loving },
            { value: "Preguiçoso", setTo: Temperament.lazy },
          ]}
        />
        <RadioButtonGroups
          title="Saúde"
          myvar={health}
          setVar={setHealth}
          details={[
            { value: "Vacinado", setTo: Health.vaccinated },
            { value: "Vermifugado", setTo: Health.dewormed },
            { value: "Castrado", setTo: Health.neutered },
            { value: "Doente", setTo: Health.sick },
          ]}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.text.gray4}
        label="Doenças do animal"
      />

      <View style={styles.sectionView}>
        <Text style={styles.subSectionTitle}>Exigências para a adoção</Text>
        <CheckBoxGroup
          title="Termo de adoção"
          myvalue={adoptionTerm}
          setValue={setAdoptionTerm}
        />
        <CheckBoxGroup
          title="Fotos da casa"
          myvalue={housePhoto}
          setValue={setHousePhoto}
        />
        <CheckBoxGroup
          title="Visita prévia ao animal"
          myvalue={requireVisit}
          setValue={setRequireVisit}
        />
        <CheckBoxGroup
          title="Acompanhamento pós adoçao"
          myvalue={monitoring}
          setValue={setMonitoring}
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
  )
}

type Details<T> = {
  value: string
  setTo: T
}

interface RadioButtonProps<T> {
  title: string
  myvar: T
  setVar: any
  details: Details<T>[]
}

function RadioButtonGroups<T>({
  title,
  details,
  myvar,
  setVar,
}: RadioButtonProps<T>) {
  return (
    <View style={{ gap: 8 }}>
      <Text
        style={{ textTransform: "uppercase", color: "#f7a800", fontSize: 12 }}>
        {title}
      </Text>
      <View style={{ flexDirection: "row", width: "100%", flexWrap: "wrap" }}>
        {details.map(({ value, setTo }: Details<T>, i) => {
          return (
            <View
              key={i}
              style={{ flexDirection: "row", flex: 1, minWidth: 90 }}>
              <RadioButton
                value={value}
                status={myvar === setTo ? "checked" : "unchecked"}
                onPress={() => {
                  setVar(setTo)
                }}
              />
              <Text style={styles.radioButtonText}>{value}</Text>
            </View>
          )
        })}
        <Text>{}</Text>
      </View>
    </View>
  )
}

interface CheckBoxGroupProps<T> {
  title: string
  myvalue: T
  setValue: any
}

function CheckBoxGroup<T>({ title, myvalue, setValue }: CheckBoxGroupProps<T>) {
  return (
    <View style={{ flexDirection: "row" }}>
      <Checkbox
        status={myvalue ? "checked" : "unchecked"}
        onPress={() => {
          setValue(!myvalue)
        }}
      />
      <Text style={{ textAlignVertical: "center" }}>{title}</Text>
    </View>
  )
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
})
