import { Controller } from "react-hook-form";
import React, { View, StyleSheet } from "react-native";
import { Text, MD3Theme, RadioButton, useTheme } from "react-native-paper";

export type radioButton<T> = {
  value: T;
  text: string;
};

export interface RadioButtonProps<T> {
  title: string;
  controllerProps: any; // TODO: Encontrar o tipo do controller props dado um tipo de campo T
  options: radioButton<T>[];
}

/**
 * Componente estilizado e controlado de criação de vários botões de rádio. Pode
 * gerar vários botões a partir de uma lista fornecida
 * @component
 *
 * @prop {string} title - O texto da caixa
 * @prop {any} controllerProps - Os parâmetros a serem passados para o
 * Controller que envolve o RadioButtonGroup. TODO: descobrir o tipo correto.
 * @prop {radioButton<T>[]} options - Lista de botões a serem criados. A lista
 * é do tipo {value:T, text:string}, onde value é o valor do botão e text é o
 * texto a ser exibido na interface.
 *
 * @example
 * <RadioButtonGroup
 *   title="Tamanho"
 *   controllerProps={{ control: control, name: "size" }}
 *   options={[
 *     { text: "Pequeno", value: "small" },
 *     { text: "Médio", value: "medium" },
 *     { text: "Grande", value: "large" },
 *   ]}
 * />
 */
export default function RadioButtonGroup<T>({
  title,
  controllerProps,
  options,
}: RadioButtonProps<T>) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Controller
        {...controllerProps}
        render={({ field: { onChange, onBlur, value, ...field } }) => (
          <RadioButton.Group onValueChange={onChange} value={value}>
            <View style={styles.listOfButtons}>
              {options.map((element, i) => {
                return (
                  <View key={i} style={styles.radioButtonWrap}>
                    <RadioButton value={String(element.value)} />
                    <Text style={styles.valueText}>{element.text}</Text>
                  </View>
                );
              })}
            </View>
          </RadioButton.Group>
        )}
      />
    </View>
  );
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    sectionTitle: {
      textTransform: "uppercase",
      color: theme.colors.primary,
      fontSize: 12,
    },
    listOfButtons: {
      flexDirection: "row",
      width: "100%",
      flexWrap: "wrap",
    },
    radioButtonWrap: {
      flexDirection: "row",
      flex: 1,
      minWidth: 90,
    },
    valueText: {
      color: theme.colors.onBackground,
      fontSize: 12,
      fontFamily: "Roboto_Regular",
      fontWeight: "normal",
      textAlignVertical: "center",
    },
  });
