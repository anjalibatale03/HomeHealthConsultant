import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const cancelby = [
  { value: '1', label: 'Spero' },
  { value: '2', label: 'Customer' },
];

const CancelService = ({ eventID }) => {
  const navigate = useNavigate();
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');

  const [cancelReason, setCancelReason] = useState([]);
  const [selectedReasonID, setSelectedReasonID] = useState('');
  const [followRemark, setFollowRemark] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // success, error, warning, info
  const [selectedCancelReason, setSelectedCancelReason] = useState('');

  const [errors, setErrors] = useState({
    cancelReason: '',
    selectedReasonID: '',
    followRemark: '',
  });

  const handleCancelReasonChange = (event) => {
    setSelectedCancelReason(event.target.value);
  };

  const handleReasonChange = (event) => {
    setSelectedReasonID(event.target.value);
  };

  useEffect(() => {
    const getCancelReason = async () => {
      if (selectedReasonID) {
        try {
          const res = await fetch(
            `${port}/web/cancellation_reason_follow_up_list/${selectedReasonID}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          );
          const data = await res.json();
          setCancelReason(data);
        } catch (error) {
          console.error("Error fetching Cancel Reasons:", error);
        }
      }
    };
    getCancelReason();
  }, [selectedReasonID, port, accessToken]);

  const handleEmptyFieldService = () => {
    const newErrors = {};
    if (!followRemark) newErrors.followRemark = 'Remark is required';
    if (!selectedReasonID) newErrors.selectedReasonID = 'Required';
    if (!selectedCancelReason) newErrors.selectedCancelReason = 'Required';
    setErrors(newErrors);
    return Object.values(newErrors).some((error) => error !== '');
  };

  async function handleCancelSubmit(event) {
    event.preventDefault();
    const hasEmptyFields = handleEmptyFieldService();

    if (hasEmptyFields) {
      setSnackbarSeverity('warning');
      setSnackbarMessage('Please fill all required details.');
      setOpenSnackbar(true);
      return;
    }

    if (followRemark.trim().length < 15) {
      setErrors({ followRemark: 'Remark must be at least 15 characters long.' });
      setSnackbarSeverity('error');
      setSnackbarMessage('Remark must be at least 15 characters long.');
      setOpenSnackbar(true);
      return;
    }

    const requestData = {
      flag_id: 2,
      event_id: eventID,
      follow_up: 2,
      cancel_by: selectedReasonID,
      canclation_reason: selectedCancelReason,
      previous_follow_up_remark: followRemark,
    };

    try {
      const response = await fetch(`${port}/web/cancel_follow_up/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        setSnackbarSeverity('error');
        setSnackbarMessage(`Failed to cancel service. Status: ${response.status}`);
        setOpenSnackbar(true);
        return;
      }

      const result = await response.json();
      console.log("Cancel Service data", result);

      setSnackbarSeverity('success');
      setSnackbarMessage('Service cancelled successfully!');
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate('/addservice');
      }, 2000);
    } catch (error) {
      console.error("An error occurred:", error);
      setSnackbarSeverity('error');
      setSnackbarMessage('An unexpected error occurred.');
      setOpenSnackbar(true);
    }
  }

  return (
    <div>
      <Box sx={{ width: '100%', typography: 'body1', marginTop: '-10px' }}>
        <Grid container spacing={2}>
          <Grid item lg={12} sm={12} xs={12}>
            <TextField
              required
              select
              label="Follow up"
              size="small"
              fullWidth
              value="Cancel"
              sx={{ textAlign: 'left', '& input': { fontSize: '14px' } }}
            >
              <MenuItem value="Cancel">Cancel</MenuItem>
            </TextField>
          </Grid>

          <Grid item lg={12} sm={12} xs={12}>
            <TextField
              required
              select
              label="Cancel by"
              size="small"
              fullWidth
              value={selectedReasonID}
              onChange={handleReasonChange}
              sx={{ textAlign: 'left', '& input': { fontSize: '14px' } }}
              error={!!errors.selectedReasonID}
              helperText={errors.selectedReasonID}
            >
              {cancelby.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item lg={12} sm={12} xs={12}>
            <TextField
              required
              select
              label="Cancellation Reason"
              size="small"
              value={selectedCancelReason}
              onChange={handleCancelReasonChange}
              fullWidth
              error={!!errors.selectedCancelReason}
              helperText={errors.selectedCancelReason}
              sx={{ textAlign: 'left', '& input': { fontSize: '14px' } }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: { maxHeight: '200px', maxWidth: '200px' },
                  },
                },
              }}
            >
              {cancelReason.map((option) => (
                <MenuItem
                  key={option.cancelation_reason_id}
                  value={option.cancelation_reason_id}
                  sx={{ fontSize: '14px' }}
                >
                  {option.cancelation_reason}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item lg={12} sm={12} xs={12}>
            <TextField
              required
              label="Remark"
              placeholder="Write remark here"
              size="small"
              value={followRemark}
              onChange={(e) => setFollowRemark(e.target.value)}
              fullWidth
              multiline
              rows={2}
              sx={{ '& input': { fontSize: '14px' } }}
              error={!!errors.followRemark}
              helperText={errors.followRemark || "Remark must be at least 15 characters"}
            />
          </Grid>

          <Grid item lg={12} sm={12} xs={12}>
            <Button
              variant="contained"
              sx={{
                m: 1,
                width: '30ch',
                backgroundColor: '#7AB8EE',
                borderRadius: '12px',
                textTransform: 'capitalize',
              }}
              onClick={handleCancelSubmit}
            >
              Close Service
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar for messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CancelService;
