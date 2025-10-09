import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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

    const question_and_marks = [];
    data.forEach((item, i) => {
      question_and_marks.push({
        question_id: item.id ?? i + 1,
        marks: Number(item.marks) || 0,
      });
    });;

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
      question_and_marks: question_and_marks,
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

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${port}/web/clinical_evaluation_get/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [accessToken]);

  // const handleMarksChange = (index, value) => {
  //   let num = Number(value);

  //   if ((num >= 0 && num <= 10) || value === "") {
  //     const updatedData = [...data];
  //     updatedData[index].marks = value;
  //     setData(updatedData);
  //   }
  // };

  // Inside your component
  useEffect(() => {
    if (formData?.question_and_marks) {
      const mappedData = formData.question_and_marks.map(item => {
        const question = data.find(q => q.id === item.question_id);
        return {
          ...item,
          parameter: question ? question.parameter : `Fetching...`,
          marks: item.marks ?? "",
        };
      });
      setData(mappedData);
    }
  }, [formData]);

  const handleMarksChange = (index, value) => {
    const num = Number(value);
    if ((num >= 0 && num <= 10) || value === "") {
      setData(prevData => {
        const updatedData = [...prevData];
        updatedData[index] = {
          ...updatedData[index],
          marks: value === "" ? "" : num,
        };
        return updatedData;
      });
    }
  };

  return (
    <Card sx={{ p: 0, boxShadow: "none", mt: 1 }}>
      <CardContent
        sx={{
          maxHeight: "40vh",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: 2,
        }}>
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

        <Table
          size="small"
          sx={{
            "& .MuiTableCell-root": {
              padding: "4px 8px",
              marginTop: '12px',
            },
            "& .MuiTableRow-root": {
              height: "30px",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Marks (10)</TableCell>
              <TableCell>Out Of</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.parameter}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    variant="outlined"
                    size="small"
                    disabled={isViewMode}
                    value={item.marks}
                    onChange={(e) => handleMarksChange(index, e.target.value)}
                    inputProps={{ min: 0, max: 10, step: 1 }}
                  />
                </TableCell>
                <TableCell>10</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
      </CardContent>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
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
