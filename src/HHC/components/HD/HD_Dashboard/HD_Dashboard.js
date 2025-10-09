// import React, { useEffect, useState } from "react";
// import {
//   Grid,
//   Box,
//   Typography,
//   Tab,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import TabContext from "@mui/lab/TabContext";
// import TabList from "@mui/lab/TabList";
// import TabPanel from "@mui/lab/TabPanel";

// import Navbar from "../../../Navbar";
// import Footer from "../../../Footer";

// import ServiceDetails from "./ServiceDetails";
// import TotalEnquiries from "./TotalEnquiries";
// import TotalServices from "./TotalServices";
// import Cancellations from "./Cancellations";
// import Feedback from "./Feedback";
// import ProfAvailable from "./ProfAvailable";

// const HDLayout = ({
//   tabValue,
//   handleTabChange,
//   hospitalList,
//   selectedHospital,
//   handleHospitalChange,
//   assignData,
//   unassignData,
//   assign,
//   selectedHospitalId,
//   allServices,
//   allServicesData,
//   services,
//   dashboardCounts,
// }) => {
//   return (
//     <Grid container spacing={1}>
//       {/* Tabs and Hospital Filter */}
//       <Grid item xs={12}>
//         <Grid container alignItems="center" spacing={2}>
//           <Grid
//             item
//             xs={12}
//             md={7}
//             sm={6}
//             lg={3.5}
//             sx={{
//               maxWidth: 250,
//               display: "flex",
//               justifyContent: "flex-start",
//             }}
//           >
//             <Box
//               sx={{
//                 background: "#f1f1f1",
//                 borderRadius: "10px",
//                 display: "flex",
//                 justifyContent: "flex-start",
//                 width: "100%",
//                 px: 2,
//               }}
//             >
//               <TabList
//                 onChange={handleTabChange}
//                 value={tabValue}
//                 sx={{ width: "100%" }}
//                 TabIndicatorProps={{
//                   style: {
//                     background: "#69A5EB",
//                     height: "36px",
//                     marginBottom: "8px",
//                     borderRadius: "10px",
//                   },
//                 }}
//               >
//                 <Tab
//                   label="Today"
//                   value="1"
//                   sx={{
//                     fontSize: "15px",
//                     textTransform: "capitalize",
//                     color: "#000000", // Default text color
//                     "&.Mui-selected": {
//                       color: "#000000", // Selected tab text
//                       // backgroundColor: "#69A5EB", // Match TabIndicator
//                       borderRadius: "10px",
//                       zIndex: 1,
//                     },
//                   }}
//                 />
//                 <Tab
//                   label="This Month"
//                   value="2"
//                   sx={{
//                     fontSize: "15px",
//                     textTransform: "capitalize",
//                     color: "#000000", // Default text color
//                     "&.Mui-selected": {
//                       color: "#000000", // Selected tab text
//                       borderRadius: "10px",
//                       zIndex: 1,
//                     },
//                   }}
//                 />
//                 <Tab
//                   label="Last Month"
//                   value="3"
//                   sx={{
//                     fontSize: "15px",
//                     textTransform: "capitalize",
//                     color: "#000000", // Default text color
//                     "&.Mui-selected": {
//                       color: "#000000", // Selected tab text
//                       borderRadius: "10px",
//                       zIndex: 1,
//                     },
//                   }}
//                 />
//               </TabList>
//             </Box>
//           </Grid>

//           <Grid
//             item
//             xs={12}
//             md={6}
//             sm={6}
//             lg={8.4}
//             sx={{
//               display: "flex",
//               justifyContent: { xs: "flex-start", md: "flex-end" },
//               // flexWrap: "wrap",
//             }}
//           >
//             <FormControl size="small" sx={{ minWidth: 270 }}>
//               <InputLabel id="hospital-label" placeholder="Select Hospital">Hospital</InputLabel>
//               <Select
//                 value={selectedHospital}
//                 label="Hospital"
//                 onChange={handleHospitalChange}
//                 labelId="hospital-label"
//               >
//                 {hospitalList.map((hosp) => (
//                   <MenuItem
//                     key={hosp.id || hosp.hosp_id}
//                     value={String(hosp.id || hosp.hosp_id)}
//                   >
//                     {hosp.hospital_name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//         </Grid>
//       </Grid>

//       {/* Service Details and Cards */}
//       <Grid item xs={12} md={4} lg={4}>
//         <ServiceDetails tabValue={tabValue} allServices={allServices} />
//       </Grid>

//       <Grid item xs={12} md={8} lg={8}>
//         <Grid container spacing={1}>
//           <Grid item xs={12} sm={6} md={5}>
//             <TotalServices
//               services={services}
//               tabValue={tabValue}
//               selectedHospital={selectedHospital}
//               hospitalId={selectedHospitalId}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={7}>
//             <TotalEnquiries
//               tabValue={tabValue}
//               enquiryData={dashboardCounts.enquiry}
//             />
//           </Grid>
//           <Grid item xs={12} sm={4.5} md={4}>
//             <Cancellations
//               tabValue={tabValue}
//               hospitalId={selectedHospitalId}
//               cancellationData={dashboardCounts.cancellation}
//             />
//           </Grid>
//           <Grid item xs={12} sm={4} md={4.5}>
//             <ProfAvailable
//               tabValue={tabValue}
//               assignData={assignData}
//               hospitalId={selectedHospitalId}
//             />
//           </Grid>
//           <Grid item xs={12} sm={3.5} md={3.5}>
//             <Feedback
//               tabValue={tabValue}
//               feedbackData={dashboardCounts.feedback}
//             />
//           </Grid>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// const HD_Dashboard = () => {
//   const port = process.env.REACT_APP_API_KEY;
//   const accessToken = localStorage.getItem("token");
//   const [hospitalId, setHospitalId] = useState("all");

//   const [tabValue, setTabValue] = useState("1");
//   const [hospitalList, setHospitalList] = useState([]);
//   const [selectedHospital, setSelectedHospital] = useState("all");
//   console.log(selectedHospital, "selectedHospital");

//   const [assign, setAssign] = useState(null); // Not {}
//   const [selectedHospitalId, setSelectedHospitalId] = useState("");

//   console.log("Selected hospital:", selectedHospitalId);

//   console.log(selectedHospitalId, "selectedHospitalId");

//   // Assign and Unassign professional data states
//   const [assignData, setAssignData] = useState({
//     today: 0,
//     month: 0,
//     last_month: 0,
//   });

//   const [unassignData, setUnassignData] = useState({
//     today: 0,
//     month: 0,
//     last_month: 0,
//   });

//   const [unassignProf, setUnassignProf] = useState({
//     today: [],
//     month: [],
//     tilldate: [],
//   });
//   // Assign and Unassign professional data states
//   const [assignCount, setAssignCount] = useState({
//     total_professionals: 0,
//     assignToday: 0,
//     assignMonth: 0,
//     assignTill: 0,
//     unassignToday: 0,
//     unassignMonth: 0,
//     unassignTill: 0,
//   });
//   const [unassignProfData, setUnassignProfData] = useState({
//     today: 0,
//     month: 0,
//     tilldate: 0,
//   });
//   // hospital list api
//   useEffect(() => {
//     fetch(`${port}/web/agg_hhc_hospitals_api_web_form`, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data) && data.length > 0) {
//           setHospitalList(data);
//           const firstHospitalId = String(data[0]?.id || data[0]?.hosp_id);
//           setSelectedHospitalId(firstHospitalId); // Set first hospital
//           console.log("Default selected hospital:", firstHospitalId);
//         } else {
//           console.warn("Hospital data is empty or not in array format");
//         }
//       })
//       .catch((err) => console.error("Hospital fetch error", err));
//   }, [port, accessToken]);

//   // Fetch assign data
//   // const fetchAssignProfessionalData = (hospitalId) => {
//   //   console.log(hospitalId,"hospital111");

//   //   const url =
//   //     hospitalId === "all"
//   //       ? `${port}/web/assign_professional/`
//   //       : `${port}/web/assign_professional/?hosp_id=${hospitalId}`;

//   //   fetch(url, {
//   //     headers: { Authorization: `Bearer ${accessToken}` },
//   //   })
//   //     .then((res) => res.json())
//   //     .then((data) => {
//   //       setAssignData({
//   //         today: data.today || 0,
//   //         month: data.this_month || 0,
//   //         last_month: data.last_month || 0,
//   //       });
//   //     })
//   //     .catch((err) => console.error("Assign fetch error", err));
//   // };

//   const fetchUnassignProfessionalData = (hospitalId) => {
//     const url =
//       hospitalId === "all"
//         ? `${port}/web/unassign_professional/`
//         : `${port}/web/unassign_professional/?hosp_id=${hospitalId}`;

//     fetch(url, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setUnassignData({
//           today: data.today || 0,
//           month: data.this_month || 0,
//           last_month: data.last_month || 0,
//         });
//       })
//       .catch((err) => console.error("Unassign fetch error", err));
//   };

//   const fetchAssignUnassignCount = (hospitalId) => {
//     const url =
//       hospitalId === "all"
//         ? `${port}/web/professional-count/`
//         : `${port}/web/professional-count/?hosp_id=${hospitalId}`;

//     fetch(url, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setAssignCount({
//           total_professionals: data.total_professionals || 0,
//           assignToday: data.assigned_professionals?.today || 0,
//           assignMonth: data.assigned_professionals?.this_month || 0,
//           assignTill: data.assigned_professionals?.total || 0,
//           unassignToday: data.unassigned_professionals?.today || 0,
//           unassignMonth: data.unassigned_professionals?.this_month || 0,
//           unassignTill: data.unassigned_professionals?.total || 0,
//         });
//       })
//       .catch((err) =>
//         console.error("Error fetching professional-count data:", err)
//       );
//   };

//   const fetchServicesCount = (hospitalId) => {
//     const url =
//       hospitalId === "all"
//         ? `${port}/web/TotalServicesOngoingPendingCompleted/`
//         : `${port}/web/TotalServicesOngoingPendingCompleted/?hosp_id=${hospitalId}`;
//     fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
//       .then((res) => res.json())
//       .then((data) => setServices(data))
//       .catch((err) =>
//         console.error(
//           "Error fetching TotalServicesOngoingPendingCompleted data:",
//           err
//         )
//       );
//   };
//   // Fetch data initially and on hospital or tab change
//   useEffect(() => {
//     if (!selectedHospital) return;
//     // fetchAssignProfessionalData(selectedHospital);
//     fetchUnassignProfessionalData(selectedHospital);
//     fetchAssignUnassignCount(selectedHospital);
//     fetchServicesCount(selectedHospital);
//   }, [selectedHospital, tabValue]);

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const handleHospitalChange = (event) => {
//     const selectedId = event.target.value;
//     setSelectedHospital(selectedId);
//     const value = event.target.value;
//     setSelectedHospitalId(value);
//     console.log("Selected hospital:", value);
//     // fetchAssignProfessionalData(selectedId);
//     fetchUnassignProfessionalData(selectedId);
//     fetchAssignUnassignCount(selectedId);
//   };

//   // service details
//   const [allServices, setAllServices] = useState({
//     services: [],
//     complete_service: {
//       today: [],
//       this_month: [],
//       till_date: [],
//     },
//     ongoing_service: {
//       today: [],
//       this_month: [],
//       till_date: [],
//     },
//     pending_service: {
//       today: [],
//       this_month: [],
//       till_date: [],
//     },
//   });

//   useEffect(() => {
//     // Fetch data from API
//     fetch(`${port}/web/Details_of_ServicesOngoingPendingCompleted/`)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data, "unassign_professional data");
//         // setAllServicesData(data);
//         // Process and extract service names and counts
//         const services = data.map((service) => service.srv_name);

//         const completeServiceToday = data.map(
//           (service) => service.data.total_completed_today
//         );
//         const completeServiceThisMonth = data.map(
//           (service) => service.data.total_completed_this_month
//         );
//         const completeServiceTillDate = data.map(
//           (service) => service.data.total_completed_till_date
//         );

//         const ongoingServiceToday = data.map(
//           (service) => service.data.total_ongoing_today
//         );
//         const ongoingServiceThisMonth = data.map(
//           (service) => service.data.total_ongoing_this_month
//         );
//         const ongoingServiceTillDate = data.map(
//           (service) => service.data.total_ongoing_till_date
//         );

//         const pendingServiceToday = data.map(
//           (service) => service.data.total_pending_today
//         );
//         const pendingServiceThisMonth = data.map(
//           (service) => service.data.total_pending_this_month
//         );
//         const pendingServiceTillDate = data.map(
//           (service) => service.data.total_pending_till_date
//         );

//         // Set state with service names and counts
//         setAllServices({
//           services,
//           complete_service: {
//             today: completeServiceToday,
//             this_month: completeServiceThisMonth,
//             till_date: completeServiceTillDate,
//           },
//           ongoing_service: {
//             today: ongoingServiceToday,
//             this_month: ongoingServiceThisMonth,
//             till_date: ongoingServiceTillDate,
//           },
//           pending_service: {
//             today: pendingServiceToday,
//             this_month: pendingServiceThisMonth,
//             till_date: pendingServiceTillDate,
//           },
//         });
//       })
//       .catch((error) => console.error("Error fetching hospital data:", error));
//   }, []);
//   const [allServicesData, setAllServicesData] = useState([]);

//   const AllServicesCount = (id) => {
//     const url =
//       id === "all"
//         ? `${port}/web/Details_of_ServicesOngoingPendingCompleted/`
//         : `${port}/web/Details_of_ServicesOngoingPendingCompleted/?hosp_id=${id}`;

//     fetch(url, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Service data:", data);
//         setAllServicesData(data); // data is the array of services with srv_name & data

//         // Process and extract service names and counts
//         const services = data.map((service) => service.srv_name);

//         const completeServiceToday = data.map(
//           (service) => service.data.total_completed_today
//         );
//         const completeServiceThisMonth = data.map(
//           (service) => service.data.total_completed_this_month
//         );
//         const completeServiceTillDate = data.map(
//           (service) => service.data.total_completed_till_date
//         );

//         const ongoingServiceToday = data.map(
//           (service) => service.data.total_ongoing_today
//         );
//         const ongoingServiceThisMonth = data.map(
//           (service) => service.data.total_ongoing_this_month
//         );
//         const ongoingServiceTillDate = data.map(
//           (service) => service.data.total_ongoing_till_date
//         );

//         const pendingServiceToday = data.map(
//           (service) => service.data.total_pending_today
//         );
//         const pendingServiceThisMonth = data.map(
//           (service) => service.data.total_pending_this_month
//         );
//         const pendingServiceTillDate = data.map(
//           (service) => service.data.total_pending_till_date
//         );

//         // Set state with service names and counts
//         setAllServices({
//           services,
//           complete_service: {
//             today: completeServiceToday,
//             this_month: completeServiceThisMonth,
//             till_date: completeServiceTillDate,
//           },
//           ongoing_service: {
//             today: ongoingServiceToday,
//             this_month: ongoingServiceThisMonth,
//             till_date: ongoingServiceTillDate,
//           },
//           pending_service: {
//             today: pendingServiceToday,
//             this_month: pendingServiceThisMonth,
//             till_date: pendingServiceTillDate,
//           },
//         });
//       })
//       .catch((error) => console.error("Error fetching hospital data:", error));
//   };

//   const [abc, setAbc] = useState([]);

//   useEffect(() => {
//     if (allServices.services && Array.isArray(allServices.services)) {
//       setAbc(allServices.services);
//     }
//   }, [allServices.services]);

//   console.log(abc, "abccccccccccccccc");

//   useEffect(() => {
//     if (selectedHospital) {
//       // fetchAssignProfessionalData(selectedHospital, tabValue);
//       fetchAssignUnassignCount(selectedHospital, tabValue);
//       fetchAssignUnassignCount(selectedHospital, tabValue);
//       AllServicesCount(selectedHospital, tabValue);
//       servicesCount(selectedHospital, tabValue);
//     }
//   }, [selectedHospital, tabValue]);

//   //total services count
//   const [services, setServices] = useState({
//     total_service_today: "",
//     total_service_this_month: "",
//     total_servces_till_date: "",
//     total_completed_servces_till_date: "",
//     total_completed_servces_today: "",
//     total_completed_servces_this_month: "",
//     total_pending_service_till_date: "",
//     total_pending_service_today: "",
//     total_pending_service_this_month: "",
//     total_ongoing_till_date: "",
//     total_ongoing_today: "",
//     total_ongoing_this_month: "",
//   });

//   const servicesCount = (id) => {
//     const url =
//       id === "all"
//         ? `${port}/web/TotalServicesOngoingPendingCompleted/`
//         : `${port}/web/TotalServicesOngoingPendingCompleted/?hosp_id=${id}`;

//     fetch(url)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(
//           data,
//           "TotalServicesOngoingPendingCompleted data hosp wise"
//         );
//         setServices({
//           ...services,
//           total_service_today: data.total_service_today,
//           total_service_this_month: data.total_service_this_month,
//           total_servces_till_date: data.total_servces_till_date,
//           total_completed_servces_till_date:
//             data.total_completed_servces_till_date,
//           total_completed_servces_today: data.total_completed_servces_today,
//           total_completed_servces_this_month:
//             data.total_completed_servces_this_month,
//           total_pending_service_till_date: data.total_pending_service_till_date,
//           total_pending_service_today: data.total_pending_service_today,
//           total_pending_service_this_month:
//             data.total_pending_service_this_month,
//           total_ongoing_till_date: data.total_ongoing_till_date,
//           total_ongoing_today: data.total_ongoing_today,
//           total_ongoing_this_month: data.total_ongoing_this_month,
//         });
//         //   setPending(data);
//       })
//       .catch((error) =>
//         console.error(
//           "Error fetching TotalServicesOngoingPendingCompleted data:",
//           error
//         )
//       );
//   };

//   useEffect(() => {
//     // Fetch data from API
//     fetch(`${port}/web/TotalServicesOngoingPendingCompleted/`)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data, "TotalServicesOngoingPendingCompleted data");
//         setServices({
//           ...services,
//           total_service_today: data.total_service_today,
//           total_service_this_month: data.total_service_this_month,
//           total_servces_till_date: data.total_servces_till_date,
//           total_completed_servces_till_date:
//             data.total_completed_servces_till_date,
//           total_completed_servces_today: data.total_completed_servces_today,
//           total_completed_servces_this_month:
//             data.total_completed_servces_this_month,
//           total_pending_service_till_date: data.total_pending_service_till_date,
//           total_pending_service_today: data.total_pending_service_today,
//           total_pending_service_this_month:
//             data.total_pending_service_this_month,
//           total_ongoing_till_date: data.total_ongoing_till_date,
//           total_ongoing_today: data.total_ongoing_today,
//           total_ongoing_this_month: data.total_ongoing_this_month,
//         });
//         //   setPending(data);
//       })
//       .catch((error) =>
//         console.error(
//           "Error fetching TotalServicesOngoingPendingCompleted data:",
//           error
//         )
//       );
//   }, []);

//   // ENquiry Cancellation feedback integration

//   const [dashboardCounts, setDashboardCounts] = useState({
//     enquiry: {},
//     feedback: {},
//     cancellation: {},
//   });
//   console.log(dashboardCounts, "dashboardCounts");

//   const fetchDashboardCounts = (tab, hospId) => {
//     const url = `${port}/web/Dashboard_enquiry_cancellation_feedback_counts/${tab}/${hospId}/`;

//     fetch(url, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setDashboardCounts(data);
//         console.log(data, "dashboardCounts");
//       })
//       .catch((err) => console.error("Dashboard counts fetch error", err));
//   };

//   useEffect(() => {
//     if (selectedHospital) {
//       fetchDashboardCounts(tabValue, selectedHospital);
//     }
//   }, [selectedHospital, tabValue]);

//   return (
//     <>
//       <Navbar />
//       <Box sx={{ flexGrow: 1, mt: 11, mb: 2, width: "100%" }}>
//         <TabContext value={tabValue}>
//           <TabPanel value="1">
//             <HDLayout
//               tabValue={tabValue}
//               handleTabChange={handleTabChange}
//               hospitalList={hospitalList}
//               selectedHospital={selectedHospital}
//               handleHospitalChange={handleHospitalChange}
//               assignData={assignData}
//               selectedHospitalId={selectedHospitalId}
//               unassignData={unassignData}
//               allServicesData={allServicesData}
//               allServices={allServices}
//               services={services}
//               dashboardCounts={dashboardCounts}
//             />
//           </TabPanel>
//           <TabPanel value="2">
//             <HDLayout
//               tabValue={tabValue}
//               handleTabChange={handleTabChange}
//               hospitalList={hospitalList}
//               selectedHospital={selectedHospital}
//               handleHospitalChange={handleHospitalChange}
//               assignData={assignData}
//               unassignData={unassignData}
//               selectedHospitalId={selectedHospitalId}
//               allServicesData={allServicesData}
//               allServices={allServices}
//               services={services}
//               dashboardCounts={dashboardCounts}
//             />
//           </TabPanel>
//           <TabPanel value="3">
//             <HDLayout
//               tabValue={tabValue}
//               handleTabChange={handleTabChange}
//               hospitalList={hospitalList}
//               selectedHospital={selectedHospital}
//               handleHospitalChange={handleHospitalChange}
//               assignData={assignData}
//               unassignData={unassignData}
//               selectedHospitalId={selectedHospitalId}
//               allServicesData={allServicesData}
//               allServices={allServices}
//               services={services}
//               dashboardCounts={dashboardCounts}
//             />
//           </TabPanel>
//         </TabContext>
//       </Box>
//       <Footer />
//     </>
//   );
// };

// export default HD_Dashboard;

import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import Navbar from "../../../Navbar";
import Footer from "../../../Footer";
import ServiceDetails from "./ServiceDetails";
import TotalEnquiries from "./TotalEnquiries";
import TotalServices from "./TotalServices";
import Cancellations from "./Cancellations";
import Feedback from "./Feedback";
import ProfAvailable from "./ProfAvailable";

const HDLayout = ({
  tabValue,
  handleTabChange,
  hospitalList,
  selectedHospital,
  handleHospitalChange,
  assignData,
  allServices,
  services,
  dashboardCounts,
}) => {
  return (
    <Grid container spacing={1} sx={{ mt: 0,bgcolor:'#F6F6F6' }}>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={2}>
          <Grid
            item
            xs={12}
            md={7}
            sm={6}
            lg={3.5}
            sx={{
              maxWidth: 250,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Box
              sx={{
                background: "#f1f1f1",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "flex-start",
                width: "100%",
                px: 2,
              }}
            >
              <TabList
                onChange={handleTabChange}
                value={tabValue}
                sx={{ width: "100%" }}
                TabIndicatorProps={{
                  style: {
                    background: "#69A5EB",
                    height: "36px",
                    marginBottom: "8px",
                    borderRadius: "10px",
                  },
                }}
              >
                <Tab
                  label="Today"
                  value="1"
                  sx={{
                    fontSize: "15px",
                    textTransform: "capitalize",
                    color: "#000000", // Default text color
                    "&.Mui-selected": {
                      color: "#000000", // Selected tab text
                      // backgroundColor: "#69A5EB", // Match TabIndicator
                      borderRadius: "10px",
                      zIndex: 1,
                    },
                  }}
                />
                <Tab
                  label="This Month"
                  value="2"
                  sx={{
                    fontSize: "15px",
                    textTransform: "capitalize",
                    color: "#000000", // Default text color
                    "&.Mui-selected": {
                      color: "#000000", // Selected tab text
                      borderRadius: "10px",
                      zIndex: 1,
                    },
                  }}
                />
                <Tab
                  label="Last Month"
                  value="3"
                  sx={{
                    fontSize: "15px",
                    textTransform: "capitalize",
                    color: "#000000", // Default text color
                    "&.Mui-selected": {
                      color: "#000000", // Selected tab text
                      borderRadius: "10px",
                      zIndex: 1,
                    },
                  }}
                />
              </TabList>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            lg={8}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <FormControl size="small" sx={{ minWidth: 270 }}>
              <InputLabel id="hospital-label">Hospital</InputLabel>
              <Select
                value={selectedHospital}
                label="Hospital"
                onChange={handleHospitalChange}
                labelId="hospital-label"
              >
                <MenuItem value="">All Hospitals</MenuItem>
                {hospitalList.map((hosp) => (
                  <MenuItem
                    key={hosp.id || hosp.hosp_id}
                    value={String(hosp.id || hosp.hosp_id)}
                  >
                    {hosp.hospital_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>

      {/* Data cards */}
      <Grid item xs={12} md={4}>
        <ServiceDetails tabValue={tabValue} allServices={allServices} />
      </Grid>

      <Grid item xs={12} md={8}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} md={5}>
            <TotalServices services={services} tabValue={tabValue} />
          </Grid>
          <Grid item xs={12} sm={6} md={7}>
            <TotalEnquiries
              tabValue={tabValue}
              enquiryData={dashboardCounts.enquiry}
            />
          </Grid>
          <Grid item xs={12} sm={4.5} md={4}>
            <Cancellations
              tabValue={tabValue}
              cancellationData={dashboardCounts.cancellation}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4.5}>
            <ProfAvailable tabValue={tabValue} assignData={assignData} />
          </Grid>
          <Grid item xs={12} sm={3.5} md={3.5}>
            <Feedback
              tabValue={tabValue}
              feedbackData={dashboardCounts.feedback}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const HD_Dashboard = () => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");

  const [tabValue, setTabValue] = useState("1");
  const [hospitalList, setHospitalList] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(""); // default no filter

  const [assignData, setAssignData] = useState({});
  const [services, setServices] = useState({});
  // const [allServices, setAllServices] = useState({});
  const [dashboardCounts, setDashboardCounts] = useState({
    enquiry: {},
    feedback: {},
    cancellation: {},
  });

  // 🟢 Fetch hospital list
  useEffect(() => {
    fetch(`${port}/web/agg_hhc_hospitals_api_web_form`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setHospitalList(data))
      .catch((err) => console.error("Hospital list fetch error:", err));
  }, [port, accessToken]);

  // 🔹 Universal fetch functions
  const fetchAssignUnassignCount = (hospId) => {
    const url = hospId
      ? `${port}/web/professional-count/?hosp_id=${hospId}`
      : `${port}/web/professional-count/`;

    fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => res.json())
      .then(setAssignData)
      .catch((err) => console.error("Professional count error:", err));
  };

  const fetchServicesCount = (hospId) => {
    const url = hospId
      ? `${port}/web/TotalServicesOngoingPendingCompleted/?hosp_id=${hospId}`
      : `${port}/web/TotalServicesOngoingPendingCompleted/`;

    fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => res.json())
      .then(setServices)
      .catch((err) => console.error("Services count error:", err));
  };

  // Service details state
  const [allServices, setAllServices] = useState({
    services: [],
    complete_service: { today: [], this_month: [], till_date: [] },
    ongoing_service: { today: [], this_month: [], till_date: [] },
    pending_service: { today: [], this_month: [], till_date: [] },
  });

  // Fetch service details
  const fetchAllServices = (hospitalId) => {
    const url =
      hospitalId && hospitalId !== "all"
        ? `${port}/web/Details_of_ServicesOngoingPendingCompleted/?hosp_id=${hospitalId}`
        : `${port}/web/Details_of_ServicesOngoingPendingCompleted/`;

    fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;

        const services = data.map((service) => service.srv_name);

        const complete_service = {
          today: data.map((s) => s.data.total_completed_today),
          this_month: data.map((s) => s.data.total_completed_this_month),
          till_date: data.map((s) => s.data.total_completed_till_date),
        };

        const ongoing_service = {
          today: data.map((s) => s.data.total_ongoing_today),
          this_month: data.map((s) => s.data.total_ongoing_this_month),
          till_date: data.map((s) => s.data.total_ongoing_till_date),
        };

        const pending_service = {
          today: data.map((s) => s.data.total_pending_today),
          this_month: data.map((s) => s.data.total_pending_this_month),
          till_date: data.map((s) => s.data.total_pending_till_date),
        };

        setAllServices({
          services,
          complete_service,
          ongoing_service,
          pending_service,
        });
      })
      .catch((err) => console.error("Error fetching service details:", err));
  };

  // Fetch on dashboard load for ALL hospitals
  useEffect(() => {
    fetchAllServices("all");
  }, []);

  // Fetch when user selects hospital or changes tab
  useEffect(() => {
    fetchAllServices(selectedHospital); // selectedHospital can be 'all' or a specific hospital ID
  }, [selectedHospital, tabValue]);

  const fetchDashboardCounts = (tab, hospId) => {
    const url = hospId
      ? `${port}/web/Dashboard_enquiry_cancellation_feedback_counts/${tab}/${hospId}/`
      : `${port}/web/Dashboard_enquiry_cancellation_feedback_counts/${tab}/`;

    fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => res.json())
      .then(setDashboardCounts)
      .catch((err) => console.error("Dashboard counts error:", err));
  };

  // 🟢 On first load → show full (no filter)
  useEffect(() => {
    fetchAssignUnassignCount("");
    fetchServicesCount("");
    fetchAllServices("");
    fetchDashboardCounts(tabValue, "");
  }, []);

  // 🟢 When tab or hospital changes
  useEffect(() => {
    fetchAssignUnassignCount(selectedHospital);
    fetchServicesCount(selectedHospital);
    fetchAllServices(selectedHospital);
    fetchDashboardCounts(tabValue, selectedHospital);
  }, [selectedHospital, tabValue]);

  const handleTabChange = (e, newValue) => setTabValue(newValue);
  const handleHospitalChange = (e) => setSelectedHospital(e.target.value);

  return (
    <>
      <Navbar />
      <Box sx={{ flexGrow: 1, mt: 11, mb: 2, width: "100%" }}>
        <TabContext value={tabValue}>
          <TabPanel value="1">
            <HDLayout
              tabValue={tabValue}
              handleTabChange={handleTabChange}
              hospitalList={hospitalList}
              selectedHospital={selectedHospital}
              handleHospitalChange={handleHospitalChange}
              assignData={assignData}
              allServices={allServices}
              services={services}
              dashboardCounts={dashboardCounts}
            />
          </TabPanel>
          <TabPanel value="2">
            <HDLayout
              tabValue={tabValue}
              handleTabChange={handleTabChange}
              hospitalList={hospitalList}
              selectedHospital={selectedHospital}
              handleHospitalChange={handleHospitalChange}
              assignData={assignData}
              allServices={allServices}
              services={services}
              dashboardCounts={dashboardCounts}
            />
          </TabPanel>
          <TabPanel value="3">
            <HDLayout
              tabValue={tabValue}
              handleTabChange={handleTabChange}
              hospitalList={hospitalList}
              selectedHospital={selectedHospital}
              handleHospitalChange={handleHospitalChange}
              assignData={assignData}
              allServices={allServices}
              services={services}
              dashboardCounts={dashboardCounts}
            />
          </TabPanel>
        </TabContext>
      </Box>
      <Footer />
    </>
  );
};

export default HD_Dashboard;
