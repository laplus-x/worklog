import { useTheme } from "@/Hook";
import { AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { HeatmapRect } from "@visx/heatmap";
import { scaleBand, scaleLinear } from "@visx/scale";
import type { Stats } from "./types";

interface GitHeatmapChartProps {
  data: Stats[];
}

const margin = { top: 0, right: 0, bottom: 0, left: 150 };

const getWeekDates = (dateStr: string): string[] => {
  const date = new Date(dateStr);
  const day = date.getDay(); // 0=Sun, 1=Mon...
  const monday = new Date(date);
  monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1)); // 本週週一
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
};

export const GitHeatmapChart = ({ data }: GitHeatmapChartProps) => {
  const { theme } = useTheme();
  const color = theme === "dark" ? "#fff" : "#000";

  const projects = Array.from(new Set(data.map((d) => d.project)));

  const group = data.reduce<Record<string, any>>((prev, curr) => {
    const weekDates = getWeekDates(curr.date);
    for (const d of weekDates) {
      prev[d] ??= {};
      prev[d][curr.project] ??= 0;
    }

    prev[curr.date][curr.project] =
      2.5 * (curr.commitCount || 0) +
      0.1 * ((curr.additions || 0) + (curr.deletions || 0)) +
      3.0 * (curr.mergeCount || 0);
    return prev;
  }, {});

  const activeData = Object.entries(group).map(([date, projectMap], idx) => {
    const bins = projects.map((project, idx2) => ({
      bin: idx2,
      count: projectMap[project] ?? 0,
    }));

    return {
      bin: idx,
      bins,
    };
  });

  const width = 8 * 50 + margin.top + margin.bottom;
  const height = projects.length * 50;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = scaleLinear({
    domain: [0, 7],
    range: [0, innerWidth],
  });
  const yScale = scaleLinear({
    domain: [0, projects.length],
    range: [0, innerHeight],
  });

  const vMax = Math.max(
    ...activeData.map((d) => Math.max(...d.bins.map((i) => i.count)))
  );
  const colorScale = scaleLinear({
    domain: [0, vMax],
    range: ["Gainsboro", "DeepSkyBlue"],
  });
  const opacityScale = scaleLinear({
    range: [0.1, 1],
    domain: [0, vMax],
  });

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        <HeatmapRect
          data={activeData}
          xScale={xScale}
          yScale={yScale}
          colorScale={colorScale}
          opacityScale={opacityScale}
          binWidth={10}
          binHeight={30}
          top={10}
          left={20}
        />
        <AxisLeft
          scale={scaleBand<string>({
            domain: projects,
            range: [0, innerHeight],
          })}
          stroke={color}
          tickStroke={color}
          tickLabelProps={() => ({
            fontSize: 14,
            textAnchor: "end",
            fill: color,
          })}
        />
      </Group>
    </svg>
  );
};
