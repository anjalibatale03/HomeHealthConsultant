// import { PolarArea } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   RadialLinearScale,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
// import React, { useEffect, useState, useRef } from "react";

// ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

// // Custom plugin to render labels in center of arcs
// const centerLabelPlugin = {
//   id: "centerLabelPlugin",
//   afterDraw(chart) {
//     const {
//       ctx,
//       chartArea: { width, height },
//     } = chart;

//     const dataset = chart.data.datasets[0];
//     const meta = chart.getDatasetMeta(0);

//     meta.data.forEach((arc, index) => {
//       const { x, y } = arc.tooltipPosition();
//       const value = Number(dataset.data[index]) === 0.1 ? 0 : dataset.data[index];

//       ctx.save();
//       ctx.fillStyle = "#000";
//       ctx.font = "bold 11px Roboto"; // Slightly smaller font
//       ctx.textAlign = "center";

//       // Adjust position for small slices
//       const offsetY = dataset.data[index] <= 1 ? -2 : -5;

//       ctx.fillText(value, x, y + offsetY); // value above
//       ctx.fillText(chart.data.labels[index], x, y + 12); // label below
//       ctx.restore();
//     });
//   },
// };

// const polarOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: { display: false },
//     tooltip: { enabled: true },
//   },
//   scales: {
//     r: {
//       ticks: { display: false },
//       grid: { color: "rgba(255, 255, 255, 0.2)" },
//       pointLabels: {
//         font: { size: 10, weight: "bold" },
//         color: "#000",
//       },
//     },
//   },
// };

// const cardSx = {
//   flex: 1,
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "space-between",
//   minHeight: 260,
//   boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//   borderRadius: { xs: 1, sm: 2 },
//   backgroundColor: "#fff",
// };

// const TotalServices = ({
//   hospitalId,
//   tabValue,
//   selectedHospital,
//   services,
// }) => {
//   const port = process.env.REACT_APP_API_KEY;
//   const [serviceData, setServiceData] = useState(null);
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (!selectedHospital) return;

//     const hospParam =
//       selectedHospital === "all" ? "" : `?hosp_id=${selectedHospital}`;
//     const url = `${port}/web/TotalServicesOngoingPendingCompleted/${hospParam}`;

//     fetch(url)
//       .then((res) => res.json())
//       .then((data) => setServiceData(data))
//       .catch((err) => {
//         console.error("Error fetching total services data", err);
//         setServiceData(null);
//       });
//   }, [selectedHospital, port]);

//   // ...existing code...
//   let dataForTab = {};
//   if (tabValue === "1") {
//     dataForTab = {
//       completed: services.total_completed_servces_today,
//       pending: services.total_pending_service_today,
//       ongoing: services.total_ongoing_today,
//       total: services.total_service_today, // Use backend total directly
//     };
//   } else if (tabValue === "2") {
//     dataForTab = {
//       completed: services.total_completed_servces_this_month,
//       pending: services.total_pending_service_this_month,
//       ongoing: services.total_ongoing_this_month,
//       total: services.total_service_this_month, // Use backend total directly
//     };
//   } else if (tabValue === "3") {
//     dataForTab = {
//       completed: services.total_completed_servces_till_date,
//       pending: services.total_pending_service_till_date,
//       ongoing: services.total_ongoing_till_date,
//       total: services.total_service_till_date, // Use backend total directly
//     };
//   }
//   // ...existing code...
//   // Add this after the above logic:
//   dataForTab.total =
//     Number(dataForTab.completed || 0) +
//     Number(dataForTab.pending || 0) +
//     Number(dataForTab.ongoing || 0);

//   const allZero =
//     Number(dataForTab.completed) === 0 &&
//     Number(dataForTab.pending) === 0 &&
//     Number(dataForTab.ongoing) === 0;

//   const chartData = allZero
//     ? [0.1, 0.1, 0.1]
//     : [
//         Number(dataForTab.completed || 0),
//         Number(dataForTab.pending || 0),
//         Number(dataForTab.ongoing || 0),
//       ];

//   // Generate gradient colors for Polar chart
//   const getGradientColors = () => {
//     const chart = chartRef.current;
//     if (!chart || !chart.ctx) return ["#F72585", "#00C5C9", "#FFD600"];

//     const ctx = chart.ctx;

//     const g1 = ctx.createRadialGradient(100, 100, 0, 100, 100, 100);
//     g1.addColorStop(0, "#F72585");
//     g1.addColorStop(1, "#9A1750");

//     const g2 = ctx.createRadialGradient(100, 100, 0, 100, 100, 100);
//     g2.addColorStop(0, "#00C5C9");
//     g2.addColorStop(1, "#005F60");

//     const g3 = ctx.createRadialGradient(100, 100, 0, 100, 100, 100);
//     g3.addColorStop(0, "#FFD600");
//     g3.addColorStop(1, "#FFA500");

//     return [g1, g2, g3];
//   };

//   const polarData = {
//     labels: ["Completed", "Pending", "Ongoing"],
//     datasets: [
//       {
//         label: "Services",
//         data: chartData,
//         backgroundColor: allZero
//           ? ["#e0e0e0", "#e0e0e0", "#e0e0e0"] // All grey if no data
//           : [
//               chartData[0] === 0 ? "#e0e0e0" : "#F72585", // Completed
//               chartData[1] === 0 ? "#e0e0e0" : "#FFA500", // Pending
//               chartData[2] === 0 ? "#e0e0e0" : "#FFD600", // Ongoing
//             ],
//         borderWidth: 0,
//       },
//     ],
//   };

//   const percent = dataForTab.total
//     ? Math.round(
//         ((Number(dataForTab.completed || 0) +
//           Number(dataForTab.pending || 0) +
//           Number(dataForTab.ongoing || 0)) /
//           Number(dataForTab.total)) *
//           100
//       )
//     : 0;

//   const radialOptions = {
//     chart: {
//       type: "radialBar",
//       sparkline: { enabled: true },
//     },
//     plotOptions: {
//       radialBar: {
//         hollow: { size: "65%" },
//         track: { background: "#eee" },
//         dataLabels: {
//           show: true,
//           name: { show: false },
//           value: {
//             fontSize: "24px",
//             fontWeight: 700,
//             color: "#000",
//             show: true,
//             offsetY: 8,
//             formatter: (val) => `${val}%`,
//           },
//         },
//       },
//     },
//     fill: {
//       type: "gradient",
//       gradient: {
//         shade: "dark",
//         type: "horizontal",
//         shadeIntensity: 0.5,
//         gradientToColors: ["#FFD600"],
//         inverseColors: false,
//         opacityFrom: 1,
//         opacityTo: 1,
//         stops: [0, 100],
//       },
//       colors: ["#F72585"],
//     },
//     stroke: { lineCap: "round" },
//     labels: ["Progress"],
//   };

//   const radialSeries = [percent];
//   return (
//     <div>
//       <Card
//         sx={{
//           backgroundColor: "#D0E5FF",
//           height: 40,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           mb: 0.5,
//           px: 2,
//           borderRadius: 1,
//         }}
//       >
//         <Typography
//           fontWeight="bold"
//           sx={{ fontSize: { xs: 16, sm: 13, md: 16 } }}
//           color="#6f42c1"
//           textTransform="uppercase"
//           textAlign="left"
//         >
//           Services Till Date
//         </Typography>
//         <Typography
//           sx={{ fontSize: { xs: 16, sm: 13, md: 20 } }}
//           color="primary"
//           fontWeight="bold"
//         >
//           {serviceData?.total_servces_till_date ?? "-"}
//         </Typography>
//       </Card>

//       <Card sx={cardSx}>
//         <Typography
//           fontWeight="bold"
//           sx={{
//             textAlign: "left",
//             color: "#6f42c1",
//             fontSize: { xs: 14, sm: 14, md: 16 },
//             mb: 0.5,
//             px: { xs: 1.5, sm: 2 },
//             pt: 1,
//             pb: 0,
//           }}
//         >
//           SERVICES
//         </Typography>

//         <Grid container alignItems="center" justifyContent="space-between">
//           <Grid item xs={12} sm={5} md={4}>
//             <Typography
//               variant="subtitle2"
//               fontWeight="bold"
//               color="text.secondary"
//               sx={{
//                 fontSize: { xs: 16, sm: 16, md: 14 },
//                 textAlign: "left",
//                 textTransform: "uppercase",
//                 ml: { xs: 0, sm: 2 },
//               }}
//             >
//               Total Service
//             </Typography>
//             <Typography
//               fontWeight="bold"
//               color="#000000"
//               sx={{
//                 textAlign: "left",
//                 mb: 7,
//                 ml: { xs: 0, sm: 2 },
//                 fontSize: { xs: 16, sm: 14, md: 17 },
//               }}
//             >
//               {dataForTab.total ?? "-"}
//             </Typography>
//           </Grid>

//           <Grid item xs={12} sm={7} md={8}>
//             {allZero && (
//               <Typography
//                 variant="body2"
//                 color="text.secondary"
//                 textAlign="center"
//                 sx={{ mb: 1 }}
//               >
//                 No data available for this period.
//               </Typography>
//             )}
//             <Box
//               sx={{
//                 position: "relative",
//                 width: { xs: "100%", sm: 200, md: 180 },
//                 height: { xs: "100%", sm: 240, md: 180 },
//                 ml: { xs: 0, sm: 0.3, md: 3 },
//                 mr: { xs: "auto", sm: "2rem", md: 0 },
//                 mb: { xs: 2, sm: 2 },
//               }}
//             >
//               <PolarArea
//                 ref={chartRef}
//                 data={polarData}
//                 options={polarOptions}
//                 plugins={[centerLabelPlugin]}
//               />
//             </Box>
//           </Grid>
//         </Grid>
//       </Card>
//     </div>
//   );
// };

// export default TotalServices;

import React from "react";
import {
  Card,
  Typography,
  Stack,
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { motion } from "framer-motion";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import LoopIcon from "@mui/icons-material/Loop";

const ServiceRing = ({ value, color, size = 40, thickness = 4, icon }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: 40,
        height: 40,
        borderRadius: "40%",
        border: `1px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mx: "auto",
      }}
    >
      {icon}
    </Box>
  );
};

const TotalServices = ({ services, tabValue }) => {
  let dataForTab = {};
  if (tabValue === "1") {
    dataForTab = {
      completed: services.total_completed_servces_today || 0,
      pending: services.total_pending_service_today || 0,
      ongoing: services.total_ongoing_today || 0,
    };
  } else if (tabValue === "2") {
    dataForTab = {
      completed: services.total_completed_servces_this_month || 0,
      pending: services.total_pending_service_this_month || 0,
      ongoing: services.total_ongoing_this_month || 0,
    };
  } else if (tabValue === "3") {
    dataForTab = {
      completed: services.total_completed_servces_till_date || 0,
      pending: services.total_pending_service_till_date || 0,
      ongoing: services.total_ongoing_till_date || 0,
    };
  }

  const total =
    dataForTab.completed + dataForTab.pending + dataForTab.ongoing || 0;

  const cardSx = {
    flex: 1,
    display: "flex",
    flexDirection: "row", // 👈 horizontal card layout
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 160,
    px: 2,
    py: 2,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    borderRadius: { xs: 1, sm: 2 },
    backgroundColor: "#fff",
  };
  return (
    <>
      {/* SERVICES TILL DATE CARD */}
      <Card
        sx={{
          backgroundColor: "#D0E5FF",
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
          px: 2,
          borderRadius: 1,
        }}
      >
        <Typography
          fontWeight="bold"
          sx={{ fontSize: { xs: 16, sm: 13, md: 16 } }}
          color="#6f42c1"
          textTransform="uppercase"
          textAlign="left"
        >
          Services Till Date
        </Typography>
        <Typography
          sx={{ fontSize: { xs: 16, sm: 13, md: 20 } }}
          color="primary"
          fontWeight="bold"
        >
          {services?.total_servces_till_date ?? "-"}
        </Typography>
      </Card>

      {/* MAIN SERVICES CARD */}
      <Card sx={{ ...cardSx, mt: 2, py: 3, px: 3 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              fontWeight="bold"
              color="#6f42c1"
              sx={{ fontSize: 18, textTransform: "uppercase" }}
            >
              Services
            </Typography>

            <Box textAlign="right">
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color="text.secondary"
                sx={{ fontSize: { xs: 12, sm: 14, md: 14 } }}
              >
                Total Services
              </Typography>
              <Typography fontWeight="bold" color="#000000" fontSize={18}>
                {total}
              </Typography>
            </Box>
          </Stack>
          {/* Horizontal 3 Service Cards */}
          <Stack direction="row" spacing={2} justifyContent="space-between">
            {/* ✅ Completed */}
            <Card
              sx={{
                flex: 1,
                p: 2,
                textAlign: "center",
                backgroundColor: "#E8F5E9",
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <ServiceRing
                value={dataForTab.completed}
                // color="#4CAF50"
                icon={
                  <motion.div
                    initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    <CheckCircleOutlineIcon
                      sx={{ fontSize: 40, color: "#4CAF50" }}
                    />
                  </motion.div>
                }
              />
              <Typography
                fontWeight="bold"
                fontSize={20}
                color="#4CAF50"
                mt={1}
              >
                {dataForTab.completed}
              </Typography>
              <Typography fontSize={13} fontWeight="600" fontFamily={"Roboto"}>
                Completed
              </Typography>
            </Card>

            {/* ⏳ Pending (smoothed) */}
            <Card
              sx={{
                flex: 1,
                p: 2,
                textAlign: "center",
                backgroundColor: "#FFF3E0",
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <ServiceRing
                value={dataForTab.pending}
                // color="#FFA500"
                icon={
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.6, // ⬅ slower and smoother
                      ease: "easeInOut",
                    }}
                  >
                    <HourglassTopIcon sx={{ fontSize: 40, color: "#FFA500" }} />
                  </motion.div>
                }
              />
              <Typography
                fontWeight="bold"
                fontSize={20}
                color="#FFA500"
                mt={1}
              >
                {dataForTab.pending}
              </Typography>
              <Typography fontSize={13} fontWeight="600" fontFamily={"Roboto"}>
                Pending
              </Typography>
            </Card>

            {/* 🔄 Ongoing */}
            <Card
              sx={{
                flex: 1,
                p: 2,
                textAlign: "center",
                backgroundColor: "#FFFDE7",
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <ServiceRing
                value={dataForTab.ongoing}
                // color="#FFD600"
                icon={
                  <motion.div
                    animate={{ initial: { y: 0 }, animate: { y: [0, 1, 0.5] } }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <LoopIcon sx={{ fontSize: 40, color: "#FFD600" }} />
                  </motion.div>
                }
              />
              <Typography
                fontWeight="bold"
                fontSize={18}
                color="#FFD600"
                mt={1}
              >
                {dataForTab.ongoing}
              </Typography>
              <Typography fontSize={13} fontWeight="550" fontFamily={"Roboto"}>
                Ongoing
              </Typography>
            </Card>
          </Stack>
        </Stack>
      </Card>
    </>
  );
};

export default TotalServices;
