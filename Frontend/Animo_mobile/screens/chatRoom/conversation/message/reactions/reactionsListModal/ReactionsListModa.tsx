import { Modal, Text, StyleSheet, View, Pressable } from "react-native";
import COLORS from "../../../../../../utils/colors";
import { useSafeAreaStyle } from "../../../../../../utils/hooks";
import OutsidePressHandler from "react-native-outside-press";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ReactionType } from "../../../../types";
import { FlatList } from "react-native-gesture-handler";
import { useState } from "react";
import ReactionsTypesListItem from "./ReactionsTypesListItem";
import ReactionsListItem from "./ReactionsListItem";

type ReactionsListModalProps = {
  reactions: ReactionType[];
  onClose: () => void;
};

export default function ReactionsListModal({ reactions, onClose }: ReactionsListModalProps) {
  const safeAreaStyle = useSafeAreaStyle();
  const [selectedReactionsFilter, setSelectedReactionsFilter] = useState<string | null>(null);
  const filteredReactions = reactions.filter((reaction) =>
    selectedReactionsFilter ? selectedReactionsFilter === reaction.emoji : true
  );
  const reactionsTypes = Array.from(new Set(reactions.map((reaction) => reaction.emoji)));

  const onSelectFilter = (filter: string | null) => {
    setSelectedReactionsFilter(filter);
  };

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent>
      <View style={[styles.modalContainer, safeAreaStyle]}>
        <OutsidePressHandler style={styles.modal} onOutsidePress={onClose}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Reactions</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <FontAwesomeIcon icon={faXmark} size={20} color={COLORS.blue600} />
            </Pressable>
          </View>
          <View style={styles.reactionsListContainer}>
            <FlatList
              data={filteredReactions}
              keyExtractor={(reaction) => reaction.messageReactionId}
              renderItem={({ item, index }) => (
                <ReactionsListItem isLastItem={index === reactions.length - 1} reaction={item} />
              )}
            />
            <View style={styles.reactionsTypesListContainer}>
              <ReactionsTypesListItem
                text="All"
                isSelected={selectedReactionsFilter === null}
                onSelect={() => onSelectFilter(null)}
              />
              {reactionsTypes.map((reaction) => (
                <ReactionsTypesListItem
                  key={reaction}
                  reaction={reaction}
                  count={reactions.filter((r) => r.emoji === reaction).length}
                  isSelected={selectedReactionsFilter === reaction}
                  onSelect={() => onSelectFilter(reaction)}
                />
              ))}
            </View>
          </View>
        </OutsidePressHandler>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginHorizontal: 8,
  },

  modal: {
    width: "100%",
    height: 350,
    backgroundColor: COLORS.gray200,
    borderRadius: 24,
    padding: 20,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "500",
  },

  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },

  reactionsListContainer: {
    paddingTop: 12,
    height: "100%",
  },

  reactionsTypesListContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    paddingVertical: 10,
  },
});
