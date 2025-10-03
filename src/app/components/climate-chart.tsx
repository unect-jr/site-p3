"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface ClimateChartProps {
  chartConfig: { temperature: { label: string; color: string } };
  chartData: { time: string; temperature: string }[];
}

export default function ClimateChart({
  chartConfig,
  chartData,
}: ClimateChartProps) {
  return (
    <ChartContainer config={chartConfig} className="max-h-[420px] w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 30,
          right: 30,
          top: 30,
        }}
      >
        <CartesianGrid vertical={true} strokeWidth={2} horizontal={false} />
        <XAxis dataKey="time" tickLine={true} axisLine={true} tickMargin={8} />
        <ChartTooltip
          formatter={(value, name, props) => ["Temperatura: ", value, " °C"]}
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <Line
          dataKey="temperature"
          type="linear"
          stroke="var(--color-temperature)"
          strokeWidth={4}
          dot={false}
          label={({ x, y, stroke, value }) => {
            return (
              <text
                x={x}
                y={y}
                dy={-18}
                fill={stroke}
                fontSize={16}
                fontWeight={600}
                textAnchor="middle"
              >
                {value} °C
              </text>
            );
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}
