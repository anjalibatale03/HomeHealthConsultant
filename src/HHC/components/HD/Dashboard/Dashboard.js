import React, { useState } from "react";
import "./Dashboard.css";
import {
  Grid,
  Box,
  Stack,
  Typography,
  Tab,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { motion } from "framer-motion";

import Navbar from "../../../Navbar";
import Footer from "../../../Footer";

import Service from "./Service";
import Complaint from "./Complaint";
import Feedback from "./Feedback";
import Enquiries from "./Enquiries";
import Enquirystatus from "./Enquirystatus";
import Cancellation from "./Cancellation";
import Professional from "./Professional";

// Reusable TabList Component
const DashboardTabList = ({ value, handleChange }) => (
  <Box
    sx={{
      background: "#f1f1f1",
      borderRadius: "10px",
      width: "auto",
      height: "auto",
      display: "flex",
      justifyContent: "center",
      // marginX: "8px",
    }}
  >
    <TabList
      onChange={handleChange}
      sx={{ position: "relative" }}
      TabIndicatorProps={{
        style: {
          background: "#69A5EB",
          height: "36px",
          marginBottom: "8px",
          borderRadius: "10px",
        },
      }}
    >
      {["Today", "This Week", "This Month"].map((label, i) => {
        const tabValue = (i + 1).toString();
        return (
          <Tab
            key={label}
            label={
              <span
                style={{
                  fontSize: "15px",
                  textTransform: "capitalize",
                  color: value === tabValue ? "#ffffff" : "black",
                }}
              >
                {label}
              </span>
            }
            value={tabValue}
            sx={{
              position: "relative",
              zIndex: 1,
              // paddingX: "10px",      
              minWidth: "auto",
              paddingY: 0,
            }}
          />
        );
      })}
    </TabList>
  </Box>
);

// Reusable Dashboard Layout Component
const DashboardLayout = ({ tabValue, handleChange }) => (
  <Grid item xs={12} container spacing={1}>
    {/* Left Panel */}
    <Grid item lg={3} md={12} xs={12}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Stack direction="row" gap={0} >

            <DashboardTabList value={tabValue} handleChange={handleChange} />

          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Service value={tabValue} />
        </Grid>
      </Grid>
    </Grid>

    {/* Center Panel */}
    <Grid item lg={4.5} md={12} xs={12}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Enquiries value={tabValue} />
        <Grid container spacing={1} sx={{ mt: 0 }}>
          <Grid item lg={6} md={12} xs={12}>
            <Professional />
          </Grid>
          <Grid item lg={6} md={12} xs={12}>
            <Complaint value={tabValue} />
          </Grid>
        </Grid>
      </Box>
    </Grid>

    {/* Right Panel */}
    <Grid item lg={4.5} md={12} xs={12}>
      <Enquirystatus value={tabValue} />
      <Grid container spacing={1} sx={{ mt: 0 }}>
        <Grid item lg={6} md={12} xs={12}>
          <Cancellation value={tabValue} />
        </Grid>
        <Grid item lg={6} md={12} xs={12}>
          <Feedback value={tabValue} />
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

const Dashboard = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ flexGrow: 1, mt: 12.5, mb: 2, width: "100%" }}>
        <TabContext value={value}>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabPanel value="1">
              <DashboardLayout tabValue={"1"} handleChange={handleChange} />
            </TabPanel>
            <TabPanel value="2">
              <DashboardLayout tabValue={"2"} handleChange={handleChange} />
            </TabPanel>
            <TabPanel value="3">
              <DashboardLayout tabValue={"3"} handleChange={handleChange} />
            </TabPanel>
          </Box>
        </TabContext>
      </Box>
      <Footer />
    </>
  );
};

export default Dashboard;
