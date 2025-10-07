import React, { useEffect, useState } from "react";
import HRNavbar from "../../HR/HRNavbar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {
  TextField,
  Button,
  TablePagination,
  Tooltip,
  Alert,
  Snackbar,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import InputBase from "@mui/material/InputBase";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/system";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import TableCell from "@mui/material/TableCell";
import Footer from "../../../Footer";
import DatePicker from "react-multi-date-picker";
import dayjs from "dayjs";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const HospitalCard = styled(Card)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "10px",
  marginRight: "10px",
  backgroundColor: "white",
  boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
  height: "43px",
  borderRadius: "10px",
  transition: "0.5s ease-in-out",
  "&:hover": {
    backgroundColor: "#F7F7F7",
    cursor: "pointer",
  },
  fontWeight: "200",
});

const ClinicalReports = () => {
  const [hospitalType, setHospitalType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hospDataTable, setHospDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedDates, setSelectedDates] = useState([]);
  console.log("selectedDates", selectedDates);
  const [snackbarOpen, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [hospitalData, setHospitalData] = useState([]);

  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");

  const handleViewReport = async () => {
    setLoading(true);
    try {
      let url = `${port}/hhc_repo/hospital_patient_count_Report/?`;

      if (startDate) {
        url += `fromdate=${startDate}&`;
      }
      if (endDate) {
        url += `todate=${endDate}&`;
      }
      if (hospitalType) {
        url += `hospital_name=${hospitalType}&`;
      }

      const res = await fetch(url.slice(0, -1), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log(res);
      const data = await res.json();
      setHospDataTable(data || []);
      setLoading(false);
      console.log("Consultant Data", data);
    } catch (error) {
      console.error("Error fetching Consultant Report Data:", error);
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    if (!selectedDates || selectedDates.length === 0) {
      snackbarMessage("Please select at least one date.");
      return;
    }

    const unwrappedDates = Array.isArray(selectedDates[0])
      ? selectedDates[0]
      : selectedDates;

    if (unwrappedDates.length < 2) {
      snackbarMessage("Please select a date range.");
      return;
    }

    const start = new Date(unwrappedDates[0]);
    const end = new Date(unwrappedDates[unwrappedDates.length - 1]);

    if (isNaN(start) || isNaN(end)) {
      snackbarMessage("Invalid date format.");
      return;
    }

    const start_date = start.toISOString().split("T")[0];
    const end_date = end.toISOString().split("T")[0];

    const downloadUrl = `${port}/medical/download_report/?start_date=${start_date}&end_date=${end_date}`;

    try {
      const response = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        snackbarMessage("Failed to download the file.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "clinicalreport.xlsx"; // ✅ desired filename
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      snackbarMessage("Error downloading the report.");
      console.error("Download error:", error);
    }
  };

  useEffect(() => {
    const hospitalData = async () => {
      try {
        const res = await fetch(`${port}/web/agg_hhc_hospitals_api`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        console.log(res);
        const data = await res.json();
        setHospitalData(data);
        console.log("Data from hospitalData", data);
      } catch (error) {
        console.error("Error fetching hospitalData Data:", error);
      }
    };
    hospitalData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /////// date changes validation
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setEndDate(""); // Reset end date whenever start date changes
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

  // Handle date change just store as is for picker
  const handleDateChange = (dates) => {
    setSelectedDates(dates);
    console.log("UpdatedselectedDates:", dates);

    // On date change, call fetchGovernanceData with unwrapped dates
    const unwrappedDates = Array.isArray(dates[0]) ? dates[0] : dates;

    if (unwrappedDates.length === 2) {
      const formattedStart = new Date(unwrappedDates[0])
        .toISOString()
        .split("T")[0];
      const formattedEnd = new Date(unwrappedDates[1])
        .toISOString()
        .split("T")[0];
      fetchGovernanceData(formattedStart, formattedEnd);
    }
  };

  const fetchGovernanceData = async () => {
    // if (!selectedDates || selectedDates.length === 0) {
    //   return;
    // }

    // Unwrap nested array if needed
    const dates = Array.isArray(selectedDates[0])
      ? selectedDates[0]
      : selectedDates;

    // if (dates.length < 2) {
    //   alert("Please select both start and end dates");
    //   return;
    // }

    const start = new Date(dates[0]).toISOString().split("T")[0];
    const end = new Date(dates[1]).toISOString().split("T")[0];

    setLoading(true);
    try {
      const res = await fetch(
        `${port}/medical/report/?start_date=${start}&end_date=${end}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setHospDataTable(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setHospDataTable([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const [start, end] = selectedDates;
    fetchGovernanceData(start, end);
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  return (
    <div>
      <HRNavbar />
      <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mt: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "left" }}>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>{" "}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            style={{ overflowX: "hidden" }}
          >
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 600,
                marginTop: "20px",
                marginLeft: "10px",
              }}
              color="text.secondary"
              gutterBottom
            >
              Clinical Governance Report
            </Typography>
            {/* <Box sx={{ mb: 1, width: 300, marginLeft: "1rem" }}>
              <TextField
                select
                label="Select Hospital Name"
                variant="outlined"
                size="small"
                sx={{
                  height: 39,
                  width: "100%",
                  backgroundColor: "white",
                  boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                  borderRadius: "7px",
                }}
                InputProps={{ style: { border: "none" } }}
                inputProps={{ "aria-label": "Select Group" }}
                value={hospitalType}
                onChange={(e) => setHospitalType(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: "100px",
                      overflowY: "auto",
                    },
                  },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: "200px", // Set the maximum height to 200px
                        maxWidth: "200px",
                      },
                    },
                    MenuListProps: {
                      style: {
                        maxHeight: "200px", // Set the maximum height to 200px
                      },
                    },
                  },
                }}
              >
                {hospitalData.map((item, index) => (
                  <MenuItem key={item.hosp_id} value={item.hosp_id}>
                    {item.hospital_name}
                  </MenuItem>
                ))}
              </TextField>
            </Box> */}

            <Box
              sx={{
                marginLeft: "1rem",
                display: "flex",
                alignItems: "center",
                mb: 1,
                padding: "2px 4px",
              }}
            >
              <DatePicker
                multiple
                range
                value={selectedDates}
                onChange={handleDateChange}
                placeholder="YYYY/MM/DD"
                format="YYYY-MM-DD"
                // mapDays={mapDays} // or remove if not needed
                render={(value, openCalendar) => (
                  <TextField
                    onClick={openCalendar}
                    label="Select  Date *"
                    placeholder="YYYY/MM/DD"
                    size="small"
                    fullWidth
                    sx={{
                      height: 39,
                      boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                      borderRadius: "8px",
                      backgroundColor: "white",
                      mb: 1,
                      width: 210,
                      mt: 0.8,
                    }}
                    value={selectedDates.join("-")}
                    // variant="standard"
                  />
                )}
              />
            </Box>

            <Button
              variant="contained"
              style={{
                backgroundColor: "#69A5EB",
                color: "white",
                textTransform: "capitalize",
              }}
              onClick={fetchGovernanceData}
            >
              Submit
            </Button>
            {/* 
            <Button
              variant="contained"
              style={{
                backgroundColor: "#69A5EB",
                color: "white",
                textTransform: "capitalize",
              }}
              onClick={handleViewReport}
            >
              View Report
            </Button> */}

            <FileDownloadOutlinedIcon
              sx={{ color: "#000000", cursor: "pointer" }}
              onClick={() => {
                handleDownloadExcel();
              }}
            />
          </Stack>
        </Box>

        <TableContainer sx={{ ml: 1, mr: 1, overflowX: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow>
                <HospitalCard
                  style={{
                    background: "#69A5EB",
                    color: "#FFFFFF",
                    borderRadius: "8px 10px 0 0",
                    height: "3rem",
                  }}
                >
                  <CardContent
                    style={{ flex: 0.6, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Sr No </Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Added Date</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Patient Name</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2"> Patient Number</Typography>
                  </CardContent>

                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Added By</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Remark </Typography>
                  </CardContent>
                </HospitalCard>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <CardContent
                    style={{
                      width: "100%",
                      textAlign: "center",
                      height: "45vh",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress />
                  </CardContent>
                </TableRow>
              ) : !Array.isArray(hospDataTable) ||
                hospDataTable.length === 0 ? (
                <TableRow>
                  <CardContent
                    style={{
                      width: "100%",
                      textAlign: "center",
                      height: "45vh",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="subtitle1">No data found</Typography>
                  </CardContent>
                </TableRow>
              ) : (
                hospDataTable
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((hosp, index) => (
                    <TableRow key={index} sx={{ overflowX: "hidden" }}>
                      <HospitalCard
                        style={{
                          height: "3rem",
                          background: "white",
                          color: "rgba(0, 0, 0, 0.87)",
                          fontWeight: "100",
                          borderRadius: "8px 10px 8px 8px",
                        }}
                      >
                        <CardContent style={{ flex: 0.6 }}>
                          <Typography variant="subtitle2" alignItems={"center"}>
                            {index + 1}
                          </Typography>
                        </CardContent>
                        <CardContent style={{ flex: 2 }}>
                          <Typography variant="subtitle2">
                            {hosp.added_date || "-"}
                          </Typography>
                        </CardContent>
                        <CardContent style={{ flex: 3 }}>
                          <Typography variant="subtitle2">
                            {hosp.patient_name || "-"}
                          </Typography>
                        </CardContent>
                        <CardContent style={{ flex: 3 }}>
                          <Typography variant="subtitle2">
                            {hosp.patient_number || "-"}
                          </Typography>
                        </CardContent>
                        <CardContent style={{ flex: 3 }}>
                          <Typography variant="subtitle2">
                            {hosp.added_by || "-"}
                          </Typography>
                        </CardContent>
                        <CardContent
                          style={{
                            flex: 3,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              flexGrow: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {hosp.remark?.length > 30 ? (
                              <Tooltip
                                title={hosp.remark}
                                arrow
                                placement="top"
                              >
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    display: "inline-block",
                                    maxWidth: "100%",
                                    verticalAlign: "middle",
                                    cursor: "pointer", // optional, makes it feel interactive
                                  }}
                                >
                                  {`${hosp.remark.slice(0, 30)}...`}
                                </Typography>
                              </Tooltip>
                            ) : (
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  display: "inline-block",
                                  maxWidth: "100%",
                                  verticalAlign: "middle",
                                }}
                              >
                                {hosp.remark || "-"}
                              </Typography>
                            )}
                          </Box>
                        </CardContent>
                      </HospitalCard>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 30, 50]}
          component="div"
          count={hospDataTable.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <Footer />
    </div>
  );
};

export default ClinicalReports;
