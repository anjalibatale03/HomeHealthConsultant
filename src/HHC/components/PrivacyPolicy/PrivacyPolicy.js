import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';

export default function PrivacyPolicy() {
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

      {/* Main Content */}
      <Container sx={{ py: 6, textAlign: 'left' }}>
        {/* <Container sx={{ py: 6 }}> */}
       <Typography variant="h4" sx={{ fontWeight: 700, color: '#69DAC3', mb: 3 }}>
               Spero - Privacy Policy & Disclaimer
             </Typography>
     
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
               The contents of this web site are provided for informational purposes only. Nothing contained in this web site is intended, or should be construed, as an endorsement or recommendation of any unrelated organization, society or any entity, which may be referenced in this site.
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
               Further, nothing is intended to furnish medical advice and opinions on diagnosis, treatment or care of an individual patient and/or a condition, all of which should be discussed with and obtained by consulting a physician.
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
               These companies accept patients for care regardless of age, race, color, national origin, religion, sex, disability, being a qualified disabled veteran, or any other category protected by law, or decisions regarding advanced directives.
             </Typography>
     
             <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
               Our Commitment to Your Privacy
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
               Our organization is dedicated to maintaining the privacy of your identifiable health information. We create records regarding you and the treatment and services we provide.
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
               We are required by law to maintain the confidentiality of health information that identifies you and to provide this notice of our legal duties and privacy practices.
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
               We must follow the terms of the notice of privacy practices in effect at the time.
             </Typography>
     
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
               This notice provides important information about:
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2, ml: 3 }}>
               • How we may use and disclose your identifiable health information.
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2, ml: 3 }}>
               • Your privacy rights in your identifiable information.
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2, ml: 3 }}>
               • Our obligations concerning the use and disclosure of your identifiable health information.
             </Typography>
     
             <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
               Use and Disclosure of Your Health Information
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1 }}>
               1. Provision of Care:
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1, ml: 3 }}>
               We may use or disclose your health information to provide care and share with those assisting in your care (physicians, therapists, spouse, children, parents).
             </Typography>
     
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1 }}>
               2. Payment:
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1, ml: 3 }}>
               We may use or disclose your information for billing and payment purposes, including obtaining payment from third parties.
             </Typography>
     
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1 }}>
               3. Health Care Operations:
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1, ml: 3 }}>
               We may use or disclose information to operate our business, evaluate care quality, and conduct cost management and business planning activities.
             </Typography>
     
             <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
               Special Circumstances
             </Typography>
     
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1 }}>
               1. Public Health Risks:
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1, ml: 3 }}>
               Disclosure to authorities for vital records, child abuse, disease control, exposure notification, and reporting reactions to drugs or products.
             </Typography>
     
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1 }}>
               2. Health Oversight Activities:
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1, ml: 3 }}>
               Disclosure to oversight agencies for audits, investigations, licensure, disciplinary actions, and monitoring government programs.
             </Typography>
     
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1 }}>
               3. Lawsuits and Similar Proceedings:
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1, ml: 3 }}>
               Disclosure in response to court or administrative orders, subpoenas, or lawful discovery requests.
             </Typography>
     
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1 }}>
               4. Legal Requirement:
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1, ml: 3 }}>
               Disclosure requested by courts for crimes, deaths, warrants, or emergencies.
             </Typography>
     
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1 }}>
               5. Authorization for Other Uses:
             </Typography>
             <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 1, ml: 3 }}>
               We will obtain your written authorization for uses not identified in this notice. You may revoke authorization in writing, but we are required to retain records of your care.
             </Typography>
        {/* </Container> */}
      </Container>
    </Box>
  );
}
