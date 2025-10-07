import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Button,
  IconButton,
  Autocomplete,
  MenuItem,
  Menu,
  InputAdornment,
  ClickAwayListener,
  List,
  Paper,
  ListItemText,
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import { createFilterOptions } from "@mui/material/Autocomplete";
import ClearIcon from "@mui/icons-material/Clear";


function SupervisorVisitorForm({
  mode,
  formData,
  tableData,
  setFormData,
  onBack,
  selectedRow,
}) {
  useEffect(() => {
    console.log(selectedRow?.id, "selectedRowselectedRowselectedRow");
  }, [tableData]);

  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const [professionList, setProfessionList] = useState([]);
  const [patientList, setPatientList] = useState([]);

  console.log(patientList, "patientListpatientList");

  const [profId, setProfId] = useState(null);
  const [ptnId, setPtnId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  console.log(selectedPatient, "selectedPatientselectedPatient");

  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [isDatePrefilled, setIsDatePrefilled] = useState(false);

  const [errors, setErrors] = useState({
    professional: false,
    patient: false,
    dateTime: false,
  });

  const filter = createFilterOptions();

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setSeconds(0); // clean seconds for consistency
    return now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  };
  const currentDateTime = getCurrentDateTime();

  // useEffect(() => {
  //   if (
  //     (mode === "edit" || mode === "view") &&
  //     formData &&
  //     professionList.length > 0
  //   ) {
  //     const prof = professionList.find((p) => p.id === formData.prof_id);
  //     setSelectedProfessional(prof || null);
  //     setProfId(formData.prof_id); // ✅ Trigger patient fetch
  //   }
  // }, [mode, formData, professionList]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (index, type) => {
    const updatedRemarks = [...(formData.remarks || [])];
    if (!updatedRemarks[index]) {
      updatedRemarks[index] = { yes: false, no: false, remark: "" };
    }
    updatedRemarks[index].yes =
      type === "yes" ? !updatedRemarks[index].yes : false;
    updatedRemarks[index].no =
      type === "no" ? !updatedRemarks[index].no : false;
    setFormData((prev) => ({ ...prev, remarks: updatedRemarks }));
  };

  const handleRemarkChange = (index, value) => {
    const updatedRemarks = [...(formData.remarks || [])];
    if (!updatedRemarks[index]) {
      updatedRemarks[index] = { yes: false, no: false, remark: "" };
    }
    updatedRemarks[index].remark = value;
    setFormData((prev) => ({ ...prev, remarks: updatedRemarks }));
  };

  const visitDate = formData.date_time?.split("T")[0];
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${port}/hhc_admin/question_get`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();

        const mapped = data.map((q) => {
          const existingAnswer =
            (formData?.ques_dtls || []).find(
              (ans) => ans.que_id === q.que_id
            ) || {};

          return {
            que_id: q.que_id,
            question: q.question,
            yes: existingAnswer.ans === "yes",
            no: existingAnswer.ans === "no",
            remark: existingAnswer.remark || "",
          };
        });

        setFormData((prev) => ({
          ...prev,
          remarks: mapped,
        }));
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    fetchQuestions();
  }, [mode, formData?.ques_dtls]);

  const formatDateTimeForBackend = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    return dateTimeStr.replace("T", " ") + ":00";
  };

  const submitSupervisorVisit = async () => {
    const hasAnsweredQuestion =
      formData.remarks?.some((q) => q.yes || q.no) ?? false;

    const newErrors = {
      professional: !selectedProfessional || !selectedProfessional.id,
      // patient: !selectedPatient || !selectedPatient.id,
      patient: !selectedPatient || !selectedPatient.actualId,
      dateTime: !formData.date_time,
      questionCheck: !hasAnsweredQuestion,
    };

    setErrors(newErrors);

    // ✅ If question not selected, show snackbar
    if (!hasAnsweredQuestion) {
      setSnackbarMsg(
        "Please select at least one Yes or No from the questions."
      );
      setSnackbarOpen(true);
    }

    // ❌ if any field is invalid, exit
    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    // 🟢 proceed to API call
    const payload = {
      visit_id: selectedRow,
      prof_id: profId,
      ptn_id: ptnId,
      visitor_date: formatDateTimeForBackend(formData.date_time),
      que_data: formData.remarks
        .filter((r) => r.yes || r.no)
        .map((r) => ({
          que_id: r.que_id,
          ans: r.yes === true,
          remark: r.remark,
        })),
    };

    const isEditMode = mode === "edit";
    const url = isEditMode
      ? `${port}/hhc_admin/add_sup_visit/${selectedRow?.id}/`
      : `${port}/hhc_admin/add_sup_visit/`;

    try {
      const res = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("Submit success:", result);
      setSelectedPatient(result.ptn_id);
      navigate(-1);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // useEffect(() => {
  //   if ((mode === "edit" || mode === "view") && formData) {
  //     if (formData.prof_id && professionList.length > 0) {
  //       const prof = professionList.find((p) => p.id === formData.prof_id);
  //       setSelectedProfessional(prof || null);
  //       setProfId(formData.prof_id);
  //     }

  //     if (formData.ptn_id && patientList.length > 0) {
  //       const patient = patientList.find((p) => p.actualId === formData.ptn_id);
  //       setSelectedPatient(patient || null);
  //       setPtnId(formData.ptn_id);
  //     }
  //   }
  // }, [mode, formData, professionList, patientList]);

  useEffect(() => {
    if (
      (mode === "edit" || mode === "view") &&
      formData &&
      professionList.length > 0
    ) {
      const prof = professionList.find((p) => p.id === formData.prof_id);
      if (prof) {
        setSelectedProfessional(prof);
        setProfId(formData.prof_id);
      }
    }
  }, [mode, formData, professionList]);

  // useEffect(() => {
  //   const fetchPatients = async () => {
  //     if (!profId) return;

  //     try {
  //       const res = await fetch(
  //         `${port}/hhc_admin/PatientNames_get/?prof_id=${profId}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         }
  //       );
  //       const data = await res.json();

  //       const formatted = data.map((item, index) => ({
  //         id: `${item.ptn_id}_${index}`,
  //         actualId: item.ptn_id,
  //         label: item.ptn_name,
  //       }));

  //       setPatientList(formatted);

  //       // ✅ Guaranteed setting for edit/view after list fetched
  //       if ((mode === "edit" || mode === "view") && formData?.ptn_id) {
  //         const match = formatted.find((p) => p.actualId === formData.ptn_id);
  //         setSelectedPatient(match || null);
  //         setPtnId(formData.ptn_id);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching patients:", err);
  //     }
  //   };

  //   fetchPatients();
  // }, [profId]);

  // const submitSupervisorVisit = async () => {
  //   const payload = {
  //     prof_id: profId,
  //     ptn_id: ptnId,
  //     visit_date: visitDate,
  //     que_data: formData.remarks.map((r) => ({
  //       que_id: r.que_id,
  //       question: r.question,
  //       ans: r.yes === true,

  //       remark: r.remark,
  //     })),
  //   };

  //   try {
  //     const res = await fetch(`${port}/hhc_admin/add_sup_visit/`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       body: JSON.stringify(payload),
  //     });
  //     const result = await res.json();
  //     console.log("Submit success:", result);
  //     navigate(-1);
  //   } catch (err) {
  //     console.error("Submit error:", err);
  //   }
  // useEffect(() => {
  //   if ((mode === "edit" || mode === "view") && formData?.ques_dtls && formData?.remarks?.length > 0) {
  //     const mergedRemarks = formData.remarks.map((q) => {
  //       const answered = formData.ques_dtls.find((ans) => ans.que_id === q.que_id);
  //       return {
  //         ...q,
  //         yes: answered?.ans === "yes" || false,
  //         no: answered?.ans === "no" || false,
  //         remark: answered?.remark || "",
  //       };
  //     });

  //     setFormData((prev) => ({
  //       ...prev,
  //       remarks: mergedRemarks,
  //     }));
  //   }
  // }, [mode, formData?.ques_dtls, formData?.remarks]);

  // 🆕 Auto-select patient when list is ready and ptn_id is available
  useEffect(() => {
    const fetchPatients = async () => {
      if (!profId) return;

      try {
        const res = await fetch(
          `${port}/hhc_admin/PatientNames_get/?prof_id=${profId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await res.json();

        // const formatted = data.map((item, index) => ({
        //   // id: `${item.ptn_id}_${index}`,
        //   actualId: item.ptn_id,
        //   label: item.ptn_name,
        // }));
        const formatted = data.map((item, index) => ({
          id: item.ptn_id,
          actualId: item.ptn_id,
          label: item.ptn_name,
        }));

        console.log(formatted, "formattedformattedformatted");

        setPatientList(formatted);

        // // ✅ Set selected patient AFTER list is ready
        // if ((mode === "edit" || mode === "view") && formData?.ptn_id) {
        //   const match = patientList.find((p) => p.actualId === formData.ptn_id || tableData[0].ptn_id);
        //   console.log(match,'matchmatchmatch');

        //   if (match) {
        //     setSelectedPatient(match);
        //     setPtnId(formData.ptn_id);
        //   }
        // }
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    fetchPatients();
  }, [profId]);

  useEffect(() => {
    if (
      (mode === "edit" || mode === "view") &&
      formData?.ptn_id &&
      patientList.length > 0
    ) {
      const match = patientList.find(
        (p) => String(p.actualId) === String(formData.ptn_id)
      );
      console.log("Matching patient:", match);

      if (match) {
        setSelectedPatient(match);
        setPtnId(match.actualId);
      }
    }
  }, [patientList, formData?.ptn_id, mode]);

  console.log("patientID:", formData?.ptn_id);
  console.log("PatientList:", patientList);

  useEffect(() => {
    if (
      !isDatePrefilled &&
      formData?.visitor_date &&
      formData?.date_time !== formData.visitor_date.slice(0, 16)
    ) {
      setFormData((prev) => ({
        ...prev,
        date_time: formData.visitor_date.slice(0, 16),
      }));
      setIsDatePrefilled(true); // ✅ prevent future overwrite
    }
  }, [formData?.visitor_date]);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const res = await fetch(`${port}/hhc_admin/ProfessionalNames_get/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        const formatted = data.map((item) => ({
          id: item.prof_id,
          label: item.prof_name,
        }));
        setProfessionList(formatted);

        // ✅ Only set profId in add mode
        if (mode === "add" && formatted.length > 0) {
          setProfId(formatted[0].id);
        }

        // ✅ For edit/view, set selected professional
        if ((mode === "edit" || mode === "view") && formData?.prof_id) {
          const prof = formatted.find((p) => p.id === formData.prof_id);
          setSelectedProfessional(prof || null);
          setProfId(formData.prof_id);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchProfessionals();
  }, []);

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
    setProfId(option?.id || null);
    setSelectedPatient(null);
    setPtnId(null);
    setErrors((prev) => ({ ...prev, professional: false }));
    handleClose();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedProfessional(null);
    setProfId(null);
    setSelectedPatient(null);
    setPtnId(null);
    setSearchTerm("");
  };

  const filteredOptions = professionList
    .sort((a, b) => a.label.localeCompare(b.label))
    .filter((pro) =>
      pro.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

 const [openPat, setOpenPat] = useState(false);
const [anchorElPat, setAnchorElPat] = useState(null);
const [searchTermPat, setSearchTermPat] = useState("");

const handleOpenPat = (e) => {
  setAnchorElPat(e.currentTarget);
  setOpenPat(true);
};

const handleClosePat = () => setOpenPat(false);

const handleClearPat = () => {
  setSelectedPatient(null);
  setPtnId(null);
  setSearchTermPat("");
  handleClosePat();
};

const handleSelectPat = (option) => {
  setSelectedPatient(option);
  setPtnId(option?.actualId || null);
  setErrors((prev) => ({ ...prev, patient: false }));
  handleClosePat();
};

const filteredPatients = patientList.filter((option) =>
  option.label.toLowerCase().includes(searchTermPat.toLowerCase())
);

  return (
    <Box sx={{ px: 1, mt: 5 }}>
      <Card
        elevation={1}
        sx={{ mb: 2, boxShadow: "none", borderRadius: 2, mt: 5 }}
      >
        <CardContent sx={{ textAlign: "left" }}>
          <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
            <ArrowBackIosIcon
              fontSize="small"
              sx={{ color: "#3366CC", mr: 0.5, cursor: "pointer" }}
              onClick={onBack}
            />
            <Typography variant="subtitle1" fontWeight={600} color="#3366CC">
              Supervisor Visitor
            </Typography>
          </Box>

          <Grid container spacing={2} alignItems="center" flexWrap="wrap">
            <Grid item xs={12} sm={4} md={3}>
            
              {/* <TextField
                select
                label="Search Professional"
                value={selectedProfessional?.id || ""}
                onChange={(e) => {
                  const selected = professionList.find(
                    (pro) => pro.id === e.target.value
                  );
                  setSelectedProfessional(selected || null);
                  setProfId(selected?.id || null);
                  setSelectedPatient(null); // reset patient
                  setPtnId(null);
                  setErrors((prev) => ({ ...prev, professional: false }));
                }}
                fullWidth
                size="small"
                error={errors.professional}
                helperText={
                  errors.professional ? "Please select a professional" : ""
                }
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
                {[...professionList]
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((option) => (
                    <MenuItem
                      key={option.id}
                      value={option.id}
                      sx={{ fontSize: "13px" }}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
              </TextField> */}


     <ClickAwayListener onClickAway={handleClose}>
      <div>
        <TextField
          label="Search Professional"
          value={selectedProfessional?.label || ""}
          onClick={handleOpen}
          fullWidth
          size="small"
          error={errors.professional}
          helperText={
            errors.professional ? "Please select a professional" : ""
          }
          InputProps={{
            readOnly: true,
            endAdornment: selectedProfessional && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClear}>
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
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: "0.1em",
              zIndex: 2000,
              maxHeight: 200,
              width: anchorEl?.clientWidth || 200,
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
          <Paper sx={{ px: 1.5, pt: 1, boxShadow: "none" }}>
            <TextField
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              autoFocus
              fullWidth
              sx={{ mb: 1 }}
            />
          </Paper>

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
            </Grid>

            <Grid item xs={12} sm={4} md={3}>
              {/* <Autocomplete
                options={patientList}
                value={selectedPatient ?? null}
                onChange={(e, newValue) => {
                  setSelectedPatient(newValue);
                  setPtnId(newValue?.actualId || null);
                  setErrors((prev) => ({ ...prev, patient: false }));
                }}
                getOptionLabel={(option) => {
                  if (typeof option === "string") return option;
                  return option?.label || "";
                }}
                isOptionEqualToValue={(option, value) =>
                  option?.actualId === value?.actualId
                }
                filterOptions={(options, { inputValue }) => {
                  const filtered = options.filter((option) => {
                    const label = option?.label?.toLowerCase() || "";
                    return label.includes(inputValue.toLowerCase());
                  });

                  // Prioritize those starting with input
                  return filtered.sort((a, b) => {
                    const input = inputValue.toLowerCase();
                    const aLabel = a.label.toLowerCase();
                    const bLabel = b.label.toLowerCase();

                    const aStarts = aLabel.startsWith(input);
                    const bStarts = bLabel.startsWith(input);

                    if (aStarts && !bStarts) return -1;
                    if (!aStarts && bStarts) return 1;
                    return aLabel.localeCompare(bLabel); // fallback sort
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Patient"
                    placeholder="Start typing name..."
                    fullWidth
                    size="small"
                    error={errors.patient}
                    helperText={errors.patient ? "Please select a patient" : ""}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                    }}
                  />
                )}
              /> */}
              <ClickAwayListener onClickAway={handleClosePat}>
  <div>
    <TextField
      label="Search Patient"
      value={selectedPatient?.label || ""}
      onClick={handleOpenPat}
      fullWidth
      size="small"
      error={errors.patient}
      helperText={errors.patient ? "Please select a patient" : ""}
      InputProps={{
        readOnly: true,
        endAdornment: selectedPatient && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClearPat}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
    />

    <Menu
      anchorEl={anchorElPat}
      open={openPat}
      onClose={handleClosePat}
      PaperProps={{
        sx: {
          mt: "0.1em",
          zIndex: 2000,
          maxHeight: 200,
          width: anchorElPat?.clientWidth || 200,
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
      <Paper sx={{ px: 1.5, pt: 1, boxShadow: "none" }}>
        <TextField
          placeholder="Type to search..."
          value={searchTermPat}
          onChange={(e) => setSearchTermPat(e.target.value)}
          size="small"
          autoFocus
          fullWidth
          sx={{ mb: 1 }}
        />
      </Paper>

      <List dense disablePadding>
        {filteredPatients.length > 0 ? (
          filteredPatients.map((option) => (
            <MenuItem
              key={option.actualId}
              onClick={() => handleSelectPat(option)}
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
              
            </Grid>

            <Grid item xs={12} sm={4} md={3}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Visit Date & Time"
                variant="outlined"
                size="small"
                disabled={isViewMode}
                error={errors.dateTime}
                helperText={
                  errors.dateTime ? "Please select visit date and time" : ""
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  max: currentDateTime, // ✅ restrict future date/time
                }}
                value={formData.date_time || ""}
                onChange={(e) => {
                  handleChange("date_time", e.target.value);
                  setErrors((prev) => ({ ...prev, dateTime: false }));
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* QUESTIONS SECTION */}
      <Box
        sx={{
          maxHeight: "300px", // Adjust as needed
          overflowY: "auto",
          pr: 1,
          mb: 4, // Add some right padding for scrollbar
        }}
      >
        {formData.remarks && formData.remarks.length > 0 ? (
          formData.remarks.map((item, index) => (
            <Card
              key={index}
              elevation={1}
              sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: "0px 1px 4px rgba(0,0,0,0.08)",
                p: 1.5,
              }}
            >
              <Grid container spacing={2} alignItems="center" textAlign="left">
                <Grid item xs={12} md={5}>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#333",
                    }}
                  >
                    {item.question || `Question ${index + 1}`}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.yes || false}
                          disabled={isViewMode}
                          onChange={() => handleCheckboxChange(index, "yes")}
                          size="small"
                        />
                      }
                      label="Yes"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.no || false}
                          disabled={isViewMode}
                          onChange={() => handleCheckboxChange(index, "no")}
                          size="small"
                        />
                      }
                      label="No"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={12} md={5}>
                  <TextField
                    fullWidth
                    disabled={isViewMode}
                    placeholder="Remark"
                    size="small"
                    value={item.remark || ""}
                    onChange={(e) => handleRemarkChange(index, e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                    }}
                  />
                </Grid>
              </Grid>
            </Card>
          ))
        ) : (
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: "500",
              fontFamily: "Roboto",
              color: "gray",
              mt: 3,
              textAlign: "center",
            }}
          >
            Questions are not available.
          </Typography>
        )}
        {/* SUBMIT BUTTON */}
        {mode !== "view" && (
          <Box mt={3} display="flex" justifyContent="center">
            <Button
              variant="contained"
              onClick={submitSupervisorVisit}
              sx={{
                mb: 4,
                minWidth: "180px",
                height: "42px", // consistent height
                fontSize: "15px",
                borderRadius: "10px",
                backgroundColor: "#007BFF",
                textTransform: "none",
                boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                ":hover": { backgroundColor: "#0066cc" },
              }}
            >
              {mode === "edit" ? "Update" : "Submit"}
            </Button>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={4000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                onClose={() => setSnackbarOpen(false)}
                severity="warning"
                sx={{ width: "100%" }}
              >
                {snackbarMsg}
              </Alert>
            </Snackbar>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default SupervisorVisitorForm;
