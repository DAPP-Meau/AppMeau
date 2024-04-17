import Colors from "@/constants/Colors";
import React, { View, Text, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";

export type radioButton<T> = {
   key: T;
   text: string 
}

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
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <RadioButton.Group
        onValueChange={(newValue) => {
          onChange(newValue as T);
        }}
        value={value as string ?? ""}
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

const styles = StyleSheet.create({
  sectionTitle: {
    textTransform: "uppercase",
    color: "#f7a800",
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
    color: Colors.text.gray2,
    fontSize: 12,
    fontFamily: "Roboto_Regular",
    fontWeight: "normal",
    textAlignVertical: "center",
  },
});
