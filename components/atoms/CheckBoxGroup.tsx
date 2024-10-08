import { Control, Controller, FieldValues, Path } from "react-hook-form";
import React, {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Checkbox } from "react-native-paper";

export interface CheckBoxGroupProps<T extends FieldValues> {
  title: string;
  controllerProps: {control: Control<T>, name: Path<T>};
  style?: StyleProp<ViewStyle>;
}


/**
 * Componente estilizado e controlado de CheckBox
 * @component
 * 
 * @prop {string} title - O texto do botão
 * @prop {any} controllerProps - Os parâmetros a serem passados para o 
 * Controller que envolve o CheckBox. TODO: descobrir o tipo correto
 * @prop {StyleProp<ViewStyle>?} [style] - Estilo da View que engloba todos os
 * elementos do componente.
 * 
 * @example
 * <CheckBoxGroup
 *   title="Calmo"
 *   style={styles.checkBox}
 *   controllerProps={{ control: control, name: "temperament.calm" }}
 * />
 */
export default function CheckBoxGroup<T extends FieldValues>({
  title,
  controllerProps,
  style,
}: CheckBoxGroupProps<T>) {
  return (
    <View style={[styles.wrapper, style]}>
      <Controller
        {...controllerProps}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            status={value ? "checked" : "unchecked"}
            onPress={() => onChange(!value)}
          />
        )}
      />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexDirection: "row" },
  text: { textAlignVertical: "center", flexShrink: 1, },
});
