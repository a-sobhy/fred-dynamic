import React, { useEffect, useState } from "react";
import { TextField, Button, Autocomplete, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { seriesSearch } from "../redux/slices/seriesSlice";

interface FredSeries {
  id: string;
  name: string;
}

const FREDSearch: React.FC<{
  onSelectSeries: (seriesId: string) => void;
}> = ({ onSelectSeries }) => {
  const dispatch = useAppDispatch();
  const { series } = useAppSelector((state) => state.series);
  const [searchTerm, setSearchTerm] = useState("");
  const [seriesList, setSeriesList] = useState<FredSeries[]>([]);

  const handleSearch = async () => {
    dispatch(seriesSearch(searchTerm));
  };

  useEffect(() => {
    if (series?.length > 0) {
      // Map the series to conform to FredSeries type
      const mappedSeries: FredSeries[] = series.map((seriesMetadata) => ({
        id: seriesMetadata.id,
        name: seriesMetadata.title || "Unknown",
      }));
      setSeriesList(mappedSeries);
    }
    console.log("seriesList", series);
  }, [series]);
  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Box>
      <TextField
        label="Search FRED Series"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        onKeyDown={handleEnterPress}
      />

      <Button onClick={handleSearch} variant="contained" color="primary">
        Search
      </Button>

      <Autocomplete
        options={seriesList}
        getOptionLabel={(option: FredSeries) => option.id}
        onChange={(event, newValue) => {
          if (newValue) {
            onSelectSeries(newValue.id);
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Select Series" />
        )}
      />
    </Box>
  );
};

export default FREDSearch;
