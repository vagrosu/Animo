import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import COLORS from "../utils/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";

type IconAvatarProps = {
  icon: React.ComponentProps<typeof FontAwesomeIcon>["icon"];
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export default function IconAvatar({ icon, size = 40, style }: IconAvatarProps) {
  const sizeStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <View style={[styles.container, sizeStyle, style]}>
      <FontAwesomeIcon icon={icon} size={size / 2} color={COLORS.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray350,
    alignItems: "center",
    justifyContent: "center",
  },
});
