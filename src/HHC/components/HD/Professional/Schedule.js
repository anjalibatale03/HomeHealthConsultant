import React, { useState, useEffect, useRef } from 'react';
import { useMediaQuery, TableCell, CircularProgress, Grid, Box, Card, CardContent, Stack, Typography, Button, Table, TableBody, TableContainer, TableHead, TableRow, TablePagination, IconButton, InputBase } from '@mui/material';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import CalendarComponent from './calendar/CalendarComponent';
import Navbar from '../../../Navbar';
import Footer from '../../../Footer';
import HDChat from './HDChat';
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import ChatIcon from '@mui/icons-material/Chat';
import { Badge } from '@mui/material';
import { MenuItem, TextField } from '@mui/material';
import notificationMp3 from '../../../assets/mixkit-software-interface-start-2574.wav'
import hiImage from '../../../assets/image (15).png'
// import hiImage from '../../../assets/146681075-group-of-people-chatting-online-mobile-app-messenger-cellphone-screen-with-friends-talking-by.jpg'

const ScheduleCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "52px",
    borderRadius: '10px',
    transition: '2s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        // cursor: 'pointer',
    },
});
const ScheduleCard1 = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    pr: 1,
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "45px",
    borderRadius: '10px',
    transition: '2s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        // cursor: 'pointer',
    },
});

const Schedule = () => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const notificationSoundRef = useRef(new Audio(notificationMp3));
    const clgId = localStorage.getItem('clg_id');
    console.log(clgId, 'loginId');
    const [value, setValue] = useState(dayjs('2023-05-30'));
    const [tabIndex, setTabIndex] = useState(1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(7);
    const [professionalList, setProfessionalList] = useState([]);
    const [professionalListChat, setProfessionalListChat] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [prevUrl, setPrevUrl] = useState(null);

    const [selectedProfessional, setSelectedProfessional] = useState('');
    const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
    const [selectedProfessionalEvents, setSelectedProfessionalEvents] = useState([]);

    const [viewProfList, setViewProfList] = useState([]);

    const [selectedProfName, setselectedProfName] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState([]);
    const [selectedServicee, setSelectedServicee] = useState('');

    useEffect(() => {
        const getService = async () => {
            try {
                const res = await fetch(`${port}/web/agg_hhc_services_api`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                setServices(data);
            } catch (error) {
                console.error("Error fetching service data:", error);
            }
        };
        getService();
    }, []);

    const handleServiceChangee = (event) => {
        setSelectedServicee(event.target.value);
        getProfessionalListForChat();
    };

    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleProfChange = (e) => {
        setselectedProfName(e.target.value);
        setPage(0);
        getProfessionalListForChat();
    };

    const handleServiceChange = (e) => {
        setSelectedService(e.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [rowsPerPageChat, setRowsPerPageChat] = useState(5);
    const [pageChat, setPageChat] = useState(0);
    const [selectedProfessionalForChat, setSelectedProfessionalForChat] = useState(null);
    console.log(selectedProfessionalForChat, 'selectedProfessionalForChat');

    const [profClgId, setProfClgId] = useState(null);
    const [selectedProfessionalName, setSelectedProfessionalName] = useState("");

    useEffect(() => {
        const getProfessionalList = async () => {
            try {
                // const res = await fetch(`${port}/web/agg_hhc_event_professional_api/`);
                const res = await fetch(`${port}/web/agg_hhc_event_professional_api/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Professional Data.........", data);
                // setProfessionalList(data);
                // setLoading(false);
                if (data["not found"] === "Record not found") {
                    setProfessionalList([]);
                    setLoading(false);
                } else {
                    setProfessionalList(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching Profession Data:", error);
                setLoading(false);
            }
        };
        getProfessionalList();
    }, []);

    // const getProfessionalListForChat = async () => {
    //     try {
    //         let url = `${port}/web/prof_list_msg_count_wise/${rowsPerPageChat}/`;

    //         const params = [];
    //         if (selectedProfName.trim()) {
    //             params.push(`prof_name=${encodeURIComponent(selectedProfName.trim())}`);
    //         }
    //         if (selectedServicee) {
    //             params.push(`srv_id=${encodeURIComponent(selectedServicee)}`);
    //         }

    //         if (params.length > 0) {
    //             url += `?${params.join("&")}`;
    //         }

    //         console.log("Hitting URL:", url); // ✅ Debugging

    //         const res = await fetch(url, {
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         const data = await res.json();

    //         if (data["not found"] === "Record not found") {
    //             setProfessionalListChat([]);
    //         } else {
    //             // 🔁 Only update if data is different
    //             setProfessionalListChat((prevList) => {
    //                 const prevJSON = JSON.stringify(prevList);
    //                 const newJSON = JSON.stringify(data.results);
    //                 return prevJSON === newJSON ? prevList : data.results;
    //             });
    //             setNextUrl(data.next);
    //             setPrevUrl(data.previous);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     }
    // };

    const getProfessionalListForChat = async (customUrl = null) => {
        try {
            let url = customUrl || `${port}/web/prof_list_msg_count_wise/${rowsPerPageChat}/`;

            const params = [];
            if (selectedProfName.trim()) {
                params.push(`prof_name=${encodeURIComponent(selectedProfName.trim())}`);
            }
            if (selectedServicee) {
                params.push(`srv_id=${encodeURIComponent(selectedServicee)}`);
                
            }

            // Only append filters if it's not a custom pagination URL
            if (!customUrl && params.length > 0) {
                url += `?${params.join("&")}`;
            }

            console.log("Hitting URL:", url); // ✅ Debug

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            if (data["not found"] === "Record not found") {
                setProfessionalListChat([]);
            } else {
                setProfessionalListChat((prevList) => {
                    const prevJSON = JSON.stringify(prevList);
                    const newJSON = JSON.stringify(data.results);
                    return prevJSON === newJSON ? prevList : data.results;
                });

                setNextUrl(data.next);
                setPrevUrl(data.previous);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const [currentChatUrl, setCurrentChatUrl] = useState(null);

    useEffect(() => {
        if (!currentChatUrl || !currentChatUrl.includes('?page=')) {
            const interval = setInterval(() => {
                getProfessionalListForChat();
            }, 3000);
            return () => clearInterval(interval);
        }
        return undefined;
    }, [rowsPerPageChat, selectedServicee, selectedProfName, currentChatUrl]);


    // useEffect(() => {
    //     getProfessionalListForChat();
    // }, [rowsPerPageChat, selectedServicee, selectedProfName]);


    const handleEventSelect = (professionalID) => {
        if (professionalList.length > 0) {
            const selectedProfessional = professionalList.find((item) => item.srv_prof_id === professionalID);
            if (selectedProfessional) {
                setSelectedProfessional(selectedProfessional.srv_prof_id);
                console.log("Selected Professional.....>>>", selectedProfessional.srv_prof_id);
            } else {
                console.log("Professional not found.");
            }
        } else {
            console.log("Professional list is empty.");
        }
    };

    useEffect(() => {
        const getProfessionalEvent = async () => {
            if (selectedProfessional) {
                const currentSelectedProfessional = selectedProfessional;
                console.log("currentSelectedProfessional Id......>>>", currentSelectedProfessional);
                try {
                    const res = await fetch(`${port}/web/agg_hhc_detailed_event_plan_of_care/?pro=${currentSelectedProfessional}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Professional Against All Events......", data);
                    // setSelectedProfessionalEvents(data)
                    // setIsEventDetailsModalOpen(true);
                    if (data === 'not found') {
                        setSelectedProfessionalEvents([]);
                        setIsEventDetailsModalOpen(false);
                    } else {
                        setSelectedProfessionalEvents(data);
                        setIsEventDetailsModalOpen(true);
                    }
                } catch (error) {
                    console.error("Error fetching Professional All Events:", error);
                }
            }
            else {
                setSelectedProfessionalEvents([]);
                setIsEventDetailsModalOpen(false);
            }
        };
        getProfessionalEvent();
    }, [selectedProfessional]);

    useEffect(() => {
        const getViewProfList = async () => {
            try {
                const res = await fetch(`${port}/web/total_services/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("View Professional.........", data);
                setViewProfList(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching View Professional:", error);
                setLoading(false);
            }
        };
        getViewProfList();
    }, []);
    

    function filterProfessionals(list, selectedProfName, selectedService) {
  const profNameSearch = (selectedProfName || '').trim().toLowerCase();
  const serviceSearch = (selectedService || '').trim().toLowerCase();

  return list.filter((item) => {
    const profName = (item.prof_fullname || '').toLowerCase();
    const serviceId = (item.srv_id || '').toLowerCase();

    return (
      (profNameSearch === '' || profName.includes(profNameSearch)) &&
      (serviceSearch === '' || serviceId.includes(serviceSearch))
    );
  });
}

// Now just call it for each list:
const filteredData = filterProfessionals(professionalList, selectedProfName, selectedService);
const filteredDataChat = filterProfessionals(professionalListChat, selectedProfName, selectedService);
const viewFilteredData = filterProfessionals(viewProfList, selectedProfName, selectedService);


    const [chatCount, setChatCount] = useState(null);
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio(notificationMp3);
        audioRef.current.load();

        const fetchChatCount = async () => {
            try {
                const response = await fetch(`${port}/web/all_msg_counts/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (data && typeof data.count === 'number') {

                    if (chatCount !== null && data.count > chatCount) {
                        try {
                            audioRef.current.currentTime = 0;
                            await audioRef.current.play();
                            console.log("🔔 Notification sound played!");
                        } catch (err) {
                            console.warn("🔇 Sound play blocked:", err);
                        }
                        setCurrentChatUrl(null); 
                        getProfessionalListForChat(`${port}/web/prof_list_msg_count_wise/${rowsPerPageChat}/`);
                    }

                    setChatCount(data.count);
                }
            } catch (error) {
                console.error("Failed to fetch chat count:", error);
            }
        };

        const interval = setInterval(fetchChatCount, 3000);
        return () => clearInterval(interval);
    }, [chatCount, port, accessToken, rowsPerPageChat, getProfessionalListForChat]);

    return (
        <>
            <Navbar />
            <Box sx={{ flexGrow: 1, mt: 14.6, mb: 2, ml: 1, mr: 1, }}>
                <div>
                    <div>
                        <Grid item xs={12} container spacing={1}>
                            {
                                tabIndex === 1 && (
                                    <Grid item xs={12} container spacing={0}>
                                        <Grid item lg={7} md={6} xs={12}>
                                            <Grid container direction="column">
                                                <Grid item xs={12}>
                                                    <Box
                                                        sx={{
                                                            background: "#F5F5F5",
                                                            // height: "100%",
                                                            // minHeight: "150px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            borderRadius: "8px",
                                                        }}
                                                    >
                                                        <Stack direction={isSmallScreen ? 'column' : 'row'}
                                                            spacing={1}
                                                            alignItems={isSmallScreen ? 'center' : 'flex-start'} sx={{ pt: 1 }}>
                                                            <Box
                                                                component="form"
                                                                sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 220, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                                                            >
                                                                <InputBase
                                                                    sx={{ ml: 1, flex: 1, }}
                                                                    placeholder="Search Service |"
                                                                    inputProps={{ 'aria-label': 'select service' }}
                                                                    value={selectedService}
                                                                    onChange={handleServiceChange}
                                                                    
                                                                />
                                                                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                                                    <SearchIcon style={{ color: "#7AB7EE" }} />
                                                                </IconButton>
                                                            </Box>

                                                            <Box
                                                                component="form"
                                                                sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 240, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                                                            >
                                                                <InputBase
                                                                    sx={{ ml: 1, flex: 1 }}
                                                                    placeholder="Search Professional Name |"
                                                                    inputProps={{ 'aria-label': 'search professional' }}
                                                                    value={selectedProfName}
                                                                    onChange={handleProfChange}
                                                                />
                                                                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                                                    <SearchIcon style={{ color: "#7AB7EE" }} />
                                                                </IconButton>
                                                            </Box>

                                                            <Button variant="outlined" style={{ textTransform: "capitalize", borderRadius: "8px", marginLeft: "20px", height: "2.6rem", backgroundColor: tabIndex === 1 ? '#347B89' : 'inherit', color: tabIndex === 1 ? '#FFFFFF' : 'inherit', }} onClick={() => setTabIndex(1)}>Schedule List</Button>
                                                            <Button
                                                                variant="outlined"
                                                                style={{
                                                                    textTransform: "capitalize",
                                                                    borderRadius: "50%",
                                                                    width: "45px",
                                                                    height: "45px",
                                                                    marginLeft: "10px",
                                                                    backgroundColor: "rgb(37, 211, 102)",
                                                                    color: "#fff",
                                                                    minWidth: "0",
                                                                    padding: "0"
                                                                }}
                                                                onClick={() => {
                                                                    setTabIndex(2);
                                                                    getProfessionalListForChat();
                                                                }}
                                                            >
                                                                <Badge
                                                                    badgeContent={chatCount}
                                                                    color="error"
                                                                    overlap="circular"
                                                                    invisible={chatCount === 0}
                                                                >
                                                                    <ChatIcon style={{ height: 25, width: 25 }} />
                                                                </Badge>
                                                            </Button>
                                                        </Stack>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <TableContainer
                                                        sx={{
                                                            height:
                                                                filteredData.length === 0 || filteredData.length < 5
                                                                    ? "45vh"
                                                                    : "auto",
                                                        }}
                                                    >
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <ScheduleCard
                                                                        style={{
                                                                            background: "#e7bb74ff",
                                                                            color: "#FFFFFF",
                                                                            borderRadius: "8px 10px 0 0",
                                                                        }}
                                                                    >
                                                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                                            <Typography variant="subtitle2">Professional Name</Typography>
                                                                        </CardContent>
                                                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                                            <Typography variant="subtitle2">Service Name</Typography>
                                                                        </CardContent>
                                                                        <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                                            <Typography variant="subtitle2">Home Zone</Typography>
                                                                        </CardContent>
                                                                        <CardContent style={{ flex: 1 }}>
                                                                            <Typography variant="subtitle2">Type</Typography>
                                                                        </CardContent>
                                                                    </ScheduleCard>
                                                                </TableRow>
                                                            </TableHead>
                                                            {loading ? (
                                                                <TableBody>
                                                                    <TableRow>
                                                                        <TableCell colSpan={4} align="center">
                                                                            <CircularProgress />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            ) : (
                                                                <TableBody>
                                                                    {filteredData.length === 0 ? (
                                                                        <TableRow>
                                                                            <TableCell colSpan={4} align="center">
                                                                                No Data Available
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ) : (
                                                                        filteredData
                                                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                            .map((row) => (
                                                                                <TableRow
                                                                                    key={row.first_name}
                                                                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                                                                >
                                                                                    <ScheduleCard>
                                                                                        <CardContent
                                                                                            onClick={() => handleEventSelect(row.srv_prof_id)}
                                                                                            style={{
                                                                                                flex: 3,
                                                                                                borderLeft:
                                                                                                    selectedProfessional === row.srv_prof_id
                                                                                                        ? "3px solid #e7bb74ff"
                                                                                                        : "none",
                                                                                                height: "40px",
                                                                                                display: "flex",
                                                                                                alignItems: "center",
                                                                                                cursor: "pointer",
                                                                                            }}
                                                                                        >
                                                                                            <Typography variant="body2" textAlign="left">
                                                                                                {row.prof_fullname}
                                                                                            </Typography>
                                                                                        </CardContent>
                                                                                        <CardContent style={{ flex: 2 }}>
                                                                                            <Typography variant="body2" textAlign="left">
                                                                                                {row.srv_id}
                                                                                            </Typography>
                                                                                        </CardContent>
                                                                                        <CardContent style={{ flex: 1 }}>
                                                                                            <Typography variant="body2">
                                                                                                {row.prof_zone_id || "-"}
                                                                                            </Typography>
                                                                                        </CardContent>
                                                                                        <CardContent style={{ flex: 1 }}>
                                                                                            <Typography variant="body2">
                                                                                                {row.Job_type === 1
                                                                                                    ? "On Call"
                                                                                                    : row.Job_type === 2
                                                                                                        ? "Full Time"
                                                                                                        : row.Job_type === 3
                                                                                                            ? "Part Time"
                                                                                                            : "-"}
                                                                                            </Typography>
                                                                                        </CardContent>
                                                                                    </ScheduleCard>
                                                                                </TableRow>
                                                                            ))
                                                                    )}
                                                                </TableBody>
                                                            )}
                                                        </Table>
                                                    </TableContainer>

                                                    <TablePagination
                                                    sx={{overflowY:'hidden'}}
                                                        rowsPerPageOptions={[7, 25, 100]}
                                                        component="div"
                                                        count={filteredData.length}
                                                        rowsPerPage={rowsPerPage}
                                                        page={page}
                                                        onPageChange={handleChangePage}
                                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item lg={5} md={6} xs={12} sx={{ marginTop: "7px" }}>
                                            <Card sx={{ backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px" }}>
                                                <div style={{ paddingTop: "20px", paddingLeft: "5px", paddingRight: "5px", paddingBottom: "5px" }}>
                                                    <CalendarComponent events={selectedProfessionalEvents} />
                                                </div>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                )
                            }

                            {
                                tabIndex === 2 && (
                                    <Grid item xs={12} container spacing={0}>
                                        <Grid item lg={8} md={6} xs={12}>
                                            <Grid container direction="column">
                                                <Grid item xs={12}>
                                                    <Stack direction={isSmallScreen ? 'column' : 'row'}
                                                        spacing={1}
                                                        alignItems={isSmallScreen ? 'center' : 'flex-start'} sx={{ pt: 1 }}>
                                                        {/* <TextField
                                                            select
                                                            value={selectedServicee}
                                                            onChange={handleServiceChangee}
                                                            variant="standard"
                                                            fullWidth
                                                            InputProps={{
                                                                disableUnderline: true,
                                                            }}
                                                            sx={{
                                                                width: 220,
                                                                backgroundColor: '#ffffff',
                                                                borderRadius: '10px',
                                                                border: '1px solid #C9C9C9',
                                                                padding: '0 8px',
                                                                fontSize: '14px',
                                                                '& .MuiSelect-select': {
                                                                    padding: '8px 0',
                                                                    fontSize: '14px',
                                                                    color: selectedServicee === '' ? '#9e9e9e' : 'inherit',
                                                                },
                                                            }}
                                                        >
                                                            <MenuItem value="" disabled>
                                                                Select
                                                            </MenuItem>
                                                            {services.map((service) => (
                                                                <MenuItem key={service.srv_id} value={service.srv_id}>
                                                                    {service.service_title}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField> */}

                                                        <TextField
                                                            id="srv_id"
                                                            name="srv_id"
                                                            select
                                                            label="Select Service"
                                                            value={selectedServicee}
                                                            onChange={handleServiceChangee}
                                                            size="small"
                                                            fullWidth
                                                            sx={{
                                                                textAlign: "left",
                                                                "& input": {
                                                                    fontSize: "14px",
                                                                },
                                                                maxWidth: "200px",
                                                            }}
                                                            SelectProps={{
                                                                MenuProps: {
                                                                    PaperProps: {
                                                                        style: {
                                                                            padding: '8px 0',
                                                                            maxHeight: "200px",
                                                                            maxWidth: "200px",
                                                                        },
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            {services.map((service) => (
                                                                <MenuItem key={service.srv_id} value={service.srv_id}>
                                                                    {service.service_title}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>

                                                        <Box
                                                            component="form"
                                                            sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 240, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                                                        >
                                                            <InputBase
                                                                sx={{ ml: 1, flex: 1 }}
                                                                placeholder="Search Professional Name |"
                                                                inputProps={{ 'aria-label': 'search professional' }}
                                                                value={selectedProfName}
                                                                onChange={handleProfChange}
                                                            />
                                                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                                                <SearchIcon style={{ color: "#7AB7EE" }} />
                                                            </IconButton>
                                                        </Box>

                                                        <Button variant="outlined" style={{ textTransform: "capitalize", borderRadius: "8px", marginLeft: "20px", height: "2.6rem", backgroundColor: tabIndex === 1 ? '#347B89' : 'inherit', color: tabIndex === 1 ? '#FFFFFF' : 'inherit', }} onClick={() => setTabIndex(1)}>Schedule List</Button>
                                                        <Button
                                                            variant="outlined"
                                                            style={{
                                                                textTransform: "capitalize",
                                                                borderRadius: "50%",
                                                                width: "45px",
                                                                height: "45px",
                                                                marginLeft: "10px",
                                                                backgroundColor: "rgb(37, 211, 102)",
                                                                color: "#fff",
                                                                minWidth: "0",
                                                                padding: "0"
                                                            }}
                                                            onClick={() => setTabIndex(2)}
                                                        >
                                                            <Badge
                                                                badgeContent={chatCount}
                                                                color="error"
                                                                overlap="circular"
                                                                invisible={chatCount === 0}
                                                            >
                                                                <ChatIcon style={{ color: "#fff" }} />
                                                            </Badge>
                                                        </Button>
                                                    </Stack>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <TableContainer
                                                        sx={{
                                                            maxHeight: '80vh',
                                                            height:
                                                                filteredData.length === 0 || filteredData.length < 5
                                                                    ? "58vh"
                                                                    : "auto",
                                                            overflowY: "auto"
                                                        }}
                                                    >
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <ScheduleCard
                                                                        style={{
                                                                            background: " #f2b655ff",
                                                                            color: "#FFFFFF",
                                                                            borderRadius: "8px 10px 0 0",
                                                                        }}
                                                                    >
                                                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                                            <Typography variant="subtitle2">Professional Name</Typography>
                                                                        </CardContent>
                                                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                                            <Typography variant="subtitle2">Service Name</Typography>
                                                                        </CardContent>
                                                                        <CardContent
                                                                            style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                                                                        >
                                                                            <Typography variant="subtitle2" >
                                                                                Professional Contact
                                                                            </Typography>
                                                                        </CardContent>
                                                                        <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                                            <Typography variant="subtitle2">Type</Typography>
                                                                        </CardContent>
                                                                        <CardContent style={{ flex: 0.8 }}>
                                                                            Message
                                                                        </CardContent>
                                                                    </ScheduleCard>
                                                                </TableRow>
                                                            </TableHead>
                                                            {loading ? (
                                                                <TableBody>
                                                                    <TableRow>
                                                                        <TableCell colSpan={4} align="center">
                                                                            <CircularProgress />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            ) : (
                                                                <TableBody>
                                                                    {filteredDataChat.length === 0 ? (
                                                                        <TableRow>
                                                                            <TableCell colSpan={4} align="center">
                                                                                No Data Available
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ) : (
                                                                        filteredDataChat
                                                                            .map((row) => (
                                                                                <TableRow
                                                                                    key={row.first_name}
                                                                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                                                                    onClick={() => {
                                                                                        console.log("Row clicked:", row);
                                                                                        console.log("srv_prof_id:", row.srv_prof_id);
                                                                                        console.log("professionalList:", professionalList);
                                                                                        setProfClgId(row.prof_clg_id);
                                                                                        setSelectedProfessionalForChat(row.srv_prof_id);
                                                                                        handleEventSelect(row.srv_prof_id);
                                                                                        setSelectedProfessionalName(row.prof_fullname);
                                                                                    }}
                                                                                >
                                                                                    <ScheduleCard1>
                                                                                        <CardContent
                                                                                            // onClick={() => handleEventSelect(row.srv_prof_id)}
                                                                                            style={{
                                                                                                flex: 3,
                                                                                                borderLeft:
                                                                                                    selectedProfessional === row.srv_prof_id
                                                                                                        ? "3px solid #f2b655ff"
                                                                                                        : "none",
                                                                                                height: "40px",
                                                                                                display: "flex",
                                                                                                alignItems: "center",
                                                                                                cursor: "pointer",
                                                                                            }}
                                                                                        >
                                                                                            <Typography variant="body2" textAlign="left">
                                                                                                {row.prof_fullname}
                                                                                            </Typography>
                                                                                        </CardContent>
                                                                                        <CardContent style={{ flex: 2 }}>
                                                                                            <Typography variant="body2" textAlign="left">
                                                                                                {row.srv_id}
                                                                                            </Typography>
                                                                                        </CardContent>
                                                                                        <CardContent style={{ flex: 2 }}>
                                                                                            <div style={{ display: "flex" }}>
                                                                                                <LocalPhoneOutlinedIcon
                                                                                                    sx={{ color: "#FD7568", fontSize: "20px" }}
                                                                                                />
                                                                                                <Typography variant="body2">
                                                                                                    +91 {row.phone_no}
                                                                                                </Typography>
                                                                                            </div>
                                                                                        </CardContent>
                                                                                        <CardContent style={{ flex: 1 }}>
                                                                                            <Typography variant="body2">
                                                                                                {row.Job_type === 1
                                                                                                    ? "On Call"
                                                                                                    : row.Job_type === 2
                                                                                                        ? "Full Time"
                                                                                                        : row.Job_type === 3
                                                                                                            ? "Part Time"
                                                                                                            : "-"}
                                                                                            </Typography>
                                                                                        </CardContent>

                                                                                        {row.msg_count > 0 ? (
                                                                                            <CardContent style={{ flex: 0.8 }}>
                                                                                                <Typography
                                                                                                    variant="body2"
                                                                                                    style={{
                                                                                                        backgroundColor: "#25D366",
                                                                                                        color: "#fff",
                                                                                                        padding: "2px 8px",
                                                                                                        borderRadius: "50px",
                                                                                                        fontWeight: 500,
                                                                                                        display: "inline-block",
                                                                                                        minWidth: 10,
                                                                                                        textAlign: "center",
                                                                                                    }}
                                                                                                >
                                                                                                    {row.msg_count}
                                                                                                </Typography>
                                                                                            </CardContent>
                                                                                        )
                                                                                            :
                                                                                            (
                                                                                                <CardContent style={{ flex: 0.8 }}>
                                                                                                </CardContent>
                                                                                            )
                                                                                        }
                                                                                    </ScheduleCard1>
                                                                                </TableRow>
                                                                            ))
                                                                    )}
                                                                </TableBody>
                                                            )}
                                                        </Table>
                                                    </TableContainer>
                                                </Grid>
                                                {/* <TablePagination
                                                    rowsPerPageOptions={[5, 25, 50, 100]}
                                                    component="div"
                                                    count={-1}
                                                    rowsPerPage={rowsPerPageChat}
                                                    page={pageChat}
                                                    onPageChange={(e, newPage) => {
                                                        if (newPage > pageChat && nextUrl) {
                                                            setPageChat(newPage);
                                                            getProfessionalListForChat(nextUrl); // ✅ next works
                                                        } else if (newPage < pageChat && prevUrl) {
                                                            setPageChat(newPage);
                                                            getProfessionalListForChat(prevUrl); // ✅ prev works
                                                        }
                                                    }}
                                                    onRowsPerPageChange={(event) => {
                                                        const newRows = parseInt(event.target.value, 10);
                                                        setRowsPerPageChat(newRows);
                                                        setPageChat(0);
                                                        // Force fresh call with filters & updated row count
                                                        getProfessionalListForChat(`${port}/web/prof_list_msg_count_wise/${newRows}/`);
                                                    }}
                                                    labelDisplayedRows={() => ''}
                                                    sx={{
                                                        '.MuiTablePagination-displayedRows': {
                                                            display: 'none',
                                                        },
                                                    }}
                                                /> */}
                                                {/* <TablePagination
                                                    rowsPerPageOptions={[5, 25, 50, 100]}
                                                    component="div"
                                                    count={-1}
                                                    rowsPerPage={rowsPerPageChat}
                                                    page={pageChat}
                                                    onPageChange={(e, newPage) => {
                                                        if (newPage > pageChat && nextUrl) {
                                                            setPageChat(newPage);
                                                            getProfessionalListForChat(nextUrl); // Only call paginated URL
                                                        } else if (newPage < pageChat && prevUrl) {
                                                            setPageChat(newPage);
                                                            getProfessionalListForChat(prevUrl); // Only call paginated URL
                                                        }
                                                    }}
                                                    onRowsPerPageChange={(event) => {
                                                        const newRows = parseInt(event.target.value, 10);
                                                        setRowsPerPageChat(newRows);
                                                        setPageChat(0);
                                                        getProfessionalListForChat(`${port}/web/prof_list_msg_count_wise/${newRows}/`);
                                                    }}
                                                    labelDisplayedRows={() => ''}
                                                    sx={{
                                                        '.MuiTablePagination-displayedRows': {
                                                            display: 'none',
                                                        },
                                                    }}
                                                /> */}
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 25, 50, 100]}
                                                    component="div"
                                                    count={-1}
                                                    rowsPerPage={rowsPerPageChat}
                                                    page={pageChat}
                                                    onPageChange={(e, newPage) => {
                                                        if (newPage > pageChat && nextUrl) {
                                                            setPageChat(newPage);
                                                            setCurrentChatUrl(nextUrl); // Track paginated URL
                                                            getProfessionalListForChat(nextUrl);
                                                        } else if (newPage < pageChat && prevUrl) {
                                                            setPageChat(newPage);
                                                            setCurrentChatUrl(prevUrl); // Track paginated URL
                                                            getProfessionalListForChat(prevUrl);
                                                        }
                                                    }}
                                                    onRowsPerPageChange={(event) => {
                                                        const newRows = parseInt(event.target.value, 10);
                                                        setRowsPerPageChat(newRows);
                                                        setPageChat(0);
                                                        setCurrentChatUrl(null); // Reset to first page
                                                        getProfessionalListForChat(`${port}/web/prof_list_msg_count_wise/${newRows}/`);
                                                    }}
                                                    labelDisplayedRows={() => ''}
                                                    sx={{
                                                        '.MuiTablePagination-displayedRows': {
                                                            display: 'none',
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* <Grid item lg={4} md={6} xs={12} sx={{ marginTop: "7px" }}>
                                            <div>
                                                <HDChat setProfessionalListChat={setProfessionalListChat} getProfessionalListForChat={getProfessionalListForChat} selectedId={selectedProfessionalForChat} selectedProfessionalName={selectedProfessionalName} filteredData={viewFilteredData} profClgId={profClgId} />
                                            </div>
                                        </Grid> */}
                                        <Grid item lg={4} md={6} xs={12} sx={{ marginTop: "7px" }}>
                                            <div>
                                                {selectedProfessionalForChat ? (
                                                    <HDChat
                                                        setProfessionalListChat={setProfessionalListChat}
                                                        getProfessionalListForChat={getProfessionalListForChat}
                                                        selectedId={selectedProfessionalForChat}
                                                        selectedProfessionalName={selectedProfessionalName}
                                                        filteredData={viewFilteredData}
                                                        profClgId={profClgId}
                                                    />
                                                ) : (
                                                    <div style={{ textAlign: "center" }}>
                                                        <img src={hiImage} alt="Hi" style={{ width: "26.2em", height: '28em', border: 'none' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </Grid>

                                    </Grid>
                                )
                            }
                        </Grid>
                    </div>
                </div>

                {/* <div>
                    {
                        tabIndex === 2 && (
                            <div>
                                <ProfessionalList viewProfList={viewProfList} loading={loading} filteredData={viewFilteredData} />
                            </div>
                        )
                    }
                </div> */}
            </Box>
            <Footer />
        </>
    )
}

export default Schedule
