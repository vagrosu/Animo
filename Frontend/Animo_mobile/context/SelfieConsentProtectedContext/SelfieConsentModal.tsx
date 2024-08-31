import { Text, StyleSheet, View, Pressable, Platform } from "react-native";
import { useUser } from "../UserContext";
import ModalComponent from "../../components/ModalComponent";
import COLORS from "../../utils/colors";
import { useMutation } from "react-query";
import { UsersUpdateSelfieConsentResponseType } from "../../types/api/responses";
import { AxiosError } from "axios";
import { UsersUpdateSelfieConsentQueryType } from "../../types/api/queries";
import { createApiInstance } from "../../services/api";

type SelfieConsentModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  onGiveConsentExtra?: (isConsentGiven: boolean) => void;
};

export default function SelfieConsentModal({ isOpen, onClose, onGiveConsentExtra }: SelfieConsentModalProps) {
  const user = useUser();

  const giveConsentMutation = useMutation<
    UsersUpdateSelfieConsentResponseType,
    Error | AxiosError,
    UsersUpdateSelfieConsentQueryType
  >({
    mutationFn: async (data) => {
      const api = await createApiInstance();

      return api.patch(`Users/update-selfie-consent`, {
        userId: data.userId,
        isSelfieConsentGiven: data.isSelfieConsentGiven,
      });
    },
    onSettled: () => {
      user.refetch();
    },
  });

  const onGiveConsent = async (isConsentGiven: boolean) => {
    await giveConsentMutation.mutateAsync({
      userId: user.userId,
      isSelfieConsentGiven: isConsentGiven,
    });

    onGiveConsentExtra && onGiveConsentExtra(isConsentGiven);
  };

  return (
    <ModalComponent isOpen={isOpen} title={"Consent to use your selfies"} onClose={onClose} modalStyle={styles.modal}>
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.text}>
            Your privacy is important. We request permission to use your camera to capture selfies for emotion analysis.
          </Text>
          <View style={styles.listContainer}>
            <Text style={styles.text}>Here’s what you should know:</Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>{"\u2022"} Security: </Text>
              We don't store your images, they are automatically deleted after analysis.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>{"\u2022"} Encryption: </Text>
              All data is securely encrypted during transmission.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>{"\u2022"} Processing: </Text>
              All emotion analysis is conducted on our secure server, not on your device.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>{"\u2022"} Control: </Text>
              You can withdraw consent at any time from your profile settings.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>{"\u2022"} Usage: </Text>
              The camera is used only when you send a message.
            </Text>
          </View>
          <Text style={styles.text}>
            By agreeing, you allow us to access your camera and process your selfie under these conditions.
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <Pressable style={styles.button} onPress={() => onGiveConsent(false)}>
            <Text style={styles.buttonContent}>Disagree</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.primaryButton]} onPress={() => onGiveConsent(true)}>
            <Text style={[styles.buttonContent, styles.primaryButtonContent]}>Agree</Text>
          </Pressable>
        </View>
      </View>
    </ModalComponent>
  );
}

const styles = StyleSheet.create({
  modal: {
    height: 480,
  },

  container: {
    flex: 1,
    marginTop: 16,
  },

  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 16,
  },

  listContainer: {
    gap: 4,
  },

  text: {
    color: COLORS.gray500,
  },

  boldText: {
    fontWeight: "700",
    color: COLORS.blue500,
  },

  buttonsContainer: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },

  button: {
    flex: 1,
    borderColor: COLORS.blue600,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  primaryButton: {
    backgroundColor: COLORS.blue600,
  },

  buttonContent: {
    color: COLORS.blue600,
    textAlign: "center",
  },

  primaryButtonContent: {
    color: COLORS.white,
  },
});
