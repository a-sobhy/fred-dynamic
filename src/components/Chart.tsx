import { FC, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { ChartConfig } from "../redux/slices/dashboardSlice";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import ConfigPanel from "./ConfigPanel";
import { Observation } from "../redux/slices/seriesSlice";

interface ChartProps {
  chart: ChartConfig;
  onRemove: () => void;
  observations: Observation[];
}
const Chart: FC<ChartProps> = ({ observations, chart, onRemove }) => {
  const [title, setTitle] = useState(chart.title);
  const [type, setType] = useState(chart.type);
  const [color, setColor] = useState(chart.color);
  const [yAxisLabel, setYAxisLabel] = useState(chart.yAxisLabel);
  const [data, setData] = useState<Observation[]>([]);
  useEffect(() => {
    if (observations?.length) {
      setData(observations);
    }
  }, [observations]);

  return (
    <Box padding={2} boxShadow="0 2px 7px 0px #e4e3ff" borderRadius={5} mt={5}>
      <Box display="flex" gap={2} alignItems="center">
        {/* Config Panel */}
        <Box width="100%" flex="0 1 20%">
          <ConfigPanel
            title={title}
            yAxisLabel={yAxisLabel}
            color={color}
            type={type}
            setTitle={setTitle}
            setYAxisLabel={setYAxisLabel}
            setColor={setColor}
            setType={setType}
          />
        </Box>

        <Box width="100%" flex="0 1 80%">
          {/* Chart */}
          <Box height="400px" width="100%">
            <ResponsiveContainer width="100%" height="100%">
              {type === "line" ? (
                <LineChart data={data}>
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis
                    dataKey="name"
                    label={{
                      value: title,
                    }}
                  />
                  <YAxis
                    label={{
                      value: yAxisLabel,
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    activeDot={{ r: 8 }}
                    strokeWidth={3}
                  />
                </LineChart>
              ) : type === "bar" ? (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    label={{
                      value: title,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    label={{
                      value: yAxisLabel,
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill={color} />
                </BarChart>
              ) : (
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    label={{
                      value: title,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    label={{
                      value: yAxisLabel,
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    dataKey="value"
                    type="monotone"
                    stroke={color}
                    fillOpacity={0.9}
                    fill="url(#colorUv)"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
            <p className="text-center">{title}</p>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        gap={2}
        justifyContent="center"
        alignItems="center"
        mt={4}
      >
        <Button
          onClick={onRemove}
          variant="outlined"
          color="error"
          className="ml-2"
        >
          Remove
        </Button>
      </Box>
    </Box>
  );
};

export default Chart;
