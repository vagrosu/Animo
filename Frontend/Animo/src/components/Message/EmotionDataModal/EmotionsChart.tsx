import {Tooltip} from "@mui/material";
import {Doughnut} from "react-chartjs-2";
import {ArcElement, Chart as ChartJS, ChartData, Legend, Tooltip as ChartTooltip} from "chart.js";
import {capitalizeFirstLetter} from "../../../utils/helpers.ts";
ChartJS.register(ArcElement, ChartTooltip, Legend);

type EmotionType = {
  isSuccess: boolean,
  errorMessage?: string,
  neutral: number,
  joy: number,
  surprise: number,
  sadness: number,
  disgust: number,
  anger: number,
  fear: number
}

const getEmotionsObject = (emotionData: EmotionType) => {
  const resp: {[k: string]: number} = {}
  Object.keys(emotionData).filter(key => key !== "isSuccess" && key !== "errorMessage").forEach(key => {
    resp[key] = emotionData[key as keyof typeof emotionData] as number
  });

  return resp;
}

type EmotionsChartProps = {
  title: string,
  emotions: EmotionType
}

export default function EmotionsChart({title, emotions}: EmotionsChartProps) {
  const emotionsData: ChartData<"doughnut", number[], string> = {
    labels: Object.keys(getEmotionsObject(emotions)).map(capitalizeFirstLetter),
    datasets: [
      {
        data: Object.values(getEmotionsObject(emotions)).map(val => val + 0.0001),
        label: "% of all emotions",
        backgroundColor: [
          'rgba(210, 180, 140, 0.2)',
          'rgba(255, 235, 59, 0.2)',
          'rgba(255, 152, 0, 0.2)',
          'rgba(3, 169, 244, 0.2)',
          'rgba(76, 175, 80, 0.2)',
          'rgba(244, 67, 54, 0.2)',
          'rgba(156, 39, 176, 0.2)'
        ],
        borderColor: [
          'rgba(210, 180, 140, 1)',
          'rgba(255, 235, 59, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(3, 169, 244, 1)',
          'rgba(76, 175, 80, 1)',
          'rgba(244, 67, 54, 1)',
          'rgba(156, 39, 176, 1)'
        ],
        borderWidth: 0.5,
        hoverBorderWidth: 1.5
      }
    ]
  }

  return (
    <div className={"flex flex-col items-center w-1/2"}>
      <p className={"text-xl font-semibold mt-5 mb-3"}>
        {title}
        {!emotions.isSuccess && (
          <Tooltip
            title={emotions.errorMessage}
            placement={"top"}
            arrow
          >
            <label> ⚠️</label>
          </Tooltip>
        )}
      </p>
      <Doughnut
        data={emotionsData}
        options={{
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }}
        className={"!w-full !h-full"}
      />
    </div>
  )
}