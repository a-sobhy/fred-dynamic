import { FC } from "react";
import { TextField, Box, Select, MenuItem } from "@mui/material";
interface ConfigPanelProps {
  title: string;
  yAxisLabel: string;
  color: string;
  type: "line" | "bar" | "area";
  setTitle: (value: string) => void;
  setYAxisLabel: (value: string) => void;
  setColor: (value: string) => void;
  setType: (value: "line" | "bar" | "area") => void;
}

const ConfigPanel: FC<ConfigPanelProps> = ({
  title,
  yAxisLabel,
  color,
  type,
  setTitle,
  setYAxisLabel,
  setColor,
  setType,
}) => (
  <Box>
    <Box display="flex" gap={2}>
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
    <Box display="flex" gap={2} mt={2}>
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
      <Select
        value={type}
        onChange={(e) => setType(e.target.value as "line" | "bar" | "area")}
        sx={{
          width: "100%",
        }}
      >
        <MenuItem value="bar">Bar chart</MenuItem>
        <MenuItem value="line">Line chart</MenuItem>
        <MenuItem value="area">Area chart</MenuItem>
      </Select>
    </Box>
  </Box>
);

export default ConfigPanel;
