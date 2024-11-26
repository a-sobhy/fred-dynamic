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
import { API, handleError } from "../redux/API/api";

interface ChartProps {
  chart: ChartConfig;
  onRemove: () => void;
}
const Chart: FC<ChartProps> = ({ chart, onRemove }) => {
  const [title, setTitle] = useState(chart.title || "Chart Title");
  const [currentSerie, setCurrentSerie] = useState(chart.seriesId);
  const [chartLimit, setChartLimit] = useState(chart.limit);
  const [chartFrequency, setChartFrequency] = useState(chart.frequency);
  const [type, setType] = useState(chart.type);
  const [color, setColor] = useState(chart.color);
  const [yAxisLabel, setYAxisLabel] = useState(chart.yAxisLabel || "Data Axis");
  const [data, setData] = useState<Observation[]>([]);
  useEffect(() => {
    console.log("chart", chart);
    if (chart.seriesIdsList?.length) {
      setData(chart?.seriesIdts);
    }
  }, [chart]);

  const handleSeriesChange = async () => {
    try {
      const { data } = await API.get("/series/observations", {
        params: {
          series_id: currentSerie,
          frequency: chartFrequency,
          limit: chartLimit,
        },
      });
      setData(data.observations);
      console.log("data from series change", data);
    } catch (error) {
      handleError(error);
      return console.error(error);
    }
  };
  useEffect(() => {
    if (
      (currentSerie && currentSerie !== chart.seriesId) ||
      (chartFrequency && chartFrequency !== chart.frequency) ||
      (chartLimit && chartLimit !== chart.limit)
    ) {
      handleSeriesChange();
    }
  }, [currentSerie, chartFrequency, chartLimit]);

  return (
    <Box padding={2} boxShadow="0 2px 7px 0px #e4e3ff" borderRadius={5} mt={5}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: {
            xs: "column", // Stack on small screens
            sm: "column", // Stack on tablets
            md: "row", // Side-by-side on medium screens and up
          },
          gap: 2,
        }}
      >
        <Box
          width="100%"
          flex="0 1 80%"
          boxShadow="0 2px 7px 0px #e4e3ff"
          padding={2}
        >
          {/* Chart */}
          <Box minHeight="400px" width="100%">
            <p
              className="text-center font-semibold capitalize"
              style={{ color }}
            >
              {title}
            </p>
            <ResponsiveContainer width="100%" height="100%" minHeight={400}>
              {type === "line" ? (
                <LineChart data={data}>
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis
                    dataKey="date"
                    label={{
                      value: "",
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
                    dataKey="date"
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
                    <linearGradient
                      id={`ch_${chart.id}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
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
                    fill={`url(#ch_${chart.id})`}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </Box>
        </Box>
        {/* Config Panel */}
        <Box width="100%" flex="0 1 20%">
          <h4 className="mb-4">
            Chart of series ID:{" "}
            <span className="font-semibold">{chart?.seriesId}</span>
          </h4>
          <ConfigPanel
            title={title}
            yAxisLabel={yAxisLabel}
            color={color}
            type={type}
            setTitle={setTitle}
            setYAxisLabel={setYAxisLabel}
            setColor={setColor}
            setType={setType}
            seriesIds={chart?.seriesIdsList}
            setCurrentSerie={setCurrentSerie}
            currentSerie={currentSerie}
            chartLimit={chartLimit}
            setChartLimit={setChartLimit}
            chartFrequency={chartFrequency}
            setChartFrequency={setChartFrequency}
          />
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
