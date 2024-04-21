import React, { StyleProp, Text, View, ViewStyle  } from "react-native";
import { Checkbox } from "react-native-paper";

export interface CheckBoxGroupProps {
  title: string;
  value: boolean;
  onPress: (newValue: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

export default function CheckBoxGroup<T>({
  title,
  value,
  onPress,
  style
}: CheckBoxGroupProps) {
  return (
    <View style={[{ flexDirection: "row" }, style]}>
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
