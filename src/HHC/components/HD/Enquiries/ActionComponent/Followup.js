import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useNavigate } from "react-router-dom";
import { getCurrentDateTimeString } from "../../../Utils/ValidationUtils";

const followup = [
  { value: "1", label: "Keep in Followup" },
  { value: "2", label: "Cancel" },
  { value: "3", label: "Create Service" },
];

const followup1 = [
  { value: "1", label: "Keep in Followup" },
  { value: "2", label: "Cancel" },
];

const cancelby = [
  { value: "1", label: "Spero" },
  { value: "2", label: "Customer" },
];

const Followup = ({ sendData, enqData, onClose, flag }) => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const addedby = localStorage.getItem("clg_id");

  const navigate = useNavigate();

  const [value, setValue] = useState("1");
  const [selectedOption, setSelectedOption] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [remark, setRemark] = useState("");
  const [addedBy, setAddedBy] = useState("");
  const [cancelReason, setCancelReason] = useState([]);
  const [selectedCancelReason, setSelectedCancelReason] = useState("");
  const [selectedReasonID, setSelectedReasonID] = useState("");
  const [followCount, setFollowCount] = useState(0);
  const [followDateTime, setFollowDateTime] = useState("");
  const [followRemark, setFollowRemark] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [errors, setErrors] = useState({ followRemark: "" });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  function formatDateTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" };
    return date.toLocaleString("en-US", options);
  }

  useEffect(() => {
    if (sendData.length > 0) {
      const firstItem = sendData[0];
      setDateTime(firstItem.follow_up_date_time || "");
      setRemark(firstItem.previous_follow_up_remark || "");
      setFollowCount(firstItem.follow_up_count || 0);
      setAddedBy(firstItem.added_by_name || "");
    }
  }, [sendData]);

  useEffect(() => {
    if (!selectedReasonID) return;

    const getCancelReason = async () => {
      try {
        const res = await fetch(`${port}/web/cancellation_reason_follow_up_list/${selectedReasonID}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setCancelReason(data);
      } catch (error) {
        console.error("Error fetching cancel reasons:", error);
      }
    };
    getCancelReason();
  }, [selectedReasonID]);

  const handleChange = (event, newValue) => setValue(newValue);
  const handleDropdownChange = (event) => setSelectedOption(event.target.value);
  const handleReasonChange = (event) => setSelectedReasonID(event.target.value);
  const handleCancelReasonChange = (event) => setSelectedCancelReason(event.target.value);

  const handleValidation = () => {
    const newErrors = {};
    if (!followRemark || followRemark.trim().length < 15) {
      newErrors.followRemark = "Remark must be at least 15 characters long.";
      setSnackbarMessage(newErrors.followRemark);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFollowupSubmit = async (event) => {
    event.preventDefault();
    if (!handleValidation()) return;

    const requestData = {
      flag_id: flag,
      event_id: enqData,
      follow_up: selectedOption,
      follow_up_date_time: followDateTime,
      follow_up_count: followCount,
      previous_follow_up_remark: followRemark,
      added_by: addedby,
    };

    try {
      const response = await fetch(`${port}/web/Add_follow_up/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      await response.json();
      setSnackbarMessage("Followup submitted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
  onClose && onClose();
}, 1000);
      // onClose && onClose();
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to submit followup!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCancelSubmit = async (event) => {
    event.preventDefault();
    if (!handleValidation()) return;

    const requestData = {
      flag_id: flag,
      event_id: enqData,
      follow_up: selectedOption,
      cancel_by: selectedReasonID,
      canclation_reason: selectedCancelReason,
      previous_follow_up_remark: followRemark,
    };

    try {
      const response = await fetch(`${port}/web/cancel_follow_up/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      await response.json();

      setSnackbarSeverity("success");
      setSnackbarMessage(flag === 2 ? "Service cancelled successfully!" : "Enquiry cancelled successfully!");
      setOpenSnackbar(true);
      // onClose && onClose();
      setTimeout(() => {
  onClose && onClose();
}, 1000);
    } catch (error) {
      console.error(error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Failed to cancel!");
      setOpenSnackbar(true);
    }
  };

  const handleCreateServiceSubmit = async (event) => {
    event.preventDefault();
    if (!handleValidation()) return;

    const requestData = {
      event_id: enqData,
      follow_up: selectedOption,
      previous_follow_up_remark: followRemark,
    };

    try {
      const response = await fetch(`${port}/web/create_service_follow_up/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();

      setSnackbarSeverity("success");
      setSnackbarMessage("Service converted from enquiry!");
      setOpenSnackbar(true);

      const { event_id, plan_of_care, caller_id, agg_sp_pt_id } = result;
      setTimeout(() => {
        navigate("/addservice", {
          state: {
            selectedCall: 2,
            eventID: event_id,
            eventPlanID: plan_of_care,
            callerID: caller_id,
            patientID: agg_sp_pt_id,
          },
        });
      }, 2000);
    } catch (error) {
      console.error(error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Failed to create service!");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ marginTop: "2px" }}>
      <TabContext value={value}>
        <Box
          sx={{
            bgcolor: "#f1f1f1",
            borderRadius: "10px",
            width: "100%",
            height: "3rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
<TabList
  onChange={handleChange}
  sx={{
    position: "relative",
    background: "transparent",
    display: "flex",
    justifyContent: "space-between",
    p: 0,
    m: 0,
  }}
  TabIndicatorProps={{
    style: {
      background: "rgb(186, 241, 248)",
      height: "36px",
      borderRadius: "5px",
      bottom: "6px",
    },
  }}
>
  <Tab
    label="Previous Followup"
    value="1"
    sx={{
      fontSize: "15px",
      color: "#888",
      textTransform: "none",
      fontWeight: 500,
      "&.Mui-selected": {
        color: "#000",
      },
      minHeight: "36px",
      minWidth: 0,
      px: 2,
    }}
  />
  <Tab
    label="Add Followup"
    value="2"
    sx={{
      fontSize: "15px",
      color: "#888",
      textTransform: "none",
      fontWeight: 500,
      "&.Mui-selected": {
        color: "#000",
      },
      minHeight: "36px",
      minWidth: 0,
      px: 2,
    }}
  />
</TabList>



        </Box>

        <Box sx={{ width: "100%", marginTop: "-10px" }}>
          <TabPanel value="1">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Follow up Date"
                  size="small"
                  value={formatDateTime(dateTime)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Remark"
                  placeholder="write remark here"
                  size="small"
                  value={remark}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Added by" size="small" value={addedBy} fullWidth />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value="2">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  select
                  label="Follow up"
                  value={selectedOption}
                  onChange={handleDropdownChange}
                  size="small"
                  fullWidth
                >
                  {(flag === 1 ? followup : followup1)
                    .filter((option) => !(followCount === 2 && option.value === "1"))
                    .map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>

              {selectedOption === "2" && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      required
                      select
                      label="Cancel by"
                      size="small"
                      fullWidth
                      value={selectedReasonID}
                      onChange={handleReasonChange}
                    >
                      {cancelby.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      select
                      label="Cancellation Reason"
                      size="small"
                      value={selectedCancelReason}
                      onChange={handleCancelReasonChange}
                      fullWidth
                    >
                      {cancelReason.map((option) => (
                        <MenuItem key={option.cancelation_reason_id} value={option.cancelation_reason_id}>
                          {option.cancelation_reason}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </>
              )}

              {selectedOption === "1" && (
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Follow up Date Time"
                    type="datetime-local"
                    size="small"
                    fullWidth
                    value={followDateTime}
                    onChange={(e) => setFollowDateTime(e.target.value)}
                    inputProps={{ min: getCurrentDateTimeString() }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  required
                  label="Remark"
                  placeholder="write remark here"
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                  value={followRemark}
                  onChange={(e) => setFollowRemark(e.target.value)}
                  error={!!errors.followRemark}
                  helperText={errors.followRemark || "Remark must be at least 15 characters"}
                />
              </Grid>

              <Grid item xs={12}>
                {selectedOption === "2" ? (
                  <Button
                    variant="contained"
                    sx={{ m: 1, width: "30ch", backgroundColor: "rgb(52,123,137)", borderRadius: "12px" }}
                    onClick={handleCancelSubmit}
                  >
                    {flag !== 2 ? "Close Enquiry" : "Close Service"}
                  </Button>
                ) : selectedOption === "3" ? (
                  <Button
                    variant="contained"
                    sx={{ m: 1, width: "30ch", backgroundColor: "rgb(52,123,137)", borderRadius: "12px" }}
                    onClick={handleCreateServiceSubmit}
                  >
                    Go to Service
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{ m: 1, width: "30ch", backgroundColor: "rgb(52,123,137)", borderRadius: "12px" }}
                    onClick={handleFollowupSubmit}
                  >
                    Keep in Followup
                  </Button>
                )}
              </Grid>
            </Grid>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
              <Alert variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  );
};

export default Followup;
