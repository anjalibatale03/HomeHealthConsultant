
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import PublicIcon from "@mui/icons-material/Public";
import CallIcon from "@mui/icons-material/Call";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RepeatIcon from "@mui/icons-material/Repeat";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const TotalEnquiries = ({ enquiryData={} }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const enquiryData1 = [
    {
      label: "Walk-in",
      color: "#77e4d4",
      icon: <DirectionsWalkIcon />,
      width: "100%",
      count: enquiryData.Walk_in || 0,
      animation: {
        initial: { y: 0 },
        animate: { y: [0, 4, 0] },
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
      },
    },
    {
      label: "Social",
      color: "#6598f2",
      icon: <PublicIcon />,
      width: "80%",
      count: enquiryData.Social || 0,

      animation: {
        initial: { rotate: 0 },
        animate: { rotate: [0, 360] },
        transition: { duration: 6, repeat: Infinity, ease: "linear" },
      },
    },
    {
      label: "Calls",
      color: "#f2b35c",
      icon: <CallIcon />,
      width: "70%",
      count: enquiryData.Calls || 0,
      animation: {
        initial: { scale: 1 },
        animate: { scale: [1, 1.15, 1] },
        transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
      },
    },
    {
      label: "App",
      color: "#ee97da",
      icon: <PhoneIphoneIcon />,
      width: "50%",
      count: enquiryData.App || 0,
      animation: {
        initial: { opacity: 1 },
        animate: { opacity: [1, 0.5, 1] },
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      },
    },
  ];

  const enquiryStatus = [
    {
      label: "Converted",
      count: enquiryData.Converted || 0,
      bgColor: "#f8d7da",
      icon: <CheckCircleIcon sx={{ color: "#dc3545", fontSize: 18 }} />,
      animation: {
        initial: { scale: 1 },
        animate: { scale: [1, 1.25, 1] },
        transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
      },
    },
    {
      label: "In follow up",
      count: enquiryData["In_follow_up"] || 0,
      bgColor: "#d1ecf1",
      icon: <RepeatIcon sx={{ color: "#0dcaf0", fontSize: 18 }} />,
      animation: {
        initial: { x: 0 },
        animate: { x: [0, 10, 0, 9, 0] },
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
      },
    },
    {
      label: "Cancelled",
      count: enquiryData.Cancelled || 0,
      bgColor: "#fff3cd",
      icon: <CancelIcon sx={{ color: "#ffc107", fontSize: 18 }} />,
      animation: {
        initial: { rotate: 0 },
        animate: { rotate: [0, 10, -10, 10, -10, 0] },
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      },
    },
    {
      label: "Pending",
      count: enquiryData.Pending || 0,
      bgColor: "#f3e6fa",
      icon: <HourglassEmptyIcon sx={{ color: "#6f42c1", fontSize: 18 }} />,
      animation: {
        initial: { opacity: 1 },
        animate: { opacity: [1, 0.4, 1] },
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      },
    },
  ];

  const cardSx = {
    position: "relative",
    overflow: "visible",
    borderRadius: { xs: 2, sm: 3 },
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    minHeight: "100%",
    p: { xs: 1.5, sm: 2, md: 2.5 },
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };
  return (
    <Card
      sx={{
        minHeight: { xs: 200, sm: 290, md: 260 },
        backgroundColor: "#fff",
        boxShadow: "0 4px 10px rgb(0 0 0 / 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        // mb: 1,
        borderRadius: 2,
        mx: 0.5,
        p: 1,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{
          textAlign: "left",
          color: "#6f42c1",
          fontSize: { xs: 14, sm: 14, md: 16 },
          mr: 1,
          // mb:,
        }}
      >
        ENQUIRIES
      </Typography>
      <CardContent sx={{ p: 2 }}>
        {/* Top Section */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          {/* Left: Title */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              color="text.secondary"
              sx={{ fontSize: { xs: 12, sm: 14, md: 14 } }}
            >
              TOTAL ENQUIRIES
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                fontSize: { xs: 16, sm: 14, md: 17 },
              }}
            >
              {enquiryData.Total_enquiries || 0}
            </Typography>
          </Box>

          {/* Right: Horizontal Bars */}
          <Stack spacing={1} sx={{ width: "100%", maxWidth: 250 }}>
            {enquiryData1.map(({ label, color, icon, width, animation ,count}) => (
              <Box
                key={label}
                sx={{
                  backgroundColor: color,
                  width,
                  height: 29, // Increased height
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgb(0 0 0 / 0.1)",
                  px: 0.5, // Added horizontal padding
                }}
              >
                <MotionBox
                  sx={{ color: "#fff", mr: 1 }}
                  initial={animation.initial}
                  animate={animation.animate}
                  transition={animation.transition}
                >
                  {icon}
                </MotionBox>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{
                    color: "#fff",
                    whiteSpace: "nowrap",
                    fontSize: { xs: 10, sm: 12 },
                  }}
                >
                  {label}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{
                    color: "#fff",
                    ml: 1,
                    fontSize: { xs: 10, sm: 12 },
                  }}
                >
                  {count}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>

        {/* Bottom: Enquiry Status Cards */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="space-between"
          mt={1}
        >
          {enquiryStatus.map(({ label, count, bgColor, icon, animation }) => (
            <Box
              key={label}
              sx={{
                flex: 1,
                backgroundColor: bgColor,
                borderRadius: 2,
                py: 1,
                px: 1,
                textAlign: "center",
                boxShadow: "0 2px 4px rgb(0 0 0 / 0.1)",
                minHeight: "auto",
                width: { xs: "100%", sm: "auto" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MotionBox
                sx={{ mb: 0.5 }}
                initial={animation.initial}
                animate={animation.animate}
                transition={animation.transition}
              >
                {icon}
              </MotionBox>

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ mb: 0.2, fontSize: { xs: 14, sm: 16 }, lineHeight: 1.2 }}
              >
                {count}
              </Typography>

              <Typography
                variant="caption"
                fontWeight="medium"
                sx={{
                  fontSize: { xs: 11, sm: 12.5 },
                  lineHeight: 1.1,
                  mt: 0,
                }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TotalEnquiries;
