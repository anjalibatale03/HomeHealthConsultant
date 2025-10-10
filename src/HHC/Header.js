import React, { useState, useEffect } from "react";
import LocalPostOfficeOutlinedIcon from "@mui/icons-material/LocalPostOfficeOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloseIcon from "@mui/icons-material/Close";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Typography,
  Modal,
  MenuItem,
  AppBar,
  Box,
  Grid,
  TextField,
  Button,
  Drawer,
  Snackbar,
  Alert,
  Tooltip,
  Badge,
  Fab,
  useMediaQuery,
  Tab,
  IconButton,
  Fade,
  Paper,
  Popper,
} from "@mui/material";
import { Link, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Addservice from "./components/HD/Addservice";
import Viewservice from "./components/HD/Viewservice";
import Ongoingservice from "./components/HD/Ongoingservice/Ongoingservice";
import ServiceRequest from "./components/HD/Servicerequest/ServiceRequest";
import ProfRequest from "./components/HD/ProfRequest/ProfRequest";
import Enquiries from "./components/HD/Enquiries/Enquiries";
import Schedule from "./components/HD/Professional/Schedule";
import Dashboard from "./components/HD/Dashboard/Dashboard";
import Membership from "./components/HD/Membership/Membership";
import Footer from "./Footer";
import Navbar from "./Navbar";
import "./Header.css";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { keyframes } from "@mui/system";
import ShiftHandover from './components/HD/ShiftHandover/ShiftHandover';
import shift from './assets/Shift HandOver.png';

const Header = () => {
  // const accessHospital = sessionStorage.getItem('selectedHospital');
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const addedby = localStorage.getItem("clg_id");
  const location = useLocation();

  const [ptnName, setPtnName] = useState("");
  const [ptnNumber, setPtnNumber] = useState("");
  const [service, setService] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [value, setValue] = useState("1");

  const [showComponent, setShowComponent] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [state, setState] = useState({ right: false });
  const [dayPrint, setDayPrint] = useState({ right: false });
  const [callback, setCallback] = useState([]);
  const [isBlinking, setIsBlinking] = useState(false);
  const [profID, setProfID] = useState("");
  const [remark, setRemark] = useState("");
  const [remarkError, setRemarkError] = useState({ remark: "" });

  const [hospital, setHospital] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [date, setDate] = useState("");
  const [dayPrintErrors, setDayPrintErrors] = useState({
    date: "",
    selectedHospital: "",
  });

  const [enqNotify, setEnqNotify] = useState(0);
  const [srvNotify, setSrvNotify] = useState(0);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [ptnNumberError, setPtnNumberError] = useState("");
  const [errors, setErrors] = useState({
    ptnName: "",
    ptnNumber: "",
    selectedService: "",
  });

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ right: open });
  };

  const toggleDrawerDayPrint = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDayPrint({ right: open });
  };

  const handleDropdownHospital = (event) => {
    const selectedHospital = event.target.value;
    setSelectedHospital(selectedHospital);
  };

  const handleEmptyField = () => {
    const newErrors = {};

    if (!ptnName) {
      newErrors.ptnName = "Name is required";
    }
    if (!ptnNumber) {
      newErrors.ptnNumber = "Mobile No is required";
    }
    if (!selectedService) {
      newErrors.selectedService = "Service is required";
    }
    setErrors(newErrors);
    return Object.values(newErrors).some((error) => error !== "");
  };

  const handleEmptyRemark = () => {
    const newErrors = {};

    if (!remark) {
      newErrors.remark = "Remark is required";
    }
    setRemarkError(newErrors);
    return Object.values(newErrors).some((error) => error !== "");
  };

  const handleEmptyDayPrint = () => {
    const newErrors = {};

    if (!date) {
      newErrors.date = "This is required";
    }
    if (!selectedHospital) {
      newErrors.selectedHospital = "This is required";
    }
    setErrors(newErrors);
    return Object.values(newErrors).some((error) => error !== "");
  };

  const validateFullName = (name) => {
    const nameRegex = /^[A-Za-z]+( [A-Za-z]+){0,2}$/;
    if (!name) {
      return "Name is required";
    } else if (!nameRegex.test(name)) {
      return "Name accept only characters, Up to 3 spaces";
    }
    return null;
  };

  //Patient Phone Validation//
  const handlePtnNumberChange = (e) => {
    const input = e.target.value;
    const numericValue = input.replace(/[^0-9]/g, "");
    setPtnNumber(numericValue);

    if (!numericValue) {
      setPtnNumberError("Mobile No is required");
      setErrors({ ...errors, ptnNumber: "Mobile No is required" });
    } else if (!/^[6789]\d{9}$/.test(numericValue)) {
      setPtnNumberError("Enter a valid mobile");
      setErrors({ ...errors, ptnNumber: "Enter a valid mobile" });
    } else if (parseInt(numericValue) < 0) {
      setPtnNumberError("Moblile No should be a positive number");
      setErrors({
        ...errors,
        ptnNumber: "Mobile No should be a positive number",
      });
    } else {
      setPtnNumberError("");
      setErrors({ ...errors, ptnNumber: "" });
    }
  };

  const handleSMSOpen = () => setIsModalOpen(true);
  const handleSMSClose = () => {
    setIsModalOpen(false);
    setOpenSnackbar(false); // ✅ reset snackbar when modal closes
    setSnackbarMessage("");
    setSnackbarSeverity("success");
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function formatTime(originalTime) {
    return new Date(originalTime).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC", // Assuming your input time is in UTC
    });
  }

  const convertTimeFormat = (timeString) => {
    const date = new Date(timeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  // useEffect(() => {
  //   if (location.pathname === '/dashboard') setValue('1');
  //   else if (location.pathname === '/addservice') setValue('2');
  //   else if (location.pathname === '/ongoing') setValue('3');
  //   else if (location.pathname === '/professional') setValue('4');
  //   else if (location.pathname === '/service-request') setValue('5');
  //   else if (location.pathname === '/enquiries') setValue('6');
  //   else if (location.pathname === '/membership') setValue('7');
  //   // else if (location.pathname === '/viewservice') setValue('8');
  // }, [location]);

  const handleDropdownService = (event) => {
    const selectedService = event.target.value;
    setSelectedService(selectedService);
  };

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await fetch(
          `${port}/web/enquiry_Service_Notification_count/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        // console.log("Notificationsss.........", data);
        setEnqNotify(data.enquiry_notification_count);
        setSrvNotify(data.service_request_count);
      } catch (error) {
        console.error("Error fetching Notificationsss:", error);
      }
    };
    getNotifications();
  }, []);

  useEffect(() => {
    const getService = async () => {
      try {
        const res = await fetch(`${port}/web/agg_hhc_services_api`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        // console.log("Service Data.........", data);
        setService(data);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };
    getService();
  }, []);

  const fetchCallbackData = async () => {
    try {
      const res = await fetch(`${port}/web/call_back_notification_api`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // console.log("Call Back.........", data);
      setCallback(data);
      setIsBlinking(data.length > 0);
    } catch (error) {
      console.error("Error fetching Call Back:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchCallbackData();
      const interval = setInterval(fetchCallbackData, 5000);
      return () => clearInterval(interval);
    }
  }, [accessToken]);

  useEffect(() => {
    const getHospital = async () => {
      try {
        const res = await fetch(`${port}/web/agg_hhc_hospitals_api`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        // setHospital(data);
        const allHospitalsOption = { hosp_id: "0", hospital_name: "All" };
        setHospital([allHospitalsOption, ...data]);
      } catch (error) {
        console.error("Error fetching Hospital data:", error);
      }
    };
    getHospital();
  }, []);

  const callbackIDRequest = (callId) => {
    const selectedProf = callback.find((item) => item.cb_id === callId);
    if (selectedProf) {
      console.log("Selected Prof ID:", selectedProf.cb_id);
      setProfID(selectedProf.cb_id);
      setRemark("");
    }
  };

  async function handleSubmitCallback(event) {
    event.preventDefault();
    handleEmptyRemark();
    const requestData = {
      cb_id: profID,
      clgs_id: addedby,
      remark: remark,
    };
    console.log("callback ......", requestData);
    try {
      const response = await fetch(`${port}/web/call_back_notification_api`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("callback......", result);
      fetchCallbackData();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  async function handleSubmitSMS(event) {
    event.preventDefault();
    const hasEmptyFields = handleEmptyField();
    if (hasEmptyFields) {
      setOpenSnackbar(true);
      setSnackbarMessage("Please fill all required details.");
      setSnackbarSeverity("error");
      return;
    } else {
      setOpenSnackbar(true);
      setSnackbarMessage("SMS link has been sent!!");
      setSnackbarSeverity("success");
    }
    const requestData = {
      patient_name: ptnName,
      phone_number: ptnNumber,
      srv_id: selectedService,
    };
    console.log("SMS link ......", requestData);
    try {
      const response = await fetch(`${port}/enq_send_sms/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (result.message === "SMS sent successfully.") {
        setOpenSnackbar(true);
        setSnackbarMessage("SMS link has been sent!!.");
        setSnackbarSeverity("success");
        handleSMSClose();
        setPtnName("");
        setPtnNumber("");
        setSelectedService("");
      } else {
        setOpenSnackbar(true);
        setSnackbarMessage("Something went wrong..");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setSnackbarSeverity("error");
    }
  }

  // const getCurrentDate = () => {
  //   const currentDate = new Date();
  //   const year = currentDate.getFullYear();
  //   const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  //   const day = ('0' + currentDate.getDate()).slice(-2);
  //   const formattedDate = `${year}-${month}-${day}`;
  //   return formattedDate;
  // };

  const handleDownload = async () => {
    const hasErrors = handleEmptyDayPrint();
    if (hasErrors) {
      return;
    }
    try {
      // const currentDate = getCurrentDate();
      const apiUrl = `${port}/hr/DayPrint_excel_api/${date}/${date}/${selectedHospital}`;
      console.log("apiUrl", apiUrl);
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "DayPrintReport.csv");
      document.body.appendChild(link);

      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const tabFadeIn = keyframes`
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

  const [anchorEl, setAnchorEl] = useState(null);
  const openSettings = Boolean(anchorEl);
  const handleSettingsClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const rotateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
`;

  const fadeSlideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

  const slideInBounce = keyframes`
  0% {
    transform: translateY(-30%) scale(0.8);
    opacity: 0;
  }
  60% {
    transform: translateY(0%) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

  const slideInVertical = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

  const slideDownAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

  return (
    <>
      <Box
        sx={{
          typography: "body1",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(29, 36, 36, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "white",
          width: "100%",
          color: "#fff",
          // px: 2,
          height: 56,
          position: "sticky",
          top: 10,
          // zIndex: 100,
          animation: "navbarFadeSlide 0.8s ease-out",
        }}
      >
        <TabContext value={location.pathname}>
          <Box
            sx={{
              height: "3.7rem",
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
              animation: "navbarFadeSlide 0.8s ease-out",
              overflowX: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <TabList
              onChange={handleChange}
              textColor="white"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                ".MuiTab-root": {
                  fontWeight: 600,
                  color: "black",
                  textTransform: "capitalize",
                  fontSize: "0.2rem",
                  transition: "all 0.3s ease",
                  borderRadius: 2,
                  mx: 0.5,
                  mt: 1,
                  minHeight: "2.5rem",
                  minWidth: 120,
                  // "&:hover": {
                  //   borderBottom: "4px solid purple", // <-- Add this line
                  // },
                },
                ".MuiTabs-indicator": {
                  background: "none",
                },
              }}
            >
              <Tab
                component={Link}
                to="/dashboard"
                value="/dashboard"
                icon={
                  <AccessTimeIcon sx={{ fontSize: 20, color: "inherit" }} />
                }
                iconPosition="start"
                label={<span style={{ fontSize: "13.5px" }}>Dashboard</span>}
                sx={{
                  background: "#e3f2fd",
                  borderRadius: 2,
                  "&.Mui-selected": {
                    background: "#e3f2fd",
                    color: "rgb(36 146 224)",
                    borderBottom: "4px solid rgb(36 146 224)",
                  },
                  // "&:hover": {
                  //   borderBottom: "4px solid #222",
                  // },
                }}
              />
              <Tab
                component={Link}
                to="/addservice"
                value="/addservice"
                icon={
                  <AddCircleOutlineIcon
                    sx={{ fontSize: 20, color: "inherit" }}
                  />
                }
                iconPosition="start"
                label={<span style={{ fontSize: "13.5px" }}>Add Service</span>}
                sx={{
                  background: "#fce4ec",
                  borderRadius: 2,
                  "&.Mui-selected": {
                    background: "#fce4ec",
                    color: "rgb(224 0 75)",
                    borderBottom: "4px solid rgb(224 0 75)",
                  },
                  // "&:hover": {
                  //   borderBottom: "4px solid #222",
                  // },
                }}
              />
              <Tab
                component={Link}
                to="/ongoing"
                value="/ongoing"
                icon={
                  <PersonOutlineIcon sx={{ fontSize: 20, color: "inherit" }} />
                }
                iconPosition="start"
                label={
                  <span style={{ fontSize: "13.5px" }}>Ongoing Service</span>
                }
                sx={{
                  background: "#dbfadd",
                  borderRadius: 2,
                  "&.Mui-selected": {
                    background: "#dbfadd",
                    color: "rgb(19 166 31)",
                    borderBottom: "4px solid rgb(19 166 31)",
                  },
                  // "&:hover": {
                  //   borderBottom: "4px solid #222",
                  // },
                }}
              />
              <Tab
                component={Link}
                to="/professional"
                value="/professional"
                icon={
                  <CalendarTodayIcon sx={{ fontSize: 16, color: "inherit" }} />
                }
                iconPosition="start"
                label={
                  <span style={{ fontSize: "13.5px" }}>
                    Professional Schedule
                  </span>
                }
                sx={{
                  background: "#fff3e0",
                  borderRadius: 2,
                  "&.Mui-selected": {
                    background: "#fff3e0",
                    color: "rgb(193 123 10)",
                    borderBottom: "4px solid rgb(193 123 10)",
                  },
                  // "&:hover": {
                  //   borderBottom: "4px solid #222",
                  // },
                }}
              />
              <Tab
                component={Link}
                to="/service-request"
                value="/service-request"
                icon={
                  <Badge
                    color="error"
                    badgeContent={srvNotify}
                    showZero={false}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    overlap="circular"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.7rem",
                        height: 18,
                        minWidth: 18,
                        top: 0,
                        right: 0,
                      },
                    }}
                  >
                    <NotificationsNoneIcon
                      sx={{ fontSize: 22, color: "inherit" }}
                    />
                  </Badge>
                }
                iconPosition="start"
                label={
                  <span style={{ fontSize: "13.5px" }}>Service Request</span>
                }
                sx={{
                  background: "#f3e5f5",
                  borderRadius: 2,
                  minHeight: "40px",
                  position: "relative",
                  "&.Mui-selected": {
                    background: "#f3e5f5",
                    color: "#000",
                    borderBottom: "4px solid rgb(215, 139, 227)",
                  },
                }}
              />

              <Tab
                component={Link}
                to="/enquiries"
                value="/enquiries"
                icon={
                  <Badge
                    color="error"
                    badgeContent={enqNotify}
                    showZero={false}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    overlap="circular"
                    sx={{
                      "& .MuiBadge-badge": {
                        top: -2,
                        right: -3,
                        fontSize: "0.7rem",
                        height: 18,
                        minWidth: 18,
                        padding: "0 5px",
                      },
                    }}
                  >
                    <ChatBubbleOutlineIcon
                      sx={{ fontSize: 20, color: "inherit" }}
                    />
                  </Badge>
                }
                iconPosition="start"
                label={<span style={{ fontSize: "13.5px" }}>Enquiries</span>}
                sx={{
                  background: "#e0f7fa",
                  borderRadius: 2,
                  minHeight: "40px",
                  "&.Mui-selected": {
                    background: "#e0f7fa",
                    color: "#000",
                    borderBottom: "4px solid rgb(162, 217, 225)",
                  },

                  position: "relative",
                }}
              />

              <Tab
                component={Link}
                to="/prof-req"
                value="/prof-req"
                icon={
                  <ChatBubbleOutlineIcon
                    sx={{ fontSize: 20, color: "inherit" }}
                  />
                }
                iconPosition="start"
                label={
                  <span style={{ fontSize: "13.5px" }}>
                    Professional Request
                  </span>
                }
                sx={{
                  background: "#f9fbe7",
                  borderRadius: 2,
                  "&.Mui-selected": {
                    background: "#f9fbe7",
                    color: "rgb(136 151 2)",
                    borderBottom: "4px solid rgb(136 151 2)",
                  },
                  // "&:hover": {
                  //   borderBottom: "4px solid #222",
                  // },
                }}
              />

              <Tab
                component={Link}
                to="/shift-handover"
                value="/shift-handover"
                label={
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13.5px",
                    }}
                  >
                    <img
                      src={shift}
                      alt="Shift Handover"
                      style={{ width: "13px", height: "13px" }}
                    />
                    Shift Handover
                  </span>
                }
                sx={{
                  background: "#d1dfff",
                  borderRadius: 2,
                  "&.Mui-selected": {
                    background: "#d1dfff",
                    color: "#497df5",
                    borderBottom: "4px solid #497df5",
                  },
                }}
              />

              {/* <Tab
                icon={
                  <LocalPostOfficeOutlinedIcon
                    sx={{ fontSize: 20, color: "black" }}
                    disabled
                  />
                }
                 onClick={handleSMSOpen}
                iconPosition="start"
                label={
                  <span
                    style={{
                      fontSize: "13.5px",

                      cursor: "pointer",
                    }}
                   
                  >
                    SMS
                  </span>
                }
                sx={{
                  background: "rgb(199, 227, 214)",
                  borderRadius: 2,
                  "&:hover": { background: "#e0e0e0" },
                  "&.Mui-selected": {
                    background: "rgb(138, 223, 183)",
                    color: "black",
                    borderBottom: "4px solid #222", // dark border
                  },
                  // "&:hover": {
                  //   borderBottom: "4px solid #222",
                  // },
                }}
              /> */}
            </TabList>

            {/* Floating Vertical FAB Group with Slide & Bounce */}
            {openSettings && (
              <Box
                sx={{
                  position: "fixed",
                  top: 115,
                  bottom: 24,
                  right: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  animation: `${slideInBounce} 0.8s ease`,
                }}
              >
                <Fab
                  sx={{
                    backgroundColor: "#86A8FC",
                    color: "white",
                    "&:hover": {
                      backgroundColor: " #86A8FC",
                    },
                  }}
                  onClick={handleSMSOpen}
                  size="medium"
                >
                  <SmsOutlinedIcon />
                </Fab>
                <Fab
                  sx={{
                    backgroundColor: "#AAB3D2",
                    color: "white",
                    "&:hover": {
                      backgroundColor: " #AAB3D2",
                    },
                  }}
                  onClick={toggleDrawer(true)}
                  size="medium"
                >
                  <LocalPhoneOutlinedIcon />
                </Fab>
                <Fab
                  sx={{
                    backgroundColor: "#CBA0F4",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#CBA0F4",
                    },
                  }}
                  onClick={toggleDrawerDayPrint(true)}
                  size="medium"
                >
                  <CurrencyRupeeOutlinedIcon />
                </Fab>
              </Box>
            )}

            {/* {!isSmallScreen && (
              <>
                <Tooltip title="Callback Request">
                  <Fab
                    size="small"
                    color="primary"
                    aria-label="add"
                    style={{
                      // background: "#1FD0C4",
                      // background: "#F77B7B",
                      background: "#E90602",
                      marginTop: "10px",
                      height: "40px",
                      width: "40px",
                      animation: isBlinking
                        ? "blink-animation 1s infinite"
                        : "none",
                    }}
                  >
                    <LocalPhoneOutlinedIcon
                      onClick={toggleDrawer(true)}
                      sx={{ fontSize: "22px" }}
                    />
                  </Fab>
                  <style>
                    {`
          @keyframes blink-animation {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
                  </style>
                </Tooltip>

                <Tooltip title="Day Print">
                  <Fab
                    size="small"
                    color="primary"
                    aria-label="add"
                    style={{
                      background: "#1FD0C4",
                      marginLeft: "5px",
                      marginTop: "10px",
                      height: "40px",
                      width: "40px",
                    }}
                  >
                    <CurrencyRupeeOutlinedIcon
                      onClick={toggleDrawerDayPrint(true)}
                      sx={{ fontSize: "22px" }}
                    />
                  </Fab>
                </Tooltip>
              </>
            )} */}
          </Box>
        </TabContext>

        <Box sx={{ position: "relative", display: "inline-block" }}>
          {/* Settings Button */}
          <IconButton
            onClick={handleSettingsClick}
            sx={{
              color: "black",
              mr: 3,
              mt: 0.5,
              ml: 1,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
            size="small"
          >
            <MoreHorizIcon
              sx={{
                fontSize: 25,
                color: "inherit",
                animation: openSettings
                  ? `${rotateAnimation} 0.6s ease`
                  : "none",
              }}
            />
          </IconButton>
        </Box>

        <Modal open={isModalOpen} onClose={handleSMSClose} closeAfterTransition>
          <Fade in={isModalOpen}>
            <Box
              sx={{
                width: 300,
                height: 300,
                position: "absolute",
                // top: "28%",
                left: "70%",
                bottom: "35%",
                // transform: "translate(-50%, -50%)",
                bgcolor: " #FFFFFF",
                borderRadius: "10px",
                overflow: "hidden",
                "@media (max-width: 600px)": {},
              }}
            >
              {/* AppBar Header */}
              <AppBar
                position="static"
                elevation={0}
                sx={{
                  backgroundColor: " #86A8FC",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  px: 2,
                  py: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "16px", fontWeight: 600, color: "#fff" }}
                  >
                    Patient Details
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleSMSClose}
                    sx={{
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        color: "#fff",
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </AppBar>

              {/* Form Fields */}
              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    required
                    id="patient_name"
                    name="patient_name"
                    label="Patient Name"
                    placeholder="First Name | Last Name "
                    value={ptnName}
                    onChange={(e) => {
                      const inputName = e.target.value;
                      setPtnName(inputName);
                      const validationError = validateFullName(inputName);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        ptnName: validationError,
                      }));
                    }}
                    size="small"
                    fullWidth
                    sx={{ "& input": { fontSize: "14px" } }}
                    error={!!errors.ptnName}
                    helperText={errors.ptnName}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    label="Contact"
                    id="phone_number"
                    name="phone_number"
                    placeholder="+91 |"
                    size="small"
                    fullWidth
                    value={ptnNumber}
                    onInput={handlePtnNumberChange}
                    error={!!ptnNumberError || !!errors.ptnNumber}
                    helperText={ptnNumberError || errors.ptnNumber}
                    inputProps={{ minLength: 10, maxLength: 10 }}
                    sx={{ "& input": { fontSize: "14px" } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    id="srv_id"
                    name="srv_id"
                    select
                    label="Select Service"
                    value={selectedService}
                    onChange={handleDropdownService}
                    size="small"
                    fullWidth
                    error={!!errors.selectedService}
                    helperText={errors.selectedService}
                    sx={{ "& input": { fontSize: "14px" } }}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: "200px",
                            maxWidth: "200px",
                          },
                        },
                      },
                    }}
                  >
                    {service.map((option) => (
                      <MenuItem
                        key={option.srv_id}
                        value={option.srv_id}
                        sx={{ fontSize: "14px" }}
                      >
                        {option.service_title}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    sx={{
                      mx: "auto",
                      display: "block",
                      width: "15ch",
                      mt: 1,
                      borderRadius: "10px",
                      textTransform: "capitalize",
                      background: "#347B89",
                      color: "#fff",
                      boxShadow: "none",
                      "&:hover": {
                        background: "#347B89",
                      },
                    }}
                    onClick={handleSubmitSMS}
                  >
                    Send Link
                  </Button>

                 <Snackbar
  open={openSnackbar}
  autoHideDuration={6000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: 'center', horizontal: 'center' }} // <-- Center position
>
  <Alert
    variant="filled"
    onClose={handleSnackbarClose}
    severity={snackbarSeverity}
    sx={{ width: "100%" }}
  >
    {snackbarMessage}
  </Alert>
</Snackbar>

                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Modal>

        <Drawer
          anchor="right"
          open={state.right}
          onClose={toggleDrawer(false)}
          PaperProps={{
            style: {
              height: '92%',
              borderRadius: "5px",
              marginTop: "2px",
              width: '20rem',
              display: 'flex',
              flexDirection: 'column'
            },
          }}
        >
          {/* Sticky AppBar */}
          <AppBar position="sticky" style={{
            backgroundColor: "#AAB3D2",
            height: '3rem',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
          }}>
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px" }}>
                Call Back Requests
              </Typography>
              <Button onClick={toggleDrawer(false)} sx={{ color: "#FFFFFF", minWidth: 'auto', padding: 0, marginTop: "10px" }}>
                <CloseIcon />
              </Button>
            </div>
          </AppBar>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px' }}>
            {callback.map((item, index) => (
              <div key={index}>
                <Grid container justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Name</Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    onClick={() => callbackIDRequest(item.cb_id)}
                    style={{ cursor: "pointer" }}
                  >
                    {item ? item.professional_Name : ""}
                  </Typography>
                </Grid>

                <Grid container justifyContent="space-between" mt={0.5}>
                  <Typography variant='body2' color="text.secondary">Contact Number</Typography>
                  <Typography variant='subtitle2' color="text.primary">+91 {item ? item.phone_number : ""}</Typography>
                </Grid>

                <Grid container justifyContent="space-between" mt={0.5}>
                  <Typography variant='body2' sx={{ color: "#f44336" }}>Date & Time</Typography>
                  <Typography variant='body2' sx={{ color: "#f44336" }}>{convertTimeFormat(item ? item.time : "")}</Typography>
                </Grid>

                {profID === item.cb_id && (
                  <Grid container spacing={1} mt={0.5}>
                    <Grid item xs={9}>
                      <TextField
                        required
                        label="Remark"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        size="small"
                        fullWidth
                        error={!!remarkError.remark}
                        helperText={remarkError.remark}
                        sx={{ '& input': { fontSize: '14px' } }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Button variant="contained" onClick={handleSubmitCallback}><CheckOutlinedIcon /></Button>
                    </Grid>
                  </Grid>
                )}

                {index < callback.length - 1 && <hr />}
              </div>
            ))}
          </div>
        </Drawer>



        <Drawer
          anchor="right"
          open={dayPrint.right}
          onClose={toggleDrawerDayPrint(false)}
          PaperProps={{
            style: {
              height: '52%',
              borderRadius: "5px",
              marginTop: "2px",
            },
          }}
        >
          <AppBar position="static" style={{
            background: 'linear-gradient(45deg, #1FD0C4 38.02%, #328EDF 100%)',
            width: '20rem',
            height: '3rem',
          }}>
            <div style={{ display: "flex" }}>
              <Typography align="left" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "18px" }}>Day Print</Typography>
              <Button onClick={toggleDrawerDayPrint(false)} sx={{ marginLeft: "10rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
            </div>

            <div style={{ marginTop: "25px", marginLeft: "20px", marginRight: "20px", marginBottom: "10px" }}>

              <Grid item xs={12} spacing={2}>
                <Grid item lg={12} sm={12} xs={12} sx={{ mt: 3 }}>
                  <TextField
                    required
                    label="Select Date"
                    id="select_date"
                    name="select_date"
                    type="date"
                    size="small"
                    fullWidth
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    error={!!errors.date}
                    helperText={errors.date}
                    sx={{
                      textAlign: "left", '& input': {
                        fontSize: '14px',
                      },
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: new Date().toISOString().split('T')[0],
                    }}
                  />
                </Grid>

                <Grid item lg={12} sm={12} xs={12} sx={{ mt: 3 }}>
                  <TextField
                    required
                    label="Select Hospital"
                    id="preferred_hosp_id"
                    name="preferred_hosp_id"
                    select
                    size="small"
                    fullWidth
                    value={selectedHospital}
                    onChange={handleDropdownHospital}
                    error={!!errors.selectedHospital}
                    helperText={errors.selectedHospital}
                    sx={{
                      textAlign: "left", '& input': {
                        fontSize: '14px',
                      },
                    }}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: '200px',
                            maxWidth: '200px',
                          },
                        },
                      },
                    }}
                  >
                    {hospital.map((option) => (
                      <MenuItem key={option.hosp_id} value={option.hosp_id}
                        sx={{ fontSize: "14px", }}>
                        {option.hospital_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item lg={12} sm={12} xs={12} sx={{ mt: 4 }}>
                  <Button variant="contained" sx={{ textTransform: "capitalize", borderRadius: "8px", ml: 10 }} onClick={handleDownload}><FileDownloadOutlinedIcon /> Download</Button>
                </Grid>
              </Grid>
            </div>
          </AppBar>
        </Drawer>


        <Drawer
          anchor="right"
          open={dayPrint.right}
          onClose={toggleDrawerDayPrint(false)}
          PaperProps={{
            style: {
              height: "52%",
              borderRadius: "5px",
              marginTop: "2px",
            },
          }}
        >
          <AppBar
            position="static"
            style={{
              background: "#CBA0F4",
              width: "20rem",
              height: "3rem",
            }}
          >
            <div style={{ display: "flex" }}>
              <Typography
                align="left"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  marginTop: "10px",
                  marginLeft: "18px",
                }}
              >
                Day Print
              </Typography>
              <Button
                onClick={toggleDrawerDayPrint(false)}
                sx={{
                  marginLeft: "10rem",
                  color: "#FFFFFF",
                  marginTop: "2px",
                }}
              >
                <CloseIcon />
              </Button>
            </div>

            <div
              style={{
                marginTop: "25px",
                marginLeft: "20px",
                marginRight: "20px",
                marginBottom: "10px",
              }}
            >
              <Grid item xs={12} spacing={2}>
                <Grid item lg={12} sm={12} xs={12} sx={{ mt: 3 }}>
                  <TextField
                    required
                    label="Select Date"
                    id="select_date"
                    name="select_date"
                    type="date"
                    size="small"
                    fullWidth
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    error={!!errors.date}
                    helperText={errors.date}
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
                      max: new Date().toISOString().split("T")[0],
                    }}
                  />
                </Grid>

                <Grid item lg={12} sm={12} xs={12} sx={{ mt: 3 }}>
                  <TextField
                    required
                    label="Select Hospital"
                    id="preferred_hosp_id"
                    name="preferred_hosp_id"
                    select
                    size="small"
                    fullWidth
                    value={selectedHospital}
                    onChange={handleDropdownHospital}
                    error={!!errors.selectedHospital}
                    helperText={errors.selectedHospital}
                    sx={{
                      textAlign: "left",
                      "& input": {
                        fontSize: "14px",
                      },
                    }}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: "200px",
                            maxWidth: "200px",
                          },
                        },
                      },
                    }}
                  >
                    {hospital.map((option) => (
                      <MenuItem
                        key={option.hosp_id}
                        value={option.hosp_id}
                        sx={{ fontSize: "14px" }}
                      >
                        {option.hospital_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item lg={12} sm={12} xs={12} sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    sx={{
                      textTransform: "capitalize",
                      borderRadius: "8px",
                      ml: 10,
                      background: "#347B89",
                      color: "#fff",
                    }}
                    onClick={handleDownload}
                  >
                    <FileDownloadOutlinedIcon /> Download
                  </Button>
                </Grid>
              </Grid>
            </div>
          </AppBar>
        </Drawer>
      </Box>
      {/* <Footer /> */}
    </>
  );
};

export default Header;
