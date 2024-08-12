import CheckBoxGroup from "../atoms/CheckBoxGroup"
import RadioButtonGroup from "../atoms/RadioButtonGroup"
import Colors from "@/constants/Colors"
import { PetDocument } from "@/models"
import selectImage from "@/utils/selectImage"
import { Controller, Path, UseFormReturn, useForm } from "react-hook-form"
import React, {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from "react-native"
import {
  Button,
  Checkbox,
  HelperText,
  Icon,
  TextInput,
  useTheme,
} from "react-native-paper"
import { MD3Theme } from "react-native-paper/lib/typescript/types"
import ErrorHelperText from "../atoms/ErrorHelperText"
import { useState } from "react"

export type PetRegistrationFields = Omit<
  PetDocument,
  "interestedUsersList" | "owner_uid" | "picture_url"
> & { imageURI: string }

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
  onSubmit?: (form: UseFormReturn<PetRegistrationFields>) => Promise<void>
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
  const [hasMonitoring, setHasMonitoring] = useState(false)

  const form = useForm<PetRegistrationFields>({
    defaultValues: {
      animal: {
        name: "",
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
        requireMonitoring: 0,
        requirePreviousVisit: false,
      },
      imageURI: "",
    },
    mode: "onChange",
  })
  const { control, handleSubmit, watch, formState, reset } = form
  const { errors, isSubmitting } = formState
  const watchSick = watch("health.sick")

  // Essa função existe apenas pra poder aumentar reutilização de código
  // e para aproveitar a coerção de tipo correta no prop name.
  function constructController(
    theName: Path<PetRegistrationFields>,
    errorMsg?: string,
  ) {
    if (errorMsg) {
      return { control: control, name: theName, rules: { required: errorMsg } }
    } else {
      return { control: control, name: theName }
    }
  }

  return (
    <View style={{ width: "100%", marginVertical: 16 }}>
      {/* Dados da adoção */}
      <Text style={styles.sectionTitle}>Adoção</Text>

      <View style={{ paddingVertical: 16 }}>
        {/* Caixa de texto de nome */}
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
              label={"Nome do Animal*"}
              placeholder="Digite o nome"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors?.animal?.name ? true : false}
            />
          )}
          name="animal.name"
        />
        <ErrorHelperText
          show={errors?.animal?.name}
          message={errors?.animal?.name?.message}
        />
      </View>

      {/* Botão de adicionar foto. */}
      <View style={{ gap: 10 }}>
        <Text
          style={[
            styles.infoText,
            errors?.imageURI
              ? { color: theme.colors.error }
              : { color: theme.colors.primary },
          ]}
        >
          Fotos do animal*
        </Text>
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
              {value ? (
                <Image source={{ uri: value }} style={styles.photo} />
              ) : (
                <>
                  <Icon
                    source="plus-circle"
                    size={28}
                    color={
                      errors.imageURI
                        ? theme.colors.error
                        : theme.colors.onPrimaryContainer
                    }
                  />
                  <Text style={styles.photoText}> Adicionar Foto </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        />
        <ErrorHelperText
          show={errors?.imageURI}
          message={errors?.imageURI?.message}
        />
      </View>

      <View style={styles.sectionView}>
        {/* Radio buttons de dados do animal */}
        <RadioButtonGroup
          title="Espécie*"
          {...constructController("animal.species", "Escolha uma espécie")}
          options={[
            { text: "Cachorro", value: "dog" },
            { text: "Gato", value: "cat" },
          ]}
          errors={errors.animal?.species?.message}
        />
        <RadioButtonGroup
          title="Sexo*"
          {...constructController("animal.sex", "Escolha o sexo do seu pet")}
          options={[
            { text: "Macho", value: "male" },
            { text: "Fêmea", value: "female" },
          ]}
          errors={errors.animal?.sex?.message}
        />
        <RadioButtonGroup
          title="Tamanho*"
          {...constructController(
            "animal.size",
            "Escolha o tamanho do seu pet",
          )}
          options={[
            { text: "Pequeno", value: "small" },
            { text: "Médio", value: "medium" },
            { text: "Grande", value: "large" },
          ]}
          errors={errors.animal?.size?.message}
        />
        <RadioButtonGroup
          title="Idade*"
          {...constructController("animal.age", "Escolha a idade do seu pet")}
          options={[
            { text: "Filhote", value: "cub" },
            { text: "Adulto", value: "adult" },
            { text: "Idoso", value: "old" },
          ]}
          errors={errors.animal?.age?.message}
        />

        {/* CheckBoxes de dados do animal */}
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
      <HelperText type="error" visible={errors?.health?.sicknesses && true}>
        {errors?.health?.sicknesses?.message}
      </HelperText>

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
        <View style={styles.wrapper}>
          <Checkbox
            status={hasMonitoring ? "checked" : "unchecked"}
            onPress={() => {
              setHasMonitoring(!hasMonitoring)
            }}
          />
          <Text style={styles.text}>Acompanhamento?</Text>
        </View>
        {hasMonitoring && (
          <View style={{ marginLeft: 25 }}>
            <RadioButtonGroup
              control={control}
              title="Duração do acompanhamento*"
              name="adoptionRequirements.requireMonitoring"
              rules={{
                required: true,
                validate: {
                  mustBeDifferentThanZero: (x) =>
                    x != 0 || "Selecione uma duração de acompanhamento",
                },
              }}
              options={[
                { text: "1 mês", value: 1 },
                { text: "3 meses", value: 2 },
                { text: "6 meses", value: 6 },
              ]}
              errors={errors.adoptionRequirements?.requireMonitoring?.message}
            />
          </View>
        )}
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
        <HelperText type="error" visible={errors?.animal?.story && true}>
          {errors?.animal?.story?.message}
        </HelperText>
      </View>

      <View>
        <Button
          mode="contained"
          onPress={handleSubmit(async () => {
            await onSubmit?.(form)
          })}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          <Text>COLOCAR PARA ADOÇÃO</Text>
        </Button>
        <HelperText type="error" visible={Object.keys(errors).length != 0}>
          Por favor resolva os erros acima antes de cadastrar.
        </HelperText>
        <Text>{JSON.stringify(errors)}</Text>
      </View>

      <Button
        mode="text"
        onPress={() => {
          Alert.alert("Deseja mesmo limpar o formulário?", undefined, [
            {
              text: "Não",
              style: "cancel",
            },
            {
              text: "Sim",
              onPress: () => {
                setHasMonitoring(false)
                reset()
              },
              style: "default",
            },
          ])
        }}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        <Text>Limpar formulário</Text>
      </Button>
    </View>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    sectionTitle: {
      alignSelf: "flex-start",
      marginTop: 20,
      marginBottom: 10,
      fontSize: 16,
      textTransform: "uppercase",
      color: theme.colors.secondary,
      fontFamily: "Roboto_Regular",
    },
    subSectionTitle: {
      fontSize: 12,
      textTransform: "uppercase",
      color: theme.colors.primary,
    },
    infoText: {
      fontSize: 12,
      textTransform: "uppercase",
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
    sectionView: { paddingVertical: 24 },
    checkBox: {
      width: "50%",
    },
    errorText: {
      color: theme.colors.error,
    },
    wrapper: { flexDirection: "row" },
    text: { textAlignVertical: "center", flexShrink: 1 },
  })
