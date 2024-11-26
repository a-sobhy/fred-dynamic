import { DateRange, RangeKeyDict } from "react-date-range";
import { enUS } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";

// Helper function to validate a date
const isValidDate = (date: Date) => !isNaN(date.getTime());

export const DateRangeForm = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: {
  fromDate: string;
  toDate: string;
  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
}) => {
  const [openCalendar, setOpenCalendar] = useState(false); // State to toggle calendar visibility

  // Format the date as a string
  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    const todayDate = formatDate(new Date());
    setFromDate(todayDate);
    setToDate(todayDate);
    console.log("Initial Dates: ", todayDate); // Log initial values
  }, [setFromDate, setToDate]);

  // Handle date change when the user selects a date range
  const handleDateChange = (rangesByKey: RangeKeyDict) => {
    const selection = rangesByKey.selection;
    if (selection && selection.startDate && selection.endDate) {
      setFromDate(formatDate(selection.startDate));
      setToDate(formatDate(selection.endDate));
      console.log(
        "Updated Dates: ",
        formatDate(selection.startDate),
        "-",
        formatDate(selection.endDate)
      );
    }
  };

  // Handle changes made in the input fields
  const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(event.target.value);
  };

  return (
    <Box display="flex" flexDirection="column" width="100%">
      {/* Date Inputs */}
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
        <Box
          onClick={() => {
            setOpenCalendar(!openCalendar);
            console.log("clicked");
          }}
          sx={{
            cursor: "pointer",
            width: "100%",
          }}
        >
          <TextField
            label="From Date"
            value={fromDate}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            onChange={handleFromDateChange}
            size="small"
            fullWidth
          />
        </Box>
        <Box
          onClick={() => {
            setOpenCalendar(!openCalendar);
            console.log("clicked");
          }}
          sx={{
            cursor: "pointer",
            width: "100%",
          }}
        >
          <TextField
            label="To Date"
            value={toDate}
            onChange={handleToDateChange}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            size="small"
            fullWidth
          />
        </Box>
      </Box>

      {/* Date Range Picker */}
      {openCalendar && (
        <DateRange
          locale={enUS}
          editableDateInputs={true} // Allow manual date input
          ranges={[
            {
              startDate: isValidDate(new Date(fromDate))
                ? new Date(fromDate)
                : new Date(),
              endDate: isValidDate(new Date(toDate))
                ? new Date(toDate)
                : new Date(),
              key: "selection",
            },
          ]}
          onChange={handleDateChange}
        />
      )}
    </Box>
  );
};
