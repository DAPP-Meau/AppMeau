import { CheckBoxGroup, RadioButtonGroup } from "@/components/elements/forms"
import Colors from "@/constants/Colors"
import { PetRegistrationFields } from "@/services/models"
import selectImage from "@/services/selectImage"
import { Controller, Path, UseFormReturn, useForm } from "react-hook-form"
import React, {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Button, TextInput, useTheme } from "react-native-paper"
import { MD3Theme } from "react-native-paper/lib/typescript/types"


export interface CreatePetFormProps {
  /**
   * Função callback quando for apertado o botão de enviar e os dados estão
   * corretos.
   *
   * @param fields - Campos completos e "corretos" do formulário. Ainda exige
   * tratamento para verificação no backend.
   * @param form - O Objeto resultante do uso do gancho useForm do
   * react-hook-form neste componente.
   *
   */
  onSubmit?: (
    fields: PetRegistrationFields,
    form: UseFormReturn<PetRegistrationFields>,
  ) => Promise<void>
}

/**
 * Componente de formulário de adoção.
 *
 * @component
 *
 */
export default function CreatePetForm({ onSubmit }: CreatePetFormProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  const form = useForm<PetRegistrationFields>({
    defaultValues: {
      animal: {
        name: "",
        species: "dog",
        sex: "female",
        size: "small",
        age: "cub",
        story: "",
      },
      temperament: {
        playful: false,
        shy: false,
        calm: false,
        guard: false,
        loving: false,
        lazy: false,
      },
      health: {
        vaccinated: false,
        dewormed: false,
        neutered: false,
        sick: false,
        sicknesses: "",
      },
      adoptionRequirements: {
        requireAdoptionTerm: false,
        requireHousePhoto: false,
        requireMonitoring: false,
        requirePreviousVisit: false,
      },
      imageURI:""
    },
    mode: "onChange",
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = form

  const watchSick = watch("health.sick")

  // Essa função existe apenas pra poder aumentar reutilização de código
  // e para aproveitar a coerção de tipo correta no prop name.
  function constructController(theName: Path<PetRegistrationFields>) {
    return { control: control, name: theName }
  }

  return (
    <View style={{ width: "100%", marginVertical: 16 }}>
      {/* Dados da adoção */}
      <Text style={styles.sectionTitle}>Adoção</Text>

      <Controller
        control={control}
        rules={{
          required: "Por favor, insira um nome",
          minLength: { value: 1, message: "Nome muito curto" },
          maxLength: { value: 32, message: "Nome muito comprido" },
        }}
        render={({ field: { onChange, onBlur, value, ...field } }) => (
          <TextInput
            {...field}
            label={"Nome do Animal"}
            placeholder="Digite o nome"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors?.animal?.name ? true : false}
          />
        )}
        name="animal.name"
      />
      {errors?.animal?.name && <Text>{errors?.animal?.name?.message}</Text>}

      {/* Botão de adicionar foto. */}
      {/* TODO: Adicionar funcionalidade para a foto */}

      <View style={styles.sectionView}>
        <Text style={styles.infoText}>Fotos do animal</Text>
        <Controller
          control={control}
          name="imageURI"
          rules={{
            required: "Por favor, insira uma foto",
          }}
          render={({ field: { onChange, onBlur, ref, value, ...field } }) => (
            <TouchableOpacity
              {...field}
              style={styles.photoPlaceholder}
              onPress={() => selectImage(onChange)}
              onBlur={onBlur}
              ref={ref}
            >
              {value ? (<Image source={{ uri: value }} style={styles.photo} />) 
                     : (<Text style={styles.photoText}> Adicionar Foto </Text>)
              }
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.sectionView}>
        <RadioButtonGroup
          title="Espécie"
          controllerProps={constructController("animal.species")}
          options={[
            { text: "Cachorro", value: "dog" },
            { text: "Gato", value: "cat" },
          ]}
        />

        <RadioButtonGroup
          title="Sexo"
          controllerProps={constructController("animal.sex")}
          options={[
            { text: "Macho", value: "male" },
            { text: "Fêmea", value: "female" },
          ]}
        />

        <RadioButtonGroup
          title="Tamanho"
          controllerProps={constructController("animal.size")}
          options={[
            { text: "Pequeno", value: "small" },
            { text: "Médio", value: "medium" },
            { text: "Grande", value: "large" },
          ]}
        />
        <RadioButtonGroup
          title="Idade"
          controllerProps={constructController("animal.age")}
          options={[
            { text: "Filhote", value: "cub" },
            { text: "Adulto", value: "adult" },
            { text: "Idoso", value: "old" },
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
            style={styles.checkBox}
            controllerProps={constructController("temperament.calm")}
          />
          <CheckBoxGroup
            title="Guarda"
            style={styles.checkBox}
            controllerProps={constructController("temperament.guard")}
          />
          <CheckBoxGroup
            title="Preguiçoso"
            style={styles.checkBox}
            controllerProps={constructController("temperament.lazy")}
          />
          <CheckBoxGroup
            title="Amoroso"
            style={styles.checkBox}
            controllerProps={constructController("temperament.loving")}
          />
          <CheckBoxGroup
            title="Brincalhão"
            style={styles.checkBox}
            controllerProps={constructController("temperament.playful")}
          />
          <CheckBoxGroup
            title="Tímido"
            style={styles.checkBox}
            controllerProps={constructController("temperament.shy")}
          />
        </View>
      </View>

      <Text style={styles.subSectionTitle}>Saúde</Text>
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
          style={styles.checkBox}
          controllerProps={constructController("health.dewormed")}
        />
        <CheckBoxGroup
          title="Castrado"
          style={styles.checkBox}
          controllerProps={constructController("health.neutered")}
        />
        <CheckBoxGroup
          title="Doente"
          style={styles.checkBox}
          controllerProps={constructController("health.sick")}
        />
        <CheckBoxGroup
          title="Vacinado"
          style={styles.checkBox}
          controllerProps={constructController("health.vaccinated")}
        />
      </View>

      <Controller
        control={control}
        name="health.sicknesses"
        rules={{
          required: {
            value: watchSick,
            message: "Por favor, digite as doenças do animal",
          },
          minLength: { value: 1, message: "Texto muito curto" },
          maxLength: { value: 300, message: "Texto muito comprido" },
        }}
        render={({ field: { onChange, onBlur, value, ...field } }) => (
          <TextInput
            {...field}
            label="Doenças do animal"
            placeholder={!watchSick ? "Digite as doenças" : ""}
            disabled={!watchSick}
            onChangeText={onChange}
            onBlur={onBlur}
            value={watchSick ? value : undefined}
            error={errors?.health?.sicknesses ? true : false}
          />
        )}
      />
      {errors?.health?.sicknesses && (
        <Text>{errors?.health?.sicknesses?.message}</Text>
      )}

      {/* Termos de adoção */}
      <View style={styles.sectionView}>
        <Text style={styles.subSectionTitle}>Exigências para a adoção</Text>
        <CheckBoxGroup
          title="Termo de adoção"
          controllerProps={constructController(
            "adoptionRequirements.requireAdoptionTerm",
          )}
        />
        <CheckBoxGroup
          title="Fotos da casa"
          controllerProps={constructController(
            "adoptionRequirements.requireHousePhoto",
          )}
        />
        <CheckBoxGroup
          title="Visita prévia ao animal"
          controllerProps={constructController(
            "adoptionRequirements.requirePreviousVisit",
          )}
        />
        <CheckBoxGroup
          title="Acompanhamento pós adoção"
          controllerProps={constructController(
            "adoptionRequirements.requireMonitoring",
          )}
        />
      </View>

      <View style={styles.sectionView}>
        <Text style={styles.subSectionTitle}>Sobre o animal</Text>

        <Controller
          control={control}
          name="animal.story"
          rules={{
            required: false,
            maxLength: { value: 300, message: "Texto muito comprido" },
          }}
          render={({ field: { onChange, onBlur, value, ...field } }) => (
            <TextInput
              {...field}
              label="Compartilhe a história do animal"
              placeholder="Escreva a história do seu animal"
              multiline
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors?.animal?.story ? true : false}
            />
          )}
        />
        {errors?.animal?.story && <Text>{errors?.animal?.story.message}</Text>}
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit(async (completedFields) => {   
          await onSubmit?.(completedFields, form)
        })}
        loading={isSubmitting}
        disabled={isSubmitting || !isValid}
      >
        <Text>CADASTRAR ANIMAL</Text>
      </Button>
    </View>
  )
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
      height: 200,
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    photo: {
      width: "100%",
      height: 200,
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
  })
