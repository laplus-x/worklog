import { useTheme } from "@/Hook";
import { Group } from "@visx/group";
import { scaleOrdinal } from "@visx/scale";
import { Pie } from "@visx/shape";
import { Text } from "@visx/text";
import { Task } from "./types";

interface TaskPieChartProps {
  data: Task[];
}

const keys = ["完成", "未完成"];
const colorScale = scaleOrdinal({
  domain: keys,
  range: ["PaleGreen", "Pink"], // 綠=完成, 紅=未完成
});
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const width = 600;
const height = 300;

export const TaskPieChart = ({ data }: TaskPieChartProps) => {
  const { theme } = useTheme();
  const color = theme === "dark" ? "#fff" : "#000";

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const top = centerY + margin.top;
  const left = centerX + margin.left;

  // 計算完成數與未完成數
  const totalTasks = data.reduce((sum, task) => sum + task.任務數量, 0);
  const completedTasks = data.reduce((sum, task) => sum + task.完成數量, 0);
  const pieData = [
    { label: "完成", value: completedTasks },
    { label: "未完成", value: totalTasks - completedTasks },
  ];

  return (
    <svg width={width} height={height}>
      <Group top={top} left={left}>
        <Pie
          data={pieData}
          pieValue={(d) => d.value}
          outerRadius={radius}
          innerRadius={radius / 1.5}
        >
          {(pie) =>
            pie.arcs.map((arc) => {
              const arcPath = pie.path(arc);
              const arcFill = colorScale(arc.data.label);

              return (
                <g key={arc.data.label}>
                  <path d={arcPath!} fill={arcFill} />
                </g>
              );
            })
          }
        </Pie>
        <Text
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={24}
          dy={0}
        >
          {`${Math.round((completedTasks / totalTasks) * 100)}%`}
        </Text>
      </Group>
    </svg>
  );
};
