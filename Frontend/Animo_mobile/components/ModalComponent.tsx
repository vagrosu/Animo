import { Modal, ModalProps, View, StyleSheet, Pressable, Text } from "react-native";
import { useSafeAreaStyle } from "../utils/hooks";
import OutsidePressHandler from "react-native-outside-press";
import COLORS from "../utils/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type ModalComponentProps = {
  title: string;
  isOpen?: boolean;
  onClose: () => void;
  modalStyle?: any;
  children: React.ReactNode;
} & ModalProps;

export default function ModalComponent({ title, isOpen, onClose, modalStyle, children, ...rest }: ModalComponentProps) {
  const safeAreaStyle = useSafeAreaStyle();

  return (
    <Modal animationType="none" visible={isOpen} onRequestClose={onClose} onDismiss={onClose} transparent {...rest}>
      <View style={styles.modalBackground} />
      <Modal animationType="slide" visible={isOpen} onRequestClose={onClose} onDismiss={onClose} transparent {...rest}>
        <View style={[styles.modalContainer, safeAreaStyle]}>
          <View style={styles.modalWrapper}>
            <OutsidePressHandler style={[styles.modal, modalStyle]} onOutsidePress={onClose}>
              <View style={styles.headerContainer}>
                <Text style={styles.title}>{title}</Text>
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <FontAwesomeIcon icon={faXmark} size={20} color={COLORS.blue600} />
                </Pressable>
              </View>
              {children}
            </OutsidePressHandler>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
  },

  modalWrapper: {
    marginHorizontal: 8,
  },

  modal: {
    width: "100%",
    height: 350,
    backgroundColor: COLORS.gray50,
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
});
