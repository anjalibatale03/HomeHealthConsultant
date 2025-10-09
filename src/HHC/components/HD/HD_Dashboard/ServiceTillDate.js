import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const ServicesTillDate = () => {
  return (
    <Card
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        height: "100%",
        minHeight: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
      }}
    >
      <CardContent sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          Services Till Date
        </Typography>
        <Typography variant="h4" color="primary" fontWeight="bold">
          630
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ServicesTillDate;
