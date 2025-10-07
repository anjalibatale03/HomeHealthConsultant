import React, { useState } from "react";
import HRNavbar from "../../../HR/HRNavbar";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Stack, styled } from "@mui/system";
import DownloadIcon from "@mui/icons-material/Download";
import {
  CircularProgress,
  TextField,
  Button,
  InputBase,
  MenuItem,
  AppBar,
  IconButton,
  Typography,
  TablePagination,
  CardContent,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Modal,
  Tooltip,
  Divider,
} from "@mui/material";
import DatePicker from "react-multi-date-picker";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMemo } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { GridCheckCircleIcon, GridCloseIcon } from "@mui/x-data-grid";
import Feedback from "./Feedback";

const PatientfeedbackCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "white",
  height: "40px",
  borderRadius: "8px",
  boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.03)", // ⬅ softer shadow
  margin: "4px 0", // ⬅ reduce vertical spacing
  padding: "0 8px",
  transition: "all 0.3s ease",
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  pt: 2,
  px: 4,
  pb: 3,
};

function PatientFeedbackReport() {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const [filterType, setFilterType] = useState("searchby");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tempSearchValue, setTempSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [Patientdata, setPatientdata] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [profid, setProfid] = useState(0); // Assuming prof_id is used later
  const [ptnid, setPtnid] = useState(0); // Assuming ptn_id is used later
  const [eveID, setEveID] = useState(0); // Assuming eve_id is used later

  console.log("eveIDeveID:", ptnid, profid, eveID);

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:601px) and (max-width:900px)");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // can be 'error', 'info', 'warning'
  });

  const handleViewDetails = (row) => {
    setSelectedRow(row); // bas direct row set karna hai
    setOpen(true);
  };
  const handleDateChange = (newValue) => {
    if (Array.isArray(newValue)) {
      setStartDate(newValue[0]);
      setEndDate(newValue[1]);
    }
  };

const getPlaceholderText = () => {
  switch (filterType) {
    case "event_code":
      return "Enter Event Code";
    case "patient_name":
      return "Enter Patient Name";
    case "professional_name":
      return "Enter Professional Name";
    default:
      return "";
  }
};


  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    setShowSearchBox(event.target.value !== "searchby");
  };

  const handleTempSearchChange = (e) => {
    setTempSearchValue(e.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const triggerSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseQestions = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      triggerSnackbar(
        "Please select a date range before downloading.",
        "warning"
      );
      return;
    }

    const formatDate = (dateObj) =>
      new Date(dateObj).toISOString().split("T")[0];
    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);

    let query = `start_date=${formattedStart}&end_date=${formattedEnd}&prof_id=0`; // prof_id can be dynamic later
    if (filterType !== "searchby" && tempSearchValue.trim() !== "") {
      query += `&${filterType}=${encodeURIComponent(tempSearchValue.trim())}`;
    }

    try {
      const response = await fetch(
        `${port}/web/downloadpatient_feedback/?${query}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Patient_Feedback_Report_${formattedStart}_to_${formattedEnd}.xlsx`; // or .csv based on backend
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        triggerSnackbar("Report downloaded successfully!");
      } else {
        triggerSnackbar(
          `Download failed. Status code: ${response.status}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Download error:", error);
      triggerSnackbar(
        "Error downloading the file. Check console for details.",
        "error"
      );
    }
  };

  const handleSubmit = async () => {
    // If neither date nor search filter is used, show warning
    if (
      (filterType === "searchby" || tempSearchValue.trim() === "") &&
      (!startDate || !endDate)
    ) {
      triggerSnackbar(
        "Please select a date range or use a search filter.",
        "warning"
      );
      return;
    }

    setLoading(true);

    let query = "";

    // Add date to query only if both dates are selected
    if (startDate && endDate) {
      const formatDate = (dateObj) =>
        new Date(dateObj).toISOString().split("T")[0];
      const formattedStart = formatDate(startDate);
      const formattedEnd = formatDate(endDate);
      query += `start_date=${formattedStart}&end_date=${formattedEnd}`;
    }

    // Add search filter if selected
    if (filterType !== "searchby" && tempSearchValue.trim() !== "") {
      query += `${query ? "&" : ""}${filterType}=${encodeURIComponent(
        tempSearchValue.trim()
      )}`;
    }

    try {
      const response = await fetch(`${port}/web/patient_feedback/?${query}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const statusHandlers = {
        200: async () => {
          const data = await response.json();
          if (!data?.data?.length) {
            triggerSnackbar(
              "No feedback data found for the selected filters.",
              "info"
            );
          } else {
            setPatientdata(data.data);
            console.log("Patient data:", data.data);

            setPage(0);
            setRowsPerPage(5);
          
            const Record = data.data[0];
            setProfid(Record?.srv_prof_id || 0);
            setPtnid(Record?.ptn_id || 0);
            setEveID(Record?.eve_id || 0);
            console.log("FirstRecordIDs", {
  prof_id: Record?.srv_prof_id,
  ptn_id: Record?.ptn_id,
  eve_id: Record?.eve_id,
});

            triggerSnackbar("Feedback data fetched successfully!", "success");
          }
        },
        400: () =>
          triggerSnackbar("Bad request — please check your inputs.", "warning"),
        401: () =>
          triggerSnackbar("Unauthorized access. Please login again.", "error"),
        500: () =>
          triggerSnackbar("Server error — please try again later.", "error"),
      };

      if (statusHandlers[response.status]) {
        await statusHandlers[response.status]();
      } else {
        triggerSnackbar(
          `Unexpected error (Status ${response.status})`,
          "error"
        );
      }
    } catch (error) {
      console.error("API error:", error);
      triggerSnackbar(
        "Something went wrong. Check console for more details.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTempSearchValue("");
    setFilterType("searchby");
    setShowSearchBox(false);
    setStartDate(null);
    setEndDate(null);
    setPatientdata([]);
    setPage(0);
    setRowsPerPage(5);
    triggerSnackbar("Filters reset successfully", "info");
  };

  const filteredData = useMemo(
    () =>
      Patientdata.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [Patientdata, page, rowsPerPage]
  );

  return (
    <>
      <HRNavbar />
      <Box sx={{ flexGrow: 1, mt: 12.6, ml: 1, mr: 1, mb: 2 }}>
        <Stack
          direction={isSmallScreen || isTablet ? "column" : "row"}
          spacing={2}
          alignItems={isSmallScreen || isTablet ? "center" : "flex-start"}
          justifyContent={isSmallScreen || isTablet ? "center" : "flex-start"}
          flexWrap="wrap"
          useFlexGap
          sx={{
            pt: 2,
            textAlign: isSmallScreen || isTablet ? "center" : "left",
          }}
        >
          {/* Title */}
          <Typography
            variant="subtitle1"
            fontWeight={600}
            color="text.secondary"
            sx={{ mt: isSmallScreen ? 1 : "5px" }}
          >
            Patient Feedback Report
          </Typography>

          {/* Date Picker */}
          <Box
            sx={{
              width: 250,
              // bgcolor: "#ffffff",
              boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
              borderRadius: "10px",
              // border: "1px solid #C9C9C9",
            }}
          >
            <DatePicker
              range
              value={[startDate, endDate]}
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              render={(value, openCalendar) => (
                <TextField
                  onClick={openCalendar}
                  label="Select Date Range"
                  size="small"
                  fullWidth
                  sx={{
                    height: 39,
                    boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    mb: 1,
                    width: 250,
                  }}
                  value={
                    startDate && endDate
                      ? `${startDate.format("YYYY-MM-DD")} - ${endDate.format(
                          "YYYY-MM-DD"
                        )}`
                      : ""
                  }
                />
              )}
            />
          </Box>

          {/* Filter Type Dropdown */}
          <Box
            sx={{
              width: 250,
              bgcolor: "#ffffff",
              boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
              borderRadius: "10px",
              border: "1px solid #C9C9C9",
            }}
          >
            <TextField
              select
              size="small"
              fullWidth
              value={filterType}
              onChange={handleFilterTypeChange}
            >
              <MenuItem value="searchby" disabled>
                Search by
              </MenuItem>
              {/* <MenuItem value="caller_phone">Caller Number</MenuItem> */}
              <MenuItem value="event_code">Event Code</MenuItem>
              <MenuItem value="patient_name">Patient Name</MenuItem>
              {/* <MenuItem value="patient_phone">Patient Number</MenuItem> */}
              <MenuItem value="professional_name">Professional Name</MenuItem>
            </TextField>
          </Box>

          {/* Conditional Search Box */}
          {showSearchBox && (
            <Box
              sx={{
                width: 250,
                bgcolor: "#ffffff",
                display: "flex",
                alignItems: "center",
                boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                borderRadius: "10px",
                border: "1px solid #C9C9C9",
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={getPlaceholderText()}
                value={tempSearchValue}
                onChange={handleTempSearchChange}
              />
              <IconButton type="button">
                <SearchIcon style={{ color: "#7AB7EE" }} />
              </IconButton>
            </Box>
          )}

          {/* Submit and Reset Buttons */}
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            view
            {/* {loading && <CircularProgress size={24} sx={{ ml: 1 }} />} */}
          </Button>
          <Button variant="outlined" onClick={handleReset}>
            Reset
          </Button>
          <Tooltip title="Download Report" arrow>
            <IconButton
              onClick={handleDownload}
              color="primary"
              aria-label="Download"
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <TableContainer
          sx={{ height: Patientdata.length < 5 ? "60vh" : "auto" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={6} sx={{ border: "none", p: 0 }}>
                  <PatientfeedbackCard
                    sx={{
                      backgroundColor: "#69A5EB",
                      color: "#FFFFFF",
                      borderRadius: "8px 10px 0 0",
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CardContent
                      sx={{
                        flex: 0.5,
                        textAlign: "center",
                        p: 1,
                        borderRight: "1px solid #FFFFFF",
                      }}
                    >
                      <Typography variant="subtitle2">Sr. No</Typography>
                    </CardContent>
                    <CardContent
                      sx={{
                        flex: 1,
                        textAlign: "center",
                        p: 1,
                        borderRight: "1px solid #FFFFFF",
                      }}
                    >
                      <Typography variant="subtitle2">Event Code</Typography>
                    </CardContent>
                    <CardContent
                      sx={{
                        flex: 2,
                        textAlign: "center",
                        p: 1,
                        borderRight: "1px solid #FFFFFF",
                      }}
                    >
                      <Typography variant="subtitle2">
                        Professional Name
                      </Typography>
                    </CardContent>
                    <CardContent
                      sx={{
                        flex: 1.5,
                        textAlign: "center",
                        p: 1,
                        borderRight: "1px solid #FFFFFF",
                      }}
                    >
                      <Typography variant="subtitle2">patient  Name</Typography>
                    </CardContent>
                    <CardContent
                      sx={{
                        flex: 1.1,
                        textAlign: "center",
                        p: 1,
                        borderRight: "1px solid #FFFFFF",
                      }}
                    >
                      <Typography variant="subtitle2">Caller No</Typography>
                    </CardContent>
                    <CardContent
                      sx={{
                        flex: 1,
                        textAlign: "center",
                        p: 1,
                        borderRight: "1px solid #FFFFFF",
                      }}
                    >
                      <Typography variant="subtitle2">Start Date</Typography>
                    </CardContent>
                    <CardContent
                      sx={{
                        flex: 1,
                        textAlign: "center",
                        p: 1,
                        borderRight: "1px solid #FFFFFF",
                      }}
                    >
                      <Typography variant="subtitle2">End Date</Typography>
                    </CardContent>

                    <CardContent
                      sx={{ flex: 1, textAlign: "center", p: 1, mt: 1.2 }}
                    >
                      <Typography variant="subtitle2">Action</Typography>
                    </CardContent>
                  </PatientfeedbackCard>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{ border: "none", p: 3, textAlign: "center" }}
                  >
                    <CircularProgress size={30} thickness={4} color="primary" />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Loading feedback...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{ border: "none", p: 3, textAlign: "center" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No feedback data available.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={6} sx={{ border: "none", p: 0 }}>
                      <PatientfeedbackCard
                        sx={{ display: "flex", alignItems: "center", p: 1 }}
                      >
                        <CardContent
                          sx={{
                            flex: 0.5,
                            textAlign: "center",
                            py: 0.5,
                            px: 1,
                          }}
                        >
                          {page * rowsPerPage + index + 1}
                        </CardContent>
                        <CardContent
                          sx={{ flex: 1, textAlign: "center", py: 0.5, px: 1 }}
                        >
                          {row.event_code || "-"}
                        </CardContent>
                        <CardContent
                          sx={{ flex: 2, textAlign: "center", py: 0.5, px: 1 }}
                        >
                          {row.professional_name || "N/A"}
                        </CardContent>
                        <CardContent
                          sx={{
                            flex: 1.5,
                            textAlign: "center",
                            py: 0.5,
                            px: 1,
                          }}
                        >
                          {row.caller_name || "-"}
                        </CardContent>
                        <CardContent
                          sx={{ flex: 1, textAlign: "center", py: 0.5, px: 1 }}
                        >
                          {row.caller_phone || "N/A"}
                        </CardContent>
                        <CardContent
                          sx={{ flex: 1, textAlign: "center", py: 0.5, px: 1 }}
                        >
                          {row.start_date || "N/A"}
                        </CardContent>
                        <CardContent
                          sx={{ flex: 1, textAlign: "center", py: 0.5, px: 1 }}
                        >
                          {row.end_date || "N/A"}
                        </CardContent>

                        <CardContent
                          sx={{
                            flex: 1,
                            textAlign: "center",
                            py: 0.5,
                            px: 1,
                          }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            sx={{ minWidth: "64px", height: "28px", mt: 1.2 }}
                            onClick={() => handleViewDetails(row)}
                          >
                            View
                          </Button>
                        </CardContent>
                      </PatientfeedbackCard>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={Patientdata.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Box>

      <Modal
        open={open}
        onClose={handleCloseQestions}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
       <Box
  sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
      xs: "90%",
      sm: 500,
      md: 700,
      lg: 800
    },
    bgcolor: "#fff",
    borderRadius: 2,
    boxShadow: 24,
    overflow: "hidden",
  }}
>
          <Box
            sx={{
              background:
                "linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)",
              px: 2,
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              id="modal-title"
              sx={{ fontSize: "16px", fontWeight: 600, color: "#fff" }}
            >
              FEEDBACK DETAILS
            </Typography>
            <IconButton
              onClick={handleCloseQestions}
              sx={{ color: "#FFF", p: 0.5 }}
            >
              <GridCloseIcon />
            </IconButton>
          </Box>

          <CardContent
            sx={{
              px: 3,
              py: 3,
              bgcolor: "#f9f9f9",
              borderRadius: "12px",
            }}
          >
            {/* <Typography
              variant="subtitle2"
              sx={{
                fontSize: "13px",
                color: "text.disabled",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 0.5,
              }}
            >
              Question
            </Typography>

            <Typography
              fontWeight={600}
              gutterBottom
              sx={{
                fontSize: "16px",
                color: "text.primary",
                mb: 1.5,
                lineHeight: 1.4,
              }}
            >
              {selectedRow?.question || "—"}
            </Typography>

            <Divider sx={{ mb: 1.5 }} />

            <Typography
              variant="subtitle2"
              sx={{
                fontSize: "13px",
                color: "text.disabled",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 0.5,
              }}
            >
              Answer:-
            </Typography>

            <Typography
              sx={{
                fontSize: "15px",
                color: "text.secondary",
                lineHeight: 1.6,
              }}
              id="modal-description"
            >
              {selectedRow?.answer || "No answer provided."}
            </Typography> */}

            <Feedback profid={profid} ptnid={ptnid} eveID={eveID} />
          </CardContent>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

export default PatientFeedbackReport;
