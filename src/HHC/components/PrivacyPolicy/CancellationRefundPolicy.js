import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';

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

            {/* Main Content */}
            <Container sx={{ py: 6, textAlign: 'left' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#69DAC3', mb: 3 }}>
                    Spero - Cancellation / Refund Policy
                </Typography>

                {/* Payment Policy */}
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                    Spero Payment, Refund and Cancellation Policy
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                    Payment Policy
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    1. All services offered by Spero are offered on a fixed/flat fee basis and are not subject to any discounts, deductions or negotiations.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    2. For all services, payments shall be made in advance. The payments may be made through cheque, demand drafts, credit card, debit card or e-banking.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    3. In case of payment by credit card/ debit card, you agree and understand that the details provided by you will be correct and accurate and that the card used by you to make payment is lawfully owned by you.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    The said information shall not be utilized and shared by Spero with any of the third parties unless required by law, regulations or court order.
                </Typography>

                {/* Refund and Cancellation Policy */}
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                    Refund and Cancellation Policy
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 1 }}>
                    1. In case of cancellation or non-confirmation of the Home Healthcare Service by Spero due to any reasons; three options are available to the user:
                    <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 1, ml: 3 }}>
                        <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 1 }}>
                            i. He may ask for rescheduling the Home Healthcare Service, or
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 1 }}>
                            ii. He may ask for rescheduling the Home Healthcare Service, or
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 1 }}>
                            iii. He may ask for rescheduling the Home Healthcare Service, or
                        </Typography>
                    </Typography>
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    2. In case of non-paymentof advance user is entitled to a percentage of payment, depending upon the when he/she cancels a service: (Percentage in respect to service cost)
                </Typography>
                <Box sx={{ mt: 2, mb: 3, width: '60%' }}>
                    {/* Table Header */}
                    <Box sx={{ display: 'flex', fontWeight: 600, mb: 1 }}>
                        <Box sx={{ flex: 2 }}>Time Period</Box>
                        <Box sx={{ flex: 1 }}>Percentage of Payment</Box>
                    </Box>

                    {/* Table Rows */}
                    <Box sx={{ display: 'flex', mb: 0.5 }}>
                        <Box sx={{ flex: 2 }}>Before 24 Hours</Box>
                        <Box sx={{ flex: 1 }}>Nil</Box>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 0.5 }}>
                        <Box sx={{ flex: 2 }}>Before 3 Hours prior to the time the service is booked</Box>
                        <Box sx={{ flex: 1 }}>10%</Box>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 0.5 }}>
                        <Box sx={{ flex: 2, width: '50%' }}>Within 3 Hours prior to the time the service is booked / In case the professional has arrived at the Patient's address</Box>
                        <Box sx={{ flex: 1 }}>50%</Box>
                    </Box>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    3. In case of advance payment user is entitled to a percentage of refund, depending upon when he/she cancels a service:(Percentage in respect to service cost)
                </Typography>
                <Box sx={{ mt: 2, mb: 3 }}>
                    {/* Table Header */}
                    <Box sx={{ display: 'flex', fontWeight: 600, mb: 1 }}>
                        <Box sx={{ flex: 2 }}>Time Period</Box>
                        <Box sx={{ flex: 1 }}>Percentage of Refund</Box>
                    </Box>

                    {/* Table Rows */}
                    <Box sx={{ display: 'flex', mb: 0.5 }}>
                        <Box sx={{ flex: 2 }}>Before 24 Hours</Box>
                        <Box sx={{ flex: 1 }}>100%</Box>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 0.5 }}>
                        <Box sx={{ flex: 2 }}>Before 3 Hours prior to the time the service is booked</Box>
                        <Box sx={{ flex: 1 }}>90%</Box>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 0.5 }}>
                        <Box sx={{ flex: 2 }}>Within 3 Hours prior to the time the service is booked / In case the professional has arrived at the Patient's address</Box>
                        <Box sx={{ flex: 1 }}>50%</Box>
                    </Box>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    4. In case the userâ€™s credit card/debit card/payment account has been accidentally over-charged, please notify Spero of the same at the earliest. In case of over-charging, the user has the following options:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 1, ml: 3 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 1 }}>
                        i. He may claim a refund of the outstanding amount. In such a scenario, Spero shall make all endeavors to refund the amount within 7-14 working days.
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 1 }}>
                        ii. The outstanding amount may also be credited to the account of the user so as to be adjusted in future Home Healthcare Service of himself or of any other person.
                    </Typography>

                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    5. The refund shall be made by e-banking or by cheque or by other such mode other than cash, depending upon the suitability of both, Spero and the user.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    For claiming refund, the user should necessarily have the valid invoice, so as to be able to get the refund.
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                    Suspension due to non-compliance with Agreement
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    Spero will make all possible efforts to provide you the best services for your payment. However, Spero shall not incur any liability and shall declare any service guarantee void in event of one or more of the following circumstances:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    1. If you have not provided us with correct patient details including the patientâ€™s name, address, telephone number, mobile number, Service Type, Payment Account information, or the account information of the payee.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    2. If, through no fault of Spero, your payment account does not contain sufficient funds to complete the transaction or the transaction exceeds the credit limit of your overdraft amount.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    3. If the payment processing center is not working properly, and you know or have been advised by Spero about the malfunction, before, at the time of, or immediately after you execute the transaction.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    4. If circumstances beyond the control of Spero (such as, but not limited to, fire, flood, or interference from external forces) prevent proper execution of the transaction and Spero Healthcare has taken reasonable precautions to avoid these circumstances.
                </Typography>

                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    5. In case of payment through credit card, if the details provided by user are inaccurate, incorrect or entered fraudulently.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    If the user is in breach of any of the Terms and Conditions of this Agreement and/or the Terms and Conditions of the usage of Spero Services.
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                    Jurisdiction and applicable laws
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 2 }}>
                    This Agreement and any services rendered hereunder are subject to all the applicable laws and regulations of India and the rights and obligations of the parties hereto under or in connection with this Agreement shall be determined in accordance with the laws of India. Subject to the provisions relating to Arbitration, any court of competent jurisdiction at <b>Pune</b> shall have jurisdiction and venue in any proceeding instituted to enforce this Agreement and any objections to such jurisdiction and venue are hereby waived.
                </Typography>
            </Container>
        </Box>
    );
}
