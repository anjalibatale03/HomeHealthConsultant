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
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

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
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // For editing
    const [editIndex, setEditIndex] = useState(null);
    const [editRow, setEditRow] = useState({});

    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [remarkModalOpen, setRemarkModalOpen] = useState(false);
    const [modalText, setModalText] = useState("");

    const getProfRequest = async () => {
        try {
            setLoading(true);
            const taskType = filterStatus;
            const stDate = filterStartDate || new Date().toISOString().slice(0, 10);
            const edDate = filterEndDate || new Date().toISOString().slice(0, 10);

            const url = `${port}/web/add_task/?task_type=${taskType}&st_date=${stDate}&ed_date=${edDate}`;

            const res = await fetch(url, {
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
    }, [filterStartDate, filterEndDate, filterStatus]);

    const handleAddShift = () => {
        const isAdding = profRequest.some(row => row.isNew);
        if (isAdding) {
            setSnackbar({
                open: true,
                message: "A task row is already being added.",
                severity: "warning",
            });
            return;
        }

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

    const handleEditClick = (index, row) => {
        setEditIndex(index);
        setEditRow({
            ...row,
            receiver_name: row.receiver_name === "-" ? "" : row.receiver_name,
            remark: row.remark === "-" ? "" : row.remark,
        });
    };

    const [open, setOpen] = useState(false);
    const [remarks, setRemarks] = useState([]);

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

    const handleClose = () => setOpen(false);

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
            <Modal open={open} onClose={handleClose}>
                <div
                    style={{
                        background: "white",
                        padding: "20px",
                        margin: "140px auto",
                        width: "800px",
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
                <Stack
                    direction={isSmallScreen ? "column" : "row"}
                    spacing={1}
                    alignItems={isSmallScreen ? "flex-start" : "center"}
                    sx={{ pt: 1, width: "100%", justifyContent: "space-between", flexWrap: "wrap" }}
                >
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
                            SHIFT HANDOVER
                        </Typography>
                        <TextField
                            type="date"
                            size="small"
                            label="Start Date"
                            InputLabelProps={{ shrink: true }}
                            value={filterStartDate || ""}
                            onChange={(e) => setFilterStartDate(e.target.value)}
                        />
                        <TextField
                            type="date"
                            size="small"
                            label="End Date"
                            InputLabelProps={{ shrink: true }}
                            value={filterEndDate || ""}
                            onChange={(e) => setFilterEndDate(e.target.value)}
                        />
                        <TextField
                            select
                            size="small"
                            label="Status"
                            value={filterStatus || ""}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            sx={{ width: "150px" }}
                        >
                            <MenuItem value={1}>Completed</MenuItem>
                            <MenuItem value={2}>Pending</MenuItem>
                        </TextField>

                    </Stack>

                    <Button
                        variant="contained"
                        onClick={handleAddShift}
                        style={{
                            textTransform: "capitalize",
                            borderRadius: "8px",
                            background: "#1976d2",
                            color: "#fff",
                            marginTop: isSmallScreen ? "10px" : "0",
                        }}
                    >
                        <AddIcon />
                        Add Task
                    </Button>
                </Stack>

                <TableContainer sx={{ height: filteredData.length < 5 ? "60vh" : "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <EnquiryCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0" }}>
                                    <CardContent style={{ flex: 0.2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Date Time</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Task</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Added By</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Remark</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Modified By</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 0.7, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Status</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1 }}>
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
                                                    <EnquiryCard
                                                        style={{
                                                            backgroundColor: row.isNew ? "#ecb6b6" : "white",
                                                            transition: "0.3s ease-in-out",
                                                        }}
                                                    >
                                                        <CardContent style={{ flex: 0.2 }}>
                                                            <Typography variant="body2">
                                                                {globalIndex + 1}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1 }}>
                                                            {row.isNew ? (
                                                               <TextField
  sx={{ width: 200 }}
  type="datetime-local"
  size="small"
  value={
    row.date_time ||
    new Date().toISOString().slice(0, 16) // default current datetime in ISO
  }
  onChange={(e) => handleRowChange(index, "date_time", e.target.value)}
  inputProps={{
    max: new Date().toISOString().slice(0, 16), // restrict to current time
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

                                                        <CardContent style={{ flex: 0.7 }}>
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

                                                        <CardContent style={{ flex: 1 }}>
                                                            {row.isNew ?
                                                                <Button color="primary" onClick={() => handleSubmitNewShift(globalIndex)}>
                                                                    Submit
                                                                </Button>
                                                                :
                                                                (row.is_done === false ? (isEditing ?
                                                                    <Button color="primary" onClick={handleSaveEditRow}>Update</Button>
                                                                    :
                                                                    <IconButton color="yellow" onClick={() => handleEditClick(globalIndex, row)}>
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                )
                                                                    :
                                                                    <IconButton disabled color="yellow" onClick={() => handleEditClick(globalIndex, row)}>
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                )
                                                            }
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
