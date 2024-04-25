import React, {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button, MD3Theme, TextInput, useTheme } from "react-native-paper";
import Colors from "@/constants/Colors";
import { UserRegistrationForm } from "@/services/models";
import { Controller, useForm } from "react-hook-form";

type PasswordConfirm = {
  passwordConfirm: string;
};

export interface CreateUserProps {
  onSubmit?: (form: UserRegistrationForm) => Promise<boolean>;
}

export default function CreateUser({ onSubmit }: CreateUserProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserRegistrationForm & PasswordConfirm>({
    defaultValues: {
      address: "",
      age: 0,
      city: "",
      email: "",
      fullName: "",
      password: "",
      phone: "",
      state: "",
      passwordConfirm: "",
    },
    mode: "all",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        As informações preenchidas serão divulgadas apenas para a pessoa com a
        qual você realizar o processo de adoção e/ou apadrinhamento após a
        formalização do processo.
      </Text>
      <View style={{ gap: 8 }}>
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>

        <Controller
          control={control}
          name="fullName"
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
              error={errors.fullName ? true : false}
            />
          )}
        />
        {errors.fullName && <Text>{errors.fullName.message}</Text>}

        <Controller
          control={control}
          name="age"
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
              error={errors.age ? true : false}
              keyboardType="numeric"
              inputMode="numeric"
            />
          )}
        />
        {errors.age && <Text>{errors.age.message}</Text>}

        <Controller
          control={control}
          name="state"
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
              error={errors.state ? true : false}
            />
          )}
        />
        {errors.state && <Text>{errors.state.message}</Text>}

        <Controller
          control={control}
          name="city"
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
              error={errors.city ? true : false}
            />
          )}
        />
        {errors.city && <Text>{errors.city.message}</Text>}

        <Controller
          control={control}
          name="address"
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
              error={errors.address ? true : false}
            />
          )}
        />
        {errors.address && <Text>{errors.address.message}</Text>}

        <Controller
          control={control}
          name="phone"
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
              error={errors.phone ? true : false}
              keyboardType="phone-pad"
              inputMode="tel"
            />
          )}
        />
        {errors.phone && <Text>{errors.phone.message}</Text>}
      </View>

      <View style={{ gap: 8 }}>
        <Text style={styles.sectionTitle}>Informações de Perfil</Text>

        <Controller
          control={control}
          name="email"
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
              error={errors.email ? true : false}
              keyboardType="email-address"
            />
          )}
        />
        {errors.email && <Text>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="password"
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
              placeholder="Crie uma senha." // TODO: Criar validação de senha
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password ? true : false}
              secureTextEntry
            />
          )}
        />
        {errors.password && <Text>{errors.password.message}</Text>}

        <Controller
          control={control}
          name="passwordConfirm"
          rules={{
            required: "Por favor, confirme sua senha",
            validate: {
              equalPasswords: (str) =>
                watch("password") === str || "Sua senha não foi repetida corretamente!",
            },
          }}
          render={({ field: { onChange, onBlur, value, ...field } }) => (
            <TextInput
              {...field}
              label="Confirmar senha"
              placeholder="Repita a sua senha" // TODO: Criar validação de senha
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

      {/* Botão de adicionar foto */}
      <View style={{ gap: 8 }}>
        <Text style={styles.sectionTitle}>Foto de Perfil</Text>
        <TouchableOpacity style={styles.photoPlaceholder}>
          <Text style={styles.photoText}>Adicionar Foto</Text>
        </TouchableOpacity>
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit((completedForm) => {
          onSubmit?.(completedForm)
            .then((mustReset) => {
              if (mustReset) reset();
            });
        })}
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
