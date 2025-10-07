import React, { useState } from "react";
import HRNavbar from "../../HR/HRNavbar";
import dayjs from "dayjs";
import { LocalizationProvider, DatePicker, PickersDay } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";

const Cashfree = () => {
  const predefinedDates = [
    dayjs("2025-02-28"),
    dayjs("2025-02-29"),
    dayjs("2025-03-01"),
    dayjs("2025-03-02"),
    dayjs("2025-03-03"),
  ];

  const [selectedDate, setSelectedDate] = useState(null);

  // Custom render function for highlighting predefined dates
  const renderHighlightedDay = (date, selectedDates, pickersDayProps) => {
    const isPredefined = predefinedDates.some((d) => d.isSame(date, "day"));

    return (
      <PickersDay
        {...pickersDayProps}
        sx={{
          backgroundColor: isPredefined ? "#ffeb3b" : "inherit", // Yellow background for predefined dates
          color: isPredefined ? "black" : "inherit",
          borderRadius: "50%",
        }}
      />
    );
  };

  return (
    <div>
      <HRNavbar />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* First Date Picker (Predefined Dates Only) */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <DatePicker
            label="Predefined Dates"
            shouldDisableDate={(date) =>
              !predefinedDates.some((d) => d.isSame(date, "day"))
            }
            renderDay={renderHighlightedDay} // Apply highlighting
            renderInput={(params) => <TextField {...params} />}
          />
        </div>

        {/* Functional Date Picker */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <DatePicker
            label="Select Another Date"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default Cashfree;
