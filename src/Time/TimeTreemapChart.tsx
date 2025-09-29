import { useTheme } from "@/Hook";
import { Group } from "@visx/group";
import { Treemap, hierarchy, stratify } from "@visx/hierarchy";
import { scaleLinear } from "@visx/scale";
import type { Time } from "./types";

interface TimeTreemapChartProps {
  data: Time[];
}

const margin = { top: 20, right: 20, bottom: 20, left: 20 };

export const TimeTreemapChart = ({ data }: TimeTreemapChartProps) => {
  const { theme } = useTheme();
  const color = theme === "dark" ? "#fff" : "#000";

  const vMax = Math.max(...data.map((d) => d.實際工時));
  const width = 600;
  const height = data.length * 50 + margin.top + margin.bottom;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const dataWithRoot = [
    { 類別: "root", pid: null, 實際工時: 0 },
    ...data.map((d) => ({ ...d, pid: "root" })),
  ];

  const stratifiedData = stratify<any>()
    .id((d) => d.類別)
    .parentId((d) => d.pid)(dataWithRoot)
    .sum((d) => d.實際工時);

  const root = hierarchy(stratifiedData).sort(
    (a, b) => (b.value || 0) - (a.value || 0)
  );

  const colorScale = scaleLinear<string>({
    domain: [0, vMax],
    range: ["Gainsboro", "DeepSkyBlue"],
  });

  return (
    <svg width={width} height={height}>
      <rect width={width} height={height} rx={14} fill="transparent" />
      <Treemap
        root={root}
        size={[innerWidth, innerHeight]}
        tile={undefined}
        round
      >
        {(treemap) => (
          <Group>
            {treemap.leaves().map((node) => {
              const nodeWidth = node.x1 - node.x0;
              const nodeHeight = node.y1 - node.y0;
              const nodeData: any = node.data;
              return (
                <Group
                  key={node.data.id}
                  top={node.y0 + margin.top}
                  left={node.x0 + margin.left}
                >
                  <rect
                    width={nodeWidth}
                    height={nodeHeight}
                    stroke="transparent"
                    fill={colorScale(node.value || 0)}
                  />
                  <text
                    x={nodeWidth / 2}
                    y={nodeHeight / 2}
                    fill={color}
                    fontSize={14}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {nodeData.id} ({node.value})
                  </text>
                </Group>
              );
            })}
          </Group>
        )}
      </Treemap>
    </svg>
  );
};
