import React from "react";
import { Card, CardContent, Typography, Stack, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ServiceDetails = ({ allServices, tabValue }) => {
  const selectedKey =
    tabValue === "1" ? "today" : tabValue === "2" ? "this_month" : "till_date";

  const formattedData =
    allServices?.services?.map((srv, index) => ({
      name: srv,
      Completed: allServices?.complete_service?.[selectedKey]?.[index] || 0,
      Ongoing: allServices?.ongoing_service?.[selectedKey]?.[index] || 0,
      Pending: allServices?.pending_service?.[selectedKey]?.[index] || 0,
    })) || [];

  return (
    <Card
      sx={{
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        height: "100%",
        minHeight: { xs: 250, sm: 300, md: 350 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: { xs: 1, sm: 2 },
      }}
    >
      <CardContent sx={{ height: "100%", padding: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={0.2}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              textAlign: "center",
              color: "#6f42c1",
              textTransform: "uppercase",
              fontSize: { xs: 14, sm: 14, md: 16 },
              mb: 0.1,
              position: "relative",
              width: "100%",
            }}
          >
            Service Details
          </Typography>
        </Stack>

        <Box
          sx={{
            width: "100%",
            height: { xs: 220, sm: 300, md: 520 },
            overflowY: "scroll", // ✅ Must remain scroll
            overflowX: "hidden",
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": {
              width: 0,
              height: 0,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "transparent", // You can set a color like "#ccc" if you want visible scroll
            },
          }}
        >
          <ResponsiveContainer width="100%" height={formattedData.length * 50}>
            <BarChart
              data={formattedData}
              layout="vertical"
              margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="Completed"
                stackId="a"
                fill="#36EED1"
                barSize={20}
                isAnimationActive={false}
                onMouseOver={() => {}}
              />
              <Bar
                dataKey="Ongoing"
                stackId="a"
                fill="#F72585"
                isAnimationActive={false}
                onMouseOver={() => {}}
                barSize={20}
              />
              <Bar
                dataKey="Pending"
                stackId="a"
                fill="#7086FD"
                isAnimationActive={false}
                onMouseOver={() => {}}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ServiceDetails;
