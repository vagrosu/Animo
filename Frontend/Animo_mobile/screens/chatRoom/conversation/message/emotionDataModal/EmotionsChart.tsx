import { StyleSheet, View, Text, Pressable } from "react-native";
import EmojiIcon from "../../../../../components/EmojiIcon";
import { capitalizeFirstLetter } from "../../../../../utils/helpers";
import Popover from "react-native-popover-view";
import COLORS from "../../../../../utils/colors";

const BACKGROUND_COLORS = [
  "rgb(210, 180, 140)",
  "rgb(255, 235, 59)",
  "rgb(255, 152, 0)",
  "rgb(3, 169, 244)",
  "rgb(76, 175, 80)",
  "rgb(244, 67, 54)",
  "rgb(156, 39, 176)",
];

type EmotionType = {
  isSuccess: boolean;
  errorMessage?: string;
  neutral: number;
  joy: number;
  surprise: number;
  sadness: number;
  disgust: number;
  anger: number;
  fear: number;
};

const getEmotionsObject = (emotionData: EmotionType) => {
  const resp: { [k: string]: number } = {};
  Object.keys(emotionData)
    .filter((key) => key !== "isSuccess" && key !== "errorMessage")
    .forEach((key) => {
      resp[key] = emotionData[key as keyof typeof emotionData] as number;
    });

  return resp;
};

const getEmptyChartData = (cleanedEmotions: { [k: string]: number }) => {
  return Object.values(cleanedEmotions).map((val, index) => ({
    title: Object.keys(cleanedEmotions)[index],
    part: 0,
    backgroundColor: BACKGROUND_COLORS[index],
  }));
};

type EmotionsChartProps = {
  title: string;
  emotions: EmotionType;
  selectedEmotion: string | null;
  onEmotionPress: (emotion: string) => void;
};

export default function EmotionsChart({ title, emotions, selectedEmotion, onEmotionPress }: EmotionsChartProps) {
  const cleanedEmotions = getEmotionsObject(emotions);
  let data = Object.values(cleanedEmotions)
    .map((val, index) => ({
      title: Object.keys(cleanedEmotions)[index],
      part: val,
      backgroundColor: BACKGROUND_COLORS[index],
    }))
    .filter((itemData) => itemData.part > 0.01);

  if (data.length === 0) {
    data = getEmptyChartData(cleanedEmotions);
  }

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text>{title}</Text>
        {!emotions.isSuccess && (
          <Popover from={<EmojiIcon emoji={"warning"} size={16} />} offset={-7} arrowShift={0.7}>
            <Text style={styles.tooltipContent}>{emotions.errorMessage}</Text>
          </Popover>
        )}
      </View>
      <View style={styles.chartContainer}>
        {data.map((itemData, index) => {
          const isSelected = itemData.title == selectedEmotion;
          const dynamicStyles = StyleSheet.create({
            chartBar: {
              flex: itemData.part || 1,
              backgroundColor: itemData.backgroundColor,
              opacity: isSelected ? 1 : 0.5,
              ...(isSelected && {
                height: styles.chartItem.height + 2,
                marginVertical: -2,
              }),
            },

            dot: {
              backgroundColor: itemData.backgroundColor,
            },
          });

          return (
            <Popover
              key={itemData.title}
              isVisible={isSelected}
              onRequestClose={() => onEmotionPress(itemData.title)}
              from={
                <Pressable
                  onPress={() => onEmotionPress(itemData.title)}
                  style={[styles.chartItem, dynamicStyles.chartBar]}
                />
              }
            >
              <View style={styles.tooltipContent}>
                <Text style={styles.tooltipTitle}>{capitalizeFirstLetter(itemData.title)}</Text>
                <View style={styles.tooltipDataContainer}>
                  <View style={[styles.dot, dynamicStyles.dot]} />
                  <Text style={styles.tooltipSubtitle}>% of all emotions: {itemData.part.toPrecision(2)}</Text>
                </View>
              </View>
            </Popover>
          );
        })}
      </View>
      <View style={styles.labelsContainer}>
        {Object.entries(cleanedEmotions).map(([emotionName, emotionValue]) => {
          const isSelected = emotionName === selectedEmotion;
          const itemStyle = StyleSheet.flatten({
            backgroundColor: BACKGROUND_COLORS[Object.keys(cleanedEmotions).indexOf(emotionName)],
            opacity: isSelected ? 1 : 0.5,
            ...(isSelected && {
              width: styles.dot.width + 2,
              marginHorizontal: styles.dot.marginHorizontal - 1,
            }),
          });

          return (
            <Pressable key={emotionName} onPress={() => onEmotionPress(emotionName)} style={styles.labelContainer}>
              <View style={[styles.dot, itemStyle]} />
              <Text>{capitalizeFirstLetter(emotionName)}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  chartContainer: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: "100%",
    maxWidth: "100%",
    marginVertical: 10,
    gap: 6,
  },

  chartItem: {
    backgroundColor: "red",
    height: 12,
    borderRadius: 10,
  },

  labelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginVertical: 6,
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 10,
    aspectRatio: 1,
    borderRadius: 100,
    marginHorizontal: 4,
  },

  tooltipContent: {
    padding: 6,
    gap: 4,
  },

  tooltipDataContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  tooltipTitle: {
    fontWeight: "500",
    fontSize: 16,
  },

  tooltipSubtitle: {
    color: COLORS.gray400,
  },
});
