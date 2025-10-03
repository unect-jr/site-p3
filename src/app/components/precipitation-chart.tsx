"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, LabelList, XAxis } from "recharts";

interface PrecipitationChartProps {
  chartConfig: { precipitation: { label: string; color: string } };
  chartData: {
    time: string;
    precipitation: string;
    precipitationProbability: string;
  }[];
}

export default function PrecipitationChart({
  chartConfig,
  chartData,
}: PrecipitationChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="max-h-[420px] w-full min-w-[2000px]"
    >
      <BarChart accessibilityLayer data={chartData} margin={{ bottom: 15 }}>
        <XAxis
          dataKey="time"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          xAxisId="timeX"
        />
        <XAxis
          dataKey="precipitationProbability"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          orientation="top"
          xAxisId="probX"
          unit={"%"}
        />
        <ChartTooltip
          formatter={(value, name, props) => ["Precipitação: ", value, "mm"]}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar
          dataKey="precipitation"
          fill="var(--color-precipitation)"
          radius={[0, 0, 0, 0]}
          label={({ x, y, stroke, value }) => {
            return (
              <text x={x} y={y} dx={14} fill="var(--chart-3)" fontSize={12}>
                {value} mm
              </text>
            );
          }}
          xAxisId="timeX"
        />
        <Bar
          dataKey="precipitationProbability"
          fill="#FFFFFF00"
          radius={[0, 0, 0, 0]}
          label={{ fill: "var(--chart-3)" }}
          xAxisId="probX"
          hide
        />
      </BarChart>
    </ChartContainer>
  );
}
