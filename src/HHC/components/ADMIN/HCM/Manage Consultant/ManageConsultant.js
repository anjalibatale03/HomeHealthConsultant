
import React, { useState, useEffect } from 'react';

import { Box, Stack } from '@mui/system'
import {
  Button, CardContent, Grid, MenuItem, AppBar, IconButton, InputBase, Modal, Table,
  TableBody, TableContainer, TableHead, TableRow, TextField, Typography,
  Card, TablePagination, Popover, TableCell, CircularProgress, Alert, Snackbar,
} from '@mui/material'
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import HRNavbar from '../../../HR/HRNavbar';
import Footer from '../../../../Footer';


const UserCard = styled(Card)({
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
  },
});

const ManageConsultant = () => {

  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');
  const addedby = localStorage.getItem('clg_id');

  const [openModal, setOpenModal] = useState(false);
  const [openRModal, setOpenRModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [profID, setProfID] = useState('');
  const [profData, setProfData] = useState([]);
  const [remark, setRemark] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [approveRejectStatus, setApproveRejectStatus] = useState();
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenRModal = () => {
    setOpenRModal(true);
  };

  const handleCloseRModal = () => {
    setOpenRModal(false);
    setRemark('');
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const filteredTableData = tableData
    .filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (item.clg_first_name || '').toLowerCase().includes(searchLower) ||
        (item.clg_work_email_id || '').toLowerCase().includes(searchLower) ||
        (item.clg_Work_phone_number ? item.clg_Work_phone_number.toString().toLowerCase().includes(searchLower) : false)
      );
    });

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

 


async function handleConsultantApproval(event, status) {
  event.preventDefault();

  if (!remark.trim()) {
    setSnackbarMessage("Please enter a remark!");
    setSnackbarSeverity("warning");
    setOpenSnackbar(true);
    return;
  }

  const isApproved = status === 1; // 1 = Approve, 2 = Reject
  const url = isApproved
    ? `${port}/hhc_admin/consultant_approve/${profID}/`
    : `${port}/hhc_admin/consultant_reject/${profID}/`;

  const requestData = {
    is_approved: isApproved,
    remark: remark,
  };

  console.log("Submitting:", url, requestData);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      setSnackbarMessage("Failed to submit!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const result = await response.json();
    console.log("Response:", result);

    // ✅ Show success message first
    setSnackbarMessage(
      isApproved
        ? "Consultant approved successfully!"
        : "Consultant rejected successfully!"
    );
    setSnackbarSeverity("success");
    setOpenSnackbar(true);

    // ✅ Close modal
    handleCloseRModal();


    setTimeout(() => {
      FetchConsultantList(); // Refresh the table data
    }, 1000);
  } catch (error) {
    console.error("Error:", error);
    setSnackbarMessage("Something went wrong!");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
  }
}




  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`${port}/hr/company_get/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCompanyList(data);
        } else {
          console.error('Failed to fetch data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchCompany();
  }, [])

   const FetchConsultantList = async () => {
      setLoading(true);
      try {
        const url = `${port}/hhc_admin/consultant_get/`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
             "Authorization": `Bearer ${accessToken}`, 
          },
        });
  
        const data = await response.json();
        console.log("Fetched Consultant Data:", data);
        setTableData(data);
      } catch (error) {
        console.error("Error fetching consultant data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      FetchConsultantList();
    }, []);


    

  return (
    <div>
      <HRNavbar />
      <Box sx={{ flexGrow: 1, ml: 1, mr: 1, }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ fontSize: 16, fontWeight: 600 }} color="text.secondary">
            CONSULTANT LIST
          </Typography>

          <Box
            component="form"
            sx={{
              ml: 2,
              display: 'flex',
              alignItems: 'center',
              width: 300,
              height: '2.5rem',
              backgroundColor: "#F2F2F2",
              boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
              borderRadius: "10px",
              border: "1px solid #C9C9C9"
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Consultant "
              inputProps={{ 'aria-label': 'search user' }}
              value={searchQuery}
              onChange={handleSearch}
            />
            <IconButton type="button" sx={{ p: '10px' }}>
              <SearchIcon sx={{ color: "#7AB7EE" }} />
            </IconButton>
          </Box>

          {/* <Box
            component="form"
            sx={{
              ml: 2,
              display: 'flex',
              alignItems: 'center',
              width: 300,
              height: '2.5rem',
              backgroundColor: "#F2F2F2",
              boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
              borderRadius: "10px",
              border: "1px solid #C9C9C9"
            }}
          >
            <TextField
              id="outlined-select-clg_gender"
              select
              label="Consultant Name"
              name="grp_id"
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
                      maxWidth: '30px',
                    },
                  },
                },
              }}
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              {companyList.map((item) => (
                <MenuItem key={item.company_pk_id} value={item.company_pk_id}>
                  {item.company_name}
                </MenuItem>
              ))}
            </TextField>
          </Box> */}
        </Stack>

        <TableContainer sx={{ height: "68vh" }}>
          <Table >
            <TableHead>
              <TableRow >
                <UserCard style={{ height: '3rem', background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                  <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Sr. No</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Name</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Email ID</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Contact Number</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Service</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1.2, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Action</Typography>
                  </CardContent>
                </UserCard>
              </TableRow>
            </TableHead>

            <TableBody>
              {
                loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredTableData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                      <Typography variant="subtitle1">No data found</Typography>
                    </TableCell>
                  </TableRow>
                ) :
                  (
                    filteredTableData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user, index) => (
                        <TableRow key={user.srv_prof_id}>
                          <UserCard>
                            <CardContent style={{ flex: 0.5 }}>
                              <Typography variant="subtitle2">{index + 1 + page * rowsPerPage}</Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1.5 }}>
                              <Typography variant="subtitle2">{user.clg_first_name || '-'}</Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1.5 }}>
                              <Typography variant="subtitle2">{user.clg_work_email_id || '-'}</Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1 }}>
                              <Typography variant="subtitle2">{user.clg_Work_phone_number || '-'}</Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1 }}>
                              <Typography variant="subtitle2">{user.clg_address || '-'}</Typography>
                            </CardContent>
  <CardContent style={{ flex: 1.2, display: "flex", justifyContent: "center", gap: "6px" }}>

  <Button
    variant="contained"
    sx={{
      flex: 0, // auto width
      minWidth: "80px", // chhota min width
      padding: "4px 8px", // button ke andar padding chhoti
      backgroundColor: "#7AB8EE",
      borderRadius: "10px",
      textTransform: "capitalize",
      fontSize: "12px", // text chhota
    }}
     onClick={() => {
    setProfID(user.id);        // set current consultant ID
    setApproveRejectStatus(1); // 1 = Approve
    handleOpenRModal();
  }}
  >
    Approve
  </Button>

  <Button
    variant="contained"
    sx={{
      flex: 0,
      minWidth: "80px",
      padding: "4px 8px",
      backgroundColor: "#FD7568",
      borderRadius: "10px",
      textTransform: "capitalize",
      fontSize: "12px",
    }}
     onClick={() => {
    setProfID(user.id);
    setApproveRejectStatus(2); // 2 = Reject
    handleOpenRModal();
  }}
  >
    Reject
  </Button>
</CardContent>



                          </UserCard>
                        </TableRow>
                      ))
                  )
              }
            </TableBody>
          </Table>

         

          <Modal
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={openRModal}
            onClose={handleCloseRModal}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: 300,
                height: 220,
                backgroundColor: '#F2F2F2',
                borderRadius: '8px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                padding: '15px',
                overflowY: 'auto'
              }}
            >
              <IconButton sx={{ ml: 25, color: "black" }} onClick={handleCloseRModal}>
                <CloseIcon />
              </IconButton>
              <Grid container spacing={2} sx={{ marginTop: '5px', marginBottom: '10px', width: '100%' }}>
                <Grid item xs={12} sm={12} lg={12}>
                  <TextField
                    id="remark"
                    label="Remark *"
                    name="remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    sx={{
                      '& input': {
                        fontSize: '14px',
                      },
                    }}
                  />
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
                  mt: 2
                }}
                onClick={(e) => handleConsultantApproval(e, approveRejectStatus)}
              >
                Submit
              </Button>

             
            </Box>
          </Modal>

          <TablePagination
            component="div"
            count={filteredTableData.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 100]}
          />
        </TableContainer>
        <Footer />

         <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
              >
                <Alert variant="filled"
                  onClose={handleSnackbarClose}
                  severity={snackbarSeverity}
                  sx={{ width: '100%', mb: 10 }}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
      </Box>
    </div>
  )
}

export default ManageConsultant
