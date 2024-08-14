import { useEffect, useState } from "react";
import { ImageBackground, ImageSourcePropType, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const background1 = require("../assets/images/background1.webp");
const background2 = require("../assets/images/background2.webp");
const background3 = require("../assets/images/background3.webp");

const FADE_IN_DURATION = 750;
const FADE_OUT_DURATION = 500;

const fadeIn = (sharedValue: SharedValue<number>, callback?: () => void) => {
  sharedValue.value = withTiming(
    1,
    {
      duration: FADE_IN_DURATION,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    },
    () => (callback ? runOnJS(callback)() : undefined)
  );
};

const fadeOut = (sharedValue: SharedValue<number>, callback?: () => void) => {
  sharedValue.value = withTiming(
    0.75,
    {
      duration: FADE_OUT_DURATION,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    },
    () => (callback ? runOnJS(callback)() : undefined)
  );
};

const getAnimatedStyle = (sharedValue: SharedValue<number>) =>
  useAnimatedStyle(() => {
    return {
      opacity: sharedValue.value,
    };
  });

type AnimatedImageBackgroundProps = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export default function AnimatedImageBackground({ style = {}, children }: AnimatedImageBackgroundProps) {
  const backgroundFadeOpacity = useSharedValue(1);
  const animatedStyle = getAnimatedStyle(backgroundFadeOpacity);
  const [background, setBackground] = useState<ImageSourcePropType>(background1);
  const imageList = [background1, background2, background3];

  useEffect(() => {
    const intervalId = setInterval(() => {
      fadeOut(backgroundFadeOpacity, () => {
        setBackground((current) => {
          const index = imageList.indexOf(current);
          return imageList[(index + 1) % imageList.length];
        });
      });
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fadeIn(backgroundFadeOpacity);
  }, [background]);

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <ImageBackground source={background} style={[styles.container, style]}>
        {children}
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
