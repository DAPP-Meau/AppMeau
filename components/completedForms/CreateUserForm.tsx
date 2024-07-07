import React, {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button, MD3Theme, TextInput, useTheme } from "react-native-paper";
import Colors from "@/constants/Colors";
import { UserRegistrationForm } from "@/services/models";
import { Controller, UseFormReturn, useForm } from "react-hook-form";

export type PasswordConfirm = {
  passwordConfirm: string;
};

export interface CreateUserProps {
  /**
   * Função callback quando for apertado o botão de enviar e os dados estão
   * corretos.
   * 
   * @param fields - Campos completados e "corretos" do formulário. Ainda exige
   * tratamento para verificação no backend. (como por exemplo verificação de
   * e-mail.)
   * @param form - O Objeto resultante do uso do gancho useForm do
   * react-hook-form neste componente.
   *
   */
  onSubmit?: (
    fields: UserRegistrationForm & PasswordConfirm,
    form: UseFormReturn<UserRegistrationForm & PasswordConfirm>
  ) => Promise<void>;
}

/**
 * Componente de formulário de registro de usuário
 *
 * @component
 * 
 */
export default function CreateUserForm({ onSubmit }: CreateUserProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const form = useForm<UserRegistrationForm & PasswordConfirm>({
    defaultValues: {
      address: {
      fullAddress: "",
      city: "",
      state: "",
      },
      person: {
      age: 0,
      fullName: "",
      phone: "",
      },
      login: {
        email: "",
        password: "",
        username: ""
      },
      passwordConfirm: "",
    },
    mode: "all",
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: {errors, isSubmitting, isValidating, isValid},
    reset,
  } = form

  return (
    <View style={styles.container}>

      <Button
        mode="contained"
        onPress={() => reset({
          address: {
          fullAddress: "123123123",
          city: "bsb",
          state: "df",
          },
          person: {
          age: 20,
          fullName: "wagner",
          phone: "1234",
          },
          login: {
            email: "wagne@google",
            password: "1234Abcd!",
            username: "wagnerBatalha"
          },
          passwordConfirm: "1234Abcd!",})}
      >
        <Text>preencher</Text>
      </Button>

      <Text style={styles.infoText}>
        As informações preenchidas serão divulgadas apenas para a pessoa com a
        qual você realizar o processo de adoção e/ou apadrinhamento após a
        formalização do processo.
      </Text>

      {/* Dados pessoais */}
      <View style={{ gap: 8 }}>
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>

        <Controller
          control={control}
          name="person.fullName"
          rules={{
            required: "Por favor, insira um nome",
            minLength: { value: 3, message: "Nome muito curto" },
          }}
          render={({ field: { onChange, onBlur, value, ...field } }) => (
            <TextInput
              {...field}
              label="Nome completo"
              placeholder="Digite o seu nome"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.person?.fullName ? true : false}
            />
          )}
        />
        {errors.person?.fullName && <Text>{errors.person?.fullName.message}</Text>}

        <Controller
          control={control}
          name="person.age"
          rules={{
            required: "Por favor, insira uma idade",
          }}
          render={({ field: { onChange, onBlur, value, ...field } }) => (
            <TextInput
              {...field}
              label="Idade"
              placeholder="Digite a sua idade"
              value={String(value)}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.person?.age ? true : false}
              keyboardType="numeric"
              inputMode="numeric"
            />
          )}
        />
        {errors.person?.age && <Text>{errors.person?.age.message}</Text>}

        <Controller
          control={control}
          name="address.state"
          rules={{
            required: "Por favor, Digite o seu Estado",
          }}
          render={({ field: { onChange, onBlur, value, ...field } }) => (
            <TextInput
              {...field}
              label="Estado"
              placeholder="Digite o seu Estado"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.address?.state ? true : false}
            />
          )}
        />
        {errors.address?.state && <Text>{errors.address?.state.message}</Text>}

        <Controller
          control={control}
          name="address.city"
          rules={{
            required: "Por favor, Digite a sua cidade",
          }}
          render={({ field: { onChange, onBlur, value, ...field } }) => (
            <TextInput
              {...field}
              label="Cidade"
              placeholder="Digite a sua cidade"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.address?.city ? true : false}
            />
          )}
        />
        {errors.address?.city && <Text>{errors.address?.city.message}</Text>}

        <Controller
          control={control}
          name="address.fullAddress"
          rules={{
            required: "Por favor, Digite o seu endereço",
          }}
          render={({ field: { onChange, onBlur, value, ...field } }) => (
            <TextInput
              {...field}
              label="Endereço"
              placeholder="Digite o seu endereço"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.address?.fullAddress ? true : false}
            />
          )}
        />
        {errors.address?.fullAddress && <Text>{errors.address?.fullAddress.message}</Text>}

        <Controller
          control={control}
          name="person.phone"
          rules={{
            required: "Por favor, Digite o seu telefone",
          }}
          render={({ field: { onChange, onBlur, value, ...field } }) => (
            <TextInput
              {...field}
              label="Telefone"
              placeholder="Digite o número do seu telefone"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.person?.phone ? true : false}
              keyboardType="phone-pad"
              inputMode="tel"
            />
          )}
        />
        {errors.person?.phone && <Text>{errors.person?.phone.message}</Text>}
      </View>

      {/* Informações de Perfil */}
      <View style={{ gap: 8 }}>
        <Text style={styles.sectionTitle}>Informações de Perfil</Text>

        <Controller
          control={control}
          name="login.email"
          rules={{
            required: "Por favor, Digite o seu e-mail",
            validate: {
              mustContainAtSign: (str) =>
                /@/.test(str) || "Email tem que ter um @",
            },
          }}
          render={({ field: { onChange, onBlur, value, ...field } }) => (
            <TextInput
              {...field}
              label="E-mail"
              placeholder="Digite o seu e-mail"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.login?.email ? true : false}
              keyboardType="email-address"
            />
          )}
        />
        {errors.login?.email && <Text>{errors.login?.email.message}</Text>}

        <Controller
          control={control}
          name="login.username"
          rules={{
            required: "Por favor, Digite o seu usuário",
            minLength: {value:10, message:"O usuário precisa ter no mínimo 10 caracteres"}
          }}
          render={({ field: { onChange, onBlur, value, ...field } }) => (
            <TextInput
              {...field}
              label="Nome de usuário"
              placeholder="Digite o seu nome de usuário"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.login?.username ? true : false}
            />
          )}
        />
        {errors.login?.username && <Text>{errors.login?.username.message}</Text>}

        <Controller
          control={control}
          name="login.password"
          rules={{
            required: "Por favor, crie uma senha",
            validate: {
              containsLowerCase: (str) =>
                /[a-z]/.test(str) ||
                "Senha tem que conter um caractere minúsculo",
              containsUpperCase: (str) =>
                /[A-Z]/.test(str) ||
                "Senha tem que conter um caractere maiúsculo",
              containsNumber: (str) =>
                /\d/.test(str) || "Senha tem que conter um dígito",
              containsNonWord: (str) =>
                /\W/.test(str) || "Senha tem que conter um símbolo",
              lengthRequirement: (str) =>
                str.length >= 7 || "Senha tem que ter no mínimo 8 caracteres",
            },
          }}
          render={({ field: { onChange, onBlur, value, ...field } }) => (
            <TextInput
              {...field}
              label="Senha"
              placeholder="Crie uma senha."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.login?.password ? true : false}
              secureTextEntry
            />
          )}
        />
        {errors.login?.password && <Text>{errors.login?.password.message}</Text>}

        <Controller
          control={control}
          name="passwordConfirm"
          rules={{
            required: "Por favor, confirme sua senha",
            validate: {
              equalPasswords: (str) =>
                watch("login.password") === str || "Sua senha não foi repetida corretamente!",
            },
          }}
          render={({ field: { onChange, onBlur, value, ...field } }) => (
            <TextInput
              {...field}
              label="Confirmar senha"
              placeholder="Repita a sua senha"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.passwordConfirm ? true : false}
              secureTextEntry
            />
          )}
        />
        {errors.passwordConfirm && (
          <Text>{errors.passwordConfirm.message}</Text>
        )}
      </View>

      {/* Botão de adicionar foto. */}
      {/* TODO: Adicionar funcionalidade para a  foto */}
      <View style={{ gap: 8 }}>
        <Text style={styles.sectionTitle}>Foto de Perfil</Text>
        <TouchableOpacity style={styles.photoPlaceholder}>
          <Text style={styles.photoText}>Adicionar Foto</Text>
        </TouchableOpacity>
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit(async (completedFields) => {
          await onSubmit?.(completedFields, form)
        })}
        loading={isSubmitting}
        disabled={isSubmitting || isValidating || !isValid}
      >
        <Text>FAZER CADASTRO</Text>
      </Button>
    </View>
  );
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      width: "100%",
      marginVertical: 42,
      gap: 16,
    },
    infoText: {
      width: "100%",
      backgroundColor: theme.colors.secondaryContainer,
      textAlign: "center",
      padding: 8,
      fontSize: 14,
      color: theme.colors.onSecondaryContainer,
      borderRadius: 2,
      fontFamily: "Roboto_Regular",
    },
    sectionTitle: {
      alignSelf: "flex-start",
      marginTop: 20,
      marginBottom: 10,
      fontSize: 16,
      textTransform: "uppercase",
      color: theme.colors.secondary,
      fontFamily: "Roboto_Regular",
    },
    input: {
      width: "100%",
      height: 50,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderLeftWidth: 0,
      borderWidth: 0.8,
      borderColor: Colors.text.gray3,
      padding: 10,
      marginBottom: 15,
      fontSize: 14,
      color: "black",
      backgroundColor: "transparent",
      fontFamily: "Roboto_Regular",
    },
    photoPlaceholder: {
      width: "100%",
      height: 150,
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: 20,
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
  });
