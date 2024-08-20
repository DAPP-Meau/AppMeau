import Colors from "@/constants/Colors"
import { Controller, UseFormReturn, useForm } from "react-hook-form"
import React, { StyleSheet, Text, View } from "react-native"
import { Button, TextInput } from "react-native-paper"
import Constants from "expo-constants"

export type LoginFields = {
  email: string
  password: string
}

export interface LoginFormProps {
  /**
   * Função callback quando for apertado o botão de enviar e os dados estão
   * corretos.
   *
   * @param form - A instãncia do gancho useForm do react-hook-form neste componente.
   */
  onSubmit?: (form: UseFormReturn<LoginFields>) => Promise<void>
}

/**
 * Componente de formulário de login de usuário
 *
 * @component
 *
 */
export default function LoginForm({ onSubmit }: LoginFormProps) {
  const isRunningInExpoGo = Constants.appOwnership === "expo"
  let debugUser: LoginFields | undefined = undefined
  if (
    isRunningInExpoGo &&
    process.env.EXPO_PUBLIC_DEBUG_USERNAME &&
    process.env.EXPO_PUBLIC_DEBUG_PASSWORD
  ) {
    debugUser = {
      email: process.env.EXPO_PUBLIC_DEBUG_USERNAME,
      password: process.env.EXPO_PUBLIC_DEBUG_PASSWORD,
    }
  }

  const form = useForm<LoginFields>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  return (
    <View style={styles.container}>
      <View style={styles.passwordBox}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Por favor digite seu nome email",
          }}
          render={({ field: { value, onChange, onBlur, ...field } }) => (
            <TextInput
              {...field}
              label="Email"
              placeholder="Digite o seu email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email ? true : false}
              keyboardType="email-address"
              autoComplete="email"
            />
          )}
        />
        {errors.email && <Text>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="password"
          rules={{
            required: "Por favor digite a sua senha",
          }}
          render={({ field: { value, onChange, onBlur, ...field } }) => (
            <TextInput
              {...field}
              label="Senha"
              placeholder="Digite sua senha"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password ? true : false}
              secureTextEntry={true}
              autoComplete="password"
            />
          )}
        />
        {errors.password && <Text>{errors.password.message}</Text>}
      </View>
      <View style={{ width: "80%" }}>
        <Button
          mode="contained"
          style={{ marginBottom: 72 }}
          onPress={handleSubmit(async () => {
            await onSubmit?.(form)
          })}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          <Text>ENTRAR</Text>
        </Button>

        {!isSubmitting && (
          <View style={{ gap: 4 }}>
            {/* TODO: Adicionar funcionalidade para login com o oAuth do facebook
             * e google abaixo. */}
            <Button
              mode="contained"
              icon="facebook"
              buttonColor="#194f7c"
              textColor="white"
              disabled={isSubmitting}
            >
              <Text>ENTRAR COM FACEBOOK</Text>
            </Button>
            <Button
              mode="outlined"
              icon="google"
              buttonColor="#f15f5c"
              textColor="white"
              disabled={isSubmitting}
            >
              <Text>ENTRAR COM GOOGLE</Text>
            </Button>
            {debugUser && isRunningInExpoGo && 
              ( // Renderizar se tiver variável de login e no expo GO
                <>
                  <Button
                    mode="text"
                    onPress={() => {
                      form.setValue("password", debugUser?.password ?? "")
                      form.setValue("email", debugUser?.email ?? "")
                      form.trigger()
                    }}
                  >
                    <Text>Preencher com dados abaixo</Text>
                  </Button>
                  <Text>{JSON.stringify(debugUser)}</Text>
                </>
              )
            }
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  passwordBox: {
    width: "100%",
    marginTop: 30,
    marginBottom: 52,
    gap: 5,
  },
})
