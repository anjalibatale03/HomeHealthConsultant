import React from 'react';
import { Box, Container, Typography, Divider, Grid } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
export default function CancellationRefundPolicy() {
    return (
        <Box sx={{ fontFamily: 'Poppins, sans-serif', bgcolor: '#fff' }}>
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

            <Box sx={{ fontFamily: 'Poppins, sans-serif', bgcolor: '#fff', py: 6 }}>
                <Grid container spacing={0}>
                    {/* Left Side - Contact Info */}
                    <Grid item xs={12} md={6} sx={{ px: { xs: 2, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#69DAC3', mb: 3 }}>
                            CONTACT INFORMATION
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, gap: 1 }}>
                            <LocationOnIcon sx={{ mt: 0.5, color: '#69DAC3' }} />
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>OFFICE LOCATION</Typography>
                                <Typography variant="body1">
                                    SPERO HOME HEALTHCARE PRIVATE LIMITED<br />
                                    1, Shiv Corner, Samarth Park<br />
                                    Brahma Garden Rd, Anand Nagar, Pune,<br />
                                    Maharashtra 411041
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                            <PhoneIcon sx={{ color: '#69DAC3' }} />
                            <Typography variant="body1">07620400100</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
                            <MailIcon sx={{ color: '#69DAC3' }} />
                            <Typography variant="body1">info@sperohomehealth.in</Typography>
                        </Box>
                    </Grid>

                    {/* Right Side - Map */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ height: { xs: 300, md: '100%' } }}>
                            <iframe
                                title="Spero Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.1597114724514!2d73.81821787519053!3d18.476423482608574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2955e5da239b9%3A0xdac5aee634427642!2sShiv%20Corner%2C%20Anand%20Nagar%2C%20Pune%2C%20Maharashtra%20411051!5e0!3m2!1sen!2sin!4v1760089991438!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </Box>
                    </Grid>

                </Grid>
            </Box>
        </Box>
    );
}
