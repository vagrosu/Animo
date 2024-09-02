import { StyleSheet, View } from "react-native";
import { ReactionType } from "../../../../types";
import { FlatList } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import ReactionsTypesListItem from "./ReactionsTypesListItem";
import ReactionsListItem from "./ReactionsListItem";
import ModalComponent from "../../../../../../components/ModalComponent";

type ReactionsListModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reactions: ReactionType[];
};

export default function ReactionsListModal({ isOpen, onClose, reactions }: ReactionsListModalProps) {
  const [selectedReactionsFilter, setSelectedReactionsFilter] = useState<string | null>(null);
  const filteredReactions = reactions.filter((reaction) =>
    selectedReactionsFilter ? selectedReactionsFilter === reaction.emoji : true
  );
  const reactionsTypes = Array.from(new Set(reactions.map((reaction) => reaction.emoji)));

  const onSelectFilter = (filter: string | null) => {
    setSelectedReactionsFilter(filter);
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedReactionsFilter(null);
    }
  }, [isOpen]);

  return (
    <ModalComponent title={"Reactions"} isOpen={isOpen} onClose={onClose}>
      <View style={styles.reactionsListContainer}>
        <FlatList
          data={filteredReactions}
          keyExtractor={(reaction) => reaction.messageReactionId}
          renderItem={({ item, index }) => (
            <ReactionsListItem isLastItem={index === filteredReactions.length - 1} reaction={item} />
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
    </ModalComponent>
  );
}

const styles = StyleSheet.create({
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
