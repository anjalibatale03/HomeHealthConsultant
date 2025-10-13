import React from "react";
import { Box, Container, Typography, Grid, Paper, Divider } from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HandshakeIcon from "@mui/icons-material/Handshake";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const themeColor = "#69DAC3";

const data = [
  {
    title: "Mission",
    icon: <RocketLaunchIcon sx={{ fontSize: 40, color: themeColor }} />,
    content:
      "Be Trustworthy And Innovative Healthcare Technology Firm In The World.",
    gradient: `linear-gradient(135deg, ${themeColor} 0%, #a3f5e3 100%)`,
  },
  {
    title: "Vision",
    icon: <VisibilityIcon sx={{ fontSize: 40, color: themeColor }} />,
    content:
      "Value By Constantly Understanding Needs, Challenges Of The Community For The Healthcare And Innovate Unique Solution To Address It. Spero Will Benchmark The Best In The World While Achieving Excellence In What We Do.",
    gradient: `linear-gradient(135deg, ${themeColor} 0%, #a3f5e3 100%)`,
  },
  {
    title: "Values",
    icon: <HandshakeIcon sx={{ fontSize: 40, color: themeColor }} />,
    content:
      "Create And Maintain Organizational Skill, Knowledge & Discipline Be Most Respected, Trustworthy & Integral Firm Maintain Professionalism In All Business Relationships Always Be Responsive To Needs Of Employee, Society, Customers & Investors",
    gradient: `linear-gradient(135deg, ${themeColor} 0%, #a3f5e3 100%)`,
  },
];

export default function AboutUs() {
  return (
    <Box sx={{ fontFamily: "Poppins, sans-serif", bgcolor: "linear-gradient(135deg, #69DAC3 0%, #3DDAD7 100%)" }}>
      <Box
        sx={{
          bgcolor: "#69DAC3",
          color: "#fff",
          py: 1,
          px: { xs: 2, md: 6 },
          display: "flex",
          justifyContent: { xs: "center", md: "space-between" },
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          textAlign: { xs: "center", sm: "left" },
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PhoneIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
              07620400100
            </Typography>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              bgcolor: "rgba(255,255,255,0.5)",
              display: { xs: "none", sm: "block" },
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MailIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
              info@sperohomehealth.in
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* About Section */}
      <Container sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 1, color: "#333" }}
          >
            About Us
          </Typography>
          <Box
            sx={{
              width: 80,
              height: 3,
              bgcolor: themeColor,
              margin: "0 auto",
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Mission, Vision, Values */}
        <Grid container spacing={4}>
          {data.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderTop: `5px solid transparent`,
                  borderImage: `${item.gradient} 1`,
                  borderImageSlice: 1,
                  minHeight: 250,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  backgroundColor: "#fff",
                  borderRadius: 2,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: `0 6px 12px rgba(105, 218, 195, 0.3)`,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {item.icon}
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, ml: 2, color: "#333" }}
                  >
                    {item.title}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1.8, color: "#555", textAlign: "justify" }}
                >
                  {item.content}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
