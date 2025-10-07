import {
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CardContent,
  Typography,
  Card,
  Button,
  CircularProgress,
  Box,
  styled,
  TextField,
  MenuItem,
  InputBase,
  IconButton,
  Modal,
  AppBar,
  TablePagination,
  ListItemText,
  List,
  Paper,
  Menu,
  ClickAwayListener,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {  InputAdornment } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import HRHeader from "../../HR/HRHeader";
import HRNavbar from "../../HR/HRNavbar";
import DatePicker from "react-multi-date-picker";
import CloseIcon from "@mui/icons-material/Close";
import ClosureEvents from "./ClosureEvents";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon } from "@mui/x-date-pickers";
import axios from "axios";
import MilestoneForm from "./MilestoneForm";
import Footer from "../../../Footer";
import { createFilterOptions } from "@mui/material/Autocomplete";

const InsuranceCard = styled(Card)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "10px",
  backgroundColor: "white",
  boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
  height: "55px",
  borderRadius: "10px",
  transition: "0.5s ease-in-out",
  "&:hover": {
    backgroundColor: "#F7F7F7",
  },
});
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
const AddPhysioMiles = () => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const [selectedDates, setSelectedDates] = useState([]);
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);
  console.log(startDate, endDate, "datesssssssssssssssssss");
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  console.log(tableData, "tableData");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [eid, seteid] = useState("");
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, item } = location.state || { mode: "view", item: null };
  const [professionals, setProfessionals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);

  const [selectedProfessional, setSelectedProfessional] = useState("");
  console.log(selectedProfessional, "selectedProfessional");
  console.log(selectedProfessional, "selectedPatient");

  const [selectedPatient, setSelectedPatient] = useState(null);
  // console.log(selectedProfessional, selectedPatient, "selectedProfessional");
  const [showProfName, setShowProfName] = useState(false);
  console.log(showProfName, "showProfName");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState(null); // strictly ID for API
  console.log(
    selectedProfessionalId,
    "selectedProfessionalIdselectedProfessionalIdselectedProfessionalIdselectedProfessionalId"
  );

      const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedLabel, setSelectedLabel] = useState("");

  const filter = createFilterOptions();

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage + 1); // +1 because MUI uses 0-based index
  };

  const paginatedData = Array.isArray(tableData)
    ? tableData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      )
    : [];

  console.log(paginatedData, "paginatedData");

  const pageCount = Math.ceil(tableData.length / rowsPerPage);
  console.log(pageCount, "pageCount");

  // Assuming you have prof_id and user from context or props
  const prof_id = selectedProfessional?.srv_prof_id || null;
  console.log(prof_id, "prof_id");

  const added_by = "admin_user";

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const handleEvent = async (id) => {
    setOpenModal(true);
    seteid(id);

    try {
      const res = await fetch(
        `${port}/medical/event_wise_job_clouser_dtls/${id}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log("Closure Data.........", data);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching Manage Professional Profile Data:", error);
      setLoading(false);
      setEvents("");
    }
  };

  useEffect(() => {
    axios
      .get(`${port}/web/Physio_List_api/`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProfessionals(response.data);
          console.log("Professionals:", response.data);
        } else {
          console.error("Expected an array but got:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching professionals:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedProfessionalId) {
      axios
        .get(`${port}/web/Patient_List_api/${selectedProfessionalId}/`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setPatients(res.data);
            console.log("Patients:", res.data);
          } else {
            console.error("Invalid patient list response:", res.data);
          }
        })
        .catch((err) => console.error("Patient list API error:", err));
    }
  }, [selectedProfessionalId]);

  // const handleDateChange = (dates) => {
  //   if (!dates || dates.length === 0) {
  //     setSelectedDates([]);
  //     setStartDate(null);
  //     setEndDate(null);
  //     setTableData([]); // clear table when dates clear
  //     return;
  //   }

  //   setSelectedDates(dates);

  //   // Agar dates array me 2 dates hain toh set karo
  //   if (dates.length === 2) {
  //     // dates is array of Date objects or strings
  //     const start = dates[0];
  //     const end = dates[1];

  //     // Convert Date objects to yyyy-mm-dd string
  //     const formatDate = (date) =>
  //       typeof date === "string"
  //         ? date
  //         : new Date(date).toISOString().split("T")[0];

  //     setStartDate(formatDate(start));
  //     setEndDate(formatDate(end));
  //   } else {
  //     setStartDate(null);
  //     setEndDate(null);
  //   }

  //   setTableData([]); // reset table data on date change
  // };
  const handleDateChange = (dates) => {
    if (!dates || dates.length === 0) {
      setDateRange([]);
      setStartDate(null);
      setEndDate(null);
      setTableData([]);
      return;
    }

    setDateRange(dates);

    if (dates.length === 2) {
      setStartDate(dates[0]?.format("YYYY-MM-DD"));
      setEndDate(dates[1]?.format("YYYY-MM-DD"));
    } else if (dates.length === 1) {
      setStartDate(dates[0]?.format("YYYY-MM-DD"));
      setEndDate(dates[0]?.format("YYYY-MM-DD"));
    } else {
      setStartDate(null);
      setEndDate(null);
    }

    setTableData([]);
  };

  const handleSearch = async () => {
    try {
      const url = `${port}/web/Event_list_api/${selectedProfessionalId}/?from_date=${startDate}&to_date=${endDate}&ptn_id=${selectedPatient}`;
      const response = await axios.get(url);

      const dataArray = Array.isArray(response.data)
        ? response.data
        : [response.data];

      setTableData(dataArray);
      console.log("Response Data:", dataArray);

      if (dataArray.length > 0) {
        const item = dataArray[0];

        console.log("Selected Professional:", item);
        setSelectedProfessional(item);
        setShowProfName(true);
      } else {
        setShowProfName(false);
        setSelectedProfessional(null);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const firstEvent = selectedProfessional || tableData[0] || "N/A";

  const handleView = (eventId) => {
    alert(`Viewing event ${eventId}`);
  };

  // const SearchBtnTable = () => {
  //   setShowPatientCard(true);
  // };

  const [tempDate, setTempDate] = useState("");

  const handleAddDate = () => {
    if (tempDate && !selectedDates.includes(tempDate)) {
      setSelectedDates((prev) => [...prev, tempDate]);
      setTempDate("");
    }
  };
  const handleChange = (field, value) => {
    setTableData((prev) => ({ ...prev, [field]: value }));
  };
  const isReadOnly = mode === "view";
  const handleNavigateBack = () => {
    navigate("/hhc/physio Quality Audit");
  };

  // form submit


  const handleOpenPDF = () => {
    const pdfUrl = `${port}/media/Physiotherapy_Milestones.pdf`;
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

   const today = new Date();
  const maxDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999
  );


  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSearchClose = () => {
    setAnchorEl(null);
    setSearchTerm("");
  };

  const handleSelect = (id) => {
  const selected = professionals.find((p) => p.srv_prof_id === id);
  setSelectedProfessionalId(id);
  // setSelectedLabel(selected?.prof_fullname || "");
  setSearchTerm(""); // optional: reset search
  handleSearchClose(); // 👈 closes the menu
};

  const selectedLabel =
    professionals.find((p) => p.srv_prof_id === selectedProfessionalId)
      ?.prof_fullname || "";

  const filteredOptions = professionals.filter((option) =>
    option.prof_fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [patientAnchorEl, setPatientAnchorEl] = useState(null);
const [openPatient, setOpenPatient] = useState(false);
const [selectedPatientLabel, setSelectedPatientLabel] = useState("");

const [patientSearchTerm, setPatientSearchTerm] = useState("");

const handlePatientClick = (event) => {
  setPatientAnchorEl(event.currentTarget);
  setPatientSearchTerm(""); // reset search term on every open
  setOpenPatient(true);
};

const handlePatientSearchClose = () => {
  setOpenPatient(false);
  setPatientAnchorEl(null);
};

const handlePatientSelect = (option) => {
  setSelectedPatient(option.patient_name?.agg_sp_pt_id || "");
  setSelectedPatientLabel(option.patient_name?.name || "");
  setOpenPatient(false);
};

// normalize for safer search (remove casing and space errors)
const normalize = (str) => (str || "").toLowerCase().trim();

const filteredPatients = useMemo(() => {
  const normalizedSearch = normalize(patientSearchTerm);
  const seen = new Set();

  return patients.filter((option) => {
    const id = option.patient_name?.agg_sp_pt_id;
    const name = normalize(option.patient_name?.name);

    if (!name.includes(normalizedSearch)) return false;
    if (seen.has(id)) return false;

    seen.add(id);
    return true;
  });
}, [patients, patientSearchTerm]);

  return (
    <Box sx={{ mt: 5 }}>
      <HRNavbar />
      <Grid container spacing={1.5} p={2}>
        {/* LEFT SIDE */}
        <Grid item xs={12} md={7}>
          <Card sx={{ mb: 1, boxShadow: "none", padding: "10px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "nowrap", // prevent wrapping
                width: "100%",
                mt: 1,
                mb: 1.5,
              }}
            >
              <IconButton
                onClick={handleNavigateBack}
                size="small"
                aria-label="go back"
                sx={{
                  flexShrink: 0, // don't shrink the icon
                }}
              >
                <ArrowLeftIcon fontSize="medium" />
              </IconButton>

              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "13px", sm: "13px" },
                  whiteSpace: "nowrap", // keep text in one line
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontFamily: "Roboto, sans-serif",
                }}
              >
                Search Details
              </Typography>
            </Box>
            {/* <CardContent> */}
            <Grid container spacing={1}>
              {/* Professional Autocomplete */}
              <Grid item xs={12} sm={6} md={3}>
                {/* <Autocomplete
                  options={professionals}
                  getOptionLabel={(option) => option.prof_fullname || ""}
                  value={
                    professionals.find(
                      (p) => p.srv_prof_id === selectedProfessionalId
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    setSelectedProfessionalId(newValue?.srv_prof_id || "");
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option?.srv_prof_id === value?.srv_prof_id
                  }
                  size="small"
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Professional"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                        },
                      }}
                    />
                  )}
                /> */}
                {/* <TextField
                  select
                  label="Select Professional"
                  required
                  value={selectedProfessionalId}
                  onChange={(e) => setSelectedProfessionalId(e.target.value)}
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
                >
                  {professionals.map((option) => (
                    <MenuItem
                      key={option.srv_prof_id}
                      value={option.srv_prof_id}
                    >
                      {option.prof_fullname}
                    </MenuItem>
                  ))}
                </TextField> */}

                  <ClickAwayListener onClickAway={handleSearchClose}>
      <div>
       <TextField
  label="Select Professional"
  fullWidth
  size="small"
  required
  value={selectedLabel}
  onClick={handleClick}
  InputProps={{
    readOnly: true,
    endAdornment: selectedLabel && (
      <InputAdornment position="end">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation(); // prevent dropdown from opening
            setSelectedProfessionalId(""); // clear selected ID
            // setSelectedLabel(""); // clear label
            setSearchTerm(""); // also clear the search box if needed
          }}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      </InputAdornment>
    ),
  }}
  sx={{
    "& .MuiOutlinedInput-root": { borderRadius: "10px" },
  }}
/>

       <Menu
  anchorEl={anchorEl}
  open={open}
  onClose={handleSearchClose}
  PaperProps={{
    sx: {
      mt: "0.1em",
      zIndex: 2000,
      maxHeight: 300,
      width: anchorEl?.clientWidth || "11em",
      overflowY: "auto",
      overflowX: "hidden", // 👈 horizontal scroll hide
    },
  }}
  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
  transformOrigin={{ vertical: "top", horizontal: "left" }}
>
  <Paper sx={{ px: 1.5, pt: 1, boxShadow: "none" }}>
    <TextField
      placeholder="Search..."
      size="small"
      fullWidth={false}
      sx={{ width: "150px" }} // 👈 Custom width
      autoFocus
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </Paper>

  <List dense disablePadding>
    {filteredOptions.length > 0 ? (
      filteredOptions.map((option) => (
        <MenuItem
          key={option.srv_prof_id}
          onClick={() => handleSelect(option.srv_prof_id)}
          sx={{
            whiteSpace: "nowrap", // 👈 prevent wrapping
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <ListItemText primary={option.prof_fullname} />
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No match found</MenuItem>
    )}
  </List>
</Menu>

      </div>
    </ClickAwayListener>
              </Grid>

              {/* Patient Autocomplete */}
  <Grid item xs={12} sm={6} md={3}>
  <ClickAwayListener onClickAway={handlePatientSearchClose}>
    <div>
      <TextField
        label="Select Patient"
        fullWidth
        size="small"
        required
        value={selectedPatientLabel}
        onClick={handlePatientClick}
        InputProps={{
          readOnly: true,
          endAdornment: selectedPatientLabel && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPatient("");
                  setSelectedPatientLabel("");
                  setPatientSearchTerm("");
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
          },
        }}
      />

      <Menu
        anchorEl={patientAnchorEl}
        open={openPatient}
        onClose={handlePatientSearchClose}
        PaperProps={{
          sx: {
            mt: "0.1em",
            zIndex: 2000,
            maxHeight: 300,
            width: patientAnchorEl?.clientWidth || "11em",
            overflowY: "auto",
            overflowX: "hidden",
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Paper sx={{ px: 1.5, pt: 1, boxShadow: "none" }}>
          <TextField
            placeholder="Search..."
            size="small"
            fullWidth={false}
            sx={{ width: "150px" }}
            autoFocus
            value={patientSearchTerm}
            onChange={(e) => setPatientSearchTerm(e.target.value)}
          />
        </Paper>

        <List dense disablePadding>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((option) => (
              <MenuItem
                key={option.patient_name?.agg_sp_pt_id}
                onClick={() => handlePatientSelect(option)}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <ListItemText
  primary={option.patient_name?.name}
  primaryTypographyProps={{ noWrap: true }}
/>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No match found</MenuItem>
          )}
        </List>
      </Menu>
    </div>
  </ClickAwayListener>
</Grid>



              <Grid item xs={12} sm={6} md={3.5}>
                {/* <DatePicker
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
                /> */}
                <DatePicker
                  range
                  value={dateRange}
                  onChange={handleDateChange}
                  format="DD/MM/YYYY"
                  placeholder="Select Service Date"
                  maxDate={maxDate}
                  render={(value, openCalendar) => {
                    const formattedValue =
                      Array.isArray(value) && value[0] && value[1]
                        ? `${value[0]} - ${value[1]}`
                        : "";

                    return (
                      <TextField
                        onClick={openCalendar}
                        label="Service Date"
                        required
                        value={formattedValue}
                        placeholder="YYYY/MM/DD - YYYY/MM/DD"
                        fullWidth
                        size="small"
                        readOnly
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          textAlign: "left",
                          "& input": { fontSize: "14px" },
                        }}
                      />
                    );
                  }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSearch}
                  fullWidth
                  disableElevation
                  sx={{
                    minHeight: { xs: "36px", sm: "40px" },
                    borderRadius: "10px",
                    textTransform: "none",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    whiteSpace: "nowrap",
                    fontWeight: 600,
                    backgroundColor: "#69A5EB", // your custom color
                    "&:hover": {
                      backgroundColor: "#69A5EB", // keep same to disable hover change
                    },
                  }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
            {/* </CardContent> */}
          </Card>

          {/* Data Table */}
          <TableContainer sx={{ borderRadius: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <InsuranceCard
                    style={{
                      background: "#69A5EB",
                      color: "#FFFFFF",
                      borderRadius: "8px 10px 0 0",
                      height: "2.3em",
                    }}
                  >
                    <CardContent
                      style={{ flex: 0.7, borderRight: "1px solid #FFF" }}
                    >
                      <Typography variant="subtitle2" textAlign="center">
                        Sr. No
                      </Typography>
                    </CardContent>
                    <CardContent
                      style={{ flex: 2, borderRight: "1px solid #FFF" }}
                    >
                      <Typography variant="subtitle2" textAlign="center">
                        Event Code
                      </Typography>
                    </CardContent>
                    <CardContent
                      style={{ flex: 2, borderRight: "1px solid #FFF" }}
                    >
                      <Typography variant="subtitle2" textAlign="center">
                        Service Name
                      </Typography>
                    </CardContent>
                    <CardContent
                      style={{ flex: 2, borderRight: "1px solid #FFF" }}
                    >
                      <Typography variant="subtitle2" textAlign="center">
                        Sub Service Name
                      </Typography>
                    </CardContent>
                    <CardContent style={{ flex: 1 }}>
                      <Typography variant="subtitle2" textAlign="center">
                        Action
                      </Typography>
                    </CardContent>
                  </InsuranceCard>
                </TableRow>
              </TableHead>
              {loading ? (
                <Box sx={{ display: "flex", mt: 15, ml: 40, height: "130px" }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <TableBody>
                    {tableData.length === 0 ||
                    (tableData.length === 1 &&
                      tableData[0] === "data not found") ? (
                      <Typography
                        variant="body2"
                        // color="error"
                        fontWeight={600}
                        align="center"
                        style={{ padding: "20px" }}
                      >
                        No Data Found
                      </Typography>
                    ) : (
                      paginatedData.map((row, index) => (
                        <TableRow key={index} hover>
                          <TableCell colSpan={5} style={{ padding: 0 }}>
                            <InsuranceCard
                              style={{ height: "45px", display: "flex" }}
                            >
                              <CardContent style={{ flex: 0.5 }}>
                                <Typography variant="body2">
                                  {(currentPage - 1) * rowsPerPage + index + 1}
                                </Typography>
                              </CardContent>
                              <CardContent style={{ flex: 2 }}>
                                <Typography variant="body2" textAlign="center">
                                  {row.event_code || "N/A"}
                                </Typography>
                              </CardContent>
                              <CardContent style={{ flex: 2 }}>
                                <Typography variant="body2" textAlign="center">
                                  {row.service_name || "N/A"}
                                </Typography>
                              </CardContent>
                              <CardContent style={{ flex: 2 }}>
                                <Typography variant="body2" textAlign="center">
                                  {row.sub_service_name || "N/A"}
                                </Typography>
                              </CardContent>
                              <CardContent style={{ flex: 1 }}>
                                <Typography variant="body2" textAlign="center">
                                  <RemoveRedEyeIcon
                                    fontSize="small"
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => handleEvent(row.eve_id)}
                                  />
                                </Typography>
                              </CardContent>
                            </InsuranceCard>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>

                  {/* Pagination */}
                  <TablePagination
                    rowsPerPageOptions={[10, 20, 30, 40, 50]}
                    component="div"
                    count={tableData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 2, p: 1.1, boxShadow: "none" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box display="flex" gap={1}>
                  <Typography fontWeight={500} fontSize={13}>
                    Prof Name:
                  </Typography>

                  <Typography
                    fontWeight={600}
                    fontSize={12}
                    color="text.secondary"
                  >
                    {selectedProfessional?.prof_name ||
                      selectedProfessional?.prof_name ||
                      "N/A"}
                  </Typography>
                </Box>

              <Button
                  variant="contained"
                  size="small"
                  onClick={handleOpenPDF}
                  sx={{
                    backgroundColor: "#69A5EB",
                    "&:hover": { backgroundColor: "#69A5EB" },
                  }}
                  startIcon={<RemoveRedEyeIcon />}
                >
                  Checklist
                </Button>
              </Box>

              <Box display="flex" gap={1}>
                <Typography fontWeight={500} fontSize={13}>
                  Prof Number:
                </Typography>

                <Typography
                  fontWeight={600}
                  fontSize={12}
                  color="text.secondary"
                >
                  {selectedProfessional?.prof_phone_no ||
                    selectedProfessional?.prof_phone_no ||
                    "N/A"}
                </Typography>
              </Box>
            </Box>
          </Card>

          <MilestoneForm
            selectedDates={selectedDates}
            patientName={patientName}
            startDate={startDate}
            endDate={endDate}
            selectedPatientID={selectedPatient}
            selectedProfessional={selectedProfessional}
            selectedProfessionalId={selectedProfessionalId}
            tableData={tableData}
          />
        </Grid>
      </Grid>
      <Modal open={openModal} onClose={handleClose}>
        <Box sx={{ ...style, width: 1100, borderRadius: "10px" }}>
          <AppBar
            position="static"
            style={{
              background:
                "linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)",
              width: "72.7rem",
              height: "4rem",
              marginTop: "-16px",
              marginLeft: "-32px",
              borderRadius: "8px 10px 0 0",
            }}
          >
            <div style={{ display: "flex" }}>
              <Typography
                align="left"
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  marginTop: "4px",
                  marginLeft: "15px",
                }}
              >
                CLOSURE EVENT DETAILS
              </Typography>
              <Button
                onClick={handleClose}
                sx={{ marginLeft: "60rem", color: "#FFFFFF", marginTop: "2px" }}
              >
                <CloseIcon />
              </Button>
            </div>
          </AppBar>
          {events.length > 0 && (
            <ClosureEvents
              events={events}
              handleEvent={handleEvent}
              eid={eid}
            />
          )}
        </Box>
      </Modal>
      <Footer />
    </Box>
  );
};

export default AddPhysioMiles;
