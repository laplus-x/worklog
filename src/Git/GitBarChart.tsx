import { useTheme } from "@/Hook";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { BarStackHorizontal } from "@visx/shape";
import { Text } from "@visx/text";
import type { Stats } from "./types";

interface GitBarChartProps {
  data: Stats[];
}

const margin = { top: 10, right: 20, bottom: 30, left: 150 };
const keys = ["additions", "deletions"];
const colorScale = scaleOrdinal({
  domain: keys,
  range: ["PaleGreen", "Pink"], // 綠=完成, 紅=未完成
});

const formatter = new Intl.NumberFormat();

export const GitBarChart = ({ data }: GitBarChartProps) => {
  const { theme } = useTheme();
  const color = theme === "dark" ? "#fff" : "#000";

  const group = data.reduce<Record<string, any>>((prev, curr) => {
    prev[curr.project] ??= {
      project: curr.project,
      additions: 0,
      deletions: 0,
      diff: 0,
    };

    prev[curr.project].additions += curr.additions;
    prev[curr.project].deletions -= curr.deletions;
    prev[curr.project].diff += curr.diff;
    return prev;
  }, {});
  const statsData = Object.values(group);

  const width = 600;
  const height = statsData.length * 50 + margin.top + margin.bottom;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = scaleLinear({
    domain: [
      Math.min(...statsData.map((d) => d.deletions)),
      Math.max(...statsData.map((d) => d.additions)),
    ],
    range: [0, innerWidth],
  });

  const yScale = scaleBand({
    domain: statsData.map((d) => d.project),
    padding: 0.6,
    range: [0, innerHeight],
  });

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        <BarStackHorizontal
          data={statsData}
          keys={keys}
          y={(d) => d.project}
          yScale={yScale}
          xScale={xScale}
          color={colorScale}
          offset="diverging"
        />
        {/* 在每個 bar 右側顯示 diff 數值 */}
        {statsData.map((d) => {
          const y = yScale(d.project)! - yScale.bandwidth() / 2;
          const x = xScale(0)!;
          return (
            <Text
              key={d.project}
              x={x}
              y={y}
              fontSize={16}
              fill={color}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {`Δ ${formatter.format(d.diff)}`}
            </Text>
          );
        })}
        <AxisBottom
          top={innerHeight}
          scale={xScale}
          numTicks={5}
          stroke={color}
          tickStroke={color}
          tickLabelProps={{ fontSize: 14, fill: color }}
        />
        <AxisLeft
          scale={yScale}
          stroke={color}
          tickStroke={color}
          tickLabelProps={{ fontSize: 14, fill: color }}
        />
      </Group>
    </svg>
  );
};
