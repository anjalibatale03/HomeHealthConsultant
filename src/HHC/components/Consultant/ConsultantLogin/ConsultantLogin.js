
import React, { useState, useEffect, useRef } from 'react';
import logo from "../../../assets/spero_logo_3.png";
import "./ConsultantLogin.css";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import user from "../../../assets/user.png"
import key from "../../../assets/key.png"
import { useAuth } from '../../Context/ContextAPI';
import { Button, Snackbar, CardContent, Alert, CircularProgress, TableCell, Grid, MenuItem, AppBar, IconButton, InputBase, Modal, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography, Card, TablePagination, Popover } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/system';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
export default function ConsultantLogin() {

    const { handleAuth } = useAuth();
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const [login, setLogin] = useState({ clg_ref_id: "", password: "" })
    const [userIdError, setUserIdError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showExistErrorAlert, setShowExistErrorAlert] = useState(false);
    const [showExistErrorAlert1, setShowExistErrorAlert1] = useState(false);
    const [loading, setLoading] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const navigate = useNavigate()

    const handleChange = async (e) => {
        e.preventDefault();

        setUserIdError(login.clg_ref_id === "");
        setPasswordError(login.password === "");

        if (login.clg_ref_id === "" || login.password === "") {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${port}/web/login/`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ clg_ref_id: login.clg_ref_id, password: login.password })
            });
            if (response.status === 401) {
                console.log("Resource not found.");
                setShowExistErrorAlert1(true);
                setTimeout(() => setShowExistErrorAlert1(false), 3000);
            }
            if (response.status === 404) {
                console.log("Resource not found.");
                setShowErrorAlert(true);
                setTimeout(() => setShowErrorAlert(false), 3000);
            }
            else {
                setShowErrorAlert(false);
                const data = await response.json();
                if (data.msg === "User Already Logged In. Please check.") {
                    setShowExistErrorAlert(true);
                    setTimeout(() => setShowExistErrorAlert(false), 3000);
                } else {
                    console.log("Login Credentials.....", data);
                    localStorage.setItem('token', data.token.access);
                    localStorage.setItem('refresh', data.token.refresh);
                    localStorage.setItem('user-image', data.token.colleague.profile_photo_path);
                    localStorage.setItem('user-name', data.token.colleague.first_name);
                    localStorage.setItem('user-lname', data.token.colleague.last_name);
                    localStorage.setItem('user-email', data.token.colleague.email);
                    localStorage.setItem('user-phone', data.token.colleague.phone_no);
                    localStorage.setItem('user-loc', data.token.colleague.address);
                    localStorage.setItem('user-designation', data.token.colleague.designation);
                    localStorage.setItem('clg_id', data.token.colleague.id);
                    localStorage.setItem('hospitalId', data.token.colleague.clg_hosp_id);
                    localStorage.setItem('clgrefId', data.token.colleague.clg_ref_id);
                    localStorage.setItem('user_group', data.token.user_group);
                    localStorage.setItem('permissions', JSON.stringify(data.token.permissions));
                    localStorage.setItem('companyID', data.token.colleague.prof_compny);

                    if (data.token.user_group === "Consultant") {
                        navigate("/hhc/Consultant/Referred Patient");
                        handleAuth();
                        // window.location.reload();
                    }
                }
            }
        } catch (error) {
            console.error("Error during API call:", error);
        } finally {
            setLoading(false);
        }
    };

    const onchange = (e) => {
        const { name, value } = e.target;
        setLogin((prevLogin) => ({
            ...prevLogin,
            [name]: value,
        }));
        if (name === 'clg_ref_id') {
            setUserIdError(false);
        } else if (name === 'password') {
            setPasswordError(false);
        }
    }

    //////// Consulatant Registeration
    const [showRegister, setShowRegister] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [formData, setFormData] = useState({
        clg_ref_id: '',
        clg_first_name: '',
        clg_email: '',
        clg_mobile_no: '',
        clg_gender: '',
        clg_marital_status: '',
        clg_Date_of_birth: '',
        clg_hos_id: '',
        grp_id: 29,
        clg_joining_date: '',
        clg_address: '',
        clg_state: '',
        clg_district: '',
        clg_work_email_id: '',
        clg_Work_phone_number: '',
    });

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
        setOpenSnackbar(false);
    };

    const [cmpData, setCmpData] = useState([]);
    const [state, setState] = useState([]);
    const [referHospital, setReferHospital] = useState([]);

    useEffect(() => {
        const fetchState = async () => {
            try {
                const response = await fetch(`${port}/web/agg_hhc_state_api`, {
                    headers: {
                        "Content-type": "application/json",
                    },
                });
                const data = await response.json();
                console.log("Fetch the State Data", data);

                // ✅ Make sure we set an array
                if (Array.isArray(data)) {
                    setState(data);
                } else if (Array.isArray(data?.states)) {
                    setState(data.states);
                } else if (Array.isArray(data?.data)) {
                    setState(data.data);
                } else {
                    setState([]); // fallback
                }
            } catch (error) {
                console.error("Error fetching state data:", error);
                setState([]);
            }
        };
        fetchState();
    }, []);

    useEffect(() => {
        const getreferHospital = async () => {
            try {
                const res = await fetch(`${port}/web/agg_hhc_hospitals_api_web_form`);
                const data = await res.json();
                console.log("Refer Hospital data", data);
                setReferHospital(data);
            } catch (error) {
                console.error("Error fetching Refer Hospital data:", error);
            }
        };
        getreferHospital();
    }, []);

    const [errors, setErrors] = useState({});
    const debounceRef = useRef(null);

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "clg_ref_id") {
            if (debounceRef.current) clearTimeout(debounceRef.current);

            debounceRef.current = setTimeout(async () => {
                try {
                    const apiUrl = `${port}/hr/clg_is_already_exists/?clg_ref_id=${value}`;
                    const response = await fetch(apiUrl);
                    const data = await response.json();

                    if (response.status === 409) {
                        setSnackbarMessage(data.message || "User with this ID already exists.");
                        setSnackbarSeverity("error");
                        setSnackbarOpen(true);

                        setErrors((prev) => ({
                            ...prev,
                            clg_ref_id: data.message || "User already exists",
                        }));
                    } else if (response.ok) {
                        setErrors((prev) => ({
                            ...prev,
                            clg_ref_id: "",
                        }));
                    } else {
                        setSnackbarMessage(data.message || "Something went wrong.");
                        setSnackbarSeverity("error");
                        setSnackbarOpen(true);
                    }
                } catch {
                    setSnackbarMessage("Error checking user.");
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                }
            }, 400);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.clg_ref_id.trim() ||
            !formData.clg_first_name.trim() ||
            !formData.clg_email.trim() ||
            !formData.clg_mobile_no.trim() ||
            !formData.clg_hos_id ||
            !formData.clg_state
        ) {
            setSnackbarMessage("Please fill all required fields.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        try {
            const formDataToSubmit = {
                ...formData,
                clg_work_email_id: formData.clg_email,
                clg_Work_phone_number: formData.clg_mobile_no,
            };

            let response;

            if (formData.pk) {
                response = await fetch(`${port}/web/Edit_User/${formData.pk}/`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formDataToSubmit),
                });
            } else {
                response = await fetch(`${port}/web/Post_User/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formDataToSubmit),
                });
            }

            if (response.status === 201) {
                setSnackbarMessage("Registered successfully. Credentials sent to email.");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);

                setTimeout(() => {
                    setFormData({
                        clg_ref_id: "",
                        clg_first_name: "",
                        clg_email: "",
                        clg_mobile_no: "",
                        clg_gender: "",
                        clg_marital_status: "",
                        clg_Date_of_birth: "",
                        clg_hos_id: "",
                        grp_id: "",
                        clg_joining_date: "",
                        clg_address: "",
                        clg_state: "",
                        clg_district: "",
                    });
                    setSnackbarOpen(false);

                    setShowRegister(false);
                }, 2000);

            } else if (response.status === 200) {
                setSnackbarMessage("User Data Updated Successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                setTimeout(() => setSnackbarOpen(false), 2000);
            } else if (response.status === 409) {
                const errorData = await response.json();
                setSnackbarMessage(errorData?.message || errorData?.error || "User already exists.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            } else if (response.status === 500) {
                setSnackbarMessage("Internal Server Error!");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            } else {
                const errorData = await response.json();
                setSnackbarMessage(errorData?.error || "Unexpected error occurred");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setSnackbarMessage("Something Went Wrong!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    return (
        <>
            <div className="container">
                <div className="input_fields">
                    {showRegister ? (
                        <>
                            <Grid container spacing={2} sx={{ marginTop: '6em', marginLeft: '1em', marginBottom: '15px', width: '100%' }}>
                                {isSmallScreen ? null : (
                                    <img src={logo} alt="" style={{ height: "100px", width: "160px", marginLeft: '4em' }} />
                                )}
                                <Typography style={{ marginLeft: '3.5em', fontWeight: 'bold', fontSize: '18px', color: '#004C99', marginBottom: '1em' }} >
                                    Consultant Registration
                                </Typography>
                                <Grid container spacing={2} sx={{ width: '100%' }}>
                                    <Grid item xs={12} sm={12}>
                                        <div>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={12}>
                                                    <TextField
                                                        id="userName"
                                                        label="User Name*"
                                                        name="clg_ref_id"
                                                        size="small"
                                                        fullWidth
                                                        value={formData.clg_ref_id}
                                                        onChange={handleRegisterChange}
                                                        sx={{
                                                            '& input': {
                                                                fontSize: '14px',
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12}>
                                                    <TextField
                                                        id="clg_email"
                                                        label="Email ID*"
                                                        name="clg_email"
                                                        size="small"
                                                        fullWidth
                                                        value={formData.clg_email}
                                                        onChange={handleRegisterChange}
                                                        sx={{
                                                            '& input': {
                                                                fontSize: '14px',
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12}>
                                                    <TextField
                                                        id="fullName"
                                                        label="Consultant Full Name*"
                                                        name="clg_first_name"
                                                        size="small"
                                                        fullWidth
                                                        value={formData.clg_first_name}
                                                        onChange={handleRegisterChange}
                                                        sx={{
                                                            '& input': {
                                                                fontSize: '14px',
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12}>
                                                    <TextField
                                                        id="mobileNumber"
                                                        label="Mobile Number*"
                                                        name="clg_mobile_no"
                                                        size="small"
                                                        fullWidth
                                                        value={formData.clg_mobile_no}
                                                        onChange={handleRegisterChange}
                                                        inputProps={{
                                                            maxLength: 10,
                                                            pattern: "[0-9]*",
                                                        }}
                                                        sx={{
                                                            '& input': {
                                                                fontSize: '14px',
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        id="outlined-select-hospital"
                                                        select
                                                        label="Hospital Name*"
                                                        name="clg_hos_id"
                                                        size="small"
                                                        fullWidth
                                                        sx={{
                                                            '& input': {
                                                                fontSize: '14px',
                                                            },
                                                        }}
                                                        SelectProps={{
                                                            MenuProps: {
                                                                PaperProps: {
                                                                    style: {
                                                                        maxHeight: '170px',
                                                                        maxWidth: '200px',
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                        value={formData.clg_hos_id}
                                                        onChange={handleRegisterChange}
                                                    >
                                                        {referHospital.map((item) => (
                                                            <MenuItem key={item.hosp_id} value={item.hosp_id}>
                                                                {item.hospital_name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={12} sm={12}>
                                                    <TextField
                                                        id="clg_state"
                                                        select
                                                        label="State*"
                                                        name="clg_state"
                                                        size="small"
                                                        fullWidth
                                                        value={formData.clg_state}
                                                        onChange={handleRegisterChange}
                                                        sx={{
                                                            '& input': {
                                                                fontSize: '14px',
                                                            },
                                                        }}
                                                    >
                                                        {state.map((item, index) => (
                                                            <MenuItem key={item.state_id} value={item.state_id}
                                                                sx={{ fontSize: "14px" }}>
                                                                {item.state_name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={12} sm={12}>
                                                    <TextField
                                                        id="adress"
                                                        label="Address*"
                                                        name="clg_address"
                                                        size="small"
                                                        fullWidth
                                                        value={formData.address}
                                                        onChange={handleRegisterChange}
                                                        inputProps={{
                                                            maxLength: 10,
                                                            pattern: "[0-9]*",
                                                        }}
                                                        sx={{
                                                            '& input': {
                                                                fontSize: '14px',
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    backgroundColor: '#007bff',
                                    '&:hover': {
                                        backgroundColor: '#0056b3',
                                    },
                                    textTransform: "capitalize",
                                    borderRadius: "10px",
                                    width: "20ch",
                                }}
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                Already have an account?{' '}
                                <span
                                    style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => setShowRegister(false)}
                                >
                                    Login
                                </span>
                            </Typography>
                            <Snackbar
                                open={snackbarOpen}
                                autoHideDuration={3000}
                                onClose={handleSnackbarClose}
                                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                            >
                                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "200%" }}>
                                    {snackbarMessage}
                                </Alert>
                            </Snackbar>
                        </>
                    ) : (
                        <>
                            {isSmallScreen ? null : (
                                <img src={logo} alt="" style={{ height: "110px", width: "160px" }} />
                            )}
                            {showErrorAlert && (
                                <Alert severity="error" variant="filled">Invalid User ID or Password!</Alert>
                            )}
                            {showExistErrorAlert && (
                                <Alert severity="error" variant="filled">User is already logged in!</Alert>
                            )}
                            {showExistErrorAlert1 && (
                                <Alert severity="error" variant="filled">Login Access Denied!</Alert>
                            )}
                            <Box component="form" sx={{ mt: 3, p: "2px 4px", display: 'flex', alignItems: 'center', height: '2.5rem', boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "6px", border: "1px solid gray" }}>
                                <img src={user} alt="" style={{ height: "18px", marginLeft: "8px" }} />
                                <InputBase
                                    sx={{ ml: 2, flex: 1, }}
                                    placeholder="Enter User ID"
                                    name="clg_ref_id"
                                    onChange={onchange}
                                    required
                                    error={userIdError}
                                    helperText={userIdError && "User ID is required"}
                                />
                            </Box>

                            {userIdError && (
                                <Typography variant="body2" color="error" textAlign="left">
                                    User ID is required*
                                </Typography>
                            )}

                            <Box component="form" sx={{ mt: 3, p: "2px 4px", display: 'flex', alignItems: 'center', height: '2.5rem', boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "6px", border: "1px solid gray" }}>
                                <img src={key} alt="" style={{ height: "20px", marginLeft: "8px" }} />
                                <InputBase
                                    sx={{ ml: 1.2, flex: 1, }}
                                    placeholder="Enter Password"
                                    type="password"
                                    name="password"
                                    onChange={onchange}
                                    required
                                    error={passwordError}
                                    helperText={passwordError && "Password is required"}
                                />
                            </Box>
                            {passwordError && (
                                <Typography variant="body2" color="error" textAlign="left">
                                    Password is required*
                                </Typography>
                            )}

                            <Button variant='contained' sx={{ mt: 5, width: '28ch', height: '7vh', backgroundColor: '#69A5EB', borderRadius: "6px", textTransform: "capitalize", }} onClick={handleChange} disabled={loading}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                            </Button>

                            <Typography variant="body2" sx={{ mt: 2 }}>
                                Don't have an account?{' '}
                                <span
                                    style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => setShowRegister(true)}
                                >
                                    Register
                                </span>
                            </Typography>
                            {isSmallScreen ? <img src={logo} alt="" style={{ height: "70px", width: "120px" }} /> : (null)}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

