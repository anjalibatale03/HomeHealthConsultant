import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const Service = ({ value }) => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");

  const [service, setService] = useState({});

  useEffect(() => {
    const getService = async () => {
      if (value) {
        try {
          const res = await fetch(`${port}/web/srv_dtl_dash/${value}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          setService(data);
        } catch (error) {
          console.error("Error fetching Service Count:", error);
        }
      }
    };
    getService();
  }, [value]);

  const data = [
    {
      label: "Completed",
      value: service.Completed_services?.completed_srv || 0,
      color: "rgb(252, 134, 215)",
    },
    {
      label: "Pending",
      value: service.Pending_services?.Pending_srv || 0,
      color: "rgb(231, 130, 6)",
    },
    {
      label: "Ongoing",
      value: service.ongoing_services?.Ongoing_srv || 0,
      color: "rgb(46, 10, 81)",
    },
  ];

  const total = data.reduce((acc, item) => acc + item.value, 0) || 1;

  // Get max value for scaling bars
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 267,
        minHeight: 390,
        background: "#f1f1f1",
        boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
        borderRadius: "12px",
        p: 1.5,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        align="center"
        sx={{
          fontSize: { xs: 12, sm: 13 },
          fontWeight: 600,
          textTransform: "uppercase",
        }}
        color="text.secondary"
        gutterBottom
      >
        Services Details
      </Typography>

      <Typography
        align="center"
        variant="h5"
        sx={{ fontWeight: 600, color: "#333" }}
      >
        {service.Total_services || 0}
      </Typography>

      <Typography
        align="center"
        sx={{
          fontSize: { xs: 11, sm: 12 },
          fontWeight: 500,
          color: "#777",
          textTransform: "uppercase",
        }}
      >
        Total Services
      </Typography>

      {/* Bubble Section */}
    <Box
      sx={{
        width: "100%",
        maxWidth: 300,
        minHeight: 180,
         background: "#f1f1f1",
       
        borderRadius: "12px",
        p: 2,
        mt: 5,
      }}
    >
     

      {data.map(({ label, value, color }, index) => {
        const barWidth = (value / maxValue) * 100; // percentage width for bar

        return (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Typography
              sx={{
                width: 90,
                fontSize: 13,
                fontWeight: 600,
                color: "#555",
                textTransform: "capitalize",
              }}
            >
              {label}
            </Typography>

            <Box
              sx={{
                flexGrow: 1,
                height: 24,
                backgroundColor: "#ddd",
                borderRadius: 12,
                overflow: "hidden",
                mr: 1.5,
              }}
            >
              <Box
                sx={{
                  width: `${barWidth}%`,
                  height: "100%",
                  backgroundColor: color,
                  borderRadius: 12,
                  transition: "width 0.5s ease",
                }}
              />
            </Box>

            <Typography
              sx={{
                minWidth: 30,
                fontWeight: 600,
                fontSize: 13,
                color: "#333",
                textAlign: "right",
              }}
            >
              {value}
            </Typography>
          </Box>
        );
      })}
    </Box>


      {/* Legend Section */}
      <Grid item xs={12} sx={{ mt: 2.5 }}>
        <Box display="flex" justifyContent="center" gap={2.5}>
          {data.map((item, i) => (
            <Box key={i} display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 9,
                  height: 9,
                  backgroundColor: item.color,
                  borderRadius: "50%",
                }}
              ></Box>
              <Typography sx={{ fontSize: 11, fontWeight: 500 }}>
                {item.label} {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Grid>
    </Box>
  );
};

export default Service;
