import React, { useEffect, useState } from "react";
import HRNavbar from "../../HR/HRNavbar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {
  TextField,
  Button,
  TablePagination,
  IconButton,
  Snackbar,
  Alert,
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
import SearchIcon from "@mui/icons-material/Search";
import DatePicker from "react-multi-date-picker";
import dayjs from "dayjs";
import axios from "axios";

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

const RefundReports = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [formattedDates, setFormattedDates] = useState([]);
  const [filterType, setFilterType] = useState("searchby");
  const [tempSearchValue, setTempSearchValue] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [refundData, setRefundData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("warning");
    const [error, setError] = useState(null);
  
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
 const getPlaceholderText = () => {
    switch (filterType) {
      case "eve_code":
        return "Search by event code...";
      case "ptn_num":
        return "Search by patient number...";
      case "ptn_name":
        return "Search by patient name...";
      case "caller_num":
        return "Search by caller number...";
      default:
        return "Search here...";
    }
  };

  const handleTempSearchChange = (event) => {
    setTempSearchValue(event.target.value);
  };

  const handleFilterTypeChange = (event) => {
    const value = event.target.value;
    setFilterType(value);
    setShowSearchBox(value !== "searchby");
  };

  const handleDateChange = (dates) => {
    setSelectedDates(dates);

    const unwrapped = Array.isArray(dates[0]) ? dates[0] : dates;

    if (unwrapped.length === 2) {
      const start = new Date(unwrapped[0]).toISOString().split("T")[0];
      const end = new Date(unwrapped[1]).toISOString().split("T")[0];
      setFormattedDates([start, end]); // This should be set here
    }
  };

  // const fetchData = async () => {
  //   try {
  //     const baseURL =
  //       "http://testhhc.hospitalguru.in:8060/web/cashfreerefund_report/";

  //     let dateParams = "";
  //     if (formattedDates && formattedDates.length === 2) {
  //       // Ensure dates are valid and properly formatted
  //       const validStart = new Date(formattedDates[0]);
  //       const validEnd = new Date(formattedDates[1]);

  //       if (!isNaN(validStart) && !isNaN(validEnd)) {
  //         const start = validStart.toISOString().split("T")[0];
  //         const end = validEnd.toISOString().split("T")[0];
  //         dateParams = `?dates=${start},${end}`;
  //       }
  //     }

  //     const searchParam =
  //       filterType !== "searchby" && tempSearchValue
  //         ? `${dateParams ? "&" : "?"}${filterType}=${encodeURIComponent(
  //             tempSearchValue
  //           )}`
  //         : "";

  //     const url = `${baseURL}${dateParams}${searchParam}`;

  //     console.log("✅ Final API URL:", url);

  //     const res = await fetch(url);
  //     const json = await res.json();

  //     console.log("✅ Fetched Data:", json);
  //     setRefundData(json);
  //   } catch (error) {
  //     console.error("❌ Fetch failed:", error);
  //   }
  // };

    const fetchData = async () => {
    const baseURL = `${port}/web/cashfreerefund_report/`;
    // const baseURL = `${port}/web/cashfreerefund_report/`;

    let urlParams = [];

    if (formattedDates.length === 2) {
      const start = formattedDates[0]; // already YYYY-MM-DD
      const end = formattedDates[1];
      urlParams.push(`start_date=${start}`);
      urlParams.push(`end_date=${end}`);
    }

    if (filterType && filterType !== "searchby" && tempSearchValue.trim()) {
      urlParams.push(
        `${filterType}=${encodeURIComponent(tempSearchValue.trim())}`
      );
    }

    // urlParams.push(
    //   `${filterType}=${encodeURIComponent(tempSearchValue.trim())}`
    // );
    const finalURL =
      baseURL + (urlParams.length ? `?${urlParams.join("&")}` : "");

    setLoading(true);
    try {
      const res = await fetch(finalURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();

      // ✅ Trust backend filtered data
      if (!data || data.length === 0) {
        setSnackbarMessage("No matching records found.");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      }

      setRefundData(data); // Fallback to [] if res.data is undefined
    } catch (error) {
      setSnackbarMessage("Failed to fetch data.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      // Fetch initial data if needed
      fetchData();
    }, []);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  const handleDownloadExcel = async () => {
      setLoading(true);
  
      try {
        if (!refundData || !Array.isArray(refundData)) {
          throw new Error("Invalid refundData");
        }
  
        const response = await axios.post(
          
          `${port}/web/cashfreerefund_report_excel/`,
          refundData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            responseType: "blob",
          }
        );
  
        // Check if server actually returned a file
        const contentType = response.headers["content-type"];
        if (
          contentType &&
          contentType.includes(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          )
        ) {
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
  
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "CashfreeRefundReport.xlsx");
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        } else {
          // Likely an error returned instead of a file
          const errorText = await response.data.text();
          console.error("Server responded with error:", errorText);
          setError("Server error: " + errorText);
        }
  
        setLoading(false);
      } catch (err) {
        console.error("Error downloading Excel:", err);
        setError("Failed to download Excel file");
        setLoading(false);
      }
    };
  
  return (
    <div>
      <HRNavbar />
      <Box sx={{ flexGrow: 0, ml: 1, mr: 1, mt: 2, mb: "3em" }}>
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
              Refund Report
            </Typography>

            <Box
              sx={{
                marginLeft: "1rem",
                marginTop: "10px", // ⬅️ Add vertical space
                display: "flex",
                alignItems: "center",
                borderRadius: "10px",
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
                render={(value, openCalendar) => (
                  <TextField
                    onClick={openCalendar}
                    label="Select Date *"
                    placeholder="YYYY/MM/DD"
                    size="small"
                    fullWidth
                    sx={{
                      height: 39,
                      boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                      borderRadius: "8px",
                      backgroundColor: "white",
                      mb: 1,
                      width: 220,
                      mt: 0.8,
                    }}
                    value={formattedDates.join("-")} // properly formatted
                  />
                )}
              />
            </Box>

            <Box
              component="form"
              sx={{
                marginLeft: "2rem",
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 300,
                height: "2.5rem",
                backgroundColor: "#ffffff",
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
                sx={{
                  textAlign: "left",
                  "& input": {
                    fontSize: "14px",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                    },
                  },
                }}
              >
                <MenuItem value="searchby" disabled>
                  Search by
                </MenuItem>
                <MenuItem value="caller_num" style={{ fontSize: "15px" }}>
                  Caller Number
                </MenuItem>
                <MenuItem value="eve_code" style={{ fontSize: "15px" }}>
                  Event Code
                </MenuItem>
                <MenuItem value="ptn_name" style={{ fontSize: "15px" }}>
                  Patient Name
                </MenuItem>
                <MenuItem value="ptn_number" style={{ fontSize: "15px" }}>
                  Patient Number
                </MenuItem>
              </TextField>
            </Box>

            {showSearchBox && (
              <Box
                component="form"
                sx={{
                  marginLeft: "2rem",
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 300,
                  height: "2.5rem",
                  backgroundColor: "#ffffff",
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
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SearchIcon style={{ color: "#7AB7EE" }} />
                </IconButton>
              </Box>
            )}

            <Button
              variant="contained"
              // disabled={
              //   filterType !== "searchby" &&
              //   tempSearchValue.trim() === "" &&
              //   (!formattedDates || formattedDates.length !== 2)
              // }
              onClick={fetchData}
            >
              Submit
            </Button>

             <FileDownloadOutlinedIcon
              sx={{ color: "#000000", cursor: "pointer" }}
              onClick={() => {
                handleDownloadExcel();
              }}
            />
          </Stack>
        </Box>

        <TableContainer sx={{ ml: 1, mr: 1 }}>
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
                    style={{ flex: 0.7, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Sr. No</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2"> Event Code</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 2.8, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Caller Number</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 2.5, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Caller Name</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Created At </Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Patient Name</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Patient Number</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Refund Amount</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Status</Typography>
                  </CardContent>
                </HospitalCard>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    style={{ height: "45vh" }}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : refundData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    style={{ height: "45vh" }}
                  >
                    <Typography variant="subtitle1">No data found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                refundData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const totalRefund =
                      row.cashwebbook?.reduce(
                        (acc, cur) => acc + (cur.refund_amount || 0),
                        0
                      ) || 0;
                    const status = row.cashwebbook?.[0]?.refund_status || "-";
                    return (
                      <TableRow key={index}>
                        <HospitalCard
                          style={{
                            background: "white",
                            color: "rgba(0, 0, 0, 0.87)",
                            height: "3rem",
                          }}
                        >
                          <CardContent style={{ flex: 0.7 }}>
                            <Typography variant="subtitle2">
                              {page * rowsPerPage + index + 1}
                            </Typography>
                          </CardContent>

                          <CardContent style={{ flex: 3 }}>
                            <Typography variant="subtitle2">
                              {row.eve_code || "-"}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 2.8 }}>
                            <Typography variant="subtitle2">
                              {row.caller_number || "-"}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 2.5 }}>
                            <Typography variant="subtitle2">
                              {row.caller_name || "-"}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 3 }}>
                            <Typography variant="subtitle2">
                              {row.refund_created_date
                                ? dayjs(row.refund_created_date).format(
                                    "YYYY-MM-DD HH:mm"
                                  )
                                : "-"}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 3 }}>
                            <Typography variant="subtitle2">
                              {row.patient_name || "-"}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 3 }}>
                            <Typography variant="subtitle2">
                              {row.patient_number || "-"}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 3 }}>
                            <Typography variant="subtitle2">
                              {totalRefund}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 3 }}>
                            <Typography variant="subtitle2">
                              {status}
                            </Typography>
                          </CardContent>
                        </HospitalCard>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={refundData.length}
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

export default RefundReports;
