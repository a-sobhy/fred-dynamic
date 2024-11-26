import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SeriesMetadata } from "./seriesSlice";

export interface ChartConfig {
  id: string;
  seriesId: string;
  title: string;
  type: "line" | "bar" | "area";
  color: string;
  yAxisLabel: string;
  frequency: string;
  limit: number;
  seriesIdts: { date: string; value: number }[];
  seriesIdsList: SeriesMetadata[];
}

interface DashboardState {
  charts: ChartConfig[];
}

const initialState: DashboardState = {
  charts: [],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    addChart: (state, action: PayloadAction<ChartConfig>) => {
      state.charts.push(action.payload);
    },
    removeChart: (state, action: PayloadAction<string>) => {
      state.charts = state.charts.filter(
        (chart) => chart.id !== action.payload
      );
    },
    updateChart: (state, action: PayloadAction<ChartConfig>) => {
      const index = state.charts.findIndex(
        (chart) => chart.id === action.payload.id
      );
      if (index !== -1) {
        state.charts[index] = action.payload;
      }
    },
    setCharts: (state, action: PayloadAction<ChartConfig[]>) => {
      state.charts = action.payload;
    },
  },
});

export const { addChart, removeChart, updateChart, setCharts } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
