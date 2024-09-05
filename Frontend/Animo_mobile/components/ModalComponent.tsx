import { Modal, ModalProps, View, StyleSheet, Pressable, Text, Animated, Platform } from "react-native";
import { useSafeAreaStyle } from "../utils/hooks";
import OutsidePressHandler from "react-native-outside-press";
import COLORS from "../utils/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

const FADE_DURATION = 250;

type ModalComponentProps = {
  title: string;
  isOpen?: boolean;
  onClose?: () => void;
  modalStyle?: any;
  children: React.ReactNode;
} & ModalProps;

export default function ModalComponent({ title, isOpen, onClose, modalStyle, children, ...rest }: ModalComponentProps) {
  const safeAreaStyle = useSafeAreaStyle(styles.modalContainer);
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [isBackgroundOpen, setisBackgroundOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      Animated.timing(fadeAnimation, {
        toValue: 0.7,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }).start();
      setisBackgroundOpen(false);
    }
  }, [fadeAnimation, isOpen]);

  return (
    <Modal
      animationType="none"
      visible={isOpen}
      onRequestClose={onClose}
      onDismiss={onClose}
      onShow={() => setisBackgroundOpen(true)}
      transparent
      {...rest}
    >
      <Animated.View style={[styles.modalBackground, { opacity: fadeAnimation }]} />
      <Modal
        animationType="slide"
        visible={Platform.OS === "ios" ? isOpen : isBackgroundOpen}
        onRequestClose={onClose}
        onDismiss={onClose}
        transparent
        {...rest}
      >
        <View style={safeAreaStyle}>
          <View style={styles.modalWrapper}>
            <OutsidePressHandler style={[styles.modal, modalStyle]} onOutsidePress={onClose || (() => {})}>
              <View style={styles.headerContainer}>
                <Text style={styles.title}>{title}</Text>
                {onClose && (
                  <Pressable onPress={onClose} style={styles.closeButton}>
                    <FontAwesomeIcon icon={faXmark} size={20} color={COLORS.blue600} />
                  </Pressable>
                )}
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
    flex: 1,
    backgroundColor: COLORS.black,
  },

  modalWrapper: {
    marginHorizontal: 8,
    marginBottom: Platform.OS === "android" ? 16 : 0,
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
