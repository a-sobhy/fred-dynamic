import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API, handleError } from "../API/api";
import axios from "axios";

export interface SeriesMetadata {
  id: string;
  title: string;
  frequency: string;
  popularity: number;
}

export interface Observation {
  date: string;
  value: number;
}

interface SeriesState {
  series: SeriesMetadata[];
  observations: Observation[];
  loading: boolean;
  obsLoading: boolean;
  error?: string | null;
}

// Fetch series data
export const getSeries = createAsyncThunk(
  "series/fetchSeries",
  async (id: string, thunkAPI) => {
    try {
      const { data } = await API.get(`/series?series_id=${id}`);
      return data;
    } catch (error) {
      handleError(error);

      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const seriesObservations = createAsyncThunk(
  "series/seriesObservations",
  async (
    {
      id,
      startDate,
      endDate,
      frequency,
      limit,
    }: {
      id: string;
      startDate: string;
      endDate: string;
      frequency: string;
      limit: number;
    },
    thunkAPI
  ) => {
    try {
      const { data } = await API.get("/series/observations", {
        params: {
          series_id: id,
          start_date: startDate,
          end_date: endDate,
          frequency,
          limit,
        },
      });

      return data;
    } catch (error) {
      handleError(error);
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const seriesSearch = createAsyncThunk(
  "series/seriesSearch",
  async (keywords: string, thunkAPI) => {
    try {
      const { data } = await API.get("/series/search", {
        params: { search_text: keywords },
      });
      return data || [];
    } catch (error) {
      handleError(error);
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred.");
    }
  }
);

const initialState: SeriesState = {
  series: [],
  observations: [],
  loading: false,
  obsLoading: false,
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
        state.obsLoading = true;
      })
      .addCase(seriesObservations.fulfilled, (state, action) => {
        state.obsLoading = false;
        state.observations = action.payload.observations;
      })
      .addCase(seriesObservations.rejected, (state, action) => {
        state.obsLoading = false;
        state.error = action.error.message || "Failed to fetch series";
      });
  },
});

export default seriesSlice.reducer;
