import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API, APIKEY } from "../API/api";
console.log("APIKEY", APIKEY);

interface SeriesMetadata {
  id: string;
  title: string;
  frequency: string;
  popularity: number;
}

export interface Observation {
  date: string;
  value: string;
}

interface SeriesState {
  series: SeriesMetadata[];
  observations: Observation[];
  loading: boolean;
  error?: string | null;
}

// Fetch series data
export const getSeries = createAsyncThunk(
  "series/fetchSeries",
  async (id: string) => {
    const { data } = await API.get(`/series?series_id=${id}`);
    return data;
  }
);

export const seriesObservations = createAsyncThunk(
  "series/seriesObservations",
  async ({
    id,
    startDate,
    endDate,
  }: {
    id: string;
    startDate: string;
    endDate: string;
  }) => {
    const { data } = await API.get("/series/observations", {
      params: { series_id: id, start_date: startDate, end_date: endDate },
    });

    // Type-safe mapping of API data
    return data;
  }
);

export const seriesSearch = createAsyncThunk(
  "series/seriesSearch",
  async (keywords: string) => {
    const { data } = await API.get("/series/search", {
      params: { search_text: keywords },
    });
    return data || [];
  }
);

const initialState: SeriesState = {
  series: [],
  observations: [],
  loading: false,
  error: null,
};

export const seriesSlice = createSlice({
  name: "series",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSeries.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getSeries.fulfilled, (state, action) => {
      state.loading = false;
      state.series = action.payload.seriess;
    });
    builder.addCase(getSeries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder
      .addCase(seriesSearch.pending, (state) => {
        state.loading = true;
      })
      .addCase(seriesSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.series = action.payload.seriess;
      })
      .addCase(seriesSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch series";
      });

    builder
      .addCase(seriesObservations.pending, (state) => {
        state.loading = true;
      })
      .addCase(seriesObservations.fulfilled, (state, action) => {
        state.loading = false;
        state.observations = action.payload.observations;
      })
      .addCase(seriesObservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch series";
      });
  },
});

export default seriesSlice.reducer;
