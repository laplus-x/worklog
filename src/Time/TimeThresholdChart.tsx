import { useTheme } from "@/Hook";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveBasis } from "@visx/curve";
import { GridColumns, GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { Threshold } from "@visx/threshold";
import { Time } from "./types";

interface TimeThresholdChartProps {
  data: Time[];
}

const margin = { top: 20, right: 20, bottom: 50, left: 40 };

const colors = {
  預計工時: "Gainsboro", // 亮灰色
  實際工時: "DeepSkyBlue", // 亮藍色
};

export const TimeThresholdChart = ({ data }: TimeThresholdChartProps) => {
  const { theme } = useTheme();
  const color = theme === "dark" ? "#fff" : "#000";

  const width = 600;
  const height = data.length * 50 + margin.top + margin.bottom;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // X 軸：任務類別 (離散類別 -> 坐標數字)
  const xScale = scaleBand<string>({
    domain: data.map((d) => d.類別),
    range: [0, innerWidth],
    padding: 0.2,
  });

  // Y 軸：工時
  const yScale = scaleLinear<number>({
    domain: [0, Math.max(...data.map((d) => Math.max(d.預計工時, d.實際工時)))],
    range: [innerHeight, 0],
    nice: true,
  });

  // 取中心位置當 X
  const getX = (d: any) => (xScale(d.類別) ?? 0) + xScale.bandwidth() / 2;
  const getY0 = (d: any) => yScale(d.預計工時) ?? 0;
  const getY1 = (d: any) => yScale(d.實際工時) ?? 0;

  return (
    <svg width={width} height={height}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="transparent"
        rx={14}
      />
      <Group left={margin.left} top={margin.top}>
        {/* grid */}
        <GridRows
          scale={yScale}
          width={innerWidth}
          height={innerHeight}
          stroke="#e0e0e0"
        />
        <GridColumns
          scale={xScale}
          width={innerWidth}
          height={innerHeight}
          stroke="#e0e0e0"
        />

        {/* 底線 */}
        <line
          x1={innerWidth}
          x2={innerWidth}
          y1={0}
          y2={innerHeight}
          stroke="#e0e0e0"
        />

        {/* Threshold 區域 */}
        <Threshold<any>
          id={`${Math.random()}`}
          data={data}
          x={getX}
          y0={getY0}
          y1={getY1}
          clipAboveTo={0}
          clipBelowTo={innerHeight}
          curve={curveBasis}
          belowAreaProps={{
            fill: "Pink",
            fillOpacity: 0.4,
          }}
          aboveAreaProps={{
            fill: "PaleGreen",
            fillOpacity: 0.4,
          }}
        />

        {/* 線條：實際 */}
        <LinePath
          data={data}
          curve={curveBasis}
          x={getX}
          y={getY1}
          stroke={colors["實際工時"]}
          strokeWidth={2}
        />

        {/* 線條：預計 */}
        <LinePath
          data={data}
          curve={curveBasis}
          x={getX}
          y={getY0}
          stroke={colors["預計工時"]}
          strokeWidth={2}
          strokeDasharray="10,10"
        />

        {/* X 軸 */}
        <AxisBottom
          top={innerHeight}
          scale={xScale}
          stroke={color}
          tickStroke={color}
          tickLabelProps={() => ({
            fontSize: 14,
            textAnchor: "middle",
            fill: color,
          })}
        />

        {/* Y 軸 */}
        <AxisLeft
          scale={yScale}
          stroke={color}
          tickStroke={color}
          tickLabelProps={() => ({
            fontSize: 14,
            textAnchor: "end",
            fill: color,
          })}
          tickFormat={(v) => `${v}p`}
        />
      </Group>
    </svg>
  );
};
