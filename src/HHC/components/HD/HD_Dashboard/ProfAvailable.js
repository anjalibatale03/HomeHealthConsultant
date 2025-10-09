// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Stack,
//   Avatar,
//   Grid,
//   Box,
// } from "@mui/material";
// import { motion } from "framer-motion";

// import Man from "../../../assets/HD_Dashboard/Man.png";
// import Man1 from "../../../assets/HD_Dashboard/Man1.png";
// import Man2 from "../../../assets/HD_Dashboard/Man2.png";
// import Unassigned from "../../../assets/HD_Dashboard/Unassigned.png";
// import Unassigned1 from "../../../assets/HD_Dashboard/Unassigned1.png";
// import Unassigned2 from "../../../assets/HD_Dashboard/Unassigned2.png";

// const manImages = [
//   { src: Man, size: { xs: 28, sm: 36, md: 38 } },
//   { src: Man1, size: { xs: 32, sm: 40, md: 48 } },
//   { src: Man2, size: { xs: 36, sm: 44, md: 54 } },
// ];

// const assignImages = [
//   { src: Unassigned, size: { xs: 28, sm: 36, md: 38 } },
//   { src: Unassigned1, size: { xs: 32, sm: 40, md: 48 } },
//   { src: Unassigned2, size: { xs: 36, sm: 44, md: 54 } },
// ];

// const cardSx = {
//   position: "relative",
//   overflow: "hidden",
//   borderRadius: { xs: 2, sm: 3 },
//   boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//   backgroundColor: "#fff",
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
//   minHeight: { xs: 250, sm: 200, md: 220 },
// };

// const avatarVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: (i) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: i * 0.1, type: "spring", stiffness: 100 },
//   }),
// };

// const ProfAvailable = ({ tabValue, assignData, hospitalId }) => {
//   const port = process.env.REACT_APP_API_KEY;
//   const accessToken = localStorage.getItem("token");

//   const [assign, setAssign] = useState({
//     total_professionals: 0,
//     assigned_professionals: {
//       today: 0,
//       this_month: 0,
//       total: 0,
//     },
//     unassigned_professionals: {
//       today: 0,
//       this_month: 0,
//       total: 0,
//     },
//   });

//   useEffect(() => {
//     if (!hospitalId) return; // prevent invalid request

//     fetch(`${port}/web/professional-count/?hosp_id=${hospitalId}`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setAssign({
//           total_professionals: data.total_professionals || 0,
//           assigned_professionals: {
//             today: data.assigned_professionals?.today || 0,
//             this_month: data.assigned_professionals?.this_month || 0,
//             total: data.assigned_professionals?.total || 0,
//           },
//           unassigned_professionals: {
//             today: data.unassigned_professionals?.today || 0,
//             this_month: data.unassigned_professionals?.this_month || 0,
//             total: data.unassigned_professionals?.total || 0,
//           },
//         });
//       })
//       .catch((error) =>
//         console.error("Error fetching professional data:", error)
//       );
//   }, [hospitalId, port, accessToken]);

//   const getAssignValue = () => {
//     if (tabValue === "1") return assign.assigned_professionals.today;
//     if (tabValue === "2") return assign.assigned_professionals.this_month;
//     if (tabValue === "3") return assign.assigned_professionals.total;
//     return 0;
//   };

//   const getUnassignValue = () => {
//     if (tabValue === "1") return assign.unassigned_professionals.today;
//     if (tabValue === "2") return assign.unassigned_professionals.this_month;
//     if (tabValue === "3") return assign.unassigned_professionals.total;
//     return 0;
//   };

//   return (
//     <Card sx={cardSx}>
//       <CardContent sx={{ p: { xs: 2, sm: 2, md: 0.5 } }}>
//         <Typography
//           variant="h6"
//           fontWeight="bold"
//           textAlign="left"
//           sx={{
//             color: "#6f42c1",
//             fontSize: { xs: 16, sm: 14, md: 16 },
//             mb: { xs: 1.5, sm: 1, md: 0.5 },
//           }}
//         >
//           PROFESSIONALS AVAILABLE
//         </Typography>

//         <Grid container direction="column" spacing={1.2}>
//           <Grid item>
//             <Box textAlign="center">
//               <Typography variant="h4" fontWeight="bold">
//                 {assign.total_professionals}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Total Professionals
//               </Typography>
//             </Box>
//           </Grid>

//           {/* Assigned Professionals */}
//           <Grid item>
//             <Stack direction="row" alignItems="center" spacing={2}>
//               <Stack direction="row" spacing={0.5}>
//                 {assignImages.map((item, index) => (
//                   <motion.div
//                     key={index}
//                     custom={index}
//                     initial="hidden"
//                     animate="visible"
//                     variants={avatarVariants}
//                   >
//                     <Avatar
//                       src={item.src}
//                       sx={{ width: item.size, height: item.size }}
//                     />
//                   </motion.div>
//                 ))}
//               </Stack>
//               <Stack textAlign="center" alignItems="center">
//                 <Typography variant="h6" fontWeight="bold">
//                   {getAssignValue()}
//                 </Typography>
//                 <Typography color="text.secondary">Assign</Typography>
//               </Stack>
//             </Stack>
//           </Grid>

//           {/* Unassigned Professionals */}
//           <Grid item>
//             <Stack direction="row" alignItems="center" spacing={2}>
//               <Stack direction="row" spacing={0.5}>
//                 {manImages.map((item, index) => (
//                   <motion.div
//                     key={index}
//                     custom={index}
//                     initial="hidden"
//                     animate="visible"
//                     variants={avatarVariants}
//                   >
//                     <Avatar
//                       src={item.src}
//                       sx={{ width: item.size, height: item.size }}
//                     />
//                   </motion.div>
//                 ))}
//               </Stack>
//               <Stack textAlign="center" alignItems="center">
//                 <Typography variant="h6" fontWeight="bold">
//                   {getUnassignValue()}
//                 </Typography>
//                 <Typography color="text.secondary">Un-assign</Typography>
//               </Stack>
//             </Stack>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProfAvailable;

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";

import Man from "../../../assets/HD_Dashboard/Man.png";
import Man1 from "../../../assets/HD_Dashboard/Man1.png";
import Man2 from "../../../assets/HD_Dashboard/Man2.png";
import Unassigned from "../../../assets/HD_Dashboard/Unassigned.png";
import Unassigned1 from "../../../assets/HD_Dashboard/Unassigned1.png";
import Unassigned2 from "../../../assets/HD_Dashboard/Unassigned2.png";

const manImages = [Man, Man1, Man2];
const assignImages = [Unassigned, Unassigned1, Unassigned2];

const cardSx = {
  position: "relative",
  overflow: "hidden",
  borderRadius: { xs: 2, sm: 3 },
  boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: { xs: 250, sm: 200, md: 220 },
};

const avatarVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 100 },
  }),
};

const ProfAvailable = ({ tabValue, hospitalId }) => {
  console.log("tabValue:", tabValue);
  console.log(hospitalId, "hospitalId");

  // console.log("assign data:", assign);
  // console.log("Assigned count:", getAssignValue());
  // console.log("Unassigned count:", getUnassignValue());

  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const theme = useTheme();

  // Responsive avatar size based on breakpoints
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // Function to get size per breakpoint
  const getAvatarSize = (index) => {
    if (isXs) {
      return [28, 32, 36][index];
    }
    if (isSm) {
      return [36, 40, 44][index];
    }
    if (isMdUp) {
      return [38, 48, 54][index];
    }
    return 38; // default fallback
  };

  const [assign, setAssign] = useState({
    total_professionals: 0,
    assigned_professionals: {
      today: 0,
      this_month: 0,
      total: 0,
    },
    unassigned_professionals: {
      today: 0,
      this_month: 0,
      total: 0,
    },
  });

  // old code 
  // useEffect(() => {
  //   if (!hospitalId) return;
  //   console.log("Fetchingforohspital:", hospitalId);

  //   fetch(`${port}/web/professional-count/?hosp_id=${hospitalId}`, {
  //     headers: { Authorization: `Bearer ${accessToken}` },
  //   })
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw new Error(`HTTP error! status: ${res.status}`);
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log("Fetched professional count data:", data);
  //       setAssign({
  //         total_professionals: data.total_professionals || 0,
  //         assigned_professionals: {
  //           today: data.assigned_professionals?.today || 0,
  //           this_month: data.assigned_professionals?.this_month || 0,
  //           total: data.assigned_professionals?.total || 0,
  //         },
  //         unassigned_professionals: {
  //           today: data.unassigned_professionals?.today || 0,
  //           this_month: data.unassigned_professionals?.this_month || 0,
  //           total: data.unassigned_professionals?.total || 0,
  //         },
  //       });
  //     })

  //     .catch((err) => {
  //       console.error("Fetch error:", err);
  //     });
  // }, [hospitalId, port, accessToken]);

  useEffect(() => {
    const url = hospitalId
      ? `${port}/web/professional-count/?hosp_id=${hospitalId}`
      : `${port}/web/professional-count/`; // fallback for all hospitals

    fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched professional count data:", data); // check console
        setAssign({
          total_professionals: data.total_professionals || 0,
          assigned_professionals: {
            today: data.assigned_professionals?.today || 0,
            this_month: data.assigned_professionals?.this_month || 0,
            total: data.assigned_professionals?.total || 0,
          },
          unassigned_professionals: {
            today: data.unassigned_professionals?.today || 0,
            this_month: data.unassigned_professionals?.this_month || 0,
            total: data.unassigned_professionals?.total || 0,
          },
        });
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [hospitalId, port, accessToken]);

  const getAssignValue = () => {
    if (tabValue === 1 || tabValue === "1")
      return assign.assigned_professionals.today;
    if (tabValue === 2 || tabValue === "2")
      return assign.assigned_professionals.this_month;
    if (tabValue === 3 || tabValue === "3")
      return assign.assigned_professionals.total;
    return 0;
  };

  const getUnassignValue = () => {
    if (tabValue === 1 || tabValue === "1")
      return assign.unassigned_professionals.today;
    if (tabValue === 2 || tabValue === "2")
      return assign.unassigned_professionals.this_month;
    if (tabValue === 3 || tabValue === "3")
      return assign.unassigned_professionals.total;
    return 0;
  };
  useEffect(() => {
    console.log("ProfAvailable tabValue:", tabValue);
  }, [tabValue]);

  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: { xs: 2, sm: 2, md: 0.5 } }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          textAlign="left"
          sx={{
            color: "#6f42c1",
            px: 1,
            py: 0.5,
            fontSize: { xs: 16, sm: 14, md: 16 },
            mb: { xs: 1.5, sm: 1, md: 0.5 },
          }}
        >
          PROFESSIONALS AVAILABLE
        </Typography>

        <Grid container direction="column" spacing={1.2}>
          <Grid item>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                {assign.total_professionals}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Professionals
              </Typography>
            </Box>
          </Grid>

          {/* Assigned Professionals */}
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Stack direction="row" spacing={0.5}>
                {assignImages.map((src, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={avatarVariants}
                  >
                    <Avatar
                      src={src}
                      sx={{
                        width: getAvatarSize(index),
                        height: getAvatarSize(index),
                      }}
                    />
                  </motion.div>
                ))}
              </Stack>
              <Stack textAlign="center" alignItems="center">
                <Typography variant="h6" fontWeight="bold">
                  {getAssignValue()}
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color="text.secondary"
                  sx={{ fontSize: { xs: 12, sm: 14, md: 14 } }}
                >
                  Assign
                </Typography>
              </Stack>
            </Stack>
          </Grid>

          {/* Unassigned Professionals */}
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Stack direction="row" spacing={0.5}>
                {manImages.map((src, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={avatarVariants}
                  >
                    <Avatar
                      src={src}
                      sx={{
                        width: getAvatarSize(index),
                        height: getAvatarSize(index),
                      }}
                    />
                  </motion.div>
                ))}
              </Stack>
              <Stack textAlign="center" alignItems="center">
                <Typography variant="h6" fontWeight="bold">
                  {getUnassignValue()}
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color="text.secondary"
                  sx={{ fontSize: { xs: 12, sm: 14, md: 14 } }}
                >
                  Un-assign
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProfAvailable;
