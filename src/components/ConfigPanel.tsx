import { FC } from "react";
import {
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { SeriesMetadata } from "../redux/slices/seriesSlice";
import { frequencies } from "./FredSearch";
interface ConfigPanelProps {
  title: string;
  yAxisLabel: string;
  color: string;
  seriesIds: SeriesMetadata[];
  type: "line" | "bar" | "area";
  setTitle: (value: string) => void;
  setYAxisLabel: (value: string) => void;
  setColor: (value: string) => void;
  setType: (value: "line" | "bar" | "area") => void;
  setCurrentSerie: (value: string) => void;
  currentSerie: string;

  chartLimit: number;
  setChartLimit: (value: number) => void;
  chartFrequency: string;
  setChartFrequency: (value: string) => void;
}

const ConfigPanel: FC<ConfigPanelProps> = ({
  title,
  yAxisLabel,
  color,
  seriesIds,
  setCurrentSerie,
  currentSerie,
  type,
  setTitle,
  setYAxisLabel,
  setColor,
  setType,
  chartLimit,
  setChartLimit,
  chartFrequency,
  setChartFrequency,
}) => (
  <Box>
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
        size="small"
        label="Chart Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        size="small"
        label="Y Axis Label"
        value={yAxisLabel}
        onChange={(e) => setYAxisLabel(e.target.value)}
        fullWidth
      />
    </Box>
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
      mt={2}
    >
      <FormControl size="small" fullWidth>
        <InputLabel id="type-select-label">Chart Type</InputLabel>
        <Select
          label="Chart Type"
          labelId="type-select-label"
          value={type}
          onChange={(e) => setType(e.target.value as "line" | "bar" | "area")}
          size="small"
          sx={{
            width: "100%",
          }}
        >
          <MenuItem value="area">Area chart</MenuItem>
          <MenuItem value="line">Line chart</MenuItem>
          <MenuItem value="bar">Bar chart</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" fullWidth>
        <InputLabel id="series-select-label">Change Series</InputLabel>
        <Select
          label="Change Series"
          labelId="series-select-label"
          value={currentSerie}
          onChange={(e) => setCurrentSerie(e.target.value)}
          size="small"
          sx={{
            width: "100%",
          }}
        >
          {seriesIds?.map((series) => (
            <MenuItem key={series.id} value={series.id}>
              {series.id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
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
      mt={2}
    >
      <FormControl size="small" fullWidth>
        <InputLabel id="frequency-select-label">Chart frequency</InputLabel>
        <Select
          label="Chart frequency"
          labelId="frequency-select-label"
          value={chartFrequency}
          onChange={(e) => setChartFrequency(e.target.value)}
          size="small"
          sx={{
            width: "100%",
          }}
        >
          {frequencies?.map((freq) => (
            <MenuItem key={freq.id} value={freq.id}>
              {freq.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" fullWidth>
        <TextField
          type="number"
          value={chartLimit}
          label="Chart limit"
          size="small"
          onChange={(e) => setChartLimit(Number(e.target.value))}
          slotProps={{
            htmlInput: {
              min: 1,
            },
          }}
          fullWidth
        />
      </FormControl>
    </Box>
    <Box mt={2}>
      <TextField
        size="small"
        label="Chart Color"
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        sx={{
          width: "100%",
        }}
      />
    </Box>
  </Box>
);

export default ConfigPanel;
