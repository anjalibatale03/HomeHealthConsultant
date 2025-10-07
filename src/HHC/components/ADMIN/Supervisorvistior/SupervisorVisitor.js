import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CardContent,
  IconButton,
  Stack,
  Card,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  TablePagination,
  Snackbar,
  Alert,
  CircularProgress,
  ListItemText,
  List,
  Menu,
  InputAdornment,
  ClickAwayListener,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DatePicker from "react-multi-date-picker";
import HRNavbar from "../../HR/HRNavbar";
import { useNavigate } from "react-router-dom";
import Footer from "../../../Footer";
import { styled } from "@mui/material/styles";
import { GridAddIcon } from "@mui/x-data-grid";
import dayjs from "dayjs";
import SupervisorVisitorForm from "./Superviorvisitorform";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClearIcon from "@mui/icons-material/Clear";


const SupervisorServiceCard = styled(Card)(() => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "white",
  // boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.08)",
  height: "42px",

  borderRadius: "10px",
  transition: "all 0.2s ease-in-out",
  marginBottom: "8px",
  "&:hover": {
    backgroundColor: "#F7F7F7",
  },
}));

const SupervisorVisitor = () => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");

  const [tableData, setTableData] = useState([]);
  console.log(tableData, "tableData fetching");

  const [dateRange, setDateRange] = useState([null, null]);
  console.log(dateRange, "dateRange fetching");
  const [showForm, setShowForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  console.log(selectedRow, "selectedRow fetching");

  const [mode, setMode] = useState(""); // "view" or "edit"

  const [isViewMode, setIsViewMode] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [professionalOptions, setProfessionalOptions] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isFilterApplied, setIsFilterApplied] = useState(false);


  useEffect(() => {
    console.log(" DateRange Updated", dateRange);
  }, [dateRange]);

  const fetchProfessionals = async (startDate = null, endDate = null) => {
    try {
      setIsLoading(true);

      const params = {};
      if (startDate && endDate) {
        params.start_date = startDate.format("YYYY-MM-DD");
        params.end_date = endDate.format("YYYY-MM-DD");
      }

      const response = await axios.get(
        `${port}/hhc_admin/ProfessionalNames_get/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params,
        }
      );

      const apiOptions = response.data.map((item) => ({
        id: item.prof_id,
        label: item.prof_name,
      }));

      const allOption = { id: 0, label: "All" };

      setProfessionalOptions([allOption, ...apiOptions]);
    } catch (error) {
      console.error("Failed to fetch professionals", error);
    } finally {
      setIsLoading(false);
    }
  };


  const navigate = useNavigate();

  useEffect(() => {
    fetchProfessionals(); // initial fetch without date
  }, []);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      const start = dayjs(dateRange[0]);
      const end = dayjs(dateRange[1]);
      fetchProfessionals(start, end);
    } else {
      fetchProfessionals(); // fetch all if no date range
    }
  }, [dateRange]);

  // In your component state

  const [formData, setFormData] = useState({
    professional: null,
    patient: null,
    visitDateTime: null,
    remarks: [],
  });

  const handleViewClick = (row) => {
    setIsViewMode(true); // disables inputs
    setMode("view");
    setSelectedRow(row); // to prefill form
    setFormData(row); // pass to form
    setShowForm(true); // show form
  };

  const handleEditClick = (row) => {
    setIsViewMode(false); // enables inputs
    setMode("edit");
    setSelectedRow(row);
    setFormData(row);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setIsViewMode(false);
    setMode("add");
    setFormData({}); // empty form
    setShowForm(true);
  };
  const handleBack = () => {
    // Example: Navigate back using React Router
    navigate(-1);

    // Or custom behavior:
    // setShowForm(false);
    // setStep("selection");
  };
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handlefilterSubmit = async () => {
    const [start, end] = dateRange;



    console.log(" Submitting Filter:");
    console.log("Selected Professional:", selectedProfessional);
    console.log("Start Date:", start);
    console.log("End Date:", end);

    if (selectedProfessional?.id === undefined || selectedProfessional?.id === null) {
      setSnackbarMsg("Please select a professional.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    if (!start || !end) {
      setSnackbarMsg("Please select a valid date range.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    const startDate = new Date(start).toISOString().split("T")[0];
    const endDate = new Date(end).toISOString().split("T")[0];

    console.log("✅ Formatted Dates:", { startDate, endDate });


    setIsSubmitting(true);
    setIsFilterApplied(true);

    try {
      const response = await axios.get(`${port}/hhc_admin/add_sup_visit/`, {
        params: {
          prof_id: selectedProfessional.id, // 0 will now pass correctly
          start_date: startDate,
          end_date: endDate,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.length === 0) {
        setTableData([]);
        setSnackbarMsg("No records found for the selected filter.");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      } else {
        console.log("Fetched supervisor visit data:", response.data);
        setTableData(response.data);
        setSnackbarMsg("Data loaded successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error fetching supervisor visit data", error);
      setSnackbarMsg("Failed to fetch data.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleDownload = async () => {
    if (
      selectedProfessional === null ||
      dateRange[0] === null ||
      dateRange[1] === null
    ) {
      setSnackbarMsg("Please select professional and date range.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setIsDownloading(true);
    const start = dayjs(dateRange[0]).format("YYYY-MM-DD");
    const end = dayjs(dateRange[1]).format("YYYY-MM-DD");
    const profId = selectedProfessional.id;

    try {
      const response = await axios.get(
        `${port}/hhc_admin/download_supervisor_report/`,
        {
          params: { start_date: start, end_date: end, prof_id: profId },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: "blob", // Important for file
        }
      );

      const contentType = response.headers["content-type"];

      if (contentType.includes("application/json")) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const json = JSON.parse(reader.result);
            setSnackbarMsg(json.message || "No data available.");
            setSnackbarSeverity("info");
          } catch (parseError) {
            setSnackbarMsg("Unexpected response from server.");
            setSnackbarSeverity("error");
          }
          setSnackbarOpen(true);
          setIsDownloading(false);
        };
        reader.readAsText(response.data);
      } else {
        // Download file if content is not JSON
        const blob = new Blob([response.data]);
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `Supervisor_Report_${start}_to_${end}.xlsx`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setIsDownloading(false);
      }
    } catch (data) {
      console.error("Download error:", data);

      if (data.response && data.response.data?.message) {
        setSnackbarMsg(data.response.data.message); // from API
        setSnackbarSeverity("info");
      } else {
        setSnackbarMsg("Download failed. Please try again.");
        setSnackbarSeverity("error");
      }

      setSnackbarOpen(true);
      setIsDownloading(false);
    }
  };

  const isDownloadDisabled =
    selectedProfessional?.id === undefined || !dateRange[0] || !dateRange[1];



      const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const open = Boolean(anchorEl);

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchTerm("");
  };

  const handleSelect = (option) => {
    setSelectedProfessional(option);
    handleClose();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedProfessional(null);
    setSearchTerm("");
  };

  const filteredOptions = professionalOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <HRNavbar />
      {!showForm ? (
        <Box sx={{ flexGrow: 1, mx: 1, mb: 1, mt: 3 }}>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity} // 👈 dynamic value
              sx={{ width: "100%" }}
            >
              {snackbarMsg}
            </Alert>
          </Snackbar>

          {/* Top Controls Section */}
          <Stack
            spacing={2}
            direction={isSmallScreen ? "column" : "row"}
            alignItems={isSmallScreen ? "center" : "flex-start"}
            sx={{ mb: 2, mt: 3 }}
          >
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12} sm={12} md={1.5}>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                    mt: 1.25,
                    mb: 1,
                  }}
                >
                  Supervisor Visitor
                </Typography>
              </Grid>

              {/* Filters and Buttons Section */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={4}>
                    {/* <DatePicker
                      multiple
                      range
                      value={dateRange}
                      onChange={setDateRange}
                      placeholder="YYYY/MM/DD - YYYY/MM/DD"
                      containerStyle={{
                        width: "100%",
                      }}
                      render={(value, openCalendar) => (
                        <TextField
                          onClick={openCalendar}
                          label="Date Range *"
                          placeholder="YYYY/MM/DD"
                          size="small"
                          fullWidth
                          value={
                            Array.isArray(value) && value[0] && value[1]
                              ? `${dayjs(value[0]).format("DD/MM/YYYY")} - ${dayjs(value[1]).format("DD/MM/YYYY")}`
                              : ""
                          }
                          sx={{
                            textAlign: "left",
                            "& input": {
                              fontSize: "14px",
                            },
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    /> */}

                    <DatePicker
                      containerStyle={{
                        width: "100%",
                      }}
                      range
                      value={dateRange}
                      onChange={setDateRange}
                      format="DD/MM/YYYY"
                      placeholder="Select Date Range"
                      render={(value, openCalendar) => (
                        <TextField
                          onClick={openCalendar}
                          label="Date Range *"
                          value={
                            Array.isArray(value) && value[0] && value[1]
                              ? `${value[0]} - ${value[1]}`
                              : ""
                          }
                          placeholder="YYYY/MM/DD - YYYY/MM/DD"
                          fullWidth
                          size="small"
                          readOnly
                          InputLabelProps={{
                            shrink: true,
                          }}
                          sx={{
                            textAlign: "left",
                            "& input": {
                              fontSize: "14px",
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Professional Dropdown */}
                  <Grid item xs={12} sm={12} md={4}>
                    {/* <Autocomplete
                      options={professionalOptions}
                      value={selectedProfessional}
                      onChange={(e, newValue) =>
                        setSelectedProfessional(newValue)
                      }
                      getOptionLabel={(option) => option.label || ""}
                      disableClearable
                      popupIcon={<ArrowDropDownIcon />}
                      loading={isLoading} // ✅ spinner logic
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Professional"
                          size="small"
                          fullWidth
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                            },
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {isLoading ? (
                                  <CircularProgress size={16} sx={{ mr: 2 }} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    /> */}

                     <ClickAwayListener onClickAway={handleClose}>
      <div>
        <TextField
          label="Select Professional"
          value={selectedProfessional?.label || ""}
          onClick={handleOpen}
          fullWidth
          size="small"
          InputProps={{
            readOnly: true,
            endAdornment: (
              <>
                {isLoading && (
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                )}
                {selectedProfessional && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClear}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )}
                <ArrowDropDownIcon sx={{ ml: 1 }} />
              </>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        />

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: "0.1em",
              zIndex: 2000,
              maxHeight: 300,
              width: anchorEl?.clientWidth || 300,
              overflowY: "auto",
              overflowX: "hidden",
              p: 1,
            },
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <TextField
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            fullWidth
            autoFocus
            sx={{ mb: 1 }}
          />

          <List dense disablePadding>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <MenuItem
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  sx={{
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No matches found</MenuItem>
            )}
          </List>
        </Menu>
      </div>
    </ClickAwayListener>

                    {/* <TextField 
                      select
                      label="Select Professional"
                      variant="outlined"
                      size="small"
                      fullWidth
                     sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                  }}
                  SelectProps={{
                    MenuProps: {
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                      getContentAnchorEl: null, // ❗ VERY important
                      PaperProps: {
                        sx: {
                          mt: "0.1em", // margin from textfield
                          zIndex: 2000, // bring above dialogs/drawers
                          // mb: 1,
                          maxHeight: 200, // optional: limit height
                          // minWidth: "10%",
                          width: "11em",
                        },
                      },
                    },
                  }}
                      value={selectedProfessional}
                      onChange={(e) => setSelectedProfessional(e.target.value)}
                    >
                      {professionalOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                      
                      </TextField> */}
                  </Grid>

                  <Grid item xs={12} sm={12} md={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="small"
                      onClick={handlefilterSubmit}
                      sx={{
                        borderRadius: "6px",
                        fontSize: { xs: "13px", sm: "14px", md: "15px" },
                        minWidth: "140px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={12} md={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="small"
                      onClick={handleDownload}
                      disabled={
                        isDownloading ||
                        selectedProfessional?.id === undefined || // ✅ Safe check
                        !dateRange[0] ||
                        !dateRange[1]
                      }
                      sx={{
                        borderRadius: "6px",
                        fontSize: { xs: "13px", sm: "14px", md: "15px" },
                        minWidth: "140px",
                        whiteSpace: "nowrap",
                        position: "relative",
                        backgroundColor: "#43A047",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#388E3C",
                        },
                        ml: 1,
                      }}
                    >
                      {isDownloading ? (
                        <>
                          <CircularProgress
                            size={16}
                            sx={{ mr: 1, color: "white" }}
                          />
                          Downloading...
                        </>
                      ) : (
                        <>
                          Download <DownloadIcon fontSize="small" />
                        </>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={2.5}>
                <Box
                  display="flex"
                  justifyContent={{ xs: "center", md: "flex-end" }}
                  mt={{ xs: 2, md: 0 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleAddClick}
                    startIcon={<GridAddIcon />}
                    sx={{
                      borderRadius: "6px",
                      fontSize: { xs: "13px", sm: "14px", md: "15px" },
                      minWidth: "140px",
                      whiteSpace: "nowrap",
                      mr: { xs: 0, md: 1 },
                      "&:hover": {
                        backgroundColor: "#1976d2", // Darker blue on hover
                      },
                    }}
                  >
                    Add Visitor
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Stack>

          {/* Table Section */}
          <TableContainer
            sx={{
              borderRadius: "15px",
              overflowX: "hidden",
              // boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Fixed Header Table */}
            <Table
              sx={{
                width: "100%",
                borderCollapse: "separate",
                // borderSpacing: "0 6px",
                minWidth: 800,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell colSpan={7} sx={{ p: 0 }}>
                    <SupervisorServiceCard
                      style={{
                        background: "#69A5EB",
                        color: "#FFFFFF",
                        borderRadius: "8px 10px 0 0",
                        // height: "2.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <CardContent
                        sx={{
                          flex: 0.5,
                          textAlign: "center",
                          py: 0.2,
                          borderRight: "1px solid white",
                        }}
                      >
                        <Typography variant="subtitle2" fontSize={13} noWrap>
                          Sr. No
                        </Typography>
                      </CardContent>
                      <CardContent
                        sx={{
                          flex: 2,
                          textAlign: "center",
                          py: 0.2,
                          borderRight: "1px solid white",
                        }}
                      >
                        <Typography variant="subtitle2" fontSize={13} noWrap>
                          Visitor Date & Time
                        </Typography>
                      </CardContent>
                      <CardContent
                        sx={{
                          flex: 2,
                          textAlign: "center",
                          py: 0.2,
                          borderRight: "1px solid white",
                        }}
                      >
                        <Typography variant="subtitle2" fontSize={13} noWrap>
                          Professional Name
                        </Typography>
                      </CardContent>
                      <CardContent
                        sx={{
                          flex: 2,
                          textAlign: "center",
                          py: 0.2,
                          borderRight: "1px solid white",
                        }}
                      >
                        <Typography variant="subtitle2" fontSize={13} noWrap>
                          Patient Name
                        </Typography>
                      </CardContent>
                      <CardContent
                        sx={{
                          flex: 2,
                          textAlign: "center",
                          py: 0.2,
                          borderRight: "1px solid white",
                        }}
                      >
                        <Typography variant="subtitle2" fontSize={13} noWrap>
                          Patient Number
                        </Typography>
                      </CardContent>
                      <CardContent
                        sx={{
                          flex: 2,
                          textAlign: "center",
                          py: 0.2,
                          borderRight: "1px solid white",
                        }}
                      >
                        <Typography variant="subtitle2" fontSize={13} noWrap>
                          Professional Number
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ flex: 2, textAlign: "center" }}>
                        <Typography variant="subtitle2" fontSize={13}>
                          Actions
                        </Typography>
                      </CardContent>
                    </SupervisorServiceCard>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>

            {/* Scrollable Table Body */}
            <Box sx={{ maxHeight: 380, overflowY: "auto" }}>
              <Table
                sx={{
                  width: "100%",
                  borderCollapse: "separate",
                  // borderSpacing: "0 6px",
                  minWidth: 800,
                }}
              >
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 200,
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : !Array.isArray(tableData) || tableData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Typography
                          sx={{
                            mt: 3,
                            textAlign: "center",
                            color: "gray",
                            fontSize: "16px",
                          }}
                        >
                          {isFilterApplied
                            ? "No records found for the selected filter."
                            : "Please apply filter to see records."}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    tableData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, idx) => (
                        <TableRow
                          key={idx}
                          sx={{
                            // "& td": { border: 0 },
                            p: 0,
                            transition: "background 0.2s",
                            // "&:hover": {
                            //   backgroundColor: "#f5f5f5",
                            // },
                          }}
                        >
                          <TableCell colSpan={7} sx={{ p: 0 }}>
                            <SupervisorServiceCard>
                              <CardContent
                                sx={{ flex: 0.5, textAlign: "center" }}
                              >
                                <Typography
                                  variant="body2"
                                  fontSize={13}
                                  noWrap
                                >
                                  {idx + 1 + page * rowsPerPage}
                                </Typography>
                              </CardContent>
                              <CardContent
                                sx={{ flex: 2, textAlign: "center" }}
                              >
                                <Typography variant="body2">
                                  {(() => {
                                    const date = new Date(row.visitor_date);
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    const hours = String(date.getHours()).padStart(2, '0');
                                    const minutes = String(date.getMinutes()).padStart(2, '0');
                                    return `${day}/${month}/${year} ${hours}:${minutes}`;
                                  })()}
                                </Typography>
                              </CardContent>
                              <CardContent
                                sx={{
                                  flex: 2,
                                  display: "flex",
                                  justifyContent: "center", // horizontally center
                                  alignItems: "center", // vertically center
                                  height: "42px", // same as card height if fixed
                                  px: 1,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  fontSize={13}
                                  noWrap
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    textAlign: "center",
                                  }}
                                >
                                  {row.prof_name || "N/A"}
                                </Typography>
                              </CardContent>

                              <CardContent
                                sx={{ flex: 2, textAlign: "center" }}
                              >
                                <Typography
                                  variant="body2"
                                  fontSize={13}
                                  noWrap
                                  sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "flex",
                                    justifyContent: "center", // ✅ center horizontally
                                    alignItems: "center", // ✅ center vertically (if needed)
                                    textAlign: "center",
                                    height: "100%", // Ensure full height for centering
                                  }}
                                >
                                  {row.ptn_name || "N/A"}
                                </Typography>
                              </CardContent>
                              <CardContent
                                sx={{ flex: 2, textAlign: "center" }}
                              >
                                <Typography
                                  variant="body2"
                                  fontSize={13}
                                  noWrap
                                >
                                  {row.ptn_no || "N/A"}
                                </Typography>
                              </CardContent>
                              <CardContent
                                sx={{ flex: 2, textAlign: "center" }}
                              >
                                <Typography
                                  variant="body2"
                                  fontSize={13}
                                  noWrap
                                >
                                  {row.prof_no}
                                </Typography>
                              </CardContent>
                              <CardContent
                                sx={{
                                  flex: 2,
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: 1,
                                }}
                              >
                                <IconButton
                                  onClick={() => handleViewClick(row)}
                                  size="small"
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleEditClick(row)}
                                  size="small"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </CardContent>
                            </SupervisorServiceCard>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </TableContainer>

          {/* Pagination (optional - update props as needed) */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0); // Reset to first page
            }}
          />
        </Box>
      ) : (
        <SupervisorVisitorForm
          isViewMode={isViewMode}
          formData={formData}
          professionalName={selectedProfessional?.label || ""}
          setFormData={setFormData}
          onBack={handleBack}
          mode={mode} // "view", "edit", or "add"
          tableData={tableData}
          selectedRow={selectedRow}
        />
      )}
      <Footer />
    </>
  );
};

export default SupervisorVisitor;
