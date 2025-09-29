import { useTheme } from "@/Hook";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { BarStackHorizontal } from "@visx/shape";
import { Task } from "./types";

interface TaskBarChartProps {
  data: Task[];
}

const keys = ["完成", "未完成"];
const colorScale = scaleOrdinal({
  domain: keys,
  range: ["PaleGreen", "Pink"], // 綠=完成, 紅=未完成
});
const margin = { top: 20, right: 20, bottom: 50, left: 100 };

export const TaskBarChart = ({ data }: TaskBarChartProps) => {
  const { theme } = useTheme();
  const color = theme === "dark" ? "#fff" : "#000";

  const width = 600;
  const height = data.length * 50 + margin.top + margin.bottom;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // X 軸: 0-100% 百分比
  const xScale = scaleLinear({
    domain: [0, 100],
    range: [0, innerWidth],
  });

  // Y 軸: 任務分類
  const yScale = scaleBand({
    domain: data.map((d) => d.任務分類),
    padding: 0.2,
    range: [0, innerHeight],
  });

  const percentData = data.map((d) => ({
    ...d,
    完成: d.進度,
    未完成: 100 - d.進度,
  }));

  return (
    <svg width={width} height={height}>
      <Group top={margin.top} left={margin.left}>
        <BarStackHorizontal
          data={percentData}
          keys={keys}
          y={(d) => d.任務分類}
          yScale={yScale}
          xScale={xScale}
          color={colorScale}
        />
        <AxisLeft
          scale={yScale}
          stroke={color}
          tickStroke={color}
          tickLabelProps={{ fontSize: 14, fill: color }}
        />
        <AxisBottom
          top={innerHeight}
          scale={xScale}
          numTicks={10}
          stroke={color}
          tickStroke={color}
          tickLabelProps={{ fontSize: 14, fill: color }}
          tickFormat={(v) => `${v}%`}
        />
      </Group>
    </svg>
  );
};
