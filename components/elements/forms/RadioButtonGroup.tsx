import React, { View, StyleSheet } from "react-native";
import { Text, MD3Theme, RadioButton, useTheme } from "react-native-paper";

export type radioButton<T> = {
  key: T;
  text: string;
};

export interface RadioButtonProps<T> {
  title: string;
  value?: T;
  onChange: (newValue: T) => void;
  options: radioButton<T>[];
}

export default function RadioButtonGroup<T>({
  title,
  value,
  onChange,
  options,
}: RadioButtonProps<T>) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <RadioButton.Group
        onValueChange={(newValue) => {
          onChange(newValue as T);
        }}
        value={(value as string) ?? ""}
      >
        <View style={styles.listOfButtons}>
          {options.map((element, i) => {
            return (
              <View key={i} style={styles.radioButtonWrap}>
                <RadioButton value={String(element.key)} />
                <Text style={styles.valueText}>{element.text}</Text>
              </View>
            );
          })}
        </View>
      </RadioButton.Group>
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
