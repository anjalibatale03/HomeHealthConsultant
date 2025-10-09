import React, { useEffect } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const Feedback = ({ feedbackData = {} }) => {
  useEffect(() => {
    console.log("Feedback", feedbackData);
  }, [feedbackData]);

  const feedback = feedbackData || {};

  const total = feedback.Total_feedback || 0;
  // set values by default 0.1 for chart display
  const average = feedback.average || 0.1;
  const good = feedback.good || 0.1;
  const excellent = feedback.excellent || 0.1;

  const segmentsData = [
    { name: "Excellent", value: excellent, color: "#2EC4B6" },
    { name: "Good", value: good, color: "#FF9F1C" },
    { name: "Average", value: average, color: "#E71D36" },
  ];

  const totalGiven = excellent + good + average;
  const feedbackPercent =
    total > 0 ? Math.round((totalGiven / total) * 100) : 0;

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: { xs: 2, sm: 3 },
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        minHeight: { xs: 200, sm: 200, md: 250 },
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <CardContent sx={{ pt: 0.2, pb: "16px !important" }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            textAlign: "left",
            color: "#6f42c1",
            textTransform: "uppercase",
            fontSize: { xs: 16, sm: 14, md: 16 },
            mb: 0,
            mt: 0,
          }}
        >
          Feedback
        </Typography>

        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 180, sm: 150, md: 180 },
            mt: 1,
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segmentsData}
                dataKey="value"
                startAngle={180}
                endAngle={0}
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={4}
                stroke="#fff"
                strokeWidth={3}
                cx="50%"
                cy="50%"
              >
                {segmentsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: 60, sm: 70 },
              height: { xs: 60, sm: 70 },
              borderRadius: "50%",
              backgroundColor: "#FFF3E1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: 2,
              flexDirection: "column",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography
                // variant="caption"
                sx={{
                  fontSize: { xs: 10, sm: 11, md: 10 },
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: "bold",
                  color: "#000000",
                  gap: 0.5,
                }}
              >
                Total <br /> Feedback
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: 14, sm: 16 ,md: 26},
                  color: "#FD9F62",
                  lineHeight: 1,
                }}
              >
                {total}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 0.1,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            {segmentsData.map((entry, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: 12,
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: entry.color,
                  }}
                />
                <Typography sx={{ fontSize: 12 }}>{entry.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Feedback;
