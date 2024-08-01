import { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();

  return (
    <>
      {children}
      <Toast position="top" topOffset={insets.top} />
    </>
  );
}
