import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Autocomplete,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MilestoneForm = ({
  isViewMode,
  isEditMode,
  selectedPatientID,
  selectedProfessional,
  selectedId,
  selectedDates,
  onClose,
  tableData,
  startDate,
  endDate,
  selectedProfessionalId,
  formData,
}) => {
  console.log(tableData, "tableData", startDate, endDate);
  console.log(formData, "data formDataformData");

  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const [observership, setObservership] = useState(null);
  console.log(observership, "observershipobservership");

  const [callType, setCallType] = useState("");
  const [caseDetails, setCaseDetails] = useState("");
  console.log(caseDetails, "caseDetails");

  const [observation, setObservation] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [remark, setRemark] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const isTableDataValid =
    Array.isArray(tableData) &&
    tableData.length > 0 &&
    !(tableData.length === 1 && tableData[0] === "data not found");

  const isSubmitDisabled =
    !isTableDataValid ||
    !startDate ||
    !endDate ||
    !selectedProfessional ||
    !selectedPatientID;

  console.log(
    startDate,
    endDate,
    "datesssssssssssssssssss",
    isSubmitDisabled,
    "isSubmitDisabled",
    tableData,
    "tableData",
    selectedProfessional,
    "selectedProfessional",
    selectedPatientID,
    "selectedPatientID"
  );

  const username = localStorage.getItem("user-name");

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    // Skip this block in edit mode
    if (!isEditMode) {
      if (!selectedProfessional) {
        setSnackbarText("Please select a Professional");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
      }

      if (!selectedPatientID) {
        setSnackbarText("Please select a Patient");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
      }

      if (!selectedDates) {
        setSnackbarText("Please select Dates");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
      }

      if (!Array.isArray(tableData) || tableData.length === 0) {
        setSnackbarText("Please search and select data before submitting.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
      }
    }

    const payload = {
      underwent_observership: observership,
      call_type: callType,
      patient_name: selectedPatientID,
      prof_id: selectedProfessionalId,
      case_dtls_complaints: caseDetails,
      observation,
      recommendation,
      remark,
      added_by: username,
      last_modified_by: username,
    };

    setSubmitting(true);

    try {
      if (selectedId) {
        // Edit/update
        await axios.put(
          `${port}/web/physiotherapy_milestone_update/${selectedId}/`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setSnackbarText("Updated successfully ✅");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        onClose();
      } else {
        // New submit
        await axios.post(
          `${port}/web/Physiotherapy_Milestone_Post_api/`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setSnackbarText("Form submitted successfully ✅");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        setTimeout(() => {
          navigate("/hhc/physio Quality Audit", { replace: true });
        }, 1000);
      }
    } catch (error) {
      console.error("Error submitting/updating form:", error);
      setSnackbarText("Operation failed ❌");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if ((isEditMode || isViewMode) && formData) {
      setObservership(formData?.underwent_observership || null);
      setCallType(formData?.call_type || "");
      setCaseDetails(formData?.case_dtls_complaints || "");
      setObservation(formData?.observation || "");
      setRecommendation(formData?.recommendation || "");
      setRemark(formData?.remark || "");
    }
  }, [isEditMode, isViewMode, formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!observership && !formData?.underwent_observership) {
      newErrors.observership = "This field is required";
    }

    if (!callType && !formData?.call_type) {
      newErrors.callType = "This field is required";
    }

    if (
      (!caseDetails || !caseDetails.trim()) &&
      (!formData?.case_dtls_complaints ||
        !formData?.case_dtls_complaints.trim())
    ) {
      newErrors.caseDetails = "This field is required";
    }

    if (
      (!observation || !observation.trim()) &&
      (!formData?.observation || !formData?.observation.trim())
    ) {
      newErrors.observation = "This field is required";
    }

    if (
      (!recommendation || !recommendation.trim()) &&
      (!formData?.recommendation || !formData?.recommendation.trim())
    ) {
      newErrors.recommendation = "This field is required";
    }

    if (
      (!remark || !remark.trim()) &&
      (!formData?.remark || !formData?.remark.trim())
    ) {
      newErrors.remark = "This field is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Card sx={{ p: 0, boxShadow: "none", mt: 1 }}>
      <CardContent>
        {!isEditMode && !isViewMode && (
          <Typography
            fontWeight={600}
            fontSize={14}
            fontFamily={"Roboto"}
            textAlign={"left"}
            p={1}
          >
            Quality Audit
          </Typography>
        )}

        <Grid container spacing={1.7}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Underwent Observership"
              select
              fullWidth
              size="small"
              value={observership ?? ""}
              disabled={isViewMode}
              error={!!errors.observership}
              helperText={errors.observership}
              onChange={(e) => setObservership(e.target.value)}
              // InputLabelProps={{
              //   shrink: true,
              // }}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={2}>No</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Call Type"
              select
              fullWidth
              size="small"
              // value={callType || formData.call_type}
              value={callType}
              disabled={isViewMode}
              error={!!errors.callType}
              helperText={errors.callType}
              onChange={(e) => setCallType(e.target.value)}
            >
              <MenuItem value={1}>Complain Handle</MenuItem>
              <MenuItem value={2}>Tech Interview</MenuItem>
              <MenuItem value={3}>Quality Audit</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Case Details"
              fullWidth
              size="small"
              multiline
              disabled={isViewMode} // disable in view mode
              // value={caseDetails || formData.case_dtls_complaints}
              value={caseDetails}
              error={!!errors.caseDetails}
              helperText={errors.caseDetails}
              onChange={(e) => setCaseDetails(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Observation"
              fullWidth
              size="small"
              multiline
              // value={observation || formData.observation}
              value={observation}
              disabled={isViewMode} // disable in view mode
              error={!!errors.observation}
              helperText={errors.observation}
              onChange={(e) => setObservation(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Recommendation"
              fullWidth
              size="small"
              multiline
              // value={recommendation || formData.recommendation}
              value={recommendation}
              disabled={isViewMode} // disable in view mode
              error={!!errors.recommendation}
              helperText={errors.recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Remark"
              fullWidth
              size="small"
              multiline
              // value={remark || formData.remark}
              value={remark}
              disabled={isViewMode} // disable in view mode
              error={!!errors.remark}
              helperText={errors.remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Grid>
        </Grid>

        {/* {isEditMode && ( */}
        {/* <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            disabled={!isEditMode || isSubmitDisabled}
            sx={{
              backgroundColor: !isEditMode || isSubmitDisabled ? "#ccc" : "primary.main",
              cursor: !isEditMode || isSubmitDisabled ? "not-allowed" : "pointer",
              "&:hover": {
                backgroundColor: !isEditMode || isSubmitDisabled ? "#ccc" : "primary.dark",
              },
            }}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </Grid> */}

        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          {isEditMode ? (
            <Button
              onClick={handleFormSubmit}
              variant="contained"
              sx={{
                backgroundColor: "primary.main",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              {submitting ? "Updating..." : "Update"}
            </Button>
          ) : (
            <Button
              onClick={handleFormSubmit}
              variant="contained"
              disabled={isSubmitDisabled}
              sx={{
                backgroundColor: isSubmitDisabled ? "#ccc" : "green",
                cursor: isSubmitDisabled ? "not-allowed" : "pointer",
                "&:hover": {
                  backgroundColor: isSubmitDisabled ? "#ccc" : "darkgreen",
                },
              }}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </Grid>

        {/* )} */}
      </CardContent>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Keep it open until closed manually
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarText}
        </Alert>
      </Snackbar>
    </Card>
  );
};
export default MilestoneForm;
