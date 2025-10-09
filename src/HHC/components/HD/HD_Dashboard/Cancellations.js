import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import { PieChart } from "react-minimal-pie-chart";

const cardSx = {
  position: "relative",
  overflow: "hidden",
  borderRadius: { xs: 2, sm: 3 },
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  minHeight: { xs: 200, sm: 250 },
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const Cancellations = ({ cancellationData = {} }) => {
  useEffect(() => {
    // console.log("Hospital ID:", hospitalId);
    // console.log("Tab Value:", tabValue);
    console.log("Cancellation:", cancellationData);
  }, [cancellationData]);

  const cancellation = cancellationData?.cancellation || {};
  const [selectedIndex, setSelectedIndex] = useState(null);

  const pieData = [
    {
      title: "By Spero",
      value: cancellationData.can_by_spero || 0,
      color: "#F72585",
    },
    {
      title: "By Customer",
      value: cancellationData.can_by_ptn || 0,
      color: "#FFD600",
    },
  ];

  const total = cancellationData.Total_cancellation || 0;
  

  const handleClick = (_, index) => {
    setSelectedIndex(index);
  };

  const selectedLabel =
    selectedIndex !== null ? pieData[selectedIndex]?.title : "TOTAL";
  const selectedValue =
    selectedIndex !== null ? pieData[selectedIndex]?.value : total;

  return (
    <Card sx={cardSx}>
      <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
        <Typography
          fontWeight="bold"
          sx={{
            textAlign: "left",
            color: "#6f42c1",
            fontSize: { xs: 16, sm: 14, md: 16 },
            mb: 0,
          }}
        >
          CANCELLATIONS
        </Typography>

        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 110, sm: 130, md: 150 },
            mt: 1,
          }}
        >
          <PieChart
            data={pieData}
            totalValue={total}
            lineWidth={22}
            rounded
            animate
            startAngle={270}
            lengthAngle={-360}
            paddingAngle={2}
            style={{ height: "100%", cursor: "pointer" }}
            onClick={handleClick}
            label={({ dataEntry }) => `${dataEntry.value}`}
            labelStyle={{
              fontSize: "8px",
              fontFamily: "sans-serif",
              fill: "#fff",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: "1rem", sm: "1.2rem" }, lineHeight: 1 }}
            >
              {selectedValue}
            </Typography>
            <Typography
              variant="caption"
              fontWeight="bold"
              sx={{
                fontSize: { xs: "8px", sm: "10px", md: "11px" },
                lineHeight: 1.2,
                mt: 0.3,
              }}
            >
              {selectedLabel}
              <br />
              CANCELLATIONS
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
          {pieData.map((item, i) => (
            <Stack direction="row" spacing={1} alignItems="center" key={i}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: item.color,
                }}
              />
              <Typography
                variant="body2"
                sx={{ fontSize: "12px", fontWeight: 500 }}
              >
                {item.title}: {item.value}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Cancellations;
