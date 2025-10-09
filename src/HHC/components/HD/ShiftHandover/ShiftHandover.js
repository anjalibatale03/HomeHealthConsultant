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
    IconButton,
    Snackbar,
    MenuItem,
    Tooltip,
    Modal,
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/system';
import Navbar from '../../../Navbar';
import Footer from '../../../Footer';
import EditIcon from '@mui/icons-material/Edit';

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

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 3,
};

const ShiftHandover = () => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const userName = localStorage.getItem('user-name');
    const userLastName = localStorage.getItem('user-lname');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [profRequest, setProfRequest] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState("");
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // For editing
    const [editIndex, setEditIndex] = useState(null);
    const [editRow, setEditRow] = useState({});

    // Modals
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [remarkModalOpen, setRemarkModalOpen] = useState(false);
    const [modalText, setModalText] = useState("");

    // Fetch shifts from API
    const getProfRequest = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${port}/web/add_task/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await res.json();
            const formattedData = data.map((item) => ({
                date_time: item.added_date || "-",
                task_name: item.Task || "-",
                giver_name: item.added_by || "-",
                receiver_name: item.last_modified_by || "-",
                remark: item.remark || "-",
                task_id: item.task_id,
                is_done: item.is_done,
            }));
            setProfRequest(formattedData);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProfRequest();
    }, []);

    // Add new row in table
    const handleAddShift = () => {
        const newRow = {
            date_time: "",
            task_name: "",
            giver_name: `${userName} ${userLastName}`,
            receiver_name: "",
            remark: "",
            isNew: true,
        };
        setProfRequest((prev) => [newRow, ...prev]);
    };

    const handleRowChange = (index, field, value) => {
        const updated = [...profRequest];
        updated[index][field] = value;
        setProfRequest(updated);
    };

    // Submit new shift via POST
    const handleSubmitNewShift = async (index) => {
        const row = profRequest[index];
        if (!row.task_name || row.task_name.trim() === "") {
            setSnackbar({
                open: true,
                message: "Task Name is required.",
                severity: "error",
            });
            return;
        }
        try {
            setLoading(true);
            const res = await fetch(`${port}/web/add_task/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ Task: row.task_name }),
            });
            if (!res.ok) throw new Error("Failed to add task");
            setSnackbar({
                open: true,
                message: "Shift added successfully!",
                severity: "success",
            });
            await getProfRequest();
        } catch (error) {
            console.error("Error adding shift:", error);
            setSnackbar({
                open: true,
                message: "Error adding shift.",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // Edit handlers
    const handleEditClick = (index, row) => {
        setEditIndex(index);
        setEditRow({
            ...row,
            receiver_name: row.receiver_name === "-" ? "" : row.receiver_name,
            remark: row.remark === "-" ? "" : row.remark,
        });
    };

    const handleEditRowChange = (field, value) => {
        setEditRow(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveEditRow = async () => {
        try {
            setLoading(true);
            await fetch(`${port}/web/add_task/${editRow.task_id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    remark: editRow.remark,
                    is_done: editRow.is_done ?? true,
                }),
            });
            setSnackbar({
                open: true,
                message: "Shift updated successfully!",
                severity: "success",
            });
            setEditIndex(null);
            await getProfRequest();
        } catch (error) {
            console.error("Error updating shift:", error);
            setSnackbar({
                open: true,
                message: "Error updating shift.",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const openModal = (text, type) => {
        setModalText(text);
        if (type === "task") setTaskModalOpen(true);
        else setRemarkModalOpen(true);
    };

    const filteredData = profRequest.filter((row) =>
        filterDate ? row.date_time.startsWith(filterDate) : true
    );

    return (
        <>
            <Navbar />
            <Box sx={{ flexGrow: 1, mt: 12.6, ml: 1, mb: 2, mr: 1 }}>
                <Stack
                    direction={isSmallScreen ? "column" : "row"}
                    spacing={1}
                    alignItems={isSmallScreen ? "center" : "flex-start"}
                    sx={{ pt: 1, width: "100%", justifyContent: "space-between" }}
                >
                    <Typography
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            marginTop: "10px",
                            marginLeft: "10px",
                        }}
                        color="text.secondary"
                        gutterBottom
                    >
                        SHIFT HANDOVER
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={handleAddShift}
                        style={{
                            textTransform: "capitalize",
                            borderRadius: "8px",
                            marginTop: "7px",
                            background: "#1976d2",
                            color: "#fff",
                            marginRight: "8px",
                        }}
                    >
                        Add Shift
                    </Button>
                </Stack>

                <TableContainer sx={{ height: filteredData.length < 5 ? "60vh" : "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <EnquiryCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0" }}>
                                    <CardContent style={{ flex: 0.3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Date Time</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Task</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Giver Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Remark</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Receiver Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Status</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 0.5 }}>
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
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <CardContent>
                                            <Typography variant="body2">No Data Available</Typography>
                                        </CardContent>
                                    </TableRow>
                                ) : (
                                    filteredData
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const globalIndex = index + page * rowsPerPage;
                                            const isEditing = editIndex === globalIndex;
                                            return (
                                                <TableRow key={globalIndex}>
                                                    <EnquiryCard>
                                                        <CardContent style={{ flex: 0.3 }}>
                                                            <Typography variant="body2">
                                                                {globalIndex + 1}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1 }}>
                                                            {row.isNew ? (
                                                                <TextField
                                                                    type="datetime-local"
                                                                    size="small"
                                                                    value={row.date_time || new Date().toISOString().slice(0, 16)}
                                                                    onChange={(e) => handleRowChange(index, "date_time", e.target.value)}
                                                                    inputProps={{
                                                                        max: new Date().toISOString().slice(0, 16),
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Typography variant="body2">{row.date_time}</Typography>
                                                            )}
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1 }}>
                                                            {row.isNew ? (
                                                                <TextField
                                                                    size="small"
                                                                    value={row.task_name}
                                                                    placeholder='Task Name'
                                                                    onChange={(e) => handleRowChange(index, "task_name", e.target.value)}
                                                                />
                                                            ) : row.task_name.length > 15 ? (
                                                                <Tooltip title={row.task_name} arrow>
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{ cursor: 'pointer' }}
                                                                        onClick={() => openModal(row.task_name, "task")}
                                                                    >
                                                                        {row.task_name.substring(0, 15)}...
                                                                    </Typography>
                                                                </Tooltip>
                                                            ) : (
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{ cursor: 'pointer' }}
                                                                    onClick={() => openModal(row.task_name, "task")}
                                                                >
                                                                    {row.task_name}
                                                                </Typography>
                                                            )}
                                                        </CardContent>

                                                        <CardContent style={{ flex: 1 }}>
                                                            <Typography variant="body2">{row.giver_name}</Typography>
                                                        </CardContent>

                                                        <CardContent style={{ flex: 1 }}>
                                                            {isEditing ? (
                                                                <TextField
                                                                    size="small"
                                                                    value={editRow.remark}
                                                                    placeholder="Remark"
                                                                    onChange={e => handleEditRowChange("remark", e.target.value)}
                                                                />
                                                            ) : row.remark.length > 15 ? (
                                                                <Tooltip title={row.remark} arrow>
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{ cursor: 'pointer' }}
                                                                        onClick={() => openModal(row.remark, "remark")}
                                                                    >
                                                                        {row.remark.substring(0, 15)}...
                                                                    </Typography>
                                                                </Tooltip>
                                                            ) : (
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{ cursor: 'pointer' }}
                                                                    onClick={() => openModal(row.remark, "remark")}
                                                                >
                                                                    {row.remark}
                                                                </Typography>
                                                            )}
                                                        </CardContent>

                                                        <CardContent style={{ flex: 1 }}>
                                                            <Typography variant="body2">
                                                                {row.receiver_name && row.receiver_name.trim() !== "" ? row.receiver_name : "-"}
                                                            </Typography>
                                                        </CardContent>

                                                        <CardContent style={{ flex: 1 }}>
                                                            {row.isNew ? (
                                                                <Typography variant="body2">&nbsp;</Typography>
                                                            ) : isEditing ? (
                                                                <TextField
                                                                    select
                                                                    size="small"
                                                                    value={editRow.is_done ? "Completed" : "Pending"}
                                                                    onChange={e => handleEditRowChange("is_done", e.target.value === "Completed")}
                                                                >
                                                                    <MenuItem value="Pending">Pending</MenuItem>
                                                                    <MenuItem value="Completed">Completed</MenuItem>
                                                                </TextField>
                                                            ) : row.is_done ? (
                                                                <Typography variant="body2" color="success.main">Completed</Typography>
                                                            ) : (
                                                                <Typography variant="body2" color="warning.main">Pending</Typography>
                                                            )}
                                                        </CardContent>

                                                        <CardContent style={{ flex: 0.5 }}>
                                                            {row.isNew ? (
                                                                <Button color="primary" onClick={() => handleSubmitNewShift(globalIndex)}>
                                                                    Submit
                                                                </Button>
                                                            ) : (
                                                                row.is_done === false ? (
                                                                    isEditing ? (
                                                                        <Button color="primary" onClick={handleSaveEditRow}>
                                                                            Update
                                                                        </Button>
                                                                    ) : (
                                                                        <IconButton color="primary" onClick={() => handleEditClick(globalIndex, row)}>
                                                                            <EditIcon />
                                                                        </IconButton>
                                                                    )
                                                                ) : null
                                                            )}
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

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </Box>

            {/* Task Modal */}
            <Modal
                open={taskModalOpen}
                onClose={() => setTaskModalOpen(false)}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" mb={2}>Task Details</Typography>
                    <TextField
                        multiline
                        fullWidth
                        rows={4}
                        value={modalText}
                        InputProps={{ readOnly: true }}
                    />
                    <Button sx={{ mt: 2 }} variant="contained" onClick={() => setTaskModalOpen(false)}>Close</Button>
                </Box>
            </Modal>

            {/* Remark Modal */}
            <Modal
                open={remarkModalOpen}
                onClose={() => setRemarkModalOpen(false)}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" mb={2}>Remark Details</Typography>
                    <TextField
                        multiline
                        fullWidth
                        rows={4}
                        value={modalText}
                        InputProps={{ readOnly: true }}
                    />
                    <Button sx={{ mt: 2 }} variant="contained" onClick={() => setRemarkModalOpen(false)}>Close</Button>
                </Box>
            </Modal>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Footer />
        </>
    );
};

export default ShiftHandover;
