import React, { useState } from "react";
import HRNavbar from "../../../HR/HRNavbar";
import {
    Stack,
    Button,
    Typography,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    CardContent,
    Modal,
    Box,
} from "@mui/material";
import Card from "@mui/material/Card";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";

const ManageServiceCard = styled(Card)({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "10px",
    backgroundColor: "white",
    boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
    height: "52px",
    borderRadius: "10px",
    transition: "0.3s ease-in-out",
    "&:hover": {
        backgroundColor: "#F7F7F7",
        cursor: "pointer",
    },
});

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
};

const ConsultantList = () => {
    const [openConsultantModal, setOpenConsultantModal] = useState(false);
    const [openPaymentModal, setOpenPaymentModal] = useState(false);

    return (
        <div>
            <HRNavbar />
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                    sx={{ fontSize: 16, fontWeight: 600, mt: "20px", ml: "10px" }}
                    color="text.secondary"
                    gutterBottom
                >
                    Consultant Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: "auto" }}
                    onClick={() => setOpenConsultantModal(true)}
                >
                    <AddIcon />
                    Add Consultant
                </Button>
            </Stack>

            <TableContainer sx={{ height: "68vh" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <ManageServiceCard
                                style={{
                                    height: "3rem",
                                    background: "#69A5EB",
                                    color: "#FFFFFF",
                                    borderRadius: "8px 10px 0 0",
                                }}
                            >
                                <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                    <Typography variant="subtitle2">Sr. No</Typography>
                                </CardContent>
                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                    <Typography variant="subtitle2">Event Code</Typography>
                                </CardContent>
                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                    <Typography variant="subtitle2">Caller Number</Typography>
                                </CardContent>
                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                    <Typography variant="subtitle2">Consultant Name</Typography>
                                </CardContent>
                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                    <Typography variant="subtitle2">Patient Name</Typography>
                                </CardContent>
                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                    <Typography variant="subtitle2">Patient Number</Typography>
                                </CardContent>
                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                    <Typography variant="subtitle2">Service</Typography>
                                </CardContent>
                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                    <Typography variant="subtitle2">Action</Typography>
                                </CardContent>
                            </ManageServiceCard>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <TableRow>
                            <ManageServiceCard>
                                <CardContent style={{ flex: 0.5 }}>
                                    <Typography variant="subtitle2">1</Typography>
                                </CardContent>
                                <CardContent style={{ flex: 1 }}>
                                    <Typography variant="subtitle2">EVT-001</Typography>
                                </CardContent>
                                <CardContent style={{ flex: 1 }}>
                                    <Typography variant="subtitle2">+1234567890</Typography>
                                </CardContent>
                                <CardContent style={{ flex: 1 }}>
                                    <Typography variant="subtitle2">Dr. John Doe</Typography>
                                </CardContent>
                                <CardContent style={{ flex: 1 }}>
                                    <Typography variant="subtitle2">Jane Smith</Typography>
                                </CardContent>
                                <CardContent style={{ flex: 1 }}>
                                    <Typography variant="subtitle2">+0987654321</Typography>
                                </CardContent>
                                <CardContent style={{ flex: 1 }}>
                                    <Typography variant="subtitle2">Cardiology</Typography>
                                </CardContent>
                                <CardContent style={{ flex: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => setOpenPaymentModal(true)}
                                    >
                                        Payment
                                    </Button>
                                </CardContent>
                            </ManageServiceCard>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Consultant Modal */}
            <Modal open={openConsultantModal} onClose={() => setOpenConsultantModal(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6">Add Consultant</Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        This is where you can add a new consultant.
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 2 }}
                        onClick={() => setOpenConsultantModal(false)}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>

            {/* Payment Modal */}
            <Modal open={openPaymentModal} onClose={() => setOpenPaymentModal(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6">Payment</Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Payment processing details go here.
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 2 }}
                        onClick={() => setOpenPaymentModal(false)}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default ConsultantList;
