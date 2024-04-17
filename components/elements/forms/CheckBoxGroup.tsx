import React, { Text, View  } from "react-native";
import { Checkbox } from "react-native-paper";

export interface CheckBoxGroupProps {
  title: string;
  value: boolean;
  onPress: (newValue: boolean) => void;
}

export default function CheckBoxGroup<T>({
  title,
  value,
  onPress,
}: CheckBoxGroupProps) {
  return (
    <View style={{ flexDirection: "row" }}>
      <Checkbox
        status={value ? "checked" : "unchecked"}
        onPress={() => {
          onPress(!value);
        }}
      />
      <Text style={{ textAlignVertical: "center" }}>{title}</Text>
    </View>
  );
}
