import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Modal,
  Autocomplete,
  CircularProgress,
  AppBar,
  TablePagination,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ClickAwayListener,
  InputAdornment,
  Menu,
  List,
  ListItemText,
  Paper,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import HRNavbar from "../../HR/HRNavbar";
import DatePicker from "react-multi-date-picker";
import StarIcon from "@mui/icons-material/Star"; // Import MUI Star Icon
import ClosureEvents from "./ClosureEvents";
import { styled } from "@mui/system";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import ClearIcon from "@mui/icons-material/Clear";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  pt: 2,
  px: 4,
  pb: 3,
};

const OngoingServiceCard = styled(Card)({
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

const Clinicalgov = () => {
  const port = process.env.REACT_APP_API_KEY;

  const accessToken = localStorage.getItem("token");
  const [tableHeight, setTableHeight] = useState("auto");
  const [openModal, setOpenModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientOptions, setPatientOptions] = useState([]);
  const [tableData, setTableData] = useState([]);

  console.log(tableData, "tableData");

  const [selectedDates, setSelectedDates] = useState([]);
  const [remarkData, setRemarkData] = useState(null);
  const [dischargeSummary, setDischargeSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [remark, setRemark] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  console.log(selectedEventId, "selectedEventIdselectedEventId");

  const [eventIDs, setEventIDs] = useState([]);
  const [eventCode, setEventCode] = useState([]);
  const [professionalID, setProfessionalID] = useState([]);
  console.log(eventCode, "eventCode");
  console.log("event_code", eventIDs);
  const [eid, seteid] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  const [showPatientCard, setShowPatientCard] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' | 'error'
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split("T")[0];
  const [patientDocuments, setPatientDocuments] = useState([]);
  const [consentForms, setConsentForms] = useState([]);

  const getFileNameFromPath = (path) => {
    return path.split("/").pop();
  };

  const handleDownload = async (filePath) => {
    const fileUrl = `${port}${filePath}`;
    const fileName = filePath.split("/").pop(); // extract file name like Big_rain_drops.png

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  useEffect(() => {
    const setDynamicHeight = () => {
      const screenHeight = window.innerHeight;
      setTableHeight(`${screenHeight * 0.5}px`);
    };
    setDynamicHeight();
    window.addEventListener("resize", setDynamicHeight);
    return () => window.removeEventListener("resize", setDynamicHeight);
  }, []);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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

  const fetchPatientList = async (dates) => {
    console.log("Calling fetchPatientList with dates:", dates);

    if (!dates || dates.length === 0) {
      console.log("No dates selected. Skipping API call.");
      return;
    }
    setLoading(true);

    try {
      const formattedDates = dates.map((date) =>
        typeof date === "string"
          ? date
          : new Date(date).toISOString().split("T")[0]
      );

      console.log("Formatted dates for API:", formattedDates);

      const response = await fetch(
        `${port}/medical/get_patient_list_by_dates`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dates: formattedDates }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API raw response:", data);

      if (Array.isArray(data)) {
        // 🔹 Remove duplicates by agg_sp_pt_id
        const uniquePatients = data.filter(
          (p, index, self) =>
            index === self.findIndex((x) => x.agg_sp_pt_id === p.agg_sp_pt_id)
        );

        setPatientOptions(uniquePatients);
      } else {
        setPatientOptions([]);
      }
    } catch (error) {
      console.error("Error fetching patient list:", error);
      setPatientOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDates.length > 0) {
      fetchPatientList(selectedDates); // selectedDates is now correctly formatted
    }
  }, [selectedDates]);

  const handleDateChange = (dates) => {
    console.log("Selected range:", dates);

    if (!dates || dates.length === 0) {
      setSelectedDates([]);
      setTableData([]); // ✅ Clears tableData when dates are cleared
      return;
    }

    setTableData([]); // ✅ Clears tableData on every date change

    const [start, end] = dates;
    if (!start || !end) return;

    setSelectedDates([start, end]);
    setSelectedPatient(null); // Optionally reset patient
  };

  // Search API
  const SearchBtnTable = async () => {
    if (!selectedPatient?.agg_sp_pt_id || selectedDates.length === 0) {
      console.warn("No patient selected or dates are empty.");
      setShowPatientCard(false); // Ensure card is hidden if validation fails
      return;
    }

    try {
      // Format the selected dates to YYYY-MM-DD
      const formattedDates = selectedDates.map((date) =>
        typeof date === "string"
          ? date
          : new Date(date).toISOString().split("T")[0]
      );

      const payload = {
        agg_sp_pt_id: selectedPatient.agg_sp_pt_id,
        dates: formattedDates,
      };

      console.log("📦 Request Payload:", payload);

      const response = await fetch(`${port}/medical/get_event_by_patient`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Server Error ${response.status}:`, errorText);
        setShowPatientCard(false);
        return;
      }

      const result = await response.json();
      console.log("✅ API Response:", result);

      const {
        patient_events: patientEvents = [],
        concent_forms: consentForms = [],
        patient_document: patientDocs = [],
        medical_governance_remark: governanceRemark = null,
      } = result;

      const patientDocuments = Array.isArray(result.patient_document)
        ? result.patient_document
        : result.patient_document
        ? [result.patient_document]
        : [];

      setPatientDocuments(patientDocuments);

      const uniquePatientEvents = patientEvents.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.eve_id === value.eve_id)
      );

      const eventTableData = uniquePatientEvents.map(
        ({ eve_id, eve_poc_id }) => ({
          event_id: eve_id,
          event_code: eve_poc_id?.event_code || "",
          srv_id: eve_poc_id?.srv_id || "",
          sub_srv_id: eve_poc_id?.sub_srv_id || "",
          ratings: eve_poc_id?.ratings ?? null,
        })
      );

      setEventCode(eventTableData[0]?.event_code);

      //Fetching Professional ID
      const professionalDetails = patientEvents.flatMap(
        (event) =>
          event.prof_ids?.map((prof) => ({
            prof_id: prof.prof_id,
            prof_name: prof.prof_name,
          })) || []
      );

      setProfessionalID(professionalDetails);
      console.log("👨‍⚕️ Professional IDs:", professionalDetails);

      console.log("📊 Mapped Event Data:", eventTableData);
      console.log("📝 Governance Remark:", governanceRemark);
      console.log("📄 Consent Form:", consentForms[0] || null);

      setTableData(eventTableData);
      setRemarkData(governanceRemark);
      setDischargeSummary(consentForms[0] || null);
      setEventIDs(uniquePatientEvents.map((event) => event.eve_id));

      setShowPatientCard(true);
    } catch (err) {
      console.error("💥 Error fetching event data:", err);

      setTableData([]);
      setRemarkData(null);
      setDischargeSummary(null);
      setEventIDs([]);

      setShowPatientCard(false);
    }
  };

  // 🔹 Utility to flatten patient documents into label + url pairs
  const flattenPatientDocuments = (patientDocuments) => {
    const docs = [];

    patientDocuments.forEach((doc) => {
      if (Array.isArray(doc.discharge_summary)) {
        doc.discharge_summary.forEach((url) =>
          docs.push({ label: "Discharge Summary", url })
        );
      }
      if (Array.isArray(doc.prescription) || Array.isArray(doc.prescriptions)) {
        (doc.prescription || doc.prescriptions).forEach((url) =>
          docs.push({ label: "Prescription", url })
        );
      }
      if (Array.isArray(doc.dressing)) {
        doc.dressing.forEach((url) => docs.push({ label: "Dressing", url }));
      }
      if (Array.isArray(doc["lab reports"]) || Array.isArray(doc.lab_reports)) {
        (doc["lab reports"] || doc.lab_reports).forEach((url) =>
          docs.push({ label: "Lab Report", url })
        );
      }
    });

    return docs;
  };

  const handleSubmit = async () => {
    console.log("Selected patient:", selectedPatient);
    console.log("Remark:", remark);
    console.log("Trying to submit:", selectedPatient?.agg_sp_pt_id, remark);

    if (!selectedPatient?.agg_sp_pt_id || !remark.trim()) {
      setSnackbarMessage("Please select a patient and enter a remark.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${port}/medical/add_feedback_medical_gov`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          agg_sp_pt_id: selectedPatient.agg_sp_pt_id,
          remark: remark,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Feedback submitted:", data);
      setSnackbarMessage("Remark submitted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setRemark("");
      await SearchBtnTable();
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setSnackbarMessage("Failed to submit feedback.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  ////////////////////////////// FEEDBACK FROM HD
  const [tabValue, setTabValue] = useState("patient");
  const [feedbackDataState, setFeedbackDataState] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState("");

  console.log(feedbackDataState, "fetched Data");

  useEffect(() => {
    if (professionalID.length > 0) {
      setSelectedDropdownValue(
        professionalID[professionalID.length - 1].prof_id
      );
    }
  }, [professionalID]);

  const [dropdownError, setDropdownError] = useState("");

  useEffect(() => {
    const fetchProfessionalData = async () => {
      try {
        let eventIdToUse = null;

        if (Array.isArray(eventIDs) && eventIDs.length > 0) {
          eventIdToUse = eventIDs[eventIDs.length - 1];
        }

        if (selectedEventId !== null) {
          eventIdToUse = selectedEventId;
        }

        if (eventIdToUse) {
          const response = await fetch(
            `${port}/web/Prof_names_eve_wise/${eventIdToUse}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const data = await response.json();
          setOptions(data);
        }
      } catch (error) {
        console.error("Error fetching professional data:", error);
      }
    };

    fetchProfessionalData();
  }, [port, eventIDs, selectedEventId, accessToken]);

  const handleChange = (event) => {
    setSelectedDropdownValue(event.target.value);
    setDropdownError("");
  };

  // const fetchFeedbackData = async () => {
  //   try {
  //     const profIdToUse = selectedDropdownValue || (Array.isArray(professionalID) ? professionalID[0] : '') || '';

  //     let eventIDtoSave = '';
  //     if (selectedEventId) {
  //       eventIDtoSave = selectedEventId;
  //     } else if (Array.isArray(eventIDs) && eventIDs.length > 0) {
  //       eventIDtoSave = eventIDs[eventIDs.length - 1];
  //     } else if (typeof eventIDs === 'string' || typeof eventIDs === 'number') {
  //       eventIDtoSave = eventIDs;
  //     }

  //     if (!eventIDtoSave || !selectedPatient?.agg_sp_pt_id || !profIdToUse) {
  //       console.warn("Missing required params for fetchFeedbackData");
  //       return;
  //     }

  //     const response = await fetch(
  //       `${port}/medical/save_feedback_QA/?eve_id=${eventIDtoSave}&ptn_id=${selectedPatient.agg_sp_pt_id}&prof_id=${profIdToUse}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();

  //       const feedbackEvents = data.events || [];
  //       setFeedbackDataState(feedbackEvents);
  //       setDocumentList(data.docs ? [data.docs] : []);

  //       const selectedAnswersFromData = {};
  //       const textInputsFromData = {};
  //       let profId = '';

  //       feedbackEvents.forEach((item) => {
  //         selectedAnswersFromData[item.f_questions] = item.answer;
  //         textInputsFromData[item.f_questions] = '';
  //         if (item.prof_id) {
  //           profId = item.prof_id;
  //         }
  //       });
  //     } else {
  //       console.error("Failed to fetch feedback data:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching feedback data:", error);
  //     setFeedbackDataState([]);
  //   }
  // };

  const fetchFeedbackData = async (incomingEventId) => {
    try {
      const profIdToUse =
        selectedDropdownValue ||
        (Array.isArray(professionalID) ? professionalID[0] : "") ||
        "";

      const eventIDtoSave =
        incomingEventId ||
        selectedEventId ||
        (Array.isArray(eventIDs) ? eventIDs[eventIDs.length - 1] : "") ||
        "";

      if (!eventIDtoSave || !selectedPatient?.agg_sp_pt_id || !profIdToUse) {
        console.warn("Missing required params for fetchFeedbackData");
        return;
      }

      const response = await fetch(
        `${port}/medical/save_feedback_QA/?eve_id=${eventIDtoSave}&ptn_id=${selectedPatient.agg_sp_pt_id}&prof_id=${profIdToUse}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        const feedbackEvents = data.events || [];
        setFeedbackDataState(feedbackEvents);
        setDocumentList(data.docs ? [data.docs] : []);

        const selectedAnswersFromData = {};
        const textInputsFromData = {};

        feedbackEvents.forEach((item) => {
          selectedAnswersFromData[item.f_questions] = item.answer;
          textInputsFromData[item.f_questions] = "";
        });
      } else {
        console.error("Failed to fetch feedback data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching feedback data:", error);
      setFeedbackDataState([]);
    }
  };

  useEffect(() => {
    if (selectedDropdownValue) {
      fetchFeedbackData();
    }
  }, [selectedDropdownValue]);

  // const [patientAnchorEl, setPatientAnchorEl] = useState(null);
  const [patientAnchorEl, setPatientAnchorEl] = useState(null);
  const [openPatient, setOpenPatient] = useState(false);
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [selectedPatientLabel, setSelectedPatientLabel] = useState("");
  console.log("Selected Patient Label:", selectedPatientLabel);
  const filteredPatients = patientOptions.filter((option) =>
    option.name?.toLowerCase().includes(patientSearchTerm.toLowerCase())
  );

  // 🔹 Handlers
  const handlePatientClick = (event) => {
    setPatientAnchorEl(event.currentTarget);
    setOpenPatient(true);
  };

  const handlePatientSearchClose = () => {
    setOpenPatient(false);
    setPatientAnchorEl(null);
  };

  const handlePatientSelect = (option) => {
    setSelectedPatient(option);
    setSelectedPatientLabel(option.name || "");
    setOpenPatient(false);

    // Show patient card
    setShowPatientCard(true);

    // Reset dependent data
    setProfessionalID([]);
    setFeedbackDataState([]);
    setRemarkData(null);
    setDocumentList([]);
    setDischargeSummary(null);
    setConsentForms([]);
    setPatientDocuments([]);
    setExpandedAccordion(false);
    setTableData([]);
    setRemark("");

    // Fetch patient-specific data
    SearchBtnTable(option);
  };
  return (
    <div style={{ fontFamily: "Roboto, sans-serif" }}>
      <HRNavbar />
      <Box sx={{ flexGrow: 1, p: 1, marginTop: "1em" }}>
        <Grid container spacing={1}>
          {/* Search and Patient Details */}
          <Grid item xs={12} md={7}>
            <Card sx={{ textAlign: "left" }}>
              <CardContent>
                <Typography
                  // variant="h9"
                  fontWeight={500}
                  gutterBottom
                  sx={{
                    // mb: 1,
                    fontSize: "14px",
                    fontWeight: "600",
                    fontFamily: "Roboto",
                  }}
                >
                  Search Patient Details
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6} md={5}>
                    <DatePicker
                      value={selectedDates.length === 2 ? selectedDates : null}
                      onChange={(newDates) => {
                        handleDateChange(newDates);
                      }}
                      format="YYYY/MM/DD"
                      placeholder="Select Dates"
                      style={{
                        width: "90%",
                        maxWidth: "300px",
                        minWidth: "250px",
                        height: "35px",
                        fontSize: "15px",
                      }}
                      disableFuture={true}
                      renderInput={(props) => (
                        <TextField {...props} variant="outlined" fullWidth />
                      )}
                      range
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={5}>
                    {/* old code */}
                    {/* <Autocomplete
                      options={patientOptions}
                      value={selectedPatient}
                      groupBy={(option) => option.date}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) =>
                        option?.agg_sp_pt_id === value?.agg_sp_pt_id
                      }
                      loading={loading}
                      onChange={(event, newValue) => {
                        setSelectedPatient(newValue);
                        setShowPatientCard(!!newValue);

                        // 🔹 Always reset old data when switching patient
                        setProfessionalID([]);
                        setFeedbackDataState([]);
                        setRemarkData(null);
                        setDocumentList([]);
                        setDischargeSummary(null);
                        setConsentForms([]);
                        setPatientDocuments([]);
                        setExpandedAccordion(false);
                        setTableData([]); // clear old table
                        setRemark(""); // clear remark input

                        // 🔹 Optional: auto-fetch table for the new patient
                        if (newValue) {
                          SearchBtnTable(newValue);
                        }

                        console.log("Selected patient:", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Patient Name"
                          placeholder="Search"
                          size="small"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loading ? (
                                  <CircularProgress size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      clearOnEscape
                    /> */}

                    <ClickAwayListener onClickAway={handlePatientSearchClose}>
                      <div>
                        {/* Main Input */}
                        <TextField
                          label="Patient Name"
                          fullWidth
                          size="small"
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
                                    setSelectedPatient(null);
                                    setSelectedPatientLabel("");
                                    setPatientSearchTerm("");
                                    setShowPatientCard(false);

                                    // Reset dependent states
                                    setProfessionalID([]);
                                    setFeedbackDataState([]);
                                    setRemarkData(null);
                                    setDocumentList([]);
                                    setDischargeSummary(null);
                                    setConsentForms([]);
                                    setPatientDocuments([]);
                                    setExpandedAccordion(false);
                                    setTableData([]);
                                    setRemark("");
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

                        {/* Dropdown Menu */}
                        <Menu
                          anchorEl={patientAnchorEl}
                          open={openPatient}
                          onClose={handlePatientSearchClose}
                          PaperProps={{
                            sx: {
                              mt: "0.1em",
                              zIndex: 2000,
                              maxHeight: 300,
                              width: patientAnchorEl?.clientWidth || "15em",
                              overflowY: "auto",
                              overflowX: "hidden",
                            },
                          }}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                        >
                          {/* Search Box */}
                          <Paper sx={{ px: 1.5, pt: 1, boxShadow: "none" }}>
                            <TextField
                              placeholder="Search..."
                              size="small"
                              fullWidth
                              autoFocus
                              value={patientSearchTerm}
                              onChange={(e) =>
                                setPatientSearchTerm(e.target.value)
                              }
                            />
                          </Paper>

                          {/* Options */}
                          <List dense disablePadding>
                            {filteredPatients.length > 0 ? (
                              filteredPatients.map((option) => (
                                <MenuItem
                                  key={option.agg_sp_pt_id}
                                  onClick={() => handlePatientSelect(option)}
                                  sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  <ListItemText
                                    primary={option.name}
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
                  <Grid item xs={12} sm={12} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#69A5EB",
                        fontWeight: 500,
                        "&:hover": { backgroundColor: "#4d8ad4" },
                      }}
                      onClick={SearchBtnTable} // 👈 bind this handler
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "600",
                    fontFamily: "Roboto",
                    margin: 1,
                  }}
                >
                  Patient Details
                </Typography>
              </Grid>

              <Grid container p={1}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#767676",
                        fontFamily: "Roboto",
                        fontWeight: "400",
                        minWidth: "60px",
                        textAlign: "left",
                      }}
                    >
                      Name:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#363636",
                        fontFamily: "Roboto",
                        fontWeight: "500",
                        marginLeft: "4px",
                      }}
                    >
                      {showPatientCard ? selectedPatient?.name || "" : ""}
                    </Typography>
                  </Box>
                </Grid>

                {/* Contact */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#767676",
                        minWidth: "60px",
                        fontFamily: "Roboto",
                        fontWeight: "400",
                        textAlign: "left",
                      }}
                    >
                      Contact:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#363636",
                        fontFamily: "Roboto",
                        fontWeight: "500",
                        marginLeft: "4px",
                      }}
                    >
                      {showPatientCard ? selectedPatient?.phone_no || "" : ""}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#767676",
                        minWidth: "60px",
                        fontFamily: "Roboto",
                        fontWeight: "400",
                        textAlign: "left",
                      }}
                    >
                      Age:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#363636",
                        fontFamily: "Roboto",
                        fontWeight: "500",
                        marginLeft: "4px",
                      }}
                    >
                      {showPatientCard ? selectedPatient?.Age || "" : ""}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#767676",
                        minWidth: "60px",
                        fontFamily: "Roboto",
                        fontWeight: "400",
                        textAlign: "left",
                      }}
                    >
                      Caller Number:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#363636",
                        fontFamily: "Roboto",
                        fontWeight: "500",
                        marginLeft: "4px",
                      }}
                    >
                      {showPatientCard
                        ? selectedPatient?.caller_id?.phone || ""
                        : ""}
                    </Typography>
                  </Box>
                </Grid>

                {/* Address */}
                <Grid item xs={12} sx={{ mt: 0.1 }}>
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#767676",
                        minWidth: "60px",
                        fontFamily: "Roboto",
                        fontWeight: "400",
                        textAlign: "left",
                      }}
                    >
                      Address:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#363636",
                        fontFamily: "Roboto",
                        fontWeight: "500",
                        marginLeft: "4px",
                      }}
                    >
                      {showPatientCard
                        ? selectedPatient?.google_address || ""
                        : ""}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Tables on Left Side */}
          <Grid item xs={12} md={7} sm={12}>
            <TableContainer
              style={{ height: tableHeight }}
              sx={{
                height:
                  tableData.length === 0 || tableData.length < 5
                    ? "50vh"
                    : "default",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <OngoingServiceCard
                      style={{
                        background: "#69A5EB",
                        color: "#FFFFFF",
                        borderRadius: "8px 10px 0 0",
                      }}
                    >
                      <CardContent
                        style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2" textAlign="center">
                          Sr. No
                        </Typography>
                      </CardContent>
                      <CardContent
                        style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2" textAlign="center">
                          Event Code
                        </Typography>
                      </CardContent>
                      {/* <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Professional</Typography>
                                    </CardContent> */}
                      <CardContent
                        style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2">
                          Service Name
                        </Typography>
                      </CardContent>

                      <CardContent
                        style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2">
                          Sub Service Name
                        </Typography>
                      </CardContent>
                      <CardContent style={{ flex: 1 }}>
                        <Typography variant="subtitle2">Action</Typography>
                      </CardContent>
                    </OngoingServiceCard>
                  </TableRow>
                </TableHead>
                {loading ? (
                  <Box
                    sx={{ display: "flex", mt: 10, ml: 40, height: "130px" }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableBody>
                    {tableData.length === 0 ? (
                      <TableRow>
                        <CardContent>
                          <Typography variant="body2">
                            No Data Available
                          </Typography>
                        </CardContent>
                      </TableRow>
                    ) : (
                      tableData
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              console.log("Sending event ID:", row.event_id);
                              setSelectedEventId(row.event_id); // ← Save to a state variable if needed
                              fetchFeedbackData(row.event_id);
                            }}
                          >
                            <OngoingServiceCard style={{ height: "60px" }}>
                              <CardContent style={{ flex: 0.5 }}>
                                <Typography variant="body2">
                                  {index + 1 + page * rowsPerPage}
                                </Typography>
                              </CardContent>
                              <CardContent style={{ flex: 2 }}>
                                <Typography variant="body2" textAlign="center">
                                  {row.event_code}
                                </Typography>
                              </CardContent>
                              <CardContent style={{ flex: 1.5 }}>
                                <Typography variant="body2" textAlign="center">
                                  {row.srv_id}
                                </Typography>
                              </CardContent>
                              <CardContent style={{ flex: 2 }}>
                                <Typography variant="body2" textAlign="center">
                                  {row.sub_srv_id}
                                </Typography>
                              </CardContent>

                              <CardContent
                                style={{ flex: 1, cursor: "pointer" }}
                              >
                                <Typography variant="body2" textAlign="center">
                                  <RemoveRedEyeIcon
                                    onClick={() => handleEvent(row.event_id)}
                                  />
                                </Typography>
                              </CardContent>
                            </OngoingServiceCard>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                )}
              </Table>
            </TableContainer>

            <Grid item xs={12} mt={2}>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Add Remark"
                    size="small"
                    // InputProps={{
                    //   startAdornment: (
                    //     <InputAdornment position="start">
                    //       <AddIcon />
                    //     </InputAdornment>
                    //   ),
                    // }}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="medium"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                      backgroundColor: "#69A5EB",
                      fontWeight: 500,
                      "&:hover": { backgroundColor: "#4d8ad4" },
                    }}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>

                  <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                  >
                    <Alert
                      onClose={() => setSnackbarOpen(false)}
                      severity={snackbarSeverity}
                      sx={{ width: "100%" }}
                    >
                      {snackbarMessage}
                    </Alert>
                  </Snackbar>
                </Grid>
              </Grid>
            </Grid>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>

          {/* Feedback and Clinical Governance on Left Side */}
          <Grid item xs={10} md={5}>
            <Accordion
              expanded={expandedAccordion === "feedback"}
              onChange={handleAccordionChange("feedback")}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  gutterBottom
                  textAlign="left"
                  sx={{
                    fontFamily: "Roboto",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  Feedback
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {professionalID.length > 0 && (
                  <Grid
                    container
                    spacing={2}
                    sx={{ mb: 2, p: 1, borderBottom: "1px solid #eee" }}
                  >
                    {feedbackDataState.length > 0 && (
                      <Grid
                        container
                        spacing={2}
                        sx={{ mb: 2, p: 1, borderBottom: "1px solid #eee" }}
                      >
                        <Grid item xs={12} md={5}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                              sx={{ fontSize: "14px" }}
                              textAlign="left"
                            >
                              Feedback From:
                            </Typography>
                            <Typography
                              sx={{ fontSize: "14px", fontWeight: "bold" }}
                            >
                              {feedbackDataState[0].Feedback_Source}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                              sx={{ fontSize: "14px" }}
                              textAlign="left"
                            >
                              Added By:
                            </Typography>
                            <Typography
                              sx={{ fontSize: "14px", fontWeight: "bold" }}
                            >
                              {feedbackDataState[0].added_by || "N/A"}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={7}>
                          <Box display="flex" gap={1}>
                            <Typography sx={{ fontSize: "14px" }}>
                              Event Code:
                            </Typography>
                            <Typography
                              sx={{ fontSize: "14px", fontWeight: "bold" }}
                            >
                              {eventCode || "Unknown"}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography sx={{ fontSize: "14px" }}>
                              Added Date:
                            </Typography>
                            <Typography
                              sx={{ fontSize: "14px", fontWeight: "bold" }}
                            >
                              {new Date(
                                feedbackDataState[0].added_date
                              ).toLocaleString()}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    )}

                    <Box>
                      <CardContent>
                        {tabValue === "patient" && (
                          <Grid container spacing={2} sx={{ marginTop: "1px" }}>
                            <FormControl
                              sx={{ width: "300px", marginLeft: "1em" }}
                            >
                              <InputLabel id="dropdown-label">
                                Prof Name *
                              </InputLabel>
                              <Select
                                value={selectedDropdownValue}
                                label="Select Option"
                                onChange={handleChange}
                                size="small"
                              >
                                {options.map((option) => (
                                  <MenuItem
                                    key={option.srv_prof_id}
                                    value={option.srv_prof_id}
                                  >
                                    {option.prof_name}
                                  </MenuItem>
                                ))}
                              </Select>
                              {dropdownError && (
                                <Typography variant="caption" color="red">
                                  {dropdownError}
                                </Typography>
                              )}
                            </FormControl>

                            {feedbackDataState.map((item, index) => (
                              <Grid
                                key={index}
                                item
                                lg={12}
                                sm={12}
                                xs={12}
                                sx={{ textAlign: "left", pl: 2 }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{ fontSize: "16px", textAlign: "left" }}
                                >
                                  Q{index + 1}: {item.f_questions}
                                </Typography>

                                {!item.f_questions
                                  .toLowerCase()
                                  .includes("rating") && (
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      fontSize: "15px",
                                      fontWeight: "bold",
                                      mb: 1,
                                      textAlign: "left",
                                    }}
                                  >
                                    {item.answer}
                                  </Typography>
                                )}

                                {/* Show stars if it's a rating question and answer is a number */}
                                {item.f_questions
                                  .toLowerCase()
                                  .includes("rating") &&
                                  !isNaN(item.answer) && (
                                    <Box sx={{ display: "flex", mb: 2 }}>
                                      {[...Array(5)].map((_, starIndex) =>
                                        starIndex <
                                        Math.round(Number(item.answer)) ? (
                                          <StarIcon
                                            key={starIndex}
                                            sx={{
                                              color: "#FFD700",
                                              fontSize: "20px",
                                            }}
                                          />
                                        ) : (
                                          <StarIcon
                                            key={starIndex}
                                            sx={{
                                              color: "#e0e0e0",
                                              fontSize: "20px",
                                            }}
                                          />
                                        )
                                      )}
                                    </Box>
                                  )}
                              </Grid>
                            ))}

                            {documentList.length > 0 ? (
                              documentList.map((doc, index) => (
                                <Box key={index} sx={{ mb: 3 }}>
                                  {/* Image Section */}
                                  {doc.images && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{ mr: 1 }}
                                      >
                                        Image:
                                      </Typography>

                                      {/* View Button */}
                                      <IconButton
                                        component="a"
                                        href={`http://122.176.232.35:8008${doc.images}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="View Image"
                                      >
                                        <VisibilityIcon />
                                      </IconButton>

                                      {/* Download Button */}
                                      <IconButton
                                        onClick={() =>
                                          handleDownload(doc.images)
                                        }
                                        title="Download Image"
                                      >
                                        <DownloadIcon />
                                      </IconButton>
                                    </Box>
                                  )}

                                  {/* Video Section */}
                                  {doc.video && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{ mr: 1 }}
                                      >
                                        Video:
                                      </Typography>

                                      {/* View Button */}
                                      <IconButton
                                        component="a"
                                        href={`http://122.176.232.35:8008${doc.video}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="View Video"
                                      >
                                        <VisibilityIcon />
                                      </IconButton>

                                      {/* Download Button */}
                                      <IconButton
                                        onClick={() =>
                                          handleDownload(doc.video)
                                        }
                                        title="Download Video"
                                      >
                                        <DownloadIcon />
                                      </IconButton>
                                    </Box>
                                  )}
                                </Box>
                              ))
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  marginTop: "1em",
                                  paddingLeft: "2em",
                                }}
                              >
                                <Typography variant="body2">
                                  No Feedback found.
                                </Typography>
                              </Box>
                            )}
                          </Grid>
                        )}
                      </CardContent>
                    </Box>
                  </Grid>
                )}
              </AccordionDetails>
            </Accordion>

            <Box sx={{ mt: 2 }}></Box>
            <Accordion
              expanded={expandedAccordion === "remark"}
              onChange={handleAccordionChange("remark")}
              sx={{ mt: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  sx={{
                    fontFamily: "Roboto",
                    fontWeight: 600,
                    fontSize: { xs: "13px", sm: "16px", md: "14px" }, // Responsive font size for header
                    textAlign: "left",
                    // textTransform: "uppercase",
                    letterSpacing: "0%",
                  }}
                >
                  Clinical Governance Remark
                </Typography>
              </AccordionSummary>
              {remarkData && (
                <AccordionDetails>
                  <Grid container spacing={1}>
                    {/* Left Column for "Added By" */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: "#767676",
                            minWidth: "60px",
                            fontFamily: "Roboto",
                            fontWeight: "400",
                            textAlign: "left",
                          }}
                        >
                          Added By:
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: "#363636",
                            fontFamily: "Roboto",
                            fontWeight: "500",
                            marginLeft: "4px",
                          }}
                        >
                          {remarkData?.added_by || "N/A"}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: "#767676",
                            minWidth: "60px",
                            fontFamily: "Roboto",
                            fontWeight: "400",
                            textAlign: "left",
                          }}
                        >
                          Date:
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: "#363636",
                            fontFamily: "Roboto",
                            fontWeight: "500",
                            marginLeft: "4px",
                          }}
                        >
                          {remarkData?.added_date &&
                          !isNaN(new Date(remarkData.added_date))
                            ? new Date(
                                remarkData.added_date
                              ).toLocaleDateString()
                            : "-"}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: "#767676",
                            minWidth: "60px",
                            fontFamily: "Roboto",
                            fontWeight: "400",
                            textAlign: "left",
                          }}
                        >
                          Remark:
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: "#363636",
                            fontFamily: "Roboto",
                            fontWeight: "500",
                            marginLeft: "4px",
                          }}
                        >
                          {remarkData?.remark || "No remark available"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              )}
            </Accordion>

            <Accordion
              sx={{ mt: 2 }}
              expanded={expandedAccordion === "discharge"}
              onChange={handleAccordionChange("discharge")}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  sx={{
                    fontFamily: "Roboto",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  Discharge Summary
                </Typography>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  maxHeight: 250,
                  overflowY: "auto",
                  padding: 2,
                  bgcolor: "#fff", // ✅ White background for collapse body
                  borderTop: "1px solid #e0e0e0", // subtle divider
                }}
              >
                <Grid container spacing={2}>
                  {/* 🔹 Map through each document type */}
                  {[
                    { label: "Discharge Summary", key: "discharge_summary" },
                    { label: "Prescription", key: "prescription" },
                    { label: "Dressing", key: "dressing" },
                    { label: "Lab Reports", key: "lab reports" },
                  ].map(
                    (docType, index) =>
                      patientDocuments?.[0]?.[docType.key]?.length > 0 && (
                        <Grid
                          container
                          item
                          key={index}
                          alignItems="center"
                          spacing={1}
                          sx={{ mb: 1 }}
                        >
                          {/* Left Side - Label */}
                          <Grid item xs={12} md={4}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                fontFamily: "Roboto",
                                fontSize: "14px",
                              }}
                            >
                              {docType.label}
                            </Typography>
                          </Grid>

                          {/* Right Side - Files in a Row */}
                          <Grid item xs={12} md={8}>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                              {patientDocuments[0][docType.key].map(
                                (url, idx) => (
                                  <Box
                                    key={idx}
                                    display="flex"
                                    alignItems="center"
                                    gap={0.5}
                                    sx={{
                                      backgroundColor: "#f1f5f9",
                                      borderRadius: "8px",
                                      padding: "4px 8px",
                                      marginRight: "4px",
                                    }}
                                  >
                                    {/* ✅ Show actual file name */}
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        maxWidth: "150px", // prevent overflow
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                      title={url.split("/").pop()} // full name on hover
                                    >
                                      {url.split("/").pop()}
                                    </Typography>

                                    {/* View */}
                                    <Button
                                      href={`${port}${url}`}
                                      target="_blank"
                                      size="small"
                                      sx={{
                                        minWidth: 35,
                                        padding: "2px",
                                        color: "#69A5EB",
                                      }}
                                    >
                                      <VisibilityIcon fontSize="small" />
                                    </Button>

                                    {/* Download */}
                                    <Button
                                      onClick={() => handleDownload(url)}
                                      size="small"
                                      sx={{
                                        minWidth: 35,
                                        padding: "2px",
                                        color: "#69A5EB",
                                      }}
                                    >
                                      <DownloadIcon fontSize="small" />
                                    </Button>
                                  </Box>
                                )
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      )
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Box>

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
          <ClosureEvents
            events={events}
            handleEvent={handleEvent}
            eid={eid}
            handleSubmit={handleSubmit}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default Clinicalgov;
