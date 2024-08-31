import { Text, StyleSheet, View, Pressable } from "react-native";
import COLORS from "../../../utils/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleDown, faAngleUp, faCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircle as faCircleEmpty } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import ModalComponent from "../../../components/ModalComponent";

export const SORT_BY_OPTIONS = {
  NEWEST: 0,
  OLDEST: 1,
  NAME_A_Z: 2,
  NAME_Z_A: 3,
};

const getSortByOption = (op: number) => {
  switch (op) {
    case SORT_BY_OPTIONS.NEWEST:
      return "Newest";
    case SORT_BY_OPTIONS.OLDEST:
      return "Oldest";
    case SORT_BY_OPTIONS.NAME_A_Z:
      return "Name A to Z";
    case SORT_BY_OPTIONS.NAME_Z_A:
      return "Name Z to A";
    default:
      return "Newest";
  }
};

type SortByDropdownProps = {
  value: number;
  onChange: (value: number) => void;
};

export default function SortByDropdown({ value, onChange }: SortByDropdownProps) {
  const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);

  const onClose = () => {
    setIsSortByDropdownOpen(false);
  };

  const toggle = () => {
    setIsSortByDropdownOpen((prev) => !prev);
  };

  const onSelectOption = (option: number) => {
    onChange(option);
    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <>
      <View style={styles.titleContainer}>
        <Text>Sort by</Text>
        <Pressable style={styles.dropdownLabelContainer} onPress={toggle}>
          <Text style={styles.selectedItemLabel}>{getSortByOption(value)}</Text>
          <FontAwesomeIcon icon={isSortByDropdownOpen ? faAngleUp : faAngleDown} color={COLORS.blue600} />
        </Pressable>
      </View>

      <ModalComponent title="Sort chats by" isOpen={isSortByDropdownOpen} onClose={onClose} modalStyle={styles.modal}>
        <View style={styles.optionsContainer}>
          {Object.keys(SORT_BY_OPTIONS).map((key) => {
            const optionValue = SORT_BY_OPTIONS[key as keyof typeof SORT_BY_OPTIONS];
            const isSelected = optionValue === value;

            return (
              <Pressable
                key={key}
                style={[styles.row, isSelected && styles.selectedRow]}
                onPress={() => onSelectOption(optionValue)}
              >
                <FontAwesomeIcon icon={isSelected ? faCircle : faCircleEmpty} color={COLORS.blue600} />
                <Text style={[styles.rowText, isSelected && styles.selectedText]}>{getSortByOption(optionValue)}</Text>
              </Pressable>
            );
          })}
        </View>
      </ModalComponent>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  selectedItemLabel: {
    color: COLORS.blue600,
    fontWeight: "500",
  },

  dropdownLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  modal: {
    height: undefined,
  },

  optionsContainer: {
    paddingVertical: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 8,
  },

  selectedRow: {
    backgroundColor: COLORS.blue100,
  },

  rowText: {
    fontSize: 16,
  },

  selectedText: {
    color: COLORS.blue600,
  },
});
