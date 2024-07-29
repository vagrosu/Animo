import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Text, View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import COLORS from "../utils/colors";

type NoDataProps = {
  title: string;
  subtitle?: string;
  icon?: React.ComponentProps<typeof FontAwesomeIcon>["icon"];
  style: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string;
};

export default function NoContent({ title, subtitle, icon, style, iconSize, iconColor }: NoDataProps) {
  return (
    <View style={[styles.container, style]}>
      {icon && <FontAwesomeIcon icon={icon} size={iconSize || 68} style={styles.icon} color={iconColor || COLORS.blue600} />}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    marginBottom: 16,
    fontWeight: "400",
  },

  title: {
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "gray",
  },
});
