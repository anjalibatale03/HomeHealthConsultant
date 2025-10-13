import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';

export default function TermsCondition() {
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
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#69DAC3', mb: 3 }}>
          TERMS & CONDITIONS
        </Typography>

        <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
          Thank you for accessing <b>https://hhc.hospitalguru.in/</b>. This site is owned by <b>Spero Home Healthcare Pvt. Ltd.</b> (hereinafter referred to as <b>https://hhc.hospitalguru.in/</b>). By accessing this site, you indicate your unconditional acceptance of these terms & conditions. We reserve the right, at our sole discretion, to update or revise these terms & conditions. Continued use of the site following the posting of any changes constitutes your acceptance of those changes.
        </Typography>

        <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
          At <b>https://hhc.hospitalguru.in/</b>, we try our best to create a space where you can explore and shop for all your favorite things in a safe and secure environment. All products and information displayed on <b>https://hhc.hospitalguru.in/</b> constitute an “invitation to offer”. Your order constitutes your “offer”, which shall be subject to the terms and conditions as listed below.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
          1. Eligibility to use our site
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
          Use of the Site is available only to persons who can legally enter into contracts under applicable laws. Persons who are “incompetent to contract”, within the meaning of the Indian Contract Act, 1872, including un-discharged insolvents, etc., are not eligible to use the Site. <b>https://hhc.hospitalguru.in/</b> reserves the right to terminate your access if it discovers that you are under the age of 18 years or suffer from any other disability, as recognized under the Indian Contract Act, 1872.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
          2. Membership
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
          Although it's not essential to have an account to shop with <b>https://www.sperohomehealth.in/</b>, you can shop as a guest. As a member, you agree to provide true, accurate, current, and complete information about yourself as prompted by the site's registration form. Registration where prohibited under any law shall be void. <b>https://hhc.hospitalguru.in/</b> reserves the right to revoke or terminate your registration for any reason at any time, without notice.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
          3. Electronic Communications
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
          When you use the site or send emails or other data, information or communicate to us, you agree and understand that you are communicating with us electronically and give your consent to receive communications electronically from us periodically, when required.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
          4. Reviews, Feedback, Submissions
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
          All reviews, comments, feedback, postcards, suggestions, ideas, and other submissions disclosed, submitted or offered to <b>https://hhc.hospitalguru.in/</b> directly or otherwise disclosed, submitted or offered in connection with your use of this Site (collectively referred to as "Comments") will remain <b>https://hhc.hospitalguru.in/</b> property. Such disclosure, submission or offer of any comments shall constitute an assignment to <b>https://hhc.hospitalguru.in/</b> of all worldwide rights, titles and interests in all copyrights and other intellectual properties in the comments, thus, it exclusively owns all such rights, titles and interests and shall not be limited in any way in its use, commercial or otherwise. <b>https://hhc.hospitalguru.in/</b> will be entitled to use, reproduce, disclose, modify, adapt, create derivative works from, publish, display and distribute any comments you submit for any purpose whatsoever, without restriction and without compensating you in any way.
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
          You agree that any comments submitted by you to the Site will not violate this policy or any right of any third party, including copyright, trademark, privacy or other personal or proprietary right(s), and will not cause injury to any person or entity. You further agree that no comments submitted by you to the site will be libelous or otherwise unlawful, threatening, abusive or obscene material, or contain software viruses, political campaigning, commercial solicitation, chain letters, mass mailings or any form of "spam".
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
          5. Accuracy of Content/Information of Products on the Web Site
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          While <b>https://hhc.hospitalguru.in/</b> strives to provide accurate product and pricing information, typographical errors may occur. In the event that a product is listed at an incorrect price or with incorrect information due to an error in pricing or product information, <b>https://hhc.hospitalguru.in/</b> shall have the right, at our sole discretion, to modify the price of the products, or information of the products or to refuse or cancel any orders placed for that product, unless the product has already been dispatched.
        </Typography>

        {/* <Container sx={{ py: 6 }}> */}
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#69DAC3', mb: 3, mt: 4 }}>
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
