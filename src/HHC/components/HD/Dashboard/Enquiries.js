import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const Enquiries = ({ value }) => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");

  const [enquiry, setEnquiry] = useState([]);

  useEffect(() => {
    const getEnquires = async () => {
      if (value) {
        try {
          const res = await fetch(
            `${port}/web/Dashboard_enquiry_count_api/${value}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await res.json();
          // console.log("Enquiries Data.........", data);
          setEnquiry(data);
        } catch (error) {
          console.error("Error fetching Enquiries Data:", error);
        }
      }
    };
    getEnquires();
  }, [value]);

  const chartData = {
    // series: [50, 80, 110, 200],
    series: [],
    options: {
      chart: {
        height: 350,
        type: "radialBar",
        background: "transparent",
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "40%",
          },
          track: {
            background: "transparent",
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              fontSize: "16px",
            },
          },
        },
      },
      colors: ["#00D5FF", "#2CDFAA", "#FFC300", "#E80054"],
    },
  };

  const seriesData = [
    enquiry["Walk_in_percentage"],
    enquiry["Social_percentage"],
    enquiry["Calls_percentage"],
    enquiry["App_percentage"],
  ];

  chartData.series = seriesData;
  return (
   <Box
  sx={{
    flexGrow: 1,
    width: "100%",
    minHeight: 200, // force minimum height
    // p: 1,
  }}
  style={{
    background: "#f1f1f1",
    boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
    borderRadius: "8px",
  }}
>

      <Typography
        align="left"
        sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }}
        color="text.secondary"
        gutterBottom
      >
        ENQUIRIES
      </Typography>
      <Grid item xs={12} container spacing={1}>
        <Grid item lg={6} md={6} xs={12} sx={{ marginTop: "1px" }}>
          <Stack direction="row" justifyContent="center" spacing={1}>
            <Typography variant="h5" sx={{ fontWeight: "600" }}>
              {enquiry.Total_enquiries}
            </Typography>
            <Typography variant="subtitle2" style={{ marginTop: "5px" }}>
              TOTAL ENQUIRIES
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-around"
           sx={{ mt: 2 }}
          >
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: "600" }}>
                {enquiry.Walk_in}
              </Typography>
              <Typography variant="subtitle1">Walk-in</Typography>
              <Box
                sx={{
                  m: 1,
                  width: 20,
                  height: 12,
                  borderRadius: "10px",
                  backgroundColor: "#00D5FF",
                }}
              />
            </div>
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: "600" }}>
                {enquiry.Social}
              </Typography>
              <Typography variant="subtitle1">Web</Typography>
              <Box
                sx={{
                  m: 1,
                  width: 20,
                  height: 12,
                  borderRadius: "10px",
                  backgroundColor: "#2CDFAA",
                }}
              />
            </div>
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: "600" }}>
                {enquiry.Calls}
              </Typography>
              <Typography variant="subtitle1">Calls</Typography>
              <Box
                sx={{
                  m: 1,
                  width: 20,
                  height: 12,
                  borderRadius: "10px",
                  backgroundColor: "#FFC300",
                }}
              />
            </div>
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: "600" }}>
                {enquiry.App}
              </Typography>
              <Typography variant="subtitle1">App</Typography>
              <Box
                sx={{
                  m: 1,
                  width: 20,
                  height: 12,
                  borderRadius: "10px",
                  backgroundColor: "#E80054",
                }}
              />
            </div>
          </Stack>
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="radialBar"
            height="160"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Enquiries;
