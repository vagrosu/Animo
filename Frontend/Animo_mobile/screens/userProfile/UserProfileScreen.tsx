import { View, StyleSheet, Text, ActivityIndicator, Switch, Pressable } from "react-native";
import { useSafeAreaStyle } from "../../utils/hooks";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUser } from "../../context/UserContext";
import IconAvatar from "../../components/IconAvatar";
import { faChevronLeft, faEnvelope, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "react-query";
import { UsersByUserIdResponseType } from "../../types/api/responses";
import { AxiosError } from "axios";
import { createApiInstance } from "../../services/api";
import COLORS from "../../utils/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useSelfieConsentModal } from "../../context/SelfieConsentProtectedContext/SelfieConsentProtectedContext";

export default function UserProfileScreen() {
  const currentUser = useUser();
  const { params } = useRoute();
  const navigation = useNavigation();
  const consentModal = useSelfieConsentModal();
  const safeAreaStyle = useSafeAreaStyle(styles.container);
  const userId = params?.userId;
  const isCurrentUser = currentUser.userId === userId;

  const userQuery = useQuery<UsersByUserIdResponseType, AxiosError | Error>({
    queryKey: ["Users", userId, "UserProfileModal"],
    queryFn: async () => {
      const api = await createApiInstance();

      return api.get<UsersByUserIdResponseType>(`Users/${userId}`).then((res) => res.data);
    },
  });

  const onBackPress = () => {
    navigation.goBack();
  };

  const selfieConsentAlertToggle = () => {
    consentModal.open();
  };

  const user = userQuery.data?.user;
  return (
    <View style={safeAreaStyle}>
      <Pressable onPress={onBackPress} style={styles.headerContainer}>
        <FontAwesomeIcon icon={faChevronLeft} size={19} color={COLORS.blue600} />
        <Text style={styles.headerText}>Back</Text>
      </Pressable>
      {userQuery.isLoading ? (
        <ActivityIndicator style={styles.loading} />
      ) : userQuery.error ? (
        <Text>{userQuery.error.message}</Text>
      ) : (
        user && (
          <>
            <View style={styles.profileAvatarContainer}>
              <IconAvatar icon={faUser} size={88} />
              <View style={styles.nameContainer}>
                <Text style={styles.name}>
                  {user.firstName} {user.lastName}
                </Text>
                <Text style={styles.userName}>{user.username}</Text>
              </View>
            </View>
            <View style={styles.detailsContainer}>
              {user.phoneNumber && (
                <View style={styles.detailsRow}>
                  <FontAwesomeIcon icon={faPhone} size={16} color={COLORS.blue400} />
                  <Text style={styles.detailsText}>{user.phoneNumber}</Text>
                </View>
              )}
              {user.email && (
                <View style={styles.detailsRow}>
                  <FontAwesomeIcon icon={faEnvelope} size={16} color={COLORS.blue400} />
                  <Text style={styles.detailsText}>{user.email}</Text>
                </View>
              )}
            </View>
            {isCurrentUser && (
              <>
                <View style={styles.separator} />
                <View style={styles.settingsRow}>
                  <Text>Consent to use selfies</Text>
                  <Switch
                    value={currentUser.isSelfieConsentGiven}
                    onValueChange={selfieConsentAlertToggle}
                    trackColor={{ true: COLORS.blue600 }}
                  />
                </View>
              </>
            )}
          </>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  headerText: {
    color: COLORS.blue600,
    fontSize: 16,
  },

  loading: {
    marginTop: 48,
  },

  profileAvatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 28,
  },

  nameContainer: {
    gap: 4,
    marginLeft: 16,
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
  },

  userName: {
    color: COLORS.gray600,
  },

  detailsContainer: {
    paddingHorizontal: 8,
    gap: 16,
  },

  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  detailsText: {
    color: COLORS.gray600,
  },

  separator: {
    height: 1,
    backgroundColor: COLORS.gray200,
    marginVertical: 24,
  },

  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.gray200,
    borderRadius: 8,
  },
});
