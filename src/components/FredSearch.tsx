import React, { FC, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Autocomplete,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { seriesSearch } from "../redux/slices/seriesSlice";
import { DateRangeForm } from "./DateRange";

interface FredSeries {
  id: string;
}
export const frequencies: { id: string; title: string }[] = [
  { id: "d", title: "Daily" },
  { id: "m", title: "Monthly" },
  { id: "a", title: "Annual" },
  { id: "bw", title: "Biweekly" },
  { id: "q", title: "Quarterly" },
];

type ObservInitialType = {
  id: string;
  startDate: string;
  endDate: string;
  frequency: string;
  limit: number;
};

interface FREDSearchProps {
  onSelectSeries: (
    seriesId: string,
    startDate: string,
    endDate: string,
    frequency: string,
    limit: number
  ) => void;
  setAddChartDisabled: (disabled: boolean) => void;
}

const observInitialData: ObservInitialType = {
  id: "",
  startDate: "",
  endDate: "",
  frequency: "a",
  limit: 100,
};
const FREDSearch: FC<FREDSearchProps> = ({
  onSelectSeries,
  setAddChartDisabled,
}) => {
  const dispatch = useAppDispatch();
  const { series, loading } = useAppSelector((state) => state.series);

  const [observData, setObservData] = useState(observInitialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [observDisabled, setObservDisabled] = useState(true);
  const [seriesList, setSeriesList] = useState<FredSeries[]>([]);
  // const [fromDate, setFromDate] = useState(new Date());
  // const [toDate, setToDate] = useState(new Date());
  const handleSearch = async () => {
    dispatch(seriesSearch(searchTerm));
  };

  useEffect(() => {
    if (toDate) {
      setObservData({ ...observData, startDate: fromDate, endDate: toDate });
    }
  }, [toDate, fromDate]);

  useEffect(() => {
    if (series?.length > 0) {
      // Map the series to conform to FredSeries type
      const mappedSeries: FredSeries[] = series.map((seriesData) => ({
        id: seriesData.id,
      }));
      setObservData(observInitialData);
      setSeriesList(mappedSeries);
    }
  }, [series]);

  const handleSubmitObserv = () => {
    const { id, startDate, endDate, frequency, limit } = observData;
    console.log("observData payload", observData);

    if (id && startDate && endDate) {
      onSelectSeries(id, startDate, endDate, frequency, limit);
    }
  };

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    if (!observData.id || !observData.frequency) {
      setObservDisabled(true);
      if (!series) {
        setAddChartDisabled(true);
      }
    } else {
      setObservDisabled(false);
      setAddChartDisabled(false);
    }
  }, [observData]);

  return (
    <Box display="flex" flexDirection="column" gap={3} mb={2}>
      {/* Search Field */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "row",
          },
          gap: 2,
        }}
      >
        <TextField
          label="Search FRED Series"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleEnterPress}
          size="small"
          fullWidth
        />
        <Button
          onClick={handleSearch}
          variant="contained"
          color="primary"
          disabled={!searchTerm}
        >
          <h6 className="flex items-center justify-center gap-1">
            {loading ? (
              <CircularProgress color="inherit" size={23} />
            ) : (
              <SearchOutlined fontSize="medium" />
            )}
            Search
          </h6>
        </Button>
      </Box>

      {seriesList?.length > 0 && (
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
          borderTop="1px solid #eee"
          padding={2}
        >
          {/* Frequency Dropdown */}
          <DateRangeForm
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />
          <FormControl size="small" fullWidth>
            <InputLabel id="frequency-select-label">Frequency</InputLabel>
            <Select
              labelId="frequency-select-label"
              value={observData.frequency}
              onChange={(e) =>
                setObservData({ ...observData, frequency: e.target.value })
              }
              label="Frequency"
            >
              {frequencies?.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="number"
            value={observData.limit}
            label="Enter limit"
            size="small"
            onChange={(e) =>
              setObservData({ ...observData, limit: Number(e.target.value) })
            }
            slotProps={{
              htmlInput: {
                min: 1,
              },
            }}
            fullWidth
          />
          {/* Autocomplete Dropdown */}
          <Autocomplete
            options={seriesList}
            getOptionLabel={(option: FredSeries) => option.id}
            onChange={(event, newValue) => {
              if (newValue) {
                setObservData({ ...observData, id: newValue.id });
              } else {
                setObservData({
                  ...observData,
                  id: "",
                });
                setAddChartDisabled(true);
              }
            }}
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Series"
                size="small"
                placeholder="Search for series ID"
              />
            )}
            fullWidth
          />
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmitObserv}
              disabled={observDisabled}
              size="small"
            >
              Observ
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FREDSearch;
