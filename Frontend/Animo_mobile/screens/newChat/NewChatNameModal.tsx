import { Pressable, StyleSheet, Text, View } from "react-native";
import ModalComponent from "../../components/ModalComponent";
import COLORS from "../../utils/colors";
import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

type NewChatNameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (name: string) => void;
};

export default function NewChatNameModal({ isOpen, onClose, onCreateChat }: NewChatNameModalProps) {
  const [chatName, setChatName] = useState("");

  return (
    <ModalComponent title="Name" isOpen={isOpen} onClose={onClose} modalStyle={styles.modal}>
      <View style={styles.chatNameInputContainer}>
        <FontAwesomeIcon icon={faUsers} style={styles.inputIcon} />
        <TextInput
          value={chatName}
          onChangeText={setChatName}
          placeholder={"Give your chat a name..."}
          style={styles.chatNameInput}
        />
      </View>
      <Pressable
        style={({ pressed }) => [styles.createButton, pressed && styles.createButtonPressed]}
        onPress={() => onCreateChat(chatName)}
      >
        <Text style={styles.createButtonContent}>Create</Text>
      </Pressable>
    </ModalComponent>
  );
}

const styles = StyleSheet.create({
  modal: {
    height: "auto",
  },

  chatNameInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    borderBottomColor: COLORS.gray400,
    borderBottomWidth: 0.5,
    paddingBottom: 4,
  },

  inputIcon: {
    marginLeft: 6,
    opacity: 0.54,
  },

  chatNameInput: {
    flex: 1,
    marginLeft: 8,
    lineHeight: 18,
    fontSize: 16,
  },

  createButton: {
    marginTop: "auto",
    backgroundColor: COLORS.blue600,
    borderColor: COLORS.blue600,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  createButtonDisabled: {
    backgroundColor: COLORS.gray400,
    borderColor: COLORS.gray400,
  },

  createButtonPressed: {
    backgroundColor: COLORS.blue700,
    borderColor: COLORS.blue700,
  },

  createButtonContent: {
    color: COLORS.white,
    textAlign: "center",
  },
});
