import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addChart,
  removeChart,
  setCharts,
} from "../redux/slices/dashboardSlice";
import { RootState } from "../redux/store";
import { Button, Box, Grid2 } from "@mui/material";
// import Grid from "@mui/material/Grid2";

import { ChartConfig } from "../redux/slices/dashboardSlice";
import Chart from "./Chart";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { charts } = useSelector((state: RootState) => state.dashboard);

  // Load charts from local storage on initial load
  useEffect(() => {
    const savedCharts = localStorage.getItem("charts");
    if (savedCharts) {
      dispatch(setCharts(JSON.parse(savedCharts)));
    }
  }, [dispatch]);

  // Save charts to local storage when the charts array changes
  useEffect(() => {
    localStorage.setItem("charts", JSON.stringify(charts));
  }, [charts]);

  const handleAddChart = () => {
    const newChart: ChartConfig = {
      id: Date.now().toString(),
      type: "line",
      title: "New Chart",
      yAxisLabel: "Y Axis",
      frequency: "Monthly",
      seriesId: "",
      color: "#0000FF",
    };
    dispatch(addChart(newChart));
  };

  return (
    <Box className="p-4">
      <Button
        onClick={handleAddChart}
        variant="contained"
        color="primary"
        className="mb-4"
      >
        Add Chart
      </Button>
      <Grid2 container spacing={3}>
        {charts.map((chart) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={chart.id}>
            <Chart
              chart={chart}
              onRemove={() => dispatch(removeChart(chart.id))}
            />
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default Dashboard;
