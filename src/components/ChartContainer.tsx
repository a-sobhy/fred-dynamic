import { FC, useEffect, useState } from "react";
import { ChartConfig } from "../redux/slices/dashboardSlice";
import { Button } from "@mui/material";
import Chart from "./Chart";
import { seriesObservations } from "../redux/slices/seriesSlice";
import FREDSearch from "./FredSearch";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";

const ChartContainer: FC = () => {
  const dispatch = useAppDispatch();

  const { loading, observations } = useAppSelector((state) => state.series);

  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [newChart, setNewChart] = useState<ChartConfig>({
    id: Date.now().toString(),
    title: "",
    type: "line",
    color: "#ff0000",
    yAxisLabel: "",
    frequency: "monthly",
    seriesIdts: [],
  });

  const handleSelectSeries = (seriesId: string) => {
    dispatch(
      seriesObservations({
        id: seriesId,
        startDate: "2023-01-01",
        endDate: "2023-12-31",
      })
    );
  };

  const handleAddChart = () => {
    setCharts([...charts, newChart]);
    setNewChart({
      id: Date.now().toString(),
      title: "",
      type: "line",
      color: "#ff0000",
      yAxisLabel: "",
      frequency: "monthly",
      seriesIdts: [],
    });
  };

  // Handle removing a chart
  const handleRemoveChart = (index: number) => {
    const updatedCharts = charts.filter((_, idx) => idx !== index);
    setCharts(updatedCharts);
  };

  useEffect(() => {
    if (observations.length > 0) {
      const transformedObservations = observations.map((obs) => ({
        date: obs.date,
        value: parseFloat(obs.value),
      }));

      setNewChart({
        ...newChart,
        seriesIdts: transformedObservations,
      });
    }
  }, [observations]);

  return (
    <div>
      <FREDSearch onSelectSeries={handleSelectSeries} />

      <div className="mb-4">
        <Button onClick={handleAddChart} variant="contained" color="primary">
          Add Chart
        </Button>
      </div>

      {loading && <p>Loading series data...</p>}

      {charts?.map((chart, index) => (
        <Chart
          observations={observations}
          key={chart.id}
          chart={chart}
          onRemove={() => handleRemoveChart(index)}
        />
      ))}
    </div>
  );
};

export default ChartContainer;
