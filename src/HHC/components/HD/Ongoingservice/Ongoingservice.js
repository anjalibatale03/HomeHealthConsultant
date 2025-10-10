import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useMediaQuery,
  CircularProgress,
  TextField,
  Box,
  Stack,
  Button,
  AppBar,
  InputBase,
  Menu,
  MenuItem,
  Modal,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  TablePagination,
  Tooltip,
  Toolbar,
  IconButton,
  Snackbar,
  InputLabel,
  Select,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CircleIcon from "@mui/icons-material/Circle";
import { border, styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Reschedule from "./ActionComponents/Reschedule";
import Cancellation from "./ActionComponents/Cancellation";
import Professional from "./ActionComponents/Professional";
import RecvdPayment from "./ActionComponents/RecvdPayment";
import EventDetails from "./EventDetails/EventDetails";
import Sessions from "./ActionComponents/Sessions";
import Feedback from "./ActionComponents/Feedback";
import Invoice from "./ActionComponents/Invoice";
import Payment from "./../Viewservice/Payment";
import Navbar from "../../../Navbar";
import Footer from "../../../Footer";
import PatientView from "../Viewservice/PatientView";
import CallerView from "../Viewservice/CallerView";
import Documents from "./ActionComponents/Documents";
// import Header from '../../../Header';
// import Payment from './ActionComponents/Payment';
import CancelIcon from "@mui/icons-material/Cancel";
import RateReviewIcon from "@mui/icons-material/RateReview";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Map from "./leaflet.js/Map";

const customStyles = {
  "& .Mui-focused": {
    outline: "none",
  },
};
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
    // cursor: 'pointer',
  },
});

const Ongoingservice = ({ eveId, onClose, rows }) => {
  const [callerId, setcallerID] = useState("");
  const [clrName, setclrName] = useState("Unknown"); // Default to "Unknown"

  const [caller, setCaller] = useState("");
  console.log("callerId", callerId);

  const [clrID, setclrID] = useState();

  // console.log("Caller ID:", callerId);

  const navigate = useNavigate();
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const accessHospitalID = localStorage.getItem("hospitalID") || 0;
  const [serviceRequest, setServiceRequest] = useState([]);
  const [requestAllocation, setRequestAllocation] = useState({});
  const [eventID, setEventID] = useState("");
  console.log("DDDDDDDDDDDDDDDDDDDDDDDDD", eventID);
  const [conflictData, setConflictData] = useState(null);
  console.log(conflictData, "conflictData");

  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);

  const handleChangePage2 = (event, newPage) => setPage2(newPage);
  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
    setPage2(0);
  };

  const [selected, setSelected] = useState("service");

  const handleChangeToggle = (event, newSelection) => {
    if (newSelection !== null) {
      setSelected(newSelection);
    }
  };

  // State for session
  const [sessionData, setSessionData] = useState([]);
  const [selectedMapData, setSelectedMapData] = useState(null);
  const [pageSession, setPageSession] = useState(0);

  const wsRef = useRef(null);
  const reconnectRef = useRef(null);

  const connectWebSocket = () => {
    const ws = new WebSocket("ws://192.168.1.109:2689/ws/users");

    ws.onopen = () => {
      console.log("✅ WebSocket Connected");
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 WebSocket Data:", data);

        if (Array.isArray(data)) {
          // server sent array → replace old
          setSessionData(data);
        } else if (typeof data === "object" && data !== null) {
          // server sent single object → append
          setSessionData((prev) => {
            // prevent duplicate rows by unique id
            const exists = prev.some(
              (item) => item.agg_sp_dt_eve_poc_id === data.agg_sp_dt_eve_poc_id
            );
            if (exists) {
              return prev.map((item) =>
                item.agg_sp_dt_eve_poc_id === data.agg_sp_dt_eve_poc_id
                  ? data
                  : item
              );
            }
            return [...prev, data];
          });
        }
      } catch (err) {
        console.error("❌ Error parsing WebSocket data:", err);
      }
    };

    ws.onclose = () => {
      console.warn("⚠️ WebSocket Disconnected, retrying...");
      reconnectRef.current = setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (err) => {
      console.error("🔥 WebSocket Error:", err);
      ws.close();
    };

    wsRef.current = ws;
  };

  // 👉 Trigger WebSocket only when "session" tab is active
  useEffect(() => {
    if (selected === "session") {
      connectWebSocket();
    } else {
      // if switching back to Service → close socket
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setSessionData([]); // clear old session data
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, [selected]);

  const [callerData, setCallerData] = useState({
    name: "",
    number: "",
    eventID: "",
    callerID: "",
  });
  // console.log("callerdata", callerData);
  const [data, setData] = useState();
  const [openDetails2, setOpenDeatils2] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const [openProfessional, setOpenProfessional] = useState(false);
  const [openReschedule, setOpenReschedule] = useState(false);
  const [openSrvExtend, setOpenSrvExtend] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openDocument, setOpenDocument] = useState(false);
  const [openSession, setOpenSession] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openDetails, setOpenDeatils] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [onServices, setOnServices] = useState([]);

  // Usestate for getting data event id wise
  // const [eventID, setEventID] = useState(null);

  const [eventCode, setEventCode] = useState(null);
  const [serviceID, setServiceID] = useState(null);
  const [startDateTime, setStartDateTime] = useState("");

  const [startDT, setStartDT] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [ptnName, setPtnName] = useState(null);
  const [ptnPhn, setPtnPhn] = useState(null);
  const [clrPhn, setClrPhn] = useState(null);

  console.log(clrPhn, "clrPhnclrPhn");

  const [profName, setProfName] = useState(null);
  const [ptnRecord, setPtnRecord] = useState(null);
  const [payAmount, setPayAmount] = useState(null);
  const [sesCount, setSesCount] = useState(null);
  const [payment, setPayment] = useState({});
  const [subSrvID, setSubSrvID] = useState(null);
  const [jobClosureStatus, setJobClosureStatus] = useState(null);
  const [evePlanID, setEvePlanID] = useState(null);
  const [ptnZone, setPtnZone] = useState(null);
  // fetching Wallent amount

  // Usestate for Filter values in input field
  // const [filteredData, setFilteredData] = useState(onServices);
  const filteredData = onServices;

  const [filterType, setFilterType] = useState("searchby");
  const [searchValue, setSearchValue] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [tempSearchValue, setTempSearchValue] = useState("");
  const [tempStartDateTime, setTempStartDateTime] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tableHeight, setTableHeight] = useState("auto");
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const [isInvoicePopup, setIsInvoicePopup] = useState(false);
  const [openRecPayment, setOpenRecPayment] = useState(false);

  /////Anjali's Code Start (FEEDBACK)
  const [openFeedback, setOpenFeedback] = useState(false);
  const [totalSessionCount, setTotalSessionCount] = useState(null);
  const [jobClosureCount, setJobClosureCount] = useState(null);
  const [walletData, setWalletData] = useState(null);
  // console.log(walletData, "walletDatawalletData");

  const [openPatientDetails, setOpenPatientDetails] = useState(false);
  const [patientID, setPatientID] = useState(null);

  console.log(patientID, "patientID");

  const [patient, setPatient] = useState("");
  const [hospital, setHospital] = useState("");
  // snehas code
  const [open, setOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [yesNo, setYesNo] = useState(2); // default "No"
  console.log("yesNo", yesNo);

  const [roleType, setRoleType] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [roleList, setRoleList] = useState([]);
  const [notifyby, setNotifyby] = useState(null); // default "No"
  const [notifyname, setnotifyname] = useState("");
  console.log("notifyname", notifyname);
  const [disabled, setDisabled] = useState(false); // ✅ New state for disabling
  const [isSubmitted, setIsSubmitted] = useState(false); // ✅ New state for form submission
  const [selectedID, setSelectedID] = useState(null);

  // Handle Yes/No change
  const handleYesNoChange = (e) => {
    const value = e.target.value; // string
    setYesNo(value);
    if (value === "1") {
      setOpen(true);
    }
  };
  // Handle Role change
  useEffect(() => {
    if (notifyby) {
      fetch(`${port}/web/role/${notifyby}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("RoleList from API:", data);

          if (data.role === "professional" && data.data) {
            const combinedList = Object.values(data.data).flat();
            setRoleList({ role: data.role, data: combinedList });
          } else {
            setRoleList(data);
          }
        })
        .catch((err) => console.error("API Error:", err));
    }
  }, [notifyby]); // fetch again when notifyby changes

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  // Prefetch
  useEffect(() => {
    if (open && eventID) {
      fetch(`${port}/web/ongoing_service_get/?eve_id=${eventID}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => res.json())
        .then((resData) => {
          const dataArr = resData?.data || [];

          if (dataArr.length > 0) {
            const latest = dataArr[dataArr.length - 1];
            setYesNo(latest.long_term_form);
            setNotifyby(latest.notify_by || null);
            setnotifyname(latest.notify_name || "");
            setIsSubmitted(true);
          } else {
            setYesNo(2); // Default to "No"
            setNotifyby(null);
            setnotifyname("");
            setIsSubmitted(false);
          }
        })
        .catch((err) => console.error("Prefetch Error:", err));
    }
  }, [open, eventID]);

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setnotifyname(value); // store selected role/person id
  };

  const handleOpenLongTermForm = () => {
    // setSelectedEventId(eveId);
    // setEventID(eveId);

    setOpen(true);
  };

  const handleSave = () => {
    if (!eventID) {
      console.error("eve_id is missing!");
      setSnackbarMessage("Event ID missing!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const payload = {
      notify_by: notifyby,
      notify_name: notifyname,
      eve_id: eventID,
      long_term_form: yesNo,
    };

    fetch(`${port}/web/ongoing_service/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Ongoing Service API Response:", data);
        if (data.message === "Data saved successfully") {
          setSnackbarMessage("Data saved successfully!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          setOpen(false); // close modal
        } else {
          setSnackbarMessage(data.message || "Something went wrong!");
          setSnackbarSeverity("warning");
          setSnackbarOpen(true);
        }
      })
      .catch((err) => {
        console.error("API Error:", err);
        setSnackbarMessage("API Error — please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedEventId(null);
    setYesNo("2");
    setRoleType("");
    setSelectedPerson("");
    setRoleList([]);
  };
  // end snehas code
  const handleOpenPatientDetails = () => setOpenPatientDetails(true);
  const handleClosePatientDetails = () => setOpenPatientDetails(false);

  const patientIDRequest = (id) => {
    console.log(id, "id");
    setPatientID(id); // Set the patient ID
    handleOpenPatientDetails(); // Open the modal
  };

  // Only trigger getPatientDetails when patientID changes
  useEffect(() => {
    if (patientID !== null) {
      getPatientDetails();
    }
  }, [patientID]); // This effect runs only when patientID changes

  const getPatientDetails = useCallback(async () => {
    if (!patientID) {
      console.log(patientID, "patientIDSSSS");

      console.error("No patient ID available");
      return;
    }
    try {
      const res = await fetch(
        `${port}/web/patient_detail_info_api/${patientID}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log(data, "Patient Data");

      setPatient(data.patient);
      setHospital(data.hospital);
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  }, [patientID, port, accessToken]);

  const handleOpenDetails2 = (row) => {
    // console.log("Row Data:", row); // Check the row data

    // const data = {
    //   name: row?.agg_sp_pt_id?.caller_name || "Unknown", // Use safe navigation to avoid undefined errors
    //   phone: row?.agg_sp_pt_id?.caller_phone_number || "Unknown",
    //   eventID: row?.eve_id?.event_id || "",
    //   callerID: row?.agg_sp_pt_id?.caller_id || "Unknown", // Handle missing caller_id
    // };

    // console.log("Setting Caller Data:", data); // Log the data before setting the state

    setCallerData(data); // Set the caller data state
    setOpenDeatils2(true); // Open the modal
  };

  const handleCloseDetails2 = () => {
    setOpenDeatils2(false);
  };
  // snehas code

  const handleOpenFeedback = () => {
    setOpenFeedback(true);
  };

  const handleCloseFeedback = () => {
    setOpenFeedback(false);
    // window.location.reload();
  };
  /////Anjali's Code End

  const handleOpenRecPayment = () => {
    setOpenRecPayment(true);
  };
  const handleCloseRecPayment = () => {
    setOpenRecPayment(false);
  };
  const handleOpenIsInvoice = () => {
    setIsInvoicePopup(true);
  };
  const handleCloseIsInvoice = () => {
    setIsInvoicePopup(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChange = (event) => {
    setAuth(event.target.checked);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //Model open and close function
  const handleOpenReschedule = () => {
    setOpenReschedule(true);
  };
  const handleCloseReschedule = () => {
    setOpenReschedule(false);
  };
  const handleOpenSrvExtend = () => {
    setOpenSrvExtend(true);
  };
  const handleCloseSrvExtend = () => {
    setOpenSrvExtend(false);
  };
  const handleOpenCancel = () => {
    setOpenCancel(true);
  };
  const handleCloseCancel = () => {
    setOpenCancel(false);
  };

  const handleOpenPayment = (eventID, callerPhone) => {
    console.log("Caller Phone:", callerPhone);
    fetchCallerPhoneData(callerPhone);
    setOpenPayment(true);
  };

  const handleOpenDocument = () => {
    setOpenDocument(true);
  };

  const fetchCallerPhoneData = (callerPhone) => {
    fetch(`${port}/app/wallet/1/${clrPhn}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
        setWalletData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleClosePayment = () => {
    setOpenPayment(false);
  };
  const handleCloseDocument = () => {
    setOpenDocument(false);
  };
  const handleOpenProfessional = () => {
    setOpenProfessional(true);
  };
  const handleCloseProfessional = () => {
    setOpenProfessional(false);
  };
  const handleOpenSession = () => {
    setOpenSession(true);
  };
  const handleCloseSession = () => {
    getOngoingServices();
    setOpenSession(false);
  };
  const handleOpenInvoice = () => {
    setOpenInvoice(true);
  };
  const handleCloseInvoice = () => {
    setOpenInvoice(false);
  };
  const handleOpenDetails = () => {
    setOpenDeatils(true);
  };
  const handleCloseDetails = () => {
    setOpenDeatils(false);
  };

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

  // useEffect(() => {
  //     const getOngoingServices = async () => {
  //         try {
  //             const res = await fetch(`${port}/web/Ongoing_Event/`, {
  //                 headers: {
  //                     'Authorization': `Bearer ${accessToken}`,
  //                     'Content-Type': 'application/json',
  //                 },
  //             });
  //             const data = await res.json();
  //             console.log("Ongoing Services Data.........", data);
  //             setOnServices(data);
  //             setLoading(false);
  //         } catch (error) {
  //             console.error("Error fetching Ongo
  //
  // ing Services Data:", error);
  //             setLoading(false);
  //         }
  //     };
  //     getOngoingServices();
  // }, []);

  // useEffect(() => {
  const getOngoingServices = async () => {
    setLoading(true);
    try {
      let apiUrl = `${port}/web/Ongoing_Event/`;
      if (filterType === "eventCode" && searchValue) {
        apiUrl = `${port}/web/Ongoing_Event/?eve_code=${searchValue}`;
      } else if (filterType === "ptnPhn" && searchValue) {
        apiUrl = `${port}/web/Ongoing_Event/?patient_no=${searchValue}&date=${startDateTime}`;
      } else if (filterType === "ptnName" && searchValue) {
        apiUrl = `${port}/web/Ongoing_Event/?patient_name=${searchValue}&date=${startDateTime}`;
      } else if (filterType === "clrPhn" && searchValue) {
        apiUrl = `${port}/web/Ongoing_Event/?caller_no=${searchValue}&date=${startDateTime}`;
      } else if (filterType === "profName" && searchValue) {
        apiUrl = `${port}/web/Ongoing_Event/?prof_name=${searchValue}&date=${startDateTime}`;
      } else if (startDateTime) {
        apiUrl = `${port}/web/Ongoing_Event/?date=${startDateTime}`;
      }
      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("Ongoing Services Data.........", data);
      if (data.msg === "data not foundf") {
        setOnServices([]);
      } else {
        setOnServices(data);
      }
    } catch (error) {
      console.error("Error fetching Ongoing Services Data:", error);
    } finally {
      setLoading(false);
    }
  };
  // getOngoingServices();
  // }, [filterType, searchValue, startDateTime]);

  useEffect(() => {
    getOngoingServices();
  }, [searchValue, startDateTime]);

  useEffect(() => {
    const getServiceRequest = async () => {
      // if (accessHospitalID) {
      try {
        const res = await fetch(
          `${port}/web/service_request/${accessHospitalID}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        console.log("Service Request Data.........", data);
        setServiceRequest(data.event_code);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Service Request Data:", error);
        setLoading(false);
      }
      // }
    };
    getServiceRequest();
  }, [accessHospitalID]);

  // const filteredData1 = serviceRequest.filter(item => {
  //     const isDateMatch = !selectedDate || (item.event_start_date && item.event_start_date.includes(selectedDate));
  //     const isServiceMatch = !selectedService || (item.service_name && item.service_name.toLowerCase().includes(selectedService.toLowerCase()));
  //     const isCallerStatusMatch = !selectedCallerStatus || selectedCallerStatus === 5 || item.caller_status === selectedCallerStatus;

  //     return isDateMatch && isServiceMatch && isCallerStatusMatch;
  // });

  // useEffect(() => {
  const getRequestAllocation = async () => {
    if (eventID) {
      try {
        // const res = await fetch(`${port}/web/agg_hhc_srv_req_prof_allocate/${eventID}`);
        const res = await fetch(
          `${port}/web/agg_hhc_srv_req_prof_allocate/${eventID}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        console.log("Request Allocation Data.........", data);
        setRequestAllocation(data);
        const eventValue = data.Event_ID;
        const patientValue = data.patient_details.agg_sp_pt_id;
        const callerValue = data.caller_details.caller_id;
        const eventPlanValue = data.POC[0].eve_poc_id;

        console.log("eventID", eventValue);
        console.log("patientID", patientValue);
        console.log("callerID", callerValue);
        console.log("eventPlanID", eventPlanValue);
        // Sneha's code
        if (jobClosureStatus === sesCount) {
          setOpenProfessional(true);
          //Sneha's code end
        } else {
          navigate("/viewservice", {
            state: {
              patientID: patientValue,
              callerID: callerValue,
              eventPlanID: eventPlanValue,
              eventID: eventValue,
              flag: 2,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching Request Allocation:", error);
      }
    }
  };
  // getRequestAllocation();
  // }, [eventID]);

  const getEventIDRequest = (eveId) => {
    const selectedRequest = serviceRequest.find(
      (item) => item.event_id === eveId
    );
    console.log("Selected Event:", selectedRequest);
    if (selectedRequest) {
      console.log("Selected Event ID:", selectedRequest.event_id);
      setEventID(selectedRequest.event_id);
    }
    getRequestAllocation();
  };

  const handleReset = () => {
    setStartDateTime("");
    setTempStartDateTime("");
    setFilterType("searchby");
    setShowSearchBox(false);
    setSearchValue("");
    setTempSearchValue("");
    // setOnServices([]);
    setLoading(false);
    setPage(0);
  };

  const handleFilterTypeChange = (event) => {
    // setFilterType(event.target.value);
    const value = event.target.value;
    setFilterType(value);
    // setSearchValue('');
    setTempSearchValue("");
    setShowSearchBox(value !== "searchby");
  };

  const handleTempSearchChange = (event) => {
    setTempSearchValue(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSubmit = () => {
    // setLoading(true);
    setSearchValue(tempSearchValue);
    setStartDateTime(tempStartDateTime);
    setPage(0);
    // getOngoingServices();
  };

  const getPlaceholderText = () => {
    switch (filterType) {
      case "eventCode":
        return "Search by event code...";
      case "ptnPhn":
        return "Search by patient number...";
      case "ptnName":
        return "Search by patient name...";
      case "clrPhn":
        return "Search by caller number...";
      case "profName":
        return "Search by professional name...";
      default:
        return "Search here...";
    }
  };

  const eventIDRequest = (eveId) => {
    const selectedReschedule = onServices.find((item) => item.eve_id === eveId);
    if (selectedReschedule) {
      console.log("Selected Event ID:", selectedReschedule.eve_id);
      setEventID(selectedReschedule.eve_id);
      setcallerID(selectedReschedule.agg_sp_pt_id.caller_id);
      console.log(selectedReschedule.agg_sp_pt_id.caller_id, "calerid");
      setclrName(selectedReschedule.agg_sp_pt_id.caller_name);
      console.log("caller_name", selectedReschedule.agg_sp_pt_id?.caller_name);
      setPatientID(selectedReschedule.agg_sp_pt_id.patient_id);
      setEventCode(selectedReschedule.event_code);
      setPtnRecord(selectedReschedule.agg_sp_pt_id);
      setPayAmount(selectedReschedule.payment);
      setStartDT(selectedReschedule.service.start_date);
      setEndDateTime(selectedReschedule.service.end_date);
      setPtnName(selectedReschedule.agg_sp_pt_id.name);
      setPtnPhn(selectedReschedule.agg_sp_pt_id.phone);
      setClrPhn(selectedReschedule.agg_sp_pt_id.caller_phone);
      console.log("calllllll", selectedReschedule.agg_sp_pt_id.caller_phone);
      setProfName(selectedReschedule.job_closure.service_professional);
      setServiceID(selectedReschedule.service.service_id);
      setSubSrvID(selectedReschedule.service.sub_service_id);
      setJobClosureStatus(selectedReschedule.job_closure.job_closure_count);
      setSesCount(selectedReschedule.job_closure.total_session);
      setEvePlanID(selectedReschedule.service.eve_poc_id);
      setPtnZone(selectedReschedule.agg_sp_pt_id.zone_id);

      ////Anjali's Code Start
      console.log(
        "Total Session:",
        selectedReschedule.job_closure.total_session
      ); // Log total_session
      console.log(
        "Job Closure Count:",
        selectedReschedule.job_closure.job_closure_count
      ); // Log total_session
      setJobClosureCount(selectedReschedule.job_closure.job_closure_count);
      setTotalSessionCount(selectedReschedule.job_closure.total_session);
      ////Anjali's Code End
    }
  };

  useEffect(() => {
    const getPaymentDetails = async () => {
      if (eventID) {
        console.log("Payment Event ID", eventID);
        try {
          const res = await fetch(
            `${port}/web/get_payment_details/${eventID}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await res.json();
          // console.log("Payment Payment Details ID wise.....", data);
          setPayment(data);
          console.log("Payment Details ID wise", data);
        } catch (error) {
          console.error("Error fetching Payment Details ID wise:", error);
        }
      }
    };
    getPaymentDetails();
  }, [eventID]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0"); // Get day with leading zero
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get month with leading zero
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getServiceStatusTooltip = (serviceStatus) => {
    const title =
      serviceStatus === 1
        ? "Service about to end"
        : serviceStatus === 2
        ? "Acknowledge pending"
        : serviceStatus === 3
        ? "Acknowledge by professional"
        : serviceStatus === 4
        ? "Closure completed"
        : serviceStatus === 5
        ? "Pending for closure"
        : "";

    const iconColor =
      serviceStatus === 1
        ? "#D61616"
        : serviceStatus === 2
        ? "#2A1D1D"
        : serviceStatus === 3
        ? "#3D8A00"
        : serviceStatus === 4
        ? "#1342BA"
        : serviceStatus === 5
        ? "#BA139F"
        : "#000000";

    return (
      <Tooltip title={title} arrow>
        <IconButton>
          <CircleIcon style={{ color: iconColor, fontSize: "20px" }} />
        </IconButton>
      </Tooltip>
    );
  };

  // useEffect(() => {
  //     const filtered = onServices.filter(item => {

  //         const itemDateMatches = !selectedDate || Object.values(item.service || {}).some(prop => {
  //             if (typeof prop === 'string') {
  //                 return prop.toLowerCase().includes(selectedDate.toLowerCase());
  //             } else if (prop && prop.start_date) {
  //                 const itemDate = new Date(prop.start_date);
  //                 const selected = new Date(selectedDate);
  //                 return itemDate.toDateString() === selected.toDateString();
  //             }
  //             return false;
  //         });

  //         const profNameMatches = !selectedProfessional || Object.values(item.job_closure).some(prop => {
  //             if (typeof prop === 'string') {
  //                 return prop.toLowerCase().includes(selectedProfessional.toLowerCase());
  //             }
  //             return false;
  //         });

  //         const serviceNameMatches = !selectedService || Object.values(item.service || {}).some(prop => {
  //             if (typeof prop === 'string') {
  //                 return prop.toLowerCase().includes(selectedService.toLowerCase());
  //             }
  //             return false;
  //         });

  //         const searchMatches = !searchInput ||
  //             item.event_code.toLowerCase().includes(searchInput.toLowerCase()) ||
  //             item.agg_sp_pt_id.name.toLowerCase().includes(searchInput.toLowerCase()) ||
  //             item.agg_sp_pt_id.phone.toString().includes(searchInput);

  //         return itemDateMatches && profNameMatches && serviceNameMatches && searchMatches;
  //     });

  //     setFilteredData(filtered);
  //     setPage(0);
  // }, [selectedDate, selectedProfessional, selectedService, onServices, searchInput]);

  const handleExtendService = () => {
    navigate("/addservice", { state: { eventID } });
  };
  
  useEffect(() => {
    const getCallerDetails = async () => {
      if (callerId) {
        try {
          // const res = await fetch(`${port}/web/Caller_details_api/${callerID}`);
          const res = await fetch(
            `${port}/web/Caller_details_api/${callerId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await res.json();
          console.log("Caller Details ID wise", data);
          setCaller(data.caller || {}); // Fallback to empty object if no data
          // setRelation(data.caller.caller_rel_id);
        } catch (error) {
          console.error("Error fetching Caller Details ID wise:", error);
        }
      }
    };
    getCallerDetails();
  }, [callerId]);

  return (
    <>
      <Navbar />
      <Box sx={{ flexGrow: 1, mt: 13.5, ml: 1, mr: 1, mb: 4 }}>
        {selected === "service" ? (
          <Stack
            direction={isSmallScreen ? "column" : "row"}
            spacing={1}
            alignItems={isSmallScreen ? "center" : "flex-start"}
            sx={{ pt: 1 }}
          >
            <Typography
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginTop: "7px",
                marginLeft: "0.4px",
                color: "rgb(54, 165, 121)",
              }}
              // color="text.secondary"
              gutterBottom
            >
              ONGOING SERVICES
            </Typography>

            <Box
              component="form"
              sx={{
                marginLeft: "2rem",
                // p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 300,
                height: "2.6rem",
                backgroundColor: "#f1f1f1",
                boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                borderRadius: "10px",
                border: "1px solid #C9C9C9",
              }}
            >
              <InputBase
                sx={{ ml: 1, mr: 1, flex: 1 }}
                type="date"
                value={tempStartDateTime}
                onChange={(event) => setTempStartDateTime(event.target.value)}
              />
            </Box>

            <Box
              component="form"
              sx={{
                marginLeft: "2rem",
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 300,
                height: "2.5rem",
                backgroundColor: "#f1f1f1",
                boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                borderRadius: "10px",
                border: "1px solid #C9C9C9",
              }}
            >
              <TextField
                select
                size="small"
                fullWidth
                value={filterType}
                onChange={handleFilterTypeChange}
                sx={{
                  textAlign: "center",
                  "& input": {
                    fontSize: "14px",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                    },
                  },
                }}
              >
                <MenuItem value="searchby" disabled>
                  Search by
                </MenuItem>
                <MenuItem value="clrPhn" style={{ fontSize: "15px" }}>
                  Caller Number
                </MenuItem>
                <MenuItem value="eventCode" style={{ fontSize: "15px" }}>
                  Event Code
                </MenuItem>
                <MenuItem value="ptnName" style={{ fontSize: "15px" }}>
                  Patient Name
                </MenuItem>
                <MenuItem value="ptnPhn" style={{ fontSize: "15px" }}>
                  Patient Number
                </MenuItem>
                <MenuItem value="profName" style={{ fontSize: "15px" }}>
                  Professional Name
                </MenuItem>
              </TextField>
            </Box>

            {showSearchBox && (
              <Box
                component="form"
                sx={{
                  marginLeft: "2rem",
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 300,
                  height: "2.5rem",
                  backgroundColor: "#f1f1f1",
                  boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                  borderRadius: "10px",
                  border: "1px solid #C9C9C9",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder={getPlaceholderText()}
                  value={tempSearchValue}
                  onChange={handleTempSearchChange}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SearchIcon style={{ color: "#7AB7EE" }} />
                </IconButton>
              </Box>
            )}

            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                textTransform: "capitalize",
                height: "40px",
                borderRadius: "8px",
                width: "12ch",
                bgcolor: "rgb(52, 123, 137)",
                "&:hover": {
                  backgroundColor: "rgb(52, 123, 137)",
                },
              }}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              sx={{
                textTransform: "capitalize",
                height: "40px",
                borderRadius: "8px",
                width: "12ch",
              }}
            >
              Reset
            </Button>

            <Box sx={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
              <ToggleButtonGroup
                value={selected}
                exclusive
                onChange={handleChangeToggle}
                aria-label="service-session-toggle"
                sx={{
                  "& .MuiToggleButton-root": { height: 40, minWidth: 100 },
                }}
              >
                <ToggleButton value="service" aria-label="service">
                  Service
                </ToggleButton>
                <ToggleButton value="session" aria-label="session">
                  Session
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Stack>
        ) : (
          <Stack
            direction={isSmallScreen ? "column" : "row"}
            spacing={1}
            alignItems={isSmallScreen ? "center" : "flex-start"}
            sx={{ pt: 1 }}
          >
            <Typography
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginTop: "7px",
                marginLeft: "0.4px",
                color: "rgb(54, 165, 121)",
              }}
              // color="text.secondary"
              gutterBottom
            >
              Professional Live Tracking
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
              <ToggleButtonGroup
                value={selected}
                exclusive
                onChange={handleChangeToggle}
                aria-label="service-session-toggle"
                sx={{
                  "& .MuiToggleButton-root": { height: 40, minWidth: 100 },
                }}
              >
                <ToggleButton value="service" aria-label="service">
                  Service
                </ToggleButton>
                <ToggleButton value="session" aria-label="session">
                  Session
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Stack>
        )}

        {selected === "service" ? (
          <>
            <TableContainer
              sx={{
                height:
                  filteredData.length === 0 || filteredData.length < 5
                    ? "60vh"
                    : "auto",
                // ✅ allows vertical scroll instead of clipping
                overflowY: "hidden !important", // ✅ hides horizontal scroll if not needed
              }}
              // className="pagination-scroll"
            >
              <Table sx={{ overflowY: "hidden" }}>
                <TableHead>
                  <TableRow>
                    <OngoingServiceCard
                      style={{
                        background: "rgb(173, 219, 177)",
                        color: "#423737",
                        borderRadius: "8px 10px 0 0",
                        height: "50px",
                      }}
                    >
                      <CardContent
                        style={{
                          flex: 0.5,
                          borderRight: "1px solid #ffffff",
                          fontSize: "14px",
                        }}
                      >
                        <Typography
                          style={{ fontSize: "13px", fontWeight: 500 }}
                        >
                          Sr. No
                        </Typography>
                      </CardContent>
                      <CardContent
                        style={{
                          flex: 2,
                          borderRight: "1px solid #ffffff",
                          fontSize: "14px",
                        }}
                      >
                        <Typography
                          style={{ fontSize: "13px", fontWeight: 500 }}
                        >
                          Event Code
                        </Typography>
                      </CardContent>
                      <CardContent
                        style={{
                          flex: 1.8,
                          borderRight: "1px solid #ffffff",
                          fontSize: "14px",
                        }}
                      >
                        <Typography
                          style={{ fontSize: "13px", fontWeight: 500 }}
                        >
                          Patient Name
                        </Typography>
                      </CardContent>
                      <CardContent
                        style={{
                          flex: 1.6,
                          borderRight: "1px solid #ffffff",
                          fontSize: "14px",
                        }}
                      >
                        <Typography
                          style={{ fontSize: "13px", fontWeight: 500 }}
                        >
                          Caller No
                        </Typography>
                      </CardContent>
                      <CardContent
                        style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2">
                          Professional
                        </Typography>
                      </CardContent>
                      <CardContent
                        style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2">
                          Service Name
                        </Typography>
                      </CardContent>
                      <CardContent
                        style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2">Start Date</Typography>
                      </CardContent>
                      <CardContent
                        style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2">End Date</Typography>
                      </CardContent>
                      <CardContent
                        style={{ flex: 1.7, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2">
                          Payment Status
                        </Typography>
                      </CardContent>
                      <CardContent
                        style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2">Job Closure</Typography>
                      </CardContent>
                      <CardContent
                        style={{ flex: 1.2, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2">Added by</Typography>
                      </CardContent>
                      <CardContent
                        style={{
                          flex: 0.5,
                          borderRight: "1px solid #FFFFFF",
                          cursor: "pointer",
                        }}
                      >
                        <Tooltip title="Feedback Status" arrow>
                          <RateReviewIcon />
                        </Tooltip>
                      </CardContent>
                      <CardContent style={{ flex: 0.2 }}>
                        <Typography variant="subtitle2">Action</Typography>
                      </CardContent>
                    </OngoingServiceCard>
                  </TableRow>
                </TableHead>
                {loading ? (
                  <Box
                    sx={{ display: "flex", mt: 20, ml: 80, height: "130px" }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <CardContent>
                          <Typography variant="body2">
                            No Data Available
                          </Typography>
                        </CardContent>
                      </TableRow>
                    ) : (
                      filteredData
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                              height: "auto",
                              textAlign: "left",
                              alignItems: "left",
                            }}
                          >
                            <OngoingServiceCard
                              style={{ height: "3rem" }}
                              sx={{
                                background: "#f1f1f1",
                                borderLeft: "4px solid transparent",
                                transition: "all 0.3s ease-in-out",
                                cursor: "pointer",
                                "&:hover": {
                                  borderLeft: "4px solid rgb(19 166 31)",
                                  borderRight: "4px solid rgb(19 166 31)",
                                  transform: "scale(1)",
                                },
                              }}
                            >
                              <CardContent style={{ flex: 0.5 }}>
                                <Typography variant="body2">
                                  {index + 1 + page * rowsPerPage}
                                </Typography>
                              </CardContent>
                              <CardContent style={{ flex: 2.2 }}>
                                <Typography
                                  variant="body2"
                                  onClick={() => {
                                    eventIDRequest(row.eve_id);
                                    handleOpenDetails();
                                  }}
                                >
                                  {row.event_code}
                                </Typography>
                                <Modal
                                  open={openDetails}
                                  onClose={handleCloseDetails}
                                  aria-labelledby="parent-modal-title"
                                  aria-describedby="parent-modal-description"
                                >
                                  <EventDetails
                                    eveID={eventID}
                                    open={openDetails}
                                    onClose={handleCloseDetails}
                                  />
                                </Modal>
                              </CardContent>
                              <CardContent style={{ flex: 1.6 }}>
                                <Typography
                                  variant="body2"
                                  textAlign="left"
                                  style={{
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                    alignItems: "left",
                                    // maxWidth: '100%',
                                    color: "#000000",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    patientIDRequest(
                                      row?.agg_sp_pt_id?.patient_id
                                    );
                                    handleOpenPatientDetails();
                                  }}
                                >
                                  {row?.agg_sp_pt_id?.name
                                    ? row?.agg_sp_pt_id?.name
                                    : ""}
                                </Typography>

                                {patient && (
                                  <Modal
                                    open={openPatientDetails}
                                    onClose={handleClosePatientDetails}
                                    aria-labelledby="patient-modal-title"
                                    aria-describedby="patient-modal-description"
                                  >
                                    <Box
                                      sx={{
                                        ...style,
                                        width: 400,
                                        borderRadius: "10px",
                                      }}
                                    >
                                      <AppBar
                                        position="static"
                                        style={{
                                          background:
                                            "linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)",
                                          width: "29rem",
                                          height: "3rem",
                                          marginTop: "-16px",
                                          marginLeft: "-32px",
                                          borderRadius: "8px 10px 0 0",
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
                                            PATIENT DETAILS
                                          </Typography>
                                          <Button
                                            onClick={handleClosePatientDetails}
                                            sx={{
                                              marginLeft: "15rem",
                                              color: "#FFFFFF",
                                              marginTop: "2px",
                                            }}
                                          >
                                            <CloseIcon />
                                          </Button>
                                        </div>
                                      </AppBar>
                                      <PatientView
                                        patientID={patientID}
                                        ptnID={patientID}
                                        ptnData={patient}
                                        hospData={hospital}
                                        open={openPatientDetails}
                                        // savePatientUpdate={savePatientUpdate}
                                        onClose={handleClosePatientDetails}
                                      />
                                    </Box>
                                  </Modal>
                                )}
                              </CardContent>
                              <CardContent style={{ flex: 1.6 }}>
                                <Typography
                                  variant="body2"
                                  onClick={() => {
                                    eventIDRequest(
                                      row.eve_id,
                                      row.agg_sp_pt_id?.caller_id,
                                      row.agg_sp_pt_id?.caller_phone
                                    );
                                    handleOpenDetails2();
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  {row.agg_sp_pt_id?.caller_phone || "N/A"}
                                </Typography>

                                {/* Modal moved outside the button */}
                                <Modal
                                  open={openDetails2}
                                  onClose={handleCloseDetails2}
                                  aria-labelledby="parent-modal-title"
                                  aria-describedby="parent-modal-description"
                                >
                                  <Box
                                    sx={{
                                      ...style,
                                      width: 300,
                                      borderRadius: "10px",
                                    }}
                                  >
                                    <AppBar
                                      position="static"
                                      style={{
                                        background:
                                          "linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)",
                                        width: "22.8rem",
                                        height: "3rem",
                                        marginTop: "-16px",
                                        marginLeft: "-32px",
                                        borderRadius: "8px 10px 0 0",
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
                                          CALLER DETAILS
                                        </Typography>
                                        <Button
                                          onClick={handleCloseDetails2} // Close modal
                                          sx={{
                                            marginLeft: "9rem",
                                            color: "#FFFFFF",
                                            marginTop: "2px",
                                          }}
                                        >
                                          <CloseIcon />
                                        </Button>
                                      </div>
                                    </AppBar>

                                    <CallerView
                                      callerID={callerId}
                                      eveId={eventID}
                                      callerNumber={clrPhn}
                                      callerName={clrName}
                                      Datareqcaller={caller}
                                      onClose={handleCloseDetails2} // Close modal after conflict resolution
                                      flag={1}
                                    />
                                  </Box>
                                </Modal>
                              </CardContent>

                              <CardContent style={{ flex: 2, minWidth: 0 }}>
                                <Typography
                                  variant="body2"
                                  textAlign="left"
                                  sx={{
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {row.job_closure &&
                                  row.job_closure.service_professional
                                    ? `${row.job_closure.service_professional}`
                                    : ""}
                                </Typography>
                              </CardContent>

                              <CardContent style={{ flex: 1.5 }}>
                                <Typography variant="body2" textAlign="left">
                                  {row.service ? row.service.service : ""}
                                </Typography>
                              </CardContent>

                              <CardContent style={{ flex: 1.5 }}>
                                <Typography variant="body2">
                                  {formatDate(
                                    row.service ? row.service.start_date : ""
                                  )}
                                </Typography>
                              </CardContent>
                              <CardContent style={{ flex: 1.5 }}>
                                <Typography variant="body2">
                                  {formatDate(
                                    row.service ? row.service.end_date : ""
                                  )}
                                </Typography>
                              </CardContent>
 <CardContent style={{ flex: 1.7 }}>
  {row.payment.pending_amount === 0 ? (
    <div style={{ display: "flex", alignItems: "center" }}>
      <CheckCircleIcon
        style={{
          fontSize: "16px",
          color: "#3D8A00",
          marginRight: "4px", // spacing between icon and text
        }}
      />
      <Typography
        variant="body2"
        sx={{
          textAlign: "left",
          wordBreak: "break-word",
          whiteSpace: "normal",
          cursor: row.payment.payment_status === 1 ? "pointer" : "default",
        }}
        onClick={
          row.payment.payment_status === 1
            ? () => {
                eventIDRequest(row.eve_id);
                handleOpenRecPayment();
              }
            : undefined
        }
      >
        {row.payment.payment_status === 1
          ? "Received by professional"
          : row.payment.payment_status === 100
          ? "Complementary"
          : "Received by desk"}
      </Typography>
    </div>
  ) : (
    <Typography variant="body2" sx={{ textAlign: "left", wordBreak: "break-word", whiteSpace: "normal" }}>
      {row.payment.payment_status === 100 ? (
        "Complementary"
      ) : (
        <>
          ₹ <span style={{ color: "#DA0000" }}>{parseInt(row.payment.pending_amount)}</span>/{parseInt(row.payment.final_amount)}
        </>
      )}
    </Typography>
  )}
</CardContent>


                              <Modal
                                open={openRecPayment}
                                onClose={handleCloseRecPayment}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                              >
                                <Box
                                  sx={{
                                    ...style,
                                    width: 300,
                                    borderRadius: "10px",
                                    border: "none",
                                  }}
                                >
                                  <AppBar
                                    position="static"
                                    style={{
                                      background:
                                        "linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)",
                                      width: "22.8rem",
                                      height: "3rem",
                                      marginTop: "-16px",
                                      marginLeft: "-32px",
                                      borderRadius: "8px 10px 0 0",
                                    }}
                                  >
                                    <div style={{ display: "flex" }}>
                                      <Typography
                                        align="center"
                                        style={{
                                          fontSize: "16px",
                                          fontWeight: 600,
                                          color: "#FFFFFF",
                                          marginTop: "10px",
                                          marginLeft: "15px",
                                        }}
                                      >
                                        PAYMENT DETAILS
                                      </Typography>
                                      <Button
                                        onClick={handleCloseRecPayment}
                                        sx={{
                                          marginLeft: "120px",
                                          color: "#FFFFFF",
                                          marginTop: "2px",
                                        }}
                                      >
                                        <CloseIcon />
                                      </Button>
                                    </div>
                                  </AppBar>
                                  <RecvdPayment
                                    eveID={eventID}
                                    ptnData={ptnRecord}
                                    payAmt={payAmount}
                                    sesCount={sesCount}
                                  />
                                </Box>
                              </Modal>

                              <CardContent style={{ flex: 1 }}>
                                <Typography variant="body2">
                                  {row.job_closure
                                    ? row.job_closure.job_closure_count
                                    : ""}
                                  /
                                  {row.job_closure
                                    ? row.job_closure.total_session
                                    : ""}
                                </Typography>
                              </CardContent>
                              <CardContent style={{ flex: 1.2 }}>
                                <Tooltip
                                  title={
                                    row ? row.added_by : "No data available"
                                  }
                                  arrow
                                >
                                  <Typography
                                    variant="body2"
                                    textAlign="left"
                                    alignItems="flex-start"
                                  >
                                    {row?.added_by?.slice
                                      ? `${row.added_by.slice(0, 5)}...`
                                      : "-"}
                                  </Typography>
                                </Tooltip>
                              </CardContent>
                              <CardContent style={{ flex: 0.5 }}>
                                <Typography variant="body2" textAlign="left">
                                  {row?.is_feedback_complete === true ? (
                                    <CheckCircleOutlineIcon
                                      style={{ color: "green" }}
                                    />
                                  ) : (
                                    <CancelIcon style={{ color: "red" }} />
                                  )}
                                </Typography>
                              </CardContent>
                              <CardContent style={{ flex: 0.2 }}>
                                {auth && (
                                  <div>
                                    <IconButton
                                      size="large"
                                      aria-label="account of current user"
                                      aria-controls="menu-appbar"
                                      aria-haspopup="true"
                                      align="right"
                                      onClick={(event) => {
                                        eventIDRequest(row.eve_id);
                                        handleMenu(event);
                                      }}
                                      color="inherit"
                                    >
                                      <MoreHorizIcon
                                        style={{
                                          fontSize: "18px",
                                          cursor: "pointer",
                                        }}
                                      />
                                    </IconButton>
                                    <Menu
                                      id="menu-appbar"
                                      anchorEl={anchorEl}
                                      anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                      }}
                                      keepMounted
                                      transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                      }}
                                      open={Boolean(anchorEl)}
                                      onClose={handleClose}
                                      s
                                    >
                                      <MenuItem
                                        onClick={() =>
                                          handleOpenReschedule(() =>
                                            eventIDRequest(row.eve_id)
                                          )
                                        }
                                      >
                                        Service Reschedule
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          handleOpenSrvExtend(() =>
                                            eventIDRequest(row.eve_id)
                                          )
                                        }
                                      >
                                        Service Extend
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          getEventIDRequest(row.eve_id)
                                        }
                                      >
                                        Professional Reschedule
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          handleOpenCancel(() =>
                                            eventIDRequest(row.eve_id)
                                          )
                                        }
                                      >
                                        Service Cancellation
                                      </MenuItem>

                                      <MenuItem
                                        onClick={() =>
                                          handleOpenPayment(() =>
                                            eventIDRequest(
                                              row.eve_id,
                                              row.agg_sp_pt_id
                                                ? row.agg_sp_pt_id.caller_phone
                                                : ""
                                            )
                                          )
                                        }
                                      >
                                        Make Payment
                                      </MenuItem>

                                      <MenuItem
                                        onClick={() =>
                                          handleOpenSession(() =>
                                            eventIDRequest(row.eve_id)
                                          )
                                        }
                                      >
                                        Closure
                                      </MenuItem>

                                      <MenuItem
                                        onClick={() =>
                                          handleOpenInvoice(() =>
                                            eventIDRequest(row.eve_id)
                                          )
                                        }
                                      >
                                        Invoice
                                      </MenuItem>

                                      {/* Anjali's Code Start */}
                                      <MenuItem
                                        onClick={() =>
                                          handleOpenFeedback(() =>
                                            eventIDRequest(row.eve_id)
                                          )
                                        }
                                      >
                                        Feedback
                                      </MenuItem>

                                      <MenuItem
                                        onClick={() =>
                                          handleOpenDocument(() =>
                                            eventIDRequest(row.eve_id)
                                          )
                                        }
                                      >
                                        Discharge Summary
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          handleOpenLongTermForm(() =>
                                            eventIDRequest(row.eve_id)
                                          )
                                        }
                                        // onClick={() =>
                                        //   handleOpenLongTermForm(row.eve_id)
                                        // }
                                      >
                                        Long Term Form
                                      </MenuItem>
                                    </Menu>

                                    <Modal
                                      open={open}
                                      onClose={() => setOpen(false)}
                                      aria-labelledby="longterm-modal-title"
                                      aria-describedby="longterm-modal-description"
                                    >
                                      <Box
                                        sx={{
                                          ...style,
                                          width: 550,
                                          borderRadius: "10px",
                                          border: "none",
                                          p: 0,
                                          overflow: "hidden",
                                        }}
                                      >
                                        {/* Header AppBar */}
                                        <AppBar
                                          position="static"
                                          sx={{
                                            background: "rgb(173, 219, 177)",
                                            height: "3rem",
                                            borderRadius: "8px 8px 0 0", // ✅ match Box top border radius
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              px: 2,
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: "16px",
                                                fontWeight: 600,
                                                color: "#FFFFFF",
                                                flexGrow: 1,
                                              }}
                                            >
                                              Long Term
                                            </Typography>
                                            <Button
                                              onClick={() => setOpen(false)}
                                              sx={{
                                                color: "#FFFFFF",
                                                minWidth: "auto",
                                              }}
                                            >
                                              <CloseIcon />
                                            </Button>
                                          </Box>
                                        </AppBar>

                                        {/* Modal Content */}
                                        <Box sx={{ p: 2 }}>
                                          <Stack spacing={2}>
                                            {/* Yes/No */}
                                            <FormControl fullWidth size="small">
                                              <Select
                                                value={yesNo}
                                                disabled={isSubmitted}
                                                onChange={(e) =>
                                                  setYesNo(
                                                    Number(e.target.value)
                                                  )
                                                }
                                              >
                                                <MenuItem value={1}>
                                                  Yes
                                                </MenuItem>
                                                <MenuItem value={2}>
                                                  No
                                                </MenuItem>
                                              </Select>
                                            </FormControl>

                                            {/* Radio buttons */}
                                            {!isSubmitted && yesNo === 1 && (
                                              <FormControl component="fieldset">
                                                <RadioGroup
                                                  row
                                                  value={notifyby}
                                                  onChange={(e) =>
                                                    setNotifyby(
                                                      Number(e.target.value)
                                                    )
                                                  }
                                                >
                                                  <FormControlLabel
                                                    value={1}
                                                    control={<Radio />}
                                                    label="Admin"
                                                  />
                                                  <FormControlLabel
                                                    value={2}
                                                    control={<Radio />}
                                                    label="Professional"
                                                  />
                                                </RadioGroup>
                                              </FormControl>
                                            )}

                                            {/* Role list */}
                                            {!isSubmitted &&
                                              yesNo === 1 &&
                                              notifyby && (
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <InputLabel id="role-list-label">
                                                    Select Name
                                                  </InputLabel>
                                                  <Select
                                                    labelId="role-list-label"
                                                    label="Select Name"
                                                    value={notifyname || ""}
                                                    onChange={(e) =>
                                                      setnotifyname(
                                                        e.target.value
                                                      )
                                                    }
                                                  >
                                                    {notifyby === 1 &&
                                                      roleList?.role ===
                                                        "admin" &&
                                                      roleList?.data?.map(
                                                        (item) => (
                                                          <MenuItem
                                                            key={
                                                              item.clg_ref_id
                                                            }
                                                            value={
                                                              item.clg_ref_id
                                                            }
                                                            sx={{
                                                              fontSize: "12px",
                                                              mt: 1,
                                                            }}
                                                          >
                                                            {item.name}
                                                          </MenuItem>
                                                        )
                                                      )}

                                                    {notifyby === 2 &&
                                                      roleList?.role ===
                                                        "professional" &&
                                                      roleList?.data?.map(
                                                        (item) => (
                                                          <MenuItem
                                                            key={
                                                              item.clg_ref_id
                                                            }
                                                            value={
                                                              item.clg_ref_id
                                                            }
                                                            sx={{
                                                              fontSize: "12px",
                                                              mb: 1,
                                                            }}
                                                          >
                                                            {item.name}
                                                          </MenuItem>
                                                        )
                                                      )}
                                                  </Select>
                                                </FormControl>
                                              )}

                                            {/* Submit button */}
                                            {!isSubmitted && (
                                              <Button
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                onClick={handleSave}
                                              >
                                                Submit
                                              </Button>
                                            )}
                                          </Stack>
                                        </Box>
                                      </Box>
                                    </Modal>

                                    <Modal
                                      open={openInvoice}
                                      onClose={handleCloseInvoice}
                                      aria-labelledby="parent-modal-title"
                                      aria-describedby="parent-modal-description"
                                    >
                                      <Invoice
                                        eveID={eventID}
                                        onClose={handleCloseInvoice}
                                      />
                                    </Modal>

                                    <Modal
                                      open={openDocument}
                                      onClose={handleCloseDocument}
                                      aria-labelledby="parent-modal-title"
                                      aria-describedby="parent-modal-description"
                                    >
                                      <Box
                                        sx={{
                                          ...style,
                                          width: 550,
                                          borderRadius: "10px",
                                          border: "none",
                                        }}
                                      >
                                        <>
                                          <AppBar
                                            position="static"
                                            style={{
                                              background: "rgb(173, 219, 177)",
                                              width: "38.5rem",
                                              height: "3rem",
                                              marginTop: "-16px",
                                              marginLeft: "-32px",
                                              borderRadius: "8px 10px 0 0",
                                            }}
                                          >
                                            <div style={{ display: "flex" }}>
                                              <Typography
                                                align="center"
                                                style={{
                                                  fontSize: "16px",
                                                  fontWeight: 600,
                                                  color: "#FFFFFF",
                                                  marginTop: "10px",
                                                  marginLeft: "15px",
                                                }}
                                              >
                                                Upload Documents
                                              </Typography>
                                              <Button
                                                onClick={handleCloseDocument}
                                                sx={{
                                                  marginLeft: "auto",
                                                  color: "#FFFFFF",
                                                  marginTop: "2px",
                                                }}
                                              >
                                                <CloseIcon />
                                              </Button>
                                            </div>
                                          </AppBar>
                                          <Documents
                                            eventID={eventID}
                                            callerId={callerId}
                                            patientID={patientID}
                                          />
                                        </>
                                      </Box>
                                    </Modal>

                                    <Modal
                                      open={openReschedule}
                                      onClose={handleCloseReschedule}
                                      aria-labelledby="parent-modal-title"
                                      aria-describedby="parent-modal-description"
                                    >
                                      <Box
                                        sx={{
                                          ...style,
                                          width: 300,
                                          borderRadius: "10px",
                                          border: "none",
                                        }}
                                      >
                                        {jobClosureStatus === sesCount ? (
                                          <Button
                                            variant="contained"
                                            sx={{
                                              mt: 1,
                                              ml: 1,
                                              background: "#2CDFAA",
                                              borderRadius: "10px",
                                              textTransform: "capitalize",
                                              fontWeight: "bold",
                                              color: "#fff",
                                              fontSize: "14px",
                                              boxShadow:
                                                "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                              "&:hover": {
                                                backgroundColor: "#1bb78d",
                                                boxShadow:
                                                  "0px 6px 12px rgba(0, 0, 0, 0.2)",
                                              },
                                            }}
                                          >
                                            Job closure completed. Service
                                            reschedule is no longer possible.
                                          </Button>
                                        ) : (
                                          <>
                                            <AppBar
                                              position="static"
                                              style={{
                                                background:
                                                  "rgb(173, 219, 177)",
                                                width: "22.8rem",
                                                height: "3rem",
                                                marginTop: "-16px",
                                                marginLeft: "-32px",
                                                borderRadius: "8px 10px 0 0",
                                              }}
                                            >
                                              <div style={{ display: "flex" }}>
                                                <Typography
                                                  align="center"
                                                  style={{
                                                    fontSize: "16px",
                                                    fontWeight: 600,
                                                    color: "#000000",
                                                    marginTop: "10px",
                                                    marginLeft: "15px",
                                                  }}
                                                >
                                                  SERVICE RESCHEDULE
                                                </Typography>
                                                <Button
                                                  onClick={
                                                    handleCloseReschedule
                                                  }
                                                  sx={{
                                                    marginLeft: "100px",
                                                    color: "#000000ff",
                                                    marginTop: "2px",
                                                  }}
                                                >
                                                  <CloseIcon />
                                                </Button>
                                              </div>
                                            </AppBar>
                                            <Reschedule
                                              eventID={eventID}
                                              eveStartDate={startDT}
                                              eveEndDate={endDateTime}
                                              open={openReschedule}
                                              jobClosureStatus={
                                                jobClosureStatus
                                              }
                                              sesCount={sesCount}
                                              getEventIDRequest={
                                                getEventIDRequest
                                              }
                                              onClose={handleCloseReschedule}
                                            />
                                          </>
                                        )}
                                      </Box>
                                    </Modal>

                                    <Modal
                                      open={openSrvExtend}
                                      onClose={handleCloseSrvExtend}
                                      aria-labelledby="parent-modal-title"
                                      aria-describedby="parent-modal-description"
                                    >
                                      <Box
                                        sx={{
                                          ...style,
                                          width: 300,
                                          borderRadius: "10px",
                                          border: "none",
                                          bgcolor: " #f1f1f1",
                                        }}
                                      >
                                        <AppBar
                                          position="static"
                                          style={{
                                            background: "rgb(173, 219, 177)",
                                            width: "22.8rem",
                                            height: "3rem",
                                            marginTop: "-16px",
                                            marginLeft: "-32px",
                                            borderRadius: "8px 10px 0 0",
                                          }}
                                        >
                                          <div style={{ display: "flex" }}>
                                            <Typography
                                              align="center"
                                              style={{
                                                fontSize: "16px",
                                                fontWeight: 600,
                                                color: "black",
                                                marginTop: "10px",
                                                marginLeft: "20px",
                                              }}
                                            >
                                              SERVICE EXTEND
                                            </Typography>
                                            <Button
                                              onClick={handleCloseSrvExtend}
                                              sx={{
                                                marginLeft: "150px",
                                                color: "black",
                                                marginTop: "2px",
                                              }}
                                            >
                                              <CloseIcon />
                                            </Button>
                                          </div>
                                        </AppBar>
                                        <div style={{ marginTop: "25px" }}>
                                          <Typography
                                            style={{
                                              fontSize: "13px",
                                              fontWeight: 500,
                                            }}
                                          >
                                            Are you sure want to extend the
                                            service?
                                          </Typography>
                                          <Button
                                            varaint="contained"
                                            onClick={handleExtendService}
                                            sx={{
                                              backgroundColor:
                                                "rgb(52, 123, 137)",
                                              borderRadius: "10px",
                                              color: "white",
                                              width: "14ch",
                                              marginLeft: "100px",
                                              marginTop: "25px",
                                              textTransform: "capitalize",
                                              "&:hover": {
                                                backgroundColor:
                                                  "rgb(52, 123, 137)",
                                              },
                                            }}
                                          >
                                            Yes
                                          </Button>
                                        </div>
                                      </Box>
                                    </Modal>

                                    <Modal
                                      open={openCancel}
                                      onClose={handleCloseCancel}
                                      aria-labelledby="parent-modal-title"
                                      aria-describedby="parent-modal-description"
                                    >
                                      <Box
                                        sx={{
                                          ...style,
                                          width: 300,
                                          borderRadius: "10px",
                                          border: "none",
                                        }}
                                      >
                                        {jobClosureStatus === sesCount ? (
                                          <Button
                                            variant="contained"
                                            sx={{
                                              mt: 1,
                                              ml: 1,
                                              background: "#1bb78d",
                                              borderRadius: "10px",
                                              textTransform: "capitalize",
                                              fontWeight: "bold",
                                              color: "#fff",
                                              fontSize: "14px",
                                              boxShadow:
                                                "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                              "&:hover": {
                                                backgroundColor: "#1bb78d",
                                                boxShadow:
                                                  "0px 6px 12px rgba(0, 0, 0, 0.2)",
                                              },
                                            }}
                                          >
                                            Job closure has already completed.
                                            Cannot cancel the service !!!
                                          </Button>
                                        ) : (
                                          <>
                                            <AppBar
                                              position="static"
                                              style={{
                                                // background:"linear gradient(to right,rgb(80, 64, 121),rgb(37, 55, 61)",
                                                background:
                                                  "rgb(173, 219, 177)",

                                                width: "22.8rem",
                                                height: "3rem",
                                                marginTop: "-16px",
                                                marginLeft: "-32px",
                                                borderRadius: "8px 10px 0 0",
                                              }}
                                            >
                                              <div style={{ display: "flex" }}>
                                                <Typography
                                                  align="center"
                                                  style={{
                                                    fontSize: "16px",
                                                    fontWeight: 600,
                                                    color: "#000000",
                                                    marginTop: "10px",
                                                    marginLeft: "15px",
                                                  }}
                                                >
                                                  SERVICE CANCELLATION
                                                </Typography>
                                                <Button
                                                  onClick={handleCloseCancel}
                                                  sx={{
                                                    marginLeft: "6rem",
                                                    color: "#000000",
                                                    marginTop: "2px",
                                                  }}
                                                >
                                                  <CloseIcon />
                                                </Button>
                                              </div>
                                            </AppBar>
                                            <Cancellation
                                              serviceID={serviceID}
                                              eventID={eventID}
                                              subSrvID={subSrvID}
                                              jobClosureStatus={
                                                jobClosureStatus
                                              }
                                              endDateTime={endDateTime}
                                              onClose={handleCloseCancel}
                                            />
                                          </>
                                        )}
                                      </Box>
                                    </Modal>

                                    <Modal
                                      open={openPayment}
                                      onClose={handleClosePayment}
                                      aria-labelledby="parent-modal-title"
                                      aria-describedby="parent-modal-description"
                                    >
                                      <Box
                                        sx={{
                                          ...style,
                                          width: 300,
                                          borderRadius: "10px",
                                          border: "none",
                                        }}
                                      >
                                        {/* {payment.Pending_Amount <= 0 ? ( */}
                                        {payment === "payment already done" ||
                                        payment.Pending_Amount === 0 ? (
                                          <Button
                                            variant="contained"
                                            sx={{
                                              mt: 2,
                                              ml: 6,
                                              background: "rgb(52, 123, 137)",
                                              borderRadius: "10px",
                                              textTransform: "capitalize",
                                              "&:hover": {
                                                backgroundColor:
                                                  "rgb(52, 123, 137)",
                                              },
                                            }}
                                          >
                                            <CheckCircleOutlineIcon
                                              sx={{
                                                fontSize: "20px",
                                                mr: "2px",
                                              }}
                                            />{" "}
                                            Payment Completed
                                          </Button>
                                        ) : (
                                          <>
                                            <AppBar
                                              position="static"
                                              style={{
                                                // background:
                                                //   "linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)",
                                                background:
                                                  "rgb(173, 219, 177)",

                                                width: "22.8rem",
                                                height: "3rem",
                                                marginTop: "-16px",
                                                marginLeft: "-32px",
                                                borderRadius: "8px 10px 0 0",
                                              }}
                                            >
                                              <div style={{ display: "flex" }}>
                                                <Typography
                                                  align="center"
                                                  style={{
                                                    fontSize: "16px",
                                                    fontWeight: 600,
                                                    color: "#000000",
                                                    marginTop: "10px",
                                                    marginLeft: "15px",
                                                  }}
                                                >
                                                  PAYMENT DETAILS
                                                </Typography>
                                                <Button
                                                  onClick={handleClosePayment}
                                                  sx={{
                                                    marginLeft: "8rem",
                                                    color: "#000000",
                                                    marginTop: "2px",
                                                  }}
                                                >
                                                  <CloseIcon />
                                                </Button>
                                              </div>
                                            </AppBar>
                                            <Payment
                                              eveID={eventID}
                                              ptnData={ptnRecord}
                                              pay={payment}
                                              onServices={onServices}
                                              walletData={walletData}
                                            />
                                          </>
                                        )}
                                      </Box>
                                    </Modal>

                                    <Modal
                                      open={openProfessional}
                                      onClose={handleCloseProfessional}
                                      aria-labelledby="parent-modal-title"
                                      aria-describedby="parent-modal-description"
                                    >
                                      <Box
                                        sx={{
                                          ...style,
                                          width: 300,
                                          borderRadius: "10px",
                                          border: "none",
                                        }}
                                      >
                                        {jobClosureStatus === sesCount ? (
                                          <Button
                                            variant="contained"
                                            sx={{
                                              mt: 1,
                                              ml: 1,
                                              background: "#2CDFAA",
                                              borderRadius: "10px",
                                              textTransform: "capitalize",
                                              fontWeight: "bold",
                                              color: "#fff",
                                              fontSize: "14px",
                                              boxShadow:
                                                "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                              "&:hover": {
                                                backgroundColor: "#1bb78d",
                                                boxShadow:
                                                  "0px 6px 12px rgba(0, 0, 0, 0.2)",
                                              },
                                            }}
                                          >
                                            Job closure completed. Professional
                                            Reschedule is no longer possible.
                                          </Button>
                                        ) : (
                                          <>
                                            <AppBar
                                              position="static"
                                              style={{
                                                background:
                                                  "linear-gradient(45deg,rgb(81, 84, 84) 38.02%, #0E8FE4 100%)",
                                                width: "22.8rem",
                                                height: "3rem",
                                                marginTop: "-16px",
                                                marginLeft: "-32px",
                                                borderRadius: "8px 10px 0 0",
                                              }}
                                            >
                                              <div style={{ display: "flex" }}>
                                                <Typography
                                                  align="center"
                                                  style={{
                                                    fontSize: "16px",
                                                    fontWeight: 600,
                                                    color: "#000000",
                                                    marginTop: "10px",
                                                    marginLeft: "15px",
                                                  }}
                                                >
                                                  PROFESSIONAL RESCHEDULE
                                                </Typography>
                                                <Button
                                                  onClick={
                                                    handleCloseProfessional
                                                  }
                                                  sx={{
                                                    marginLeft: "50px",
                                                    color: "#FFFFFF",
                                                    marginTop: "2px",
                                                  }}
                                                >
                                                  <CloseIcon />
                                                </Button>
                                              </div>
                                            </AppBar>
                                            <Professional
                                              eveID={eventID}
                                              serviceID={serviceID}
                                              subSrvID={subSrvID}
                                              ptnName={ptnName}
                                              ptnPhn={ptnPhn}
                                              evePlanID={evePlanID}
                                              ptnZone={ptnZone}
                                              startDateTime={startDateTime}
                                              endDateTime={endDateTime}
                                              onClose={handleCloseProfessional}
                                            />
                                          </>
                                        )}
                                      </Box>
                                    </Modal>

                                    <Modal
                                      open={openSession}
                                      onClose={handleCloseSession}
                                      aria-labelledby="parent-modal-title"
                                      aria-describedby="parent-modal-description"
                                    >
                                      <Box
                                        sx={{
                                          ...style,
                                          width: 800,
                                          borderRadius: "10px",
                                          border: "none",
                                        }}
                                      >
                                        <div style={{ display: "flex" }}>
                                          <Typography
                                            align="center"
                                            style={{
                                              fontSize: "16px",
                                              fontWeight: 600,
                                              marginTop: "10px",
                                              marginLeft: "2px",
                                              color: "gray",
                                            }}
                                          >
                                            All SESSIONS
                                          </Typography>
                                          <Button
                                            onClick={handleCloseSession}
                                            sx={{
                                              marginLeft: "39.5rem",
                                              color: "gray",
                                              marginTop: "2px",
                                            }}
                                          >
                                            <CloseIcon />
                                          </Button>
                                        </div>
                                        <Sessions
                                          eveID={eventID}
                                          subSrvID={subSrvID}
                                        />
                                      </Box>
                                    </Modal>

                                    {/* Anjali's code start */}
                                    {totalSessionCount !== null &&
                                      jobClosureCount !== null && (
                                        <Modal
                                          open={openFeedback}
                                          onClose={handleCloseFeedback}
                                          aria-labelledby="parent-modal-title"
                                          aria-describedby="parent-modal-description"
                                        >
                                          {totalSessionCount ===
                                          jobClosureCount ? (
                                            <Box
                                              sx={{
                                                ...style,
                                                width: "90%",
                                                maxWidth: 500,
                                                borderRadius: 2,
                                                border: "none",
                                              }}
                                            >
                                              <AppBar
                                                position="static"
                                                sx={{
                                                  background:
                                                    "linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)",
                                                  width: "35.3em",
                                                  height: "3rem",
                                                  mt: "-16px",
                                                  ml: "-32px",
                                                  borderRadius: "8px 10px 0 0",
                                                }}
                                              >
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                      "space-between",
                                                    alignItems: "center",
                                                    px: 2,
                                                  }}
                                                >
                                                  <Typography
                                                    align="center"
                                                    sx={{
                                                      fontSize: "16px",
                                                      fontWeight: 600,
                                                      color: "#FFFFFF",
                                                      mt: "10px",
                                                    }}
                                                  >
                                                    FEEDBACK
                                                  </Typography>
                                                  <Button
                                                    onClick={
                                                      handleCloseFeedback
                                                    }
                                                    sx={{
                                                      color: "#FFFFFF",
                                                      mt: "2px",
                                                      ml: "76%",
                                                    }}
                                                  >
                                                    <CloseIcon />
                                                  </Button>
                                                </Box>
                                              </AppBar>
                                              <Feedback
                                                eveID={eventID}
                                                patId={patientID}
                                              />
                                            </Box>
                                          ) : (
                                            <Box
                                              sx={{
                                                ...style,
                                                width: "80%",
                                                maxWidth: 500,
                                                borderRadius: 2,
                                                border: "none",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                p: 6,
                                              }}
                                            >
                                              <Typography variant="body1">
                                                Complete all job closure to open
                                                feedback.
                                              </Typography>
                                              <Button
                                                onClick={handleCloseFeedback}
                                                sx={{ color: "blue" }}
                                              >
                                                <CloseIcon />
                                              </Button>
                                            </Box>
                                          )}
                                        </Modal>
                                      )}
                                    {/* Anjali's code start */}
                                    {/* </Menu> */}
                                  </div>
                                )}
                              </CardContent>
                            </OngoingServiceCard>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                )}
              </Table>
            </TableContainer>

            <TablePagination
              // sx={}
              sx={{ overflowY: "hidden" }}
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TableContainer
                sx={{
                  maxHeight:
                    filteredData.length === 0 || filteredData.length < 5
                      ? "50vh"
                      : "unset",
                  display: "flex",
                  flexDirection: "column",

                  overflowY: "hidden",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <OngoingServiceCard
                        style={{
                          background: "rgb(173, 219, 177)",
                          color: "#423737",
                          borderRadius: "8px 10px 0 0",
                          height: "46px",
                        }}
                      >
                        <CardContent
                          style={{
                            flex: 1.5,
                            borderRight: "1px solid #FFFFFF",
                          }}
                        >
                          <Typography variant="subtitle2">
                            Event Code
                          </Typography>
                        </CardContent>
                        <CardContent
                          style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                        >
                          <Typography variant="subtitle2">
                            Professional Name
                          </Typography>
                        </CardContent>
                        <CardContent
                          style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                        >
                          <Typography variant="subtitle2">
                            Service Name
                          </Typography>
                        </CardContent>
                        <CardContent
                          style={{
                            flex: 1.5,
                            borderRight: "1px solid #FFFFFF",
                          }}
                        >
                          <Typography variant="subtitle2">
                            Start Time
                          </Typography>
                        </CardContent>
                        <CardContent
                          style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}
                        >
                          <Typography variant="subtitle2">End Time</Typography>
                        </CardContent>
                        {/* <CardContent
                          style={{
                            flex: 1,
                            borderRight: "1px solid #FFFFFF",
                          }}
                        >
                          <Typography variant="subtitle2">Status</Typography>
                        </CardContent> */}

                        <CardContent
                          style={{
                            flex: 0.8,
                            borderRight: "1px solid #FFFFFF",
                          }}
                        >
                          <Typography variant="subtitle2">
                            Map Marker
                          </Typography>
                        </CardContent>
                      </OngoingServiceCard>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {sessionData.length === 0 ? (
                      <TableRow>
                        <CardContent>
                          <Typography variant="body2">
                            No Data Available
                          </Typography>
                        </CardContent>
                      </TableRow>
                    ) : (
                      sessionData
                        .slice(
                          page2 * rowsPerPage2,
                          page2 * rowsPerPage2 + rowsPerPage2
                        )
                        .map((row, index) => (
                          <TableRow key={row.agg_sp_dt_eve_poc_id}>
                            <OngoingServiceCard
                              style={{ height: "3rem" }}
                              sx={{
                                background: "#f1f1f1",
                                borderLeft: "4px solid transparent",
                                transition: "all 0.3s ease-in-out",
                                cursor: "pointer",
                                "&:hover": {
                                  borderLeft: "4px solid rgb(19 166 31)",
                                  borderRight: "4px solid rgb(19 166 31)",
                                  transform: "scale(1)",
                                },
                              }}
                            >
                              <CardContent style={{ flex: 1.5 }}>
                                <Typography variant="body2">
                                  {row.eve_id_id?.event_code || "-"}
                                </Typography>
                              </CardContent>
                              <CardContent style={{ flex: 2 }}>
                                <Typography variant="body2">
                                  {row.srv_prof_id_id?.prof_fullname || "-"}
                                </Typography>
                              </CardContent>
                              <CardContent style={{ flex: 2 }}>
                                <Typography variant="body2">
                                  {row.service_title || "-"}
                                </Typography>
                              </CardContent>
                              <CardContent style={{ flex: 1.5 }}>
                                <Typography variant="body2">
                                  {row.start_time || "-"}
                                </Typography>
                              </CardContent>
                              <CardContent style={{ flex: 1 }}>
                                <Typography variant="body2">
                                  {row.end_time || "-"}
                                </Typography>
                              </CardContent>
                              {/* <CardContent style={{ flex: 1 }}>
                                <Typography variant="body2">
                                  {row.Session_status || "-"}
                                </Typography>
                              </CardContent> */}
                              {row.Session_status === "In route" ? (
                                <CardContent style={{ flex: 0.8 }}>
                                  <LocationOnIcon
                                    style={{
                                      color: "#1976d2",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      const lat = row.latitude;
                                      const lng = row.longitude;
                                      const profId =
                                        row.srv_prof_id_id?.srv_prof_id;

                                      setSelectedMapData({ lat, lng, profId });
                                    }}
                                  />
                                </CardContent>
                              ) : (
                                <CardContent style={{ flex: 0.8 }}>
                                  -
                                </CardContent>
                              )}
                            </OngoingServiceCard>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                sx={{ overflowY: "hidden" }}
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={sessionData.length}
                rowsPerPage={rowsPerPage2}
                page={page2}
                onPageChange={handleChangePage2}
                onRowsPerPageChange={handleChangeRowsPerPage2}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                sx={{
                  background: "#f5f5f5",
                  p: 2,
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <Map
                  lat={selectedMapData?.lat}
                  lng={selectedMapData?.lng}
                  profId={selectedMapData?.profId}
                />
              </Typography>
            </Grid>
          </Grid>
        )}
      </Box>
      <Footer />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
export default Ongoingservice;
