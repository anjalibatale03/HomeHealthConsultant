import React, { useEffect } from "react";
import HRNavbar from "../HRNavbar";
import {
  Box,
  styled,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardContent,
  Typography,
  Divider,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  AppBar,
  IconButton,
  Autocomplete,
  Snackbar,
  Alert,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

const UserCard = styled(Card)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "10px",
  backgroundColor: "white",
  boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
  height: "52px",
  borderRadius: "10px",
  transition: "2s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#F7F7F7",
  },
});

const CareCoordinator = () => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const [callerName, setCallerName] = useState("");
  const [callerNumber, setCallerNumber] = useState("");
  const [callerEmail, setCallerEmail] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [branchName, setBranchName] = useState("");
  const [adharNo, setAdharNo] = useState("");
  const [panNo, setPanNo] = useState("");
  const [qualificationList, setQualificationList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [qualification, setQualification] = useState(""); // ID as string or number
  const [designation, setDesignation] = useState("");
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isEditMode, setIsEditMode] = useState(false); // to toggle between save/update
  const [selectedId, setSelectedId] = useState(null); // to track which user to update
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    c_name: "",
    c_email: "",
    c_dob: "",
    c_address: "",
    c_mobile: "",
    account_holders_name: "",
    ifsc_code: "",
    account_no: "",
    branch_name: "",
    adhar_no: "",
    pan_no: "",
    designation: "",
    qualification: "",
  });

  useEffect(() => {
    const filtered = tableData.filter(
      (item) =>
        item.c_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.c_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTableData(filtered);
  }, [searchTerm, tableData]);

  //
  //  const handleSave = async () => {
  //   if (!validateForm()) return;

  //   const payload = {
  //     c_name: callerName,
  //     c_mobile: callerNumber,
  //     c_email: callerEmail,
  //     dob,
  //     address,
  //     account_holders_name: accountHolderName,
  //     ifsc_code: ifscCode,
  //     account_no: accountNo,
  //     branch_name: branchName,
  //     adharno: adharNo,
  //     pan_no: panNo,
  //     designation: parseInt(designation),
  //     qualification: parseInt(qualification),
  //   };

  //   try {
  //     setLoading(true);

  //     const url = isEditMode
  //       ? `${port}/hr/get_care_coordinator_update/${selectedId}/`
  //       : `${port}/hr/AddCareCoordinator/`;

  //     const method = isEditMode ? "PUT" : "POST";

  //     const res = await fetch(url, {
  //       method,
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     const result = await res.json();

  //     if (res.ok) {
  //       // Success case
  //       setSnackbar({
  //         open: true,
  //         message: isEditMode ? "Updated successfully!" : "Saved successfully!",
  //         severity: "success",
  //       });
  //       handleCloseModal();
  //       await fetchCareCoordinators();
  //     } else {
  //       // Handle specific Aadhar duplication error
  //       if (
  //         result?.errors?.adharno?.[0] ===
  //         "care coordinator with this adharno already exists."
  //       ) {
  //         setErrors((prev) => ({
  //           ...prev,
  //           adharNo: "A care coordinator with this Aadhar number already exists.",
  //         }));
  //         setSnackbar({
  //           open: true,
  //           message: "A care coordinator with this Aadhar number already exists.",
  //           severity: "error",
  //         });
  //       } else {
  //         // Generic error fallback
  //         setSnackbar({
  //           open: true,
  //           message: result?.message || "Something went wrong while saving.",
  //           severity: "error",
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Save/Update Error:", error);
  //     setSnackbar({
  //       open: true,
  //       message: "An unexpected error occurred while saving.",
  //       severity: "error",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSave = async () => {
    console.log("handleSave triggered");

    if (!validateForm()) {
      console.log("Validation failed");
      return;
    }
    const payload = {
      c_name: callerName,
      c_mobile: callerNumber,
      c_email: callerEmail,
      dob,
      address,
      account_holders_name: accountHolderName,
      ifsc_code: ifscCode,
      account_no: accountNo,
      branch_name: branchName,
      adharno: adharNo,
      pan_no: panNo,
      designation: parseInt(designation),
      qualification: parseInt(qualification),
    };

    try {
      setLoading(true);

      const url = isEditMode
        ? `${port}/hr/get_care_coordinator_update/${selectedId}/`
        : `${port}/hr/AddCareCoordinator/`;

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setSnackbar({
          open: true,
          message: isEditMode ? "Updated successfully!" : "Saved successfully!",
          severity: "success",
        });
        handleCloseModal();
        await fetchCareCoordinators();
      } else {
        // Prepare to extract field-level errors even if not wrapped in "errors"
        let fieldErrors = {};
        let errorMsg = "";
        let showSnackbar = true;

        // Check if duplication errors exist directly on result
        if (result?.adharno && result.adharno[0]?.includes("already exists")) {
          fieldErrors.adharNo = result.adharno[0];
          showSnackbar = false;
        }
        if (result?.pan_no && result.pan_no[0]?.includes("already exists")) {
          fieldErrors.panNo = result.pan_no[0];
          showSnackbar = false;
        }

        setErrors((prev) => ({
          ...prev,
          ...fieldErrors,
        }));

        if (showSnackbar) {
          // Try to show other known errors
          if (result?.errors) {
            errorMsg = Object.values(result.errors).flat().join(" ");
          } else {
            errorMsg =
              result?.message ||
              result?.detail ||
              result?.error ||
              "Something went wrong.";
          }

          setSnackbar({
            open: true,
            message: errorMsg,
            severity: "error",
          });
        }
      }
    } catch (error) {
      console.error("Save/Update Error:", error);
      setSnackbar({
        open: true,
        message: "An unexpected error occurred while saving.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (userId) => {
    try {
      setIsEditMode(true);
      setSelectedId(userId);
      setOpenModal(true); // open modal first (optional UI feel)

      const res = await axios.get(
        `${port}/hr/get_care_coordinator_update/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = res.data;

      // Set individual fields OR one single state object
      setCallerName(data.c_name || "");
      setCallerNumber(data.c_mobile || "");
      setCallerEmail(data.c_email || "");
      setDob(data.dob || "");
      setAddress(data.address || "");
      setAccountHolderName(data.account_holders_name || "");
      setIfscCode(data.ifsc_code || "");
      setAccountNo(data.account_no || "");
      setBranchName(data.branch_name || "");
      setAdharNo(data.adharno || "");
      setPanNo(data.pan_no || "");
      setDesignation(data.designation?.toString() || "");
      setQualification(data.qualification || null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch data for editing",
        severity: "error",
      });
    }
  };

  // useEffect(() => {
  //   if (openModal && isEditMode && selectedId) {
  //     const fetchData = async () => {
  //       try {
  //         const res = await axios.put(
  //           `${port}/hr/get_care_coordinator_update/${selectedId}/`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${accessToken}`,
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );

  //         const data = res.data;
  //         setCallerName(data.c_name || "");
  //         setCallerNumber(data.c_mobile || "");
  //         setCallerEmail(data.c_email || "");
  //         setDob(data.dob || "");
  //         setAddress(data.address || "");
  //         setAccountHolderName(data.account_holders_name || "");
  //         setIfscCode(data.ifsc_code || "");
  //         setAccountNo(data.account_no || "");
  //         setBranchName(data.branch_name || "");
  //         setAdharNo(data.adharno || "");
  //         setPanNo(data.pan_no || "");
  //         setDesignation(data.designation?.toString() || "");
  //         setQualification(data.qualification || null);
  //       } catch (err) {
  //         console.error("Error fetching data: ", err);
  //       }
  //     };

  //     fetchData();
  //   }
  // }, [openModal, isEditMode, selectedId]);

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEditMode(false);
    setSelectedId(null);
    setCallerName("");
    setCallerNumber("");
    setCallerEmail("");
    setDob("");
    setAddress("");
    setAccountHolderName("");
    setIfscCode("");
    setAccountNo("");
    setBranchName("");
    setAdharNo("");
    setPanNo("");
    setDesignation("");
    setQualification(null);
    setErrors({});
  };

  const fetchCareCoordinators = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${port}/hr/get_care_coordinator/`);
      const data = Array.isArray(response.data) ? response.data : [];
      setTableData(data);
      setFilteredTableData(data);
    } catch (error) {
      console.error("Error fetching care coordinators:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCareCoordinators();
  }, []);

  const handleStatusChange = (pk, status) => {
    alert(`Change status for PK: ${pk}, current status: ${status}`);
  };

  useEffect(() => {
    const fetchQualification = async () => {
      try {
        const res = await fetch(`${port}/hr/qualification_get_api`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log("Qualification Data:", data.qualification);
        setQualificationList(data.qualification); // Make sure this is just the array
      } catch (error) {
        console.error("Error fetching qualification:", error);
      }
    };

    fetchQualification();
  }, []);

  //   designation options id stored in array
  const designationOptions = [
    { id: 1, label: "Consultant" },
    { id: 2, label: "Nurse" },
    { id: 3, label: "Assistant Doctor" },
  ];

  const resetForm = () => {
    setCallerName("");
    setCallerNumber("");
    setCallerEmail("");
    setDob("");
    setAddress("");
    setAccountHolderName("");
    setIfscCode("");
    setAccountNo("");
    setBranchName("");
    setAdharNo("");
    setPanNo("");
    setDesignation("");
    setQualification("");
    setErrors({});
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset to first page on page size change
  };

  const validateForm = () => {
    const newErrors = {};

    if (!callerName.trim()) newErrors.callerName = "Caller name is required";
    if (!callerNumber || !/^[0-9]\d{9}$/.test(callerNumber))
      newErrors.callerNumber =
        "Mobile must start with 7, 8, or 9 and be 10 digits";

    if (!callerEmail || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(callerEmail))
      newErrors.callerEmail = "Invalid email";
    if (!designation) newErrors.designation = "Designation is required";
    if (!qualification) newErrors.qualification = "Qualification is required";
    if (!dob) newErrors.dob = "DOB is required";
    if (!address.trim()) newErrors.address = "Address is required";
    // if (!accountHolderName.trim())
    //   newErrors.accountHolderName = "Account holder name is required";
    // if (!ifscCode || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode))
    //   newErrors.ifscCode = "Invalid IFSC code";
    // if (!accountNo || !/^\d{9,18}$/.test(accountNo))
    //   newErrors.accountNo = "Account number must be 9-18 digits";
    // if (!branchName.trim()) newErrors.branchName = "Branch name is required";
    if (!adharNo || !/^\d{12}$/.test(adharNo))
      newErrors.adharNo = "Aadhar must be 12 digits";
    if (!panNo || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNo))
      newErrors.panNo = "Invalid PAN number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateMinDate = () => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 18);
    return minDate.toISOString().split("T")[0];
  };

  return (
    <div className="care-taker">
      <HRNavbar />
      <Box sx={{ flexGrow: 1, ml: 1, mr: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // mb: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              //   mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Typography
                sx={{ fontSize: 16, fontWeight: 600 }}
                color="text.secondary"
              >
                Care Coordinator
              </Typography>

              <TextField
                label="Search by Name or Email"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: 300 }}
                InputProps={{
                  sx: { borderRadius: "10px" },
                  endAdornment: (
                    <SearchIcon
                      style={{ cursor: "pointer", color: "#69A5EB" }}
                      onClick={() => setSearchTerm(searchTerm)}
                    />
                  ),
                }}
              />
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "#69A5EB",
                "&:hover": { backgroundColor: "#4b8bd4" },
                borderRadius: "8px",
              }}
              onClick={() => {
                resetForm();
                setOpenModal(true);
              }}
            >
              Care Coordinator
            </Button>
          </Box>

          <Dialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            maxWidth="md"
            fullWidth
            size="small"
          >
            <DialogTitle sx={{ p: 0 }}>
              <AppBar
                position="static"
                sx={{
                  background:
                    "linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  height: "3rem",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontSize: 16 }}>
                  Care Coordinator
                </Typography>
                <IconButton
                  onClick={() => setOpenModal(false)}
                  sx={{ color: "white" }}
                >
                  <CloseIcon />
                </IconButton>
              </AppBar>
            </DialogTitle>

            <DialogContent
              dividers
              sx={{
                backgroundColor: "#F2F2F2",
                maxHeight: 400,
                overflowY: "auto",
              }}
            >
              <Grid container spacing={2}>
                {/* Card 1: Personal Details */}
                <Grid item xs={12}>
                  <Card sx={{ p: 2, borderRadius: "10px" }} elevation={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Name"
                          value={callerName}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^[a-zA-Z\s]*$/.test(value)) {
                              setCallerName(value);
                            }
                          }}
                          error={!!errors.callerName}
                          helperText={errors.callerName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          fullWidth
                          size="small"
                          type="tel"
                          label="Mobile Number"
                          value={callerNumber}
                          onChange={(e) => {
                            const val = e.target.value;
                            // Allow only digits
                            if (/^\d*$/.test(val)) {
                              // Restrict length to 10
                              if (val.length <= 10) {
                                setCallerNumber(val);
                                // Real-time validation for first digit
                                if (val.length === 1 && !/^[789]/.test(val)) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    callerNumber:
                                      "Mobile must start with 7, 8, or 9",
                                  }));
                                } else if (
                                  val.length === 10 &&
                                  !/^[789]\d{9}$/.test(val)
                                ) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    callerNumber:
                                      "Must be 10 digits & start with 7, 8, or 9",
                                  }));
                                } else {
                                  setErrors((prev) => ({
                                    ...prev,
                                    callerNumber: "",
                                  }));
                                }
                              }
                            }
                          }}
                          onBlur={() => {
                            if (!/^[789]\d{9}$/.test(callerNumber)) {
                              setErrors((prev) => ({
                                ...prev,
                                callerNumber:
                                  "Must be 10 digits & start with 7, 8, or 9",
                              }));
                            } else {
                              setErrors((prev) => ({
                                ...prev,
                                callerNumber: "",
                              }));
                            }
                          }}
                          inputProps={{
                            maxLength: 10,
                          }}
                          error={!!errors.callerNumber}
                          helperText={errors.callerNumber}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          select
                          fullWidth
                          size="small"
                          label="Designation"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          error={!!errors.designation}
                          helperText={errors.designation}
                        >
                          {designationOptions.map((opt) => (
                            <MenuItem key={opt.id} value={opt.id}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Autocomplete
                          fullWidth
                          size="small"
                          options={qualificationList}
                          getOptionLabel={(option) =>
                            option.qualification || ""
                          }
                          value={
                            qualificationList.find(
                              (item) => item.quali_id === qualification
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            setQualification(
                              newValue ? newValue.quali_id : null
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Qualification"
                              error={!!errors.qualification}
                              helperText={errors.qualification}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Email"
                          value={callerEmail}
                          onChange={(e) => setCallerEmail(e.target.value)}
                          onBlur={() => {
                            if (
                              !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
                                callerEmail
                              )
                            ) {
                              setErrors((prev) => ({
                                ...prev,
                                callerEmail: "Invalid email address",
                              }));
                            } else {
                              setErrors((prev) => ({
                                ...prev,
                                callerEmail: "",
                              }));
                            }
                          }}
                          error={!!errors.callerEmail}
                          helperText={errors.callerEmail}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          required
                          id="dob"
                          label="DOB"
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          size="small"
                          fullWidth
                          error={!!errors.dob}
                          helperText={errors.dob}
                          sx={{
                            textAlign: "left",
                            "& input": {
                              fontSize: "14px",
                            },
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            max: calculateMinDate(),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          error={!!errors.address}
                          helperText={errors.address}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                {/* Card 2: Bank & ID Details */}
                <Grid item xs={12}>
                  <Card sx={{ p: 2, borderRadius: "10px" }} elevation={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Account Holder Name"
                          value={accountHolderName}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^[a-zA-Z\s]*$/.test(value)) {
                              setAccountHolderName(value);
                            }
                          }}
                          // error={!!errors.accountHolderName}
                          // helperText={errors.accountHolderName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          fullWidth
                          size="small"
                          label="IFSC Code"
                          value={ifscCode}
                          onChange={(e) =>
                            setIfscCode(e.target.value.toUpperCase())
                          }
                          // error={!!errors.ifscCode}
                          // helperText={errors.ifscCode}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Account No"
                          value={accountNo}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              setAccountNo(value);
                            }
                          }}
                          // error={!!errors.accountNo}
                          // helperText={errors.accountNo}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Branch Name"
                          value={branchName}
                          onChange={(e) => setBranchName(e.target.value)}
                          // error={!!errors.branchName}
                          // helperText={errors.branchName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Aadhar No"
                          value={adharNo}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,12}$/.test(value)) {
                              setAdharNo(value);
                              setErrors((prev) => ({
                                ...prev,
                                adharNo:
                                  value === ""
                                    ? ""
                                    : value.length < 12
                                    ? "Aadhar must be exactly 12 digits"
                                    : "",
                              }));
                            }
                          }}
                          error={!!errors.adharNo}
                          helperText={errors.adharNo}
                          inputProps={{ maxLength: 12 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          fullWidth
                          size="small"
                          label="PAN No"
                          value={panNo}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase();
                            const isValidPAN = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(
                              value
                            );
                            setPanNo(value);
                            setErrors((prev) => ({
                              ...prev,
                              panNo:
                                value === "" || isValidPAN
                                  ? ""
                                  : "Invalid PAN format (e.g., ABCDE1234F)",
                            }));
                          }}
                          error={!!errors.panNo}
                          helperText={errors.panNo}
                          inputProps={{ maxLength: 10 }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions
              sx={{
                backgroundColor: "#F2F2F2",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading}
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                  ? "Update"
                  : "Save"}
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              severity={snackbar.severity}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>

        <TableContainer sx={{ height: "68vh" }}>
          <Table>
            <TableHead>
              <TableRow>
                <UserCard
                  style={{
                    height: "2.5rem",
                    background: "#69A5EB",
                    color: "#FFFFFF",
                    borderRadius: "8px 10px 0 0",
                  }}
                >
                  <CardContent
                    style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Sr. No</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 1.6, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2"> Name</Typography>
                  </CardContent>

                  <CardContent
                    style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Mobile Number</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 1.6, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Email</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 1.6, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Account No</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Designation</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Qualification</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Action</Typography>
                  </CardContent>
                </UserCard>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    style={{ height: "45vh" }}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredTableData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    style={{ height: "45vh" }}
                  >
                    <Typography variant="subtitle1">No data found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTableData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => (
                    <TableRow key={user.cc_id}>
                      <UserCard>
                        <CardContent style={{ flex: 0.5 }}>
                          <Typography variant="subtitle2">
                            {index + 1}
                          </Typography>
                        </CardContent>
                        <CardContent style={{ flex: 2.4 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ justifyContent: "center", display: "flex" }}
                          >
                            {user.c_name || "-"}
                          </Typography>
                        </CardContent>
                        <CardContent style={{ flex: 3 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ justifyContent: "center", display: "flex" }}
                          >
                            {user.c_mobile || "-"}
                          </Typography>
                        </CardContent>
                        <CardContent style={{ flex: 3 }}>
                          <Tooltip title={user.c_email || "-"} arrow>
                            <Typography
                              variant="subtitle2"
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {user.c_email && user.c_email.length > 20
                                ? `${user.c_email.substring(0, 20)}...`
                                : user.c_email || "-"}
                            </Typography>
                          </Tooltip>
                        </CardContent>
                        <CardContent style={{ flex: 2 }}>
                          <Typography variant="subtitle2">
                            {user.account_no || "-"}
                          </Typography>
                        </CardContent>
                        <CardContent style={{ flex: 1.5 }}>
                          <Typography variant="subtitle2">
                            {user.designation === 1
                              ? "Consultant"
                              : user.designation === 2
                              ? "Nurse"
                              : user.designation === 3
                              ? "Assistant Doctor"
                              : "-"}
                          </Typography>
                        </CardContent>
                        <CardContent style={{ flex: 2 }}>
                          <Typography variant="subtitle2">
                            {user.qualification?.qualification || "-"}
                          </Typography>
                        </CardContent>
                        <CardContent style={{ flex: 1 }}>
                          <EditIcon
                            onClick={() => handleEditClick(user.cc_id)}
                            sx={{ cursor: "pointer", color: "#17A2F4" }}
                          />
                        </CardContent>
                      </UserCard>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </div>
  );
};

export default CareCoordinator;
