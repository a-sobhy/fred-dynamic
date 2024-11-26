import { FC, useEffect, useState } from "react";
import { ChartConfig } from "../redux/slices/dashboardSlice";
import { Box, Button, Collapse, IconButton } from "@mui/material";
import Chart from "./Chart";
import { seriesObservations } from "../redux/slices/seriesSlice";
import FREDSearch from "./FredSearch";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { KeyboardArrowUpOutlined } from "@mui/icons-material";

const getRandomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
const ChartContainer: FC = () => {
  const dispatch = useAppDispatch();

  const { obsLoading, observations, series } = useAppSelector(
    (state) => state.series
  );
  const randomColor = getRandomColor();

  const [selectedSeriesId, setSelectedSeriesId] = useState("");
  const [addChartDisabled, setAddChartDisabled] = useState(true);
  const [expandSearch, setExpandSearch] = useState(true);
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [newChart, setNewChart] = useState<ChartConfig>({
    id: Date.now().toString(),
    seriesId: "",
    title: "",
    type: "area",
    color: randomColor,
    yAxisLabel: "",
    frequency: "m",
    limit: 100,
    seriesIdts: [],
    seriesIdsList: [],
  });

  const handleSelectSeries = (
    id: string,
    startDate: string,
    endDate: string,
    frequency: string,
    limit: number
  ): void => {
    console.log("Obs payload Data", {
      id,
      startDate,
      endDate,
      frequency,
      limit,
    });
    dispatch(
      seriesObservations({
        id,
        startDate,
        endDate,
        frequency,
        limit,
      })
    );

    setSelectedSeriesId(id);
    setNewChart({
      ...newChart,
      seriesId: id,
      frequency,
      limit,
    });
  };

  //! Handle addin chart
  const handleAddChart = () => {
    setCharts([...charts, { ...newChart, color: randomColor }]);

    setNewChart({
      id: Date.now().toString(),
      seriesId: selectedSeriesId,
      title: "",
      type: "area",
      color: randomColor,
      yAxisLabel: "",
      frequency: "m",
      limit: 100,
      seriesIdts: observations,
      seriesIdsList: series,
    });
  };

  //! Handle removing a chart
  const handleRemoveChart = (index: number) => {
    const updatedCharts = charts.filter((_, idx) => idx !== index);
    setCharts(updatedCharts);
  };

  useEffect(() => {
    if (observations.length > 0) {
      const transformedObservations = observations?.map((obs) => ({
        date: obs.date,
        value: obs.value,
      }));

      setNewChart({
        ...newChart,
        seriesIdts: transformedObservations,
      });
    }
  }, [observations]);

  useEffect(() => {
    if (series.length > 0) {
      setNewChart({
        ...newChart,
        seriesIdsList: series,
      });
    }
  }, [series]);

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 999,
        }}
      >
        <Collapse in={expandSearch} timeout={1100} collapsedSize={4}>
          <Box
            bgcolor={expandSearch ? "#fff" : "#e0c0c0"}
            boxShadow="0 2px 7px 0px #e4e3ff"
            padding={2}
            sx={{
              transition: "all 400ms ease-in-out",
            }}
          >
            <FREDSearch
              onSelectSeries={handleSelectSeries}
              setAddChartDisabled={setAddChartDisabled}
            />
            {observations?.length > 0 && (
              <Box className="mt-5" display="flex" justifyContent="center">
                <Button
                  onClick={handleAddChart}
                  variant="contained"
                  color="primary"
                  disabled={
                    addChartDisabled || obsLoading || series.length === 0
                  }
                >
                  Add Chart
                </Button>
              </Box>
            )}
          </Box>
        </Collapse>
        <Box display="flex" justifyContent="center" mt={1} zIndex={99}>
          <IconButton
            onClick={() => setExpandSearch(!expandSearch)}
            color={expandSearch ? "secondary" : "info"}
            sx={{
              zIndex: 99,
              transition: "all 400ms ease-in-out",
              background: "#fff",
              boxShadow: expandSearch
                ? "0 2px 7px 0px #e4e3ff"
                : "0 2px 7px 0px #444",
            }}
          >
            <KeyboardArrowUpOutlined
              sx={{
                transform: expandSearch ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.4s ease",
              }}
            />
          </IconButton>
        </Box>
      </Box>
      <Box padding={2}>
        {charts.length > 0 ? (
          charts?.map((chart, index) => (
            <Chart
              key={chart.id}
              chart={chart}
              onRemove={() => handleRemoveChart(index)}
            />
          ))
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={7}
            height="40rem"
          >
            <Box>
              <h2 className="text-slate-900 text-[1.2rem] font-bold">
                No charts added yet.
              </h2>
              <p>- Start by searching for an economic data series.</p>
              <p>
                - Select a date range, data limit, frequency and a series to get its
                observations.
              </p>
            </Box>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setExpandSearch(!expandSearch)}
              sx={{
                padding: "1rem 5rem",
              }}
            >
              Start
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ChartContainer;
