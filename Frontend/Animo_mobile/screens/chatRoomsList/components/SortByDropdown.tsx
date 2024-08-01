import { Text } from "react-native";

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

export default function SortByDropdown() {
  return <Text> Sort by Newest</Text>;
}
