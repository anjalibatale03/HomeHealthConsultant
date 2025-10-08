import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import health from "../../../assets/healthcare.png";
// import UserNavbar from './UserNavbar';
import Footer from '../../../Footer';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import HRNavbar from '../../HR/HRNavbar';

const ptnStatus = [
    {
        Patient_status_at_present: 1,
        label: 'Home',
    },
    {
        Patient_status_at_present: 2,
        label: 'Hospital',
    },
];

const referby = [
    {
        refer_by: 1,
        label: 'Self',
    },
    {
        refer_by: 2,
        label: 'Hospital',
    },
    {
        refer_by: 3,
        label: 'Other',
    },
];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    pt: 2,
    px: 4,
    pb: 3,
};

const ReferredPatient = () => {
    const navigate = useNavigate();
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const clgId = localStorage.getItem('clg_id');
    if (clgId) {
        console.log("Consultant ID:", clgId);
    } else {
        console.log("No consultant ID found.");
    }
    const [ptnName, setPtnName] = useState('');
    const [ptnNo, setPtnNo] = useState('');
    const [ptnNoError, setPtnNoError] = useState('');
    const [gender, setGender] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');
    const [ptnAge, setPtnAge] = useState(null);
    const [famName, setFamName] = useState('');
    const [famNo, setFamNo] = useState(null);
    const [famNoError, setFamNoError] = useState('');
    const [validationMessage, setValidationMessage] = useState('');
    const [service, setService] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [convertedStartDate, setConvertedStartDate] = useState('');
    const [remark, setRemark] = useState('');
    const [selectedPtnStatus, setSelectedPtnStatus] = useState('');
    const [selectedReferby, setSelectedReferby] = useState('');
    const [consultant, setConsultant] = useState([]);
    const [selectedConsultant, setSelectedConsultant] = useState(null);
    const [consultantNo, setConsultantNo] = useState('');
    const [address, setAddress] = useState('');
    const [referHospital, setReferHospital] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);

    const [callerDetails, setCallerDetails] = useState(null);
    const [patientDetails, setPatientDetails] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedPtnData, setSelectedPtnData] = useState({ ...selectedPatient });
    const [isPopupOpen, setPopupOpen] = useState(false);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    //// HCA Questions ////
    const [questions, setQuestions] = useState([]);
    const [openQuestions, setOpenQuestions] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [showError, setShowError] = useState('');
    console.log("selectedQuestions,....", selectedQuestions)
    const [state, setState] = useState([]);
    const [selectedState, setSelectedState] = useState('');

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

    const handleOpenQuestions = () => setOpenQuestions(true);
    const handleCloseQuestions = () => setOpenQuestions(false);

    const handleSaveQuestions = () => {
        if (selectedQuestions.length === 0) {
            setShowError('Please select at least one question.');
        } else {
            setOpenQuestions(false);
            setShowError('');
        }
    };


    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const [errors, setErrors] = useState({
        famName: '',
        famNo: '',
        ptnName: '',
        ptnNo: '',
        selectedGender: '',
        ptnAge: '',
        remark: '',
        selectedPtnStatus: '',
        selectedReferby: '',
        address: '',
        selectedService: '',
        startDate: '',
        startTime: '',
    });

    const handleEmptyField = () => {
        const newErrors = {};

        if (!famName) {
            newErrors.famName = 'Name is required';
        }
        if (!famNo) {
            newErrors.famNo = 'Mobile No is required';
        }
        if (!ptnName) {
            newErrors.ptnName = 'Name is required';
        }
        if (!ptnNo) {
            newErrors.ptnNo = 'No is required';
        }
        if (!selectedGender) {
            newErrors.selectedGender = 'Gender is required';
        }
        if (!selectedPtnStatus) {
            newErrors.selectedPtnStatus = 'Required';
        }
        if (!ptnAge) {
            newErrors.ptnAge = 'Age is required';
        }
        if (!remark) {
            newErrors.remark = 'Remark is required';
        }
        if (!address) {
            newErrors.address = 'Address is required';
        }
        if (!selectedService) {
            newErrors.selectedService = 'Service is required';
        }
        if (!startDate) {
            newErrors.startDate = 'Start Date is required';
        }
        if (!startTime) {
            newErrors.startTime = 'Start Time is required';
        }
        if (!selectedReferby) {
            newErrors.selectedReferby = 'Required';
        }
        setErrors(newErrors);
        return Object.values(newErrors).some((error) => error !== '');
    };

    const handlePtnNumberChange = (e) => {
        const input = e.target.value;
        const numericValue = input.replace(/[^0-9]/g, '');
        setPtnNo(numericValue);

        if (!numericValue) {
            setPtnNoError('Mobile No is required');
            setErrors({ ...errors, ptnNo: 'Mobile No is required' });
        } else if (!/^[6789]\d{9}$/.test(numericValue)) {
            setPtnNoError('Please enter a valid mobile no');
            setErrors({ ...errors, ptnNo: 'Please enter a valid mobile no' });
        } else if (parseInt(numericValue) < 0) {
            setPtnNoError('Contact No should be a positive number');
            setErrors({ ...errors, ptnNo: 'Mobile No should be a positive number' });
        } else {
            setPtnNoError('');
            setErrors({ ...errors, ptnNo: '' });
        }
    };

    const validateFullName = (name) => {
        const nameRegex = /^[A-Za-z]+( [A-Za-z]+){0,2}$/;
        if (!name) {
            return "Name is required";
        } else if (!nameRegex.test(name)) {
            return "Name accept only characters, Up to 3 spaces";
        }
        return null;
    };

    const handleAgeValidation = (event) => {
        const inputAge = event.target.value;
        const numericValue = inputAge.replace(/\D/g, '');
        setPtnAge(numericValue);

        if (inputAge !== numericValue) {
            setValidationMessage('Age must contain only numbers.');
        } else {
            const parsedAge = parseInt(numericValue, 10);
            if (isNaN(parsedAge)) {
                setValidationMessage('Age must be a no.');
            } else if (parsedAge < 0) {
                setValidationMessage('Age cannot be negative.');
            } else if (parsedAge > 100) {
                setValidationMessage('Age cannot exceed 100.');
            } else {
                setValidationMessage('');
            }
        }
    };

    useEffect(() => {
        const getGender = async () => {
            try {
                const res = await fetch(`${port}/web/agg_hhc_gender_api_web_form`);
                const data = await res.json();
                console.log(data);
                // setGender(data);
                const filteredGender = data.filter(item => item.gender_id === 1 || item.gender_id === 2);
                setGender(filteredGender);
            } catch (error) {
                console.error("Error fetching gender data:", error);
            }
        };
        getGender();
    }, []);

    const handleDropdownService = (event) => {
        const selectedService = event.target.value;
        console.log("Selected Service...", selectedService)
        setSelectedService(selectedService);
        if (selectedService === 3) {
            handleOpenQuestions();
        }
    };

    useEffect(() => {
        const getService = async () => {
            try {
                const res = await fetch(`${port}/web/agg_hhc_services_api_web_form`);
                const data = await res.json();
                console.log("Service Data.........", data);
                setService(data);
            } catch (error) {
                console.error("Error fetching Service Data:", error);
            }
        };
        getService();
    }, []);

    //// HCA Questions ////
    useEffect(() => {
        const getQuestion = async () => {
            console.log("selct service Id", selectedService);
            if (selectedService) {
                console.log("service Id", selectedService);
                try {
                    const res = await fetch(`${port}/web/job_closure_questions_web_form/${selectedService}/`, {
                        headers: {
                            // 'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Qusetions Data", data);
                    setQuestions(data);
                } catch (error) {
                    console.error("Error fetching Qusetions data:", error);
                }
            } else {
                setQuestions([]);
            }
        };
        getQuestion();
    }, [selectedService]);

    const handleCheckboxChange = (event) => {
        const checkedId = parseInt(event.target.name); // Convert to integer
        if (event.target.checked) {
            setSelectedQuestions(prevChecked => [...prevChecked, checkedId]);
        } else {
            setSelectedQuestions(prevChecked => prevChecked.filter(id => id !== checkedId));
        }
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedQuestions(questions.map(question => question.jcq_id));
        } else {
            setSelectedQuestions([]);
        }
    };

    useEffect(() => {
        const getConsultant = async () => {
            try {
                const res = await fetch(`${port}/web/agg_hhc_consultant_api_web_form/`);
                const data = await res.json();
                console.log("Consultant data", data);
                const filteredConsultant = data.filter(option => option.doct_cons_id !== 0);
                setConsultant(filteredConsultant);
            } catch (error) {
                console.error("Error fetching Consultant data:", error);
            }
        };
        getConsultant();
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

    const handleDropdownConsultant = (event) => {
        const selectedValue = event.target.value;
        setSelectedConsultant(selectedValue);

        const selectedConsultantData = consultant.find(consult => consult.doct_cons_id === selectedValue);
        if (selectedConsultantData) {
            setConsultantNo(selectedConsultantData.mobile_no);
        } else {
            setConsultantNo('');
        }
    };

    useEffect(() => {
        if (startDate) {
            const originalStartDate = new Date(startDate);
            const convertedStartDateTime = formatDate(originalStartDate);
            setConvertedStartDate(convertedStartDateTime);
        }
    }, [startDate]);

    const fetchCallerData = () => {
        fetch(`${port}/web/agg_hhc_patient_from_callers_phone_no_web_form/${famNo}`).then((response) => response.json())
            .then((responseData) => {
                console.log("Caller Details Data......", responseData);
                setCallerDetails(responseData.caller);
                console.log("Patient Records......", responseData.patients);
                setPatientDetails(responseData.patients);
            })
            .catch((error) => {
                console.error('No Caller Data Found......:', error);
                setCallerDetails(null);
                setPatientDetails(null);
            });
    };


    useEffect(() => {
        if (famNo && famNo.length === 10) {
            fetchCallerData(famNo);
        }
    }, [famNo]);

    function formatDate(date) {
        return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
    }

    function padNumber(number) {
        return number.toString().padStart(2, '0');
    }

    async function handlePatientForm(event) {
        event.preventDefault();

        // const hasEmptyFields = handleEmptyField();
        // if (hasEmptyFields) {
        //     setOpenSnackbar(true);
        //     setSnackbarMessage('Please fill all required details.');
        //     setSnackbarSeverity('error');
        //     return;
        // }

        const requestData = {
            name: ptnName,
            phone_no: ptnNo,
            gender_id: selectedGender,
            Age: ptnAge,
            caller_fullname: famName,
            phone: famNo,
            refer_by: selectedReferby || 4,
            Patient_status_at_present: selectedPtnStatus,
            hosp_id: selectedHospital,
            preferred_hosp_id: selectedHospital,
            Suffered_from: remark,
            doct_cons_id: selectedConsultant || clgId,
            address: address,
            srv_id: selectedService,
            jb_cl_que: selectedQuestions,
            start_date: convertedStartDate,
            start_time: startTime,
            agg_sp_pt_id: selectedPatient ? selectedPatient.agg_sp_pt_id : null,
        };

        if (callerDetails) {
            requestData.phone = callerDetails.phone;
            requestData.caller_fullname = callerDetails.caller_fullname;
        }

        try {
            const response = await fetch(`${port}/doc_cons/refer_service_const_wise/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestData),
            });

            const result = await response.json();

            if (response.ok) {
                setOpenSnackbar(true);
                setSnackbarMessage('Your form received successfully.');
                setSnackbarSeverity('success');
                console.log("Patient Data submitted:", result);
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // window.location.reload();
        } catch (error) {
            console.error("An error occurred:", error);
            setOpenSnackbar(true);
            setSnackbarMessage('Failed to submit the form.');
            setSnackbarSeverity('error');
        }
    }

    return (
        <>
            <HRNavbar />
            <Grid item xs={12} container spacing={0}>
                <Grid item lg={4} sm={12} xs={12} md={12}>
                    <Box height="100%" display="flex" flexDirection="column">
                        <img src={health} alt="" style={{ width: "100%", height: "100%", borderRadius: "10px", }} />
                    </Box>
                </Grid>
                <Grid item lg={8} sm={12} xs={12} md={12}>
                    <Box display="flex" flexDirection="column" sx={{ backgroundColor: "#FFFFFF", boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: "10px", mt: 1, mr: 1, mb: 2 }}>
                        <Typography variant='h6' sx={{ m: 1 }}>PATIENT DETAILS</Typography>

                        <Grid container spacing={3} sx={{ marginTop: "2px", paddingLeft: "30px", paddingRight: "30px" }}>
                            <>
                                <Grid item lg={6} md={12} sm={12} xs={12}>
                                    <TextField
                                        required
                                        label="Patient Name"
                                        id="name"
                                        name="name"
                                        placeholder="First Name | Last Name *"
                                        value={ptnName}
                                        onChange={(e) => {
                                            const inputName = e.target.value;
                                            setPtnName(inputName);
                                            const validationError = validateFullName(inputName);
                                            setErrors((prevErrors) => ({ ...prevErrors, ptnName: validationError }));
                                        }}
                                        size="small"
                                        fullWidth
                                        sx={{
                                            '& input': {
                                                fontSize: '14px',
                                            },
                                        }}
                                        error={!!errors.ptnName}
                                        helperText={errors.ptnName}
                                    />
                                </Grid>

                                <Grid item lg={6} md={12} sm={12} xs={12}>
                                    <TextField
                                        required
                                        id="phone_no"
                                        name="phone_no"
                                        label="Patient Number"
                                        placeholder="+91 |"
                                        size="small"
                                        fullWidth
                                        value={ptnNo}
                                        onInput={handlePtnNumberChange}
                                        inputProps={{
                                            minLength: 10,
                                            maxLength: 10,
                                        }}
                                        sx={{
                                            '& input': {
                                                fontSize: '14px',
                                            },
                                        }}
                                        error={!!errors.ptnNo}
                                        helperText={errors.ptnNo}
                                    />
                                </Grid>

                                <Grid item lg={6} sm={12} xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} md={6} sm={6}>
                                            <TextField
                                                required
                                                id="gender_id"
                                                name="gender_id"
                                                select
                                                label="Patient Gender"
                                                size="small"
                                                fullWidth
                                                value={selectedGender}
                                                onChange={(e) => setSelectedGender(e.target.value)}
                                                sx={{
                                                    textAlign: "left",
                                                    '& input': {
                                                        fontSize: '14px',
                                                    },
                                                }}
                                                error={!!errors.selectedGender}
                                                helperText={errors.selectedGender}
                                            >
                                                {gender.map((option) => (
                                                    <MenuItem key={option.gender_id} value={option.gender_id}>
                                                        {option.name}
                                                    </MenuItem>
                                                ))}
                                            </ TextField>
                                        </Grid>
                                        <Grid item xs={6} md={6} sm={6}>
                                            <TextField
                                                required
                                                label="Age"
                                                id="age"
                                                name="age"
                                                size="small"
                                                fullWidth
                                                value={ptnAge}
                                                onChange={handleAgeValidation}
                                                error={!!validationMessage || !!errors.ptnAge}
                                                helperText={validationMessage || errors.ptnAge}
                                                inputProps={{
                                                    maxLength: 3,
                                                }}
                                                sx={{
                                                    '& input': {
                                                        fontSize: '14px',
                                                    },
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item lg={6} md={12} sm={12} xs={12}>
                                    <TextField
                                        required
                                        id="srv_id"
                                        name="srv_id"
                                        select
                                        label="Service Required"
                                        placeholder='Select Service'
                                        size="small"
                                        fullWidth
                                        value={selectedService}
                                        onChange={handleDropdownService}
                                        sx={{
                                            textAlign: "left",
                                            '& input': {
                                                fontSize: '14px',
                                            },
                                        }}
                                        SelectProps={{
                                            MenuProps: {
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: '200px',
                                                        maxWidth: '200px',
                                                    },
                                                },
                                            },
                                        }}
                                        error={!!errors.selectedService}
                                        helperText={errors.selectedService}
                                    >
                                        {service.map((option) => (
                                            <MenuItem key={option.srv_id} value={option.srv_id} sx={{ fontSize: "14px" }}>
                                                {option.service_title}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                {/* <Modal
                                    open={openQuestions}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={{
                                        ...style,
                                        width: 350,
                                        height: 550,
                                        borderRadius: "5px",
                                        overflowY: "scroll",
                                        overflowX: "hidden",
                                        scrollbarWidth: 'thin',
                                        '&::-webkit-scrollbar': {
                                            width: '0.2em',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            background: "#DCDCDE",
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: '#7AB8EE',
                                        },
                                        '&::-webkit-scrollbar-thumb:hover': {
                                            background: '#7AB8FF'
                                        }
                                    }}>
                                        <div style={{ display: "flex" }}>
                                            <Typography sx={{ fontSize: 18, fontWeight: 600, }} color="text.secondary" gutterBottom>HCA Questions</Typography>
                                        </div>

                                        <div style={{ marginTop: "10px" }}>
                                            {selectedQuestions.length === 0 && showError && (
                                                <Typography style={{ color: 'red' }}>{showError} *</Typography>
                                            )}
                                            <div>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectedQuestions.length === questions.length}
                                                            onChange={handleSelectAll}
                                                        />
                                                    }
                                                    label="Select All"
                                                    style={{ color: 'blue' }}
                                                />
                                                {questions.map(question => (
                                                    <FormControlLabel
                                                        key={question.jcq_id}
                                                        control={
                                                            <Checkbox
                                                                checked={selectedQuestions.includes(question.jcq_id)}
                                                                onChange={handleCheckboxChange}
                                                                name={question.jcq_id}
                                                            />
                                                        }
                                                        label={question.jcq_question}
                                                    />
                                                ))}
                                            </div>
                                            <Button variant="contained" sx={{ textTransform: "capitalize", ml: 12, width: "20ch", mt: 2 }} onClick={handleSaveQuestions}>Save</Button>
                                        </div>

                                    </Box>
                                </Modal> */}

                                <Grid item lg={6} md={12} sm={12} xs={12}>
                                    <TextField
                                        required
                                        label="Patient Suffering From"
                                        id="Suffered_from"
                                        name="Suffered_from"
                                        placeholder='Remark'
                                        size="small"
                                        fullWidth
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                        sx={{
                                            '& input': {
                                                fontSize: '14px',
                                            },
                                        }}
                                        error={!!errors.remark}
                                        helperText={errors.remark}
                                    />
                                </Grid>
                                <Grid item lg={6} md={12} sm={12} xs={12}>
                                    <Grid container spacing={1}>

                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <TextField
                                                id="clg_state"
                                                select
                                                label="State*"
                                                name="State"
                                                size="small"
                                                fullWidth
                                                value={selectedState}
                                                onChange={(e) => setSelectedState(e.target.value)}
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
                                        {selectedReferby === 2 && (
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Hospital Name"
                                                    id="preferred_hosp_id"
                                                    name="preferred_hosp_id"
                                                    select
                                                    placeholder='Name'
                                                    value={selectedHospital}
                                                    onChange={(e) => setSelectedHospital(e.target.value)}
                                                    // defaultValue={selectedPatient ? selectedPatient.preferred_hosp.hosp_id : selectedHospital}
                                                    // onChange={(e) => selectedPatient ? handleFieldEdit("hosp_id", e.target.value) : setSelectedHospital(e.target.value)}
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        textAlign: "left", '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    SelectProps={{
                                                        MenuProps: {
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: '200px',
                                                                    maxWidth: '200px',
                                                                },
                                                            },
                                                        },
                                                    }}
                                                >
                                                    {referHospital.map((option) => (
                                                        <MenuItem key={option.hosp_id} value={option.hosp_id}
                                                            sx={{ fontSize: "14px", }}>
                                                            {option.hospital_name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>

                                {selectedReferby === 2 ? (
                                    <>
                                        <Grid item lg={6} md={12} sm={12} xs={12}>
                                            <TextField
                                                // required
                                                id="doct_cons_id"
                                                name="doct_cons_id"
                                                select
                                                label="Consultant Name"
                                                size="small"
                                                fullWidth
                                                value={selectedConsultant}
                                                onChange={handleDropdownConsultant}
                                                sx={{
                                                    textAlign: "left",
                                                    '& input': {
                                                        fontSize: '14px',
                                                    },
                                                }}
                                                SelectProps={{
                                                    MenuProps: {
                                                        PaperProps: {
                                                            style: {
                                                                maxHeight: '200px',
                                                                maxWidth: '200px',
                                                            },
                                                        },
                                                    },
                                                }}
                                            // error={!!errors.selectedConsultant}
                                            // helperText={errors.selectedConsultant}
                                            >
                                                {consultant.map((option) => (
                                                    <MenuItem key={option.doct_cons_id} value={option.doct_cons_id} sx={{ fontSize: "14px" }}>
                                                        {option.cons_fullname}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>

                                        <Grid item lg={6} md={12} sm={12} xs={12}>
                                            <TextField
                                                id="doct_cons_phone"
                                                name="doct_cons_phone"
                                                label="Consultant Contact"
                                                placeholder='+91 |'
                                                size="small"
                                                fullWidth
                                                value={consultantNo}
                                                sx={{
                                                    textAlign: "left",
                                                    '& input': {
                                                        fontSize: '14px',
                                                    },
                                                }}
                                            // error={!!errors.consultantNo}
                                            // helperText={errors.consultantNo}
                                            />
                                        </Grid>
                                    </>
                                ) : (null)}


                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <TextField
                                        required
                                        label="Address"
                                        id="address"
                                        name="address"
                                        placeholder='Lane,Area,Street'
                                        size="small"
                                        fullWidth
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        sx={{
                                            '& input': {
                                                fontSize: '14px',
                                            },
                                        }}
                                        error={!!errors.address}
                                        helperText={errors.address}
                                    />
                                </Grid>


                            </>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Button variant="contained" sx={{ mt: 2, mb: 5, width: '30ch', backgroundColor: '#51DDD4', borderRadius: "12px", textTransform: "capitalize", }} type="submit" onClick={handlePatientForm}>Submit</Button>
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Snackbar
                                    open={openSnackbar}
                                    autoHideDuration={6000}
                                    onClose={handleSnackbarClose}
                                >
                                    <Alert variant="filled"
                                        onClose={handleSnackbarClose}
                                        severity={snackbarSeverity}
                                        sx={{ width: '100%', mb: 15 }}
                                    >
                                        {snackbarMessage}
                                    </Alert>

                                </Snackbar>
                            </Grid>

                        </Grid>

                    </Box>
                </Grid>
            </Grid>
            <Footer />
        </>
    )
}

export default ReferredPatient
