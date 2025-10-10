import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    useMediaQuery,
    Card,
    CardContent,
    Stack,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Paper,
    IconButton,
    TableCell,
    MenuItem,
    Tooltip,
    Modal,
} from "@mui/material";
import { styled } from '@mui/system';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import HRNavbar from '../../HR/HRNavbar';
import DownloadIcon from '@mui/icons-material/Download';

const EnquiryCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "52px",
    borderRadius: '10px',
    transition: '0.3s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
    },
});

const ShiftHandoverReport = () => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [profRequest, setProfRequest] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [searched, setSearched] = useState(false);

    const [open, setOpen] = useState(false);
    const [remarks, setRemarks] = useState([]);
    const handleClose = () => setOpen(false);
    const handleSearch = async () => {
        if (!filterStartDate || !filterEndDate) {
            setProfRequest([]);
            setSearched(true);
            return;
        }

        try {
            setLoading(true);
            setSearched(true);

            const url = `${port}/web/add_task/?task_type=${filterStatus}&st_date=${filterStartDate}&ed_date=${filterEndDate}`;

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = await res.json();

            const formattedData = Array.isArray(data)
                ? data.map((item) => ({
                    date_time: item.added_date || "-",
                    task_name: item.Task || "-",
                    giver_name: item.added_by || "-",
                    receiver_name: item.last_modified_by || "-",
                    remark: item.remark || "-",
                    task_id: item.task_id,
                    is_done: item.is_done,
                }))
                : [];

            setProfRequest(formattedData);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleShiftDetails = async (index, row) => {
        setOpen(true);
        setLoading(true);
        try {
            const response = await fetch(
                `${port}/web/get_task_remarks/${row.task_id}/`
            );
            const data = await response.json();
            setRemarks(data.data);
        } catch (error) {
            console.error("Error fetching remarks:", error);
            setRemarks([]);
        }
        setLoading(false);
    };

    const handleDownload = async () => {
        if (!filterStartDate || !filterEndDate) {
            alert("Please select both Start Date and End Date before downloading.");
            return;
        }

        try {
            setLoading(true);

            const url = `${port}/web/download_tasks_excel/?start_date=${filterStartDate}&end_date=${filterEndDate}&Status=${filterStatus}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to download file");
            }

            // Convert response to Blob for file download
            const blob = await response.blob();
            const urlBlob = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = urlBlob;

            // Suggested filename
            link.download = `Shift_Handover_Report_${filterStartDate}_to_${filterEndDate}.xlsx`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(urlBlob);
        } catch (error) {
            console.error("Error downloading Excel file:", error);
            alert("Error downloading the file. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <HRNavbar />

            <Modal open={open} onClose={handleClose}>
                <div
                    style={{
                        background: "white",
                        padding: "20px",
                        margin: "160px auto",
                        width: "500px",
                        borderRadius: "8px",
                    }}
                >
                    <Typography variant="h6" style={{ marginBottom: "15px" }}>
                        Task Remarks
                    </Typography>

                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                            <CircularProgress />
                        </div>
                    ) : remarks.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Sr No</strong></TableCell>
                                        <TableCell><strong>Status</strong></TableCell>
                                        <TableCell><strong>Added By</strong></TableCell>
                                        <TableCell><strong>Date</strong></TableCell>
                                        <TableCell><strong>Remark</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {remarks.map((item, index) => (
                                        <TableRow key={item.tr_id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.is_done === true ? "Completed" : "Pending"}</TableCell>
                                            <TableCell>{item.added_by}</TableCell>
                                            <TableCell>{item.added_date}</TableCell>
                                            <TableCell>{item.remark}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography>No remarks found.</Typography>
                    )}
                </div>
            </Modal>

            <Box sx={{ flexGrow: 1, mt: 13.8, ml: 1, mb: 2, mr: 1 }}>
                <Stack direction={isSmallScreen ? "column" : "row"} spacing={1} alignItems="center">
                    <Typography
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            marginLeft: "10px",
                        }}
                        color="text.secondary"
                        gutterBottom
                    >
                        SHIFT HANDOVER REPORT
                    </Typography>

                    <TextField
                        type="date"
                        size="small"
                        label="Start Date"
                        InputLabelProps={{ shrink: true }}
                        value={filterStartDate}
                        onChange={(e) => setFilterStartDate(e.target.value)}
                    />
                    <TextField
                        type="date"
                        size="small"
                        label="End Date"
                        InputLabelProps={{ shrink: true }}
                        value={filterEndDate}
                        onChange={(e) => setFilterEndDate(e.target.value)}
                    />
                    <TextField
                        select
                        size="small"
                        label="Status"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        sx={{ width: "150px" }}
                    >
                        <MenuItem value={1}>Completed</MenuItem>
                        <MenuItem value={2}>Pending</MenuItem>
                    </TextField>

                    {/* 🔍 Search Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                        sx={{ height: "40px" }}
                    >
                        Search
                    </Button>

                    {/* ⬇️ Download Button */}
                    <IconButton
                        color="primary"
                        onClick={() => handleDownload()}
                        sx={{ height: "40px" }}
                    >
                        <DownloadIcon />
                    </IconButton>
                </Stack>


                <TableContainer sx={{ height: profRequest.length < 5 ? "60vh" : "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <EnquiryCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0" }}>
                                    <CardContent style={{ flex: 0.2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Date Time</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Task</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Added By</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Modified By</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Status</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 0.4, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Action</Typography>
                                    </CardContent>
                                </EnquiryCard>
                            </TableRow>
                        </TableHead>

                        {loading ? (
                            <Box sx={{ display: 'flex', mt: 20, ml: 80, height: '130px' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableBody>
                                {searched && profRequest.length === 0 ? (
                                    <TableRow>
                                        <CardContent>
                                            <Typography variant="body2">No Data Found</Typography>
                                        </CardContent>
                                    </TableRow>
                                ) : (
                                    profRequest
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const globalIndex = index + page * rowsPerPage;
                                            return (
                                                <TableRow key={globalIndex}>
                                                    <EnquiryCard>
                                                        <CardContent style={{ flex: 0.2 }}>
                                                            <Typography variant="body2">{globalIndex + 1}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1 }}>
                                                            <Typography variant="body2">{row.date_time}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1.2 }}>
                                                            {row.task_name.length > 20 ? (
                                                                <Tooltip title={row.task_name} arrow>
                                                                    <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                                                                        {row.task_name.substring(0, 20)}...
                                                                    </Typography>
                                                                </Tooltip>
                                                            ) : (
                                                                <Typography variant="body2">{row.task_name}</Typography>
                                                            )}
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1 }}>
                                                            <Typography variant="body2">{row.giver_name}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1.2 }}>
                                                            <Typography variant="body2">
                                                                {row.receiver_name && row.receiver_name.trim() !== "" ? row.receiver_name : "-"}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1 }}>
                                                            <Typography variant="body2">
                                                                {row.is_done === true ? "Completed" : "Pending"}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 0.4 }}>
                                                            <IconButton color="primary" onClick={() => handleShiftDetails(globalIndex, row)}>
                                                                <RemoveRedEyeIcon />
                                                            </IconButton>
                                                        </CardContent>
                                                    </EnquiryCard>
                                                </TableRow>
                                            );
                                        })
                                )}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>

                {/* 🔹 Pagination */}
                {profRequest.length > 0 && (
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={profRequest.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                    />
                )}
            </Box>
        </>
    );
};

export default ShiftHandoverReport;
