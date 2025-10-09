import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const Enquirystatus = ({ value }) => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");

  const [enqStatus, setEnqStatus] = useState({});

  useEffect(() => {
    const getEnqStatus = async () => {
      if (value) {
        try {
          const res = await fetch(
            `${port}/web/Dashboard_enquiry_status_count_api/${value}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await res.json();
          setEnqStatus(data);
        } catch (error) {
          console.error("Error fetching Enquiries Status Count:", error);
        }
      }
    };
    getEnqStatus();
  }, [value]);

  const seriesData = [
    enqStatus["converted_to_service"] || 0,
    enqStatus["in_follow_up"] || 0,
    enqStatus["pending_srv"] || 0,
    enqStatus["cancelled_srv"] || 0,
  ];

  const labels = [
    "Converted into Service",
    "In Follow up",
    "Pending Enquiry",
    "Cancelled Enquiry",
  ];

  const colors = ["#2EAED6", "#FF8008", "#FD7568", "#FF5508"];

  const chartData = {
    series: seriesData,
    options: {
      chart: {
        type: "donut",
      },
      labels: labels,
      legend: {
        show: false, // 👈 Legend disable
      },
      colors: colors,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: false,
      },
    },
  };

  return (
   <Box
  sx={{
    width: "95%", // ✅ Full width
    background: "#f1f1f1",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    borderRadius: "8px",
    ml: 0.3,
    p: 1,
    pl: 2,
  }}
>
  <Typography
    align="left"
    sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}
    color="text.secondary"
  >
    ENQUIRY STATUS
  </Typography>

  <Stack
    direction="row"
    spacing={2}
    alignItems="center"
    justifyContent="space-between"
    sx={{ flexWrap: "wrap" }}
  >
    {/* Left legend */}
    <List dense sx={{ flex: 1, minWidth: 160 }}>
      {labels.map((label, index) => (
        <ListItem key={label} sx={{ p: 0.1 }}>
          <ListItemIcon sx={{ minWidth: 24 }}>
            <FiberManualRecordIcon
              sx={{ color: colors[index], fontSize: 14 }}
            />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{ fontSize: 13 }}
            primary={label}
          />
        </ListItem>
      ))}
    </List>

    {/* Right chart */}
    <Chart
      options={chartData.options}
      series={chartData.series}
      type="donut"
      height={165}
      width={180}
    />
  </Stack>
</Box>
  );
};

export default Enquirystatus;
