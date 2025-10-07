import React, { useState, useEffect, useRef } from "react";
import HRNavbar from "../../HR/HRNavbar";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Link,
  styled,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Icon,
  InputAdornment,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  AppBar,
  Snackbar,
  Alert,
  TableFooter,
} from "@mui/material";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import { MobileDatePicker } from "@mui/lab";
import Login from "../../Login/Login";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Footer from "../../../Footer";

const Refund = () => {
  // paymentModes[2] === "Online"

  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  console.log("selectedPaymentMode", selectedPaymentMode);

  const [paymentMode, setPaymentMode] = useState("");
  const cardRef = useRef(null);
  const [cardHeight, setCardHeight] = useState("auto");
  const [tableHeight, setTableHeight] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [callerInput, setCallerInput] = useState({ name: "", contact: "" });
  console.log(callerInput, "callerInputcallerInput");

  const [tableData, setTableData] = useState([]);
  const [suggestions, setSuggestions] = useState();
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [caller, setCaller] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [openRefundModal, setOpenRefundModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [remark, setRemark] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info"); // "success", "error", etc.
  const [debouncedCallerInput, setDebouncedCallerInput] = useState(callerInput);
  const [availableModes, setAvailableModes] = useState([]);
  const [selectedMode, setSelectedMode] = useState(null);

  console.log("callerdata->", caller);
  console.log("callerInput->", callerInput);

  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");

  // Triggered when clicking submit

  const handleSearchCaller = async () => {
    const { name, contact } = callerInput;

    if (!/^\d{10}$/.test(contact)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const response = await fetch(
        `${port}/web/ref_detail_callers/?number=${contact}&name=${name}&mode=${selectedPaymentMode}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (data.length > 0) {
        const callerData = data[0];
        console.log(callerData, "data1");

        setCaller({
          name: callerData.caller_fullname,
          contact: callerData.phone,
          refundAmount: callerData.refound_amount,
          remark: remark,
        });

        const tableFormatted = callerData.refound_details.map((item, idx) => {
          const paymentModeObj = paymentModes.find(
            (pm) => pm.id === item.payment_mode
          );

          return {
            eventCode: item.event_code || `EVT-${idx + 1}`,
            patientName: item.patient_name || "N/A",
            patientMobile: item.patient_number || "N/A",
            paymentMode: paymentModeObj || {
              id: item.payment_mode,
              name: "Unknown",
            },
            paymentModeId: item.payment_mode || 1,
            amount: parseFloat(item.refound_amount || 0).toFixed(2),
            order_id: item.order_id,
            wallet_ids: item.wallet_ids || [],
          };
        });

        setTableData(tableFormatted);
        console.log("Table Data:", tableFormatted);
      } else {
        // alert("No caller data found for this number.");
        setCaller(null);
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching caller details:", error);
      // alert("An error occurred while fetching caller data.");
    }
  };

  useEffect(() => {
    if (selectedPaymentMode) {
      handleSearchCaller();
    }
  }, [selectedPaymentMode]);

  useEffect(() => {
    if (cardRef.current) {
      setCardHeight(`${cardRef.current.offsetHeight}px`);
    }
  }, []);

  //  modal code start here
  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setOpenRefundModal(true);
  };

  const handleCloseModal = () => {
    setOpenRefundModal(false);
    setSelectedRow(null);
  };

  // end it modal
  useEffect(() => {
    const setDynamicHeight = () => {
      const screenHeight = window.innerHeight;
      var tableContainerHeight =
        screenHeight - setTableHeight(tableContainerHeight + "px");
    };
    setDynamicHeight();
    window.addEventListener("resize", setDynamicHeight);
    return () => {
      window.removeEventListener("resize", setDynamicHeight);
    };
  }, []);

  const InsuranceCard = styled(Card)({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "15px",
    backgroundColor: "white",
    boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
    height: "50px",
    borderRadius: "10px",
    transition: "0.5s ease-in-out",
    "&:hover": {
      backgroundColor: "#F7F7F7",
    },
  });

  useEffect(() => {
    const fetchCallerByContact = async () => {
      if (/^\d{10}$/.test(callerInput.contact)) {
        try {
          const response = await fetch(
            `${port}/web/ref_detail_callers/?number=${callerInput.contact}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          const data = await response.json();

          if (data.length > 0) {
            const caller = data[0];
            setCallerInput((prev) => ({
              ...prev,
              name: caller.caller_fullname,
            }));
          }
        } catch (err) {
          console.error("Error fetching by contact:", err);
        }
      }
    };

    fetchCallerByContact();
  }, [callerInput.contact]);

  // 9022345688

  useEffect(() => {
    const fetchCallerByName = async () => {
      if (callerInput.name.length >= 3) {
        try {
          const response = await fetch(
            `${port}/web/ref_detail_callers/?name=${callerInput.name}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          const data = await response.json();

          if (data.length > 0) {
            // Auto-fill contact if single match
            if (data.length === 1) {
              const caller = data[0];
              setCallerInput((prev) => ({
                ...prev,
                contact: caller.phone,
              }));
            }

            // Update suggestions
            setNameSuggestions(data.map((item) => item.caller_fullname));
          }
        } catch (err) {
          console.error("Error fetching by name:", err);
        }
      }
    };

    fetchCallerByName();
  }, [callerInput.name]);

  const totalRefundAmount = tableData.reduce((acc, row) => {
    return acc + Number(row.refound_amount || 0);
  }, 0);

  // 9022345688 caller numer  9665485378
  const handleRefund = async (row) => {
    if (!row.order_id) {
      setSnackbarMessage("Order ID is missing. Cannot process refund.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const walletIds = row.wallet_ids || [];

    const payload = {
      order_id: row.order_id,
      refund_amount: parseFloat(row.amount),
      refund_note: `Refund requested by ${caller?.name || "User"}`,
      refund_speed: "STANDARD",
      wallet_ids: walletIds,
    };

    try {
      const response = await fetch(`${port}/web/cashfree_refund-post/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Refund Response:", result);
      const refundMessage = result?.cashfree_response?.message || "";

      if (
        response.ok &&
        result.cashfree_response?.code !== "refund_post_failed"
      ) {
        setSnackbarMessage("Refund successful!");
        setSnackbarSeverity("success");
      } else {
        const errorMsg =
          result.cashfree_response?.message ||
          result.message ||
          "Unknown error";
        setSnackbarMessage("Refund failed: " + errorMsg);
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error during refund:", error);
      setSnackbarMessage("Refund error occurred.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const paymentModes = [
    { id: 1, name: "Cash" },
    { id: 2, name: "Cheque" },
    { id: 3, name: "Online" },
    { id: 4, name: "Card" },
    { id: 5, name: "QR_Code" },
    { id: 6, name: "NEFT" },
  ];

  const filteredTableData = selectedMode
    ? tableData.filter((row) => row.paymentMode === selectedMode)
    : tableData;

  return (
    <div>
      <HRNavbar />
      <Box p={1}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} md={6} display="flex">
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                boxShadow: "none",
                height: { xs: "auto", sm: "auto", md: "80%" },
                // p: 2,
                borderRadius: "15px",
                flexGrow: 1, // Makes sure it stretches to match height
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "600",
                    fontFamily: "Roboto",
                    textTransform: "uppercase",
                    mb: 2,
                  }}
                >
                  SEARCH CALLER DETAILS
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      freeSolo
                      options={nameSuggestions}
                      inputValue={callerInput.name}
                      onInputChange={(event, newInputValue, reason) => {
                        if (reason === "input" || reason === "clear") {
                          const onlyAlphabets = newInputValue.replace(
                            /[^a-zA-Z\s]/g,
                            ""
                          );
                          setCallerInput((prev) => ({
                            ...prev,
                            name: onlyAlphabets,
                          }));
                        }
                      }}
                      onChange={(event, newValue) => {
                        const onlyAlphabets = (newValue || "").replace(
                          /[^a-zA-Z\s]/g,
                          ""
                        );
                        setCallerInput((prev) => ({
                          ...prev,
                          name: onlyAlphabets,
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Caller Name"
                          size="small"
                          fullWidth
                          InputProps={{
                            ...params.InputProps,
                            // Just use original startAdornment from params
                            startAdornment: params.InputProps.startAdornment,
                            endAdornment: params.InputProps.endAdornment,
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Contact"
                      variant="outlined"
                      fullWidth
                      size="small"
                      inputMode="numeric"
                      placeholder="+91 |"
                      value={callerInput.contact}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, "");
                        if (onlyNums.length <= 10) {
                          setCallerInput((prev) => ({
                            ...prev,
                            contact: onlyNums,
                          }));
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              {callerInput.contact && (
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    setCallerInput((prev) => ({
                                      ...prev,
                                      contact: "",
                                    }))
                                  }
                                  sx={{ mr: 0.5 }}
                                >
                                  <CloseIcon
                                    sx={{ color: "#69A5EB" }}
                                    fontSize="small"
                                  />
                                </IconButton>
                              )}
                              <PhoneAndroidIcon sx={{ color: "#69A5EB" }} />
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#69A5EB",
                        color: "#fff",
                        height: "100%",
                      }}
                      onClick={handleSearchCaller}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} display="flex">
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                boxShadow: "none",

                // p: 2,
                height: "78%",
                borderRadius: "15px",
                flexGrow: 1, // Ensures it stretches to the same height
              }}
            >
              {/* {caller && ( */}
              <CardContent>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
                    CALLER DETAILS
                  </Typography>
                  <Button
                    // href="#"
                    color="primary"
                    variant="contained"
                    // variant="body2"
                    sx={{ color: "#ffffff", cursor: "pointer" }}
                    onClick={() => {
                      if (tableData.length > 0) {
                        setShowDetails(true);
                      } else {
                        setShowDetails(true);
                      }
                    }}
                  >
                    Show Details
                  </Button>
                </Grid>
                <Grid container spacing={1} p={1}>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {/* Left: Labels */}
                    <Grid item xs={6}>
                      <Box sx={{ mb: 1.5 }}>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: "#767676",
                            textAlign: "left",
                          }}
                        >
                          Name
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1.5 }}>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: "#767676",
                            textAlign: "left",
                          }}
                        >
                          Contact Number
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: "#767676",
                            textAlign: "left",
                          }}
                        >
                          Amount to be Refunded
                        </Typography>
                      </Box>
                    </Grid>

                    {caller && (
                      <Grid item xs={6}>
                        <Box sx={{ mb: 1.5 }}>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#363636",
                              textAlign: "left",
                            }}
                          >
                            {caller?.name || "-"}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 1.5 }}>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#363636",
                              textAlign: "left",
                            }}
                          >
                            {caller?.contact || "-"}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#363636",
                              textAlign: "left",
                            }}
                          >
                            ₹{caller?.refundAmount || "0"}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                  <Grid item xs={6} sx={{ mb: 2 }}>
                    <Typography
                      sx={{
                        fontSize: "11px",
                        color: "#363636",
                        textAlign: "left",
                        fontWeight: "900",
                      }}
                    >
                      {/* <Typography>{caller?.name}</Typography> */}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#363636",
                        // mt: 1,
                        textAlign: "left",
                      }}
                    >
                      {/* <Typography>{caller?.contact}</Typography> */}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#363636",
                        // mt: 1,
                        textAlign: "left",
                      }}
                    >
                      {/* <Typography>{caller?.refundAmount}</Typography> */}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              {/* )} */}
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ position: "relative", top: "2rem" }}></Box>

        <TableContainer
          sx={{
            overflowX: "auto",
            margin: 1,
            borderRadius: "10px",
            overflow: "hidden", // Force children to respect radius
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            position: "relative",
            right: "8px",
            bottom: "30px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              overflowX: "auto", // ENABLE SCROLL HERE
              borderRadius: "15px",
            }}
          >
            <Table
              sx={{
                minWidth: 700,
                borderCollapse: "separate",
                borderSpacing: "0 8px", // Space between rows
                width: "100%",
                backgroundColor: "transparent",
                borderRadius: "10px",
              }}
            >
              {/* Table Head */}
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#69A5EB",
                    height: "55px",
                    borderRadius: "15px",
                  }}
                >
                  {[
                    "Sr. No",
                    "Event Code",
                    "Patient Name",
                    "Patient Mobile",
                    "Payment Mode",
                    "Amount",
                    "Action",
                  ].map((heading, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        textAlign: "center",
                        padding: "6px",
                        whiteSpace: "nowrap",
                        backgroundColor: "#69A5EB",
                        borderTopLeftRadius: index === 0 ? "15px" : 0,
                        borderTopRightRadius: index === 6 ? "15px" : 0,
                        borderRight: index !== 6 ? "1px solid #FFFFFF" : "none",
                      }}
                    >
                      {/* {heading === "Payment Mode" ? (
                        <FormControl
                          fullWidth
                          size="small"
                          sx={{
                            maxWidth: "160px",
                            margin: "0 auto",
                          }}
                        >
                          <Select
                            value={selectedPaymentMode}
                            onChange={(e) =>
                              setSelectedPaymentMode(e.target.value)
                            }
                            displayEmpty
                            sx={{
                              color: "#FFFFFF",
                              backgroundColor: "#69A5EB",
                              height: "35px",
                              fontSize: "0.875rem",
                              "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  border: "none",
                                },
                              "& .MuiSvgIcon-root": { color: "white" },
                            }}
                          >
                            <MenuItem value="" disabled>
                              Payment Mode
                            </MenuItem>
                            {paymentModes.map((mode) => (
                              <MenuItem
                                key={mode.id}
                                value={mode.id}
                                sx={{
                                  color: "black",
                                  bgcolor: "white",
                                  position: "relative",
                                  right: 1,
                                }}
                              >
                                {mode.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <Typography variant="subtitle2">{heading}</Typography>
                      )} */}
                      <Typography variant="subtitle2">{heading}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* Table Body */}
              {showDetails &&
                (caller?.refundAmount > 0 && tableData.length > 0 ? (
                  <TableBody
                    sx={{ "& .MuiTableRow-root": { marginBottom: "8px" } }}
                  >
                    {filteredTableData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          sx={{ padding: 0, border: "none" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#FFF4E5",
                              border: "1px solid #FFD6A5",
                              borderRadius: "10px",
                              padding: "16px",
                              margin: "8px",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "black", fontWeight: 600 }}
                            >
                              No Data Available
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTableData.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "15px",
                          }}
                        >
                          <TableCell
                            sx={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.eventCode}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.patientName}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.patientMobile}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.paymentMode.name}
                          </TableCell>
                          <TableCell
                            sx={{
                              textAlign: "center",
                              color: "#69A5EB",
                              fontWeight: "bold",
                            }}
                          >
                            ₹{row.amount}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Button
                              variant="outlined"
                              size="small"
                              disabled={row.paymentModeId !== 3}
                              sx={{
                                bgcolor:
                                  row.paymentModeId === 3
                                    ? "#69A5EB"
                                    : "#D3D3D3",
                                color:
                                  row.paymentModeId === 3 ? "#fff" : "#888",
                                borderColor:
                                  row.paymentModeId === 3 ? "#69A5EB" : "#aaa",
                                "&:hover": {
                                  bgcolor:
                                    row.paymentModeId === 3
                                      ? "#4A90E2"
                                      : "#D3D3D3",
                                },
                              }}
                              onClick={() => handleOpenModal(row)}
                            >
                              Make A Refund
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        sx={{ padding: 0, border: "none" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            // backgroundColor: "#FFF4E5",
                            // border: "1px solid #FFD6A5",
                            borderRadius: "10px",
                            padding: "16px",
                            margin: "8px",
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "black", fontWeight: 600 }}
                          >
                            No refundable amount available.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))}

              {/* Total Amount Section */}
              {/* {caller?.refundAmount > 0 && ( */}
              {selectedRow?.total_refund_amount > 0 && (
                <TableFooter sx={{ backgroundColor: "#fff" }}>
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      sx={{
                        textAlign: "right",
                        fontSize: "18px",
                        fontWeight: "600",
                        fontFamily: "Roboto",
                        color: "black",
                      }}
                    >
                      Total Amount
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        fontSize: "18px",
                        fontWeight: "600",
                        fontFamily: "Roboto",
                        color: "black",
                      }}
                    >
                      ₹
                      {caller?.total_refund_amount ||
                        selectedRow?.total_refund_amount}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}

              {/* Snackbar */}
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
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
            </Table>
          </Box>
        </TableContainer>
        
      </Box>
      <Dialog
        open={openRefundModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="xs"
      >
        <AppBar
          position="static"
          style={{
            background: "linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)",
            borderRadius: "8px 8px 0 0",
            padding: "0.5rem 1rem",
          }}
        >
          <Typography variant="h6" style={{ color: "#fff" }}>
            Refund Details
          </Typography>
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            color="inherit"
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </IconButton>
        </AppBar>

        <DialogContent>
          {selectedRow && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Are you sure you want to refund ₹{selectedRow.amount} to{" "}
                <strong>{selectedRow.patientName}</strong>?
              </Typography>

              <TextField
                fullWidth
                label="Remark"
                multiline
                maxRows={1}
                rows={2}
                margin="normal"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#69A5EB", color: "white" }}
            onClick={() => {
              handleRefund(selectedRow);
              handleCloseModal();
            }}
          >
            Confirm Refund
          </Button>
        </DialogActions>
      </Dialog>
      <Footer></Footer>
    </div>
  );
};
export default Refund;
