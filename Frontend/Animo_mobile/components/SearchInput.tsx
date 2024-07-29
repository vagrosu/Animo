import { StyleProp, StyleSheet, View, ViewStyle, TextInput, TextInputProps } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import COLORS from "../utils/colors";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

type SearchInputProps = {
  style?: StyleProp<ViewStyle>;
} & Omit<TextInputProps, "style">;

export default function SearchInput({ style, ...rest }: SearchInputProps) {
  return (
    <View style={[styles.container, style]}>
      <FontAwesomeIcon icon={faSearch} style={styles.searchIcon} size={12} />
      <TextInput style={styles.textInput} placeholder={"Search"} autoCorrect={false} autoCapitalize={"none"} {...rest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray200,
    paddingVertical: 4,
    borderRadius: 12,
  },

  textInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 5,
    lineHeight: 20,
    fontSize: 18,
  },

  searchIcon: {
    marginLeft: 12,
    opacity: 0.54,
  },
});
