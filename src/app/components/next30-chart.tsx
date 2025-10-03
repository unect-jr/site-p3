"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

interface Next30ChartProps {
  chartConfig: {
    temperatureMax: { label: string; color: string };
    temperatureMin: { label: string; color: string };
  };
  chartData: {
    timestamp: string;
    date: string;
    temperatureMax: string;
    temperatureMin: string;
  }[];
}

export default function Next30Chart({
  chartConfig,
  chartData,
}: Next30ChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="max-h-[420px] w-full min-w-[900px]"
    >
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 35,
          right: 35,
          top: 30,
        }}
      >
        <CartesianGrid vertical={true} strokeWidth={2} horizontal={false} />
        <XAxis
          dataKey="date"
          tickLine={true}
          axisLine={true}
          tickMargin={8}
          hide
        />
        <ChartTooltip
          formatter={(value, name, props) => [
            name === "temperatureMax"
              ? "Temperatura Max. "
              : "Temperatura Min. ",
            value,
            " °C",
          ]}
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <Line
          dataKey="temperatureMax"
          type="linear"
          stroke="var(--color-temperatureMax)"
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
        <Line
          dataKey="temperatureMin"
          type="linear"
          stroke="var(--color-temperatureMin)"
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
