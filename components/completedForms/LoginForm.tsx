import Colors from '@/constants/Colors'
import { Controller, UseFormReturn, useForm } from 'react-hook-form'
import React, { StyleSheet, Text, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'

export type LoginFields = {
  username: string
  password: string
}

export interface LoginFormProps {
  /**
   * Função callback quando for apertado o botão de enviar e os dados estão
   * corretos.
   *
   * @param fields - Campos completados e "corretos" do formulário. Ainda exige
   * tratamento para verificação no backend.
   * @param form - O Objeto resultante do uso do gancho useForm do
   * react-hook-form neste componente.
   */
  onSubmit?: (
    fields: LoginFields,
    form: UseFormReturn<LoginFields>
  ) => Promise<void>
}

/**
 * Componente de formulário de login de usuário
 *
 * @component
 *
 */
export default function LoginForm({ onSubmit }: LoginFormProps) {
  const form = useForm<LoginFields>({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: 'onBlur',
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
          name="username"
          rules={{
            required: 'Por favor digite seu nome de usuário',
          }}
          render={({ field: { value, onChange, onBlur, ...field } }) => (
            <TextInput
              {...field}
              label="Nome de usuário"
              placeholder="Digite o seu usuário"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.username ? true : false}
            />
          )}
        />
        {errors.username && <Text>{errors.username.message}</Text>}

        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Por favor digite a sua senha',
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
            />
          )}
        />
        {errors.password && <Text>{errors.password.message}</Text>}
      </View>

      <View style={{ width: '80%' }}>
        <Button
          mode="contained"
          style={{ marginBottom: 72 }}
          onPress={handleSubmit(async (completedFields) => {
            await onSubmit?.(completedFields, form)
          })}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          <Text>ENTRAR</Text>
        </Button>

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
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  passwordBox: {
    width: '100%',
    marginTop: 30,
    marginBottom: 52,
    gap: 5,
  },
})
