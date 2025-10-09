import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  RadioGroup,
  FormControlLabel,
  Radio,
  CardContent,
  Divider,
  Autocomplete,
  FormControl,
  FormLabel,
  Card,
  Checkbox,
  IconButton,
  styled,
  Modal,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  TablePagination,
  Snackbar,
  Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Footer from "../../../Footer";

import HRNavbar from "../../HR/HRNavbar";
import { useState, useEffect } from "react";
import { GridAddIcon } from "@mui/x-data-grid";
import AddPhysioMiles from "./AddPhysioMiles";
import { useNavigate } from "react-router-dom";
import Header from "../../../Header";
import MilestoneForm from "./MilestoneForm";

const InsuranceCard = styled(Card)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "10px",
  backgroundColor: "white",
  boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
  height: "55px",
  borderRadius: "10px",
  transition: "0.5s ease-in-out",
  "&:hover": {
    backgroundColor: "#F7F7F7",
  },
});
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  pt: 2,
  px: 4,
  pb: 3,
};
const PhysioMiles = () => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const userGroup = localStorage.getItem("user_group");
  console.log(userGroup, 'userGroup');

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState("");

  const [observership, setObservership] = useState("");
  const [caseDetails, setCaseDetails] = useState("");
  const [observation, setObservation] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [remark, setRemark] = useState("");
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState(null);
  console.log(formData, 'formData fetching');

  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // or 0 if you prefer 0-based index
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage + 1);
  };

  const handleRowsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // reset to page 1 after changing rows per page
  };

  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const paginatedData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewClick1 = (item) => {
    navigate("/AddPhysioMiles", { state: { mode: "view", item } });
  };

  const handleEditClick1 = (item) => {
    navigate("/AddPhysioMiles", { state: { mode: "edit", item } });
  };

  useEffect(() => {
    if (selectedRow) {
      setCaseDetails(selectedRow.case_dtls_complaints || "");
      setObservation(selectedRow.observation || "");
      setRecommendation(selectedRow.recommendation || "");
      setRemark(selectedRow.remark || "");
      setObservership(selectedRow.underwent_observership ?? "");
      // setCallType(""); // if needed
      setSelectedPatient(selectedRow.ptn_name || "");
    }
  }, [selectedRow]);
  useEffect(() => {
    if (formData) {
      setObservership(formData.underwent_observership);
      // setCallType(formData.call_type);
      setCaseDetails(formData.case_dtls_complaints);
      setObservation(formData.observation);
      setRecommendation(formData.recommendation);
      setRemark(formData.remark);
      // other form fields...
    }
  }, [formData]);

  // Modal Code
  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      setSnackbarMessage("Please select both Start Date and End Date");
      setSnackbarOpen(true);
      return;
    }
    try {
      const response = await fetch(
        `${port}/web/Physiotherapy_Milestone_Get_Api/?from_date=${startDate}&to_date=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setTableData(data); // assuming array of records
    } catch (error) {
      console.error("Error fetching Physio milestone data:", error);
    }
  };

  const handleAddPhysioClick = () => {
    navigate("/AddPhysioMiles"); // 👈 goes to new screen
  };

  const handleViewClick = async (pk_id) => {
    setIsViewMode(true); // 👈 View mode (fields disabled)
    setSelectedId(pk_id);
    setOpenModal(true);
    await fetchData(pk_id);
  };

  const handleEditClick = async (pk_id) => {
    setIsEditMode(true);
    setIsViewMode(false); // 👈 Edit mode (fields enabled)
    setSelectedId(pk_id);
    setOpenModal(true);
    await fetchData(pk_id);
  };

  const fetchData = async (pk_id) => {
    try {
      const res = await axios.get(
        `${port}/web/Physiotherapy_Milestone_ID_Wise_Get_Api/${pk_id}/`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      console.log(data, 'fetched data');
      
      setFormData(data);
      setObservership(data.underwent_observership);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  return (
    <div>
      <HRNavbar />
      <Box p={1} sx={{ mt: userGroup === 'physioMilestone' ? '3.5em' : 0, overflowX: "hidden" }}>
        <Grid
          container
          spacing={1}
          alignItems="center"
          justifyContent="flex-start"
          flexWrap="wrap"
        // sx={{ ml: "10px !important" }}
        >
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              // inputProps={{
              //   min: startDate, // This restricts past dates before startDate
              // }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={1.5}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{
                height: "40px",
                backgroundColor: "#69A5EB",
                borderRadius: "10px",
                ":hover": { backgroundColor: "#69A5EB" },
              }}
            >
              Submit
            </Button>
          </Grid>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="warning"
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>

          <Grid
            item
            xs={12}
            sm={6}
            md={6.3}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Box display="flex" justifyContent={{ xs: "center", md: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                // size="small"
                onClick={handleAddPhysioClick}
                startIcon={<GridAddIcon />}
                sx={{
                  borderRadius: "10px",
                  ":hover": { backgroundColor: "#69A5EB" },
                  backgroundColor: "#69A5EB",
                }}
              >
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            height: "100vh", // full height of viewport
            overflow: "hidden", // disables scroll
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
            p: 0.5,
            mt: 0.6,
          }}
        >
          <TableContainer
            sx={{
              flex: 1,
              borderRadius: "15px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
              overflowX: "auto",
            }}
          >
            <Table
              sx={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 6px",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell colSpan={5} sx={{ p: 0 }}>
                    <InsuranceCard
                      style={{
                        background: "#69A5EB",
                        color: "#FFFFFF",
                        borderRadius: "8px 10px 0 0",
                        height: "2.5rem",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <CardContent
                        sx={{
                          flex: 0.5,
                          textAlign: "center",
                          borderRight: "1px solid white",
                        }}
                      >
                        <Typography variant="subtitle2">Sr. No</Typography>
                      </CardContent>
                      <CardContent
                        sx={{
                          flex: 2,
                          textAlign: "center",
                          borderRight: "1px solid white",
                        }}
                      >
                        <Typography variant="subtitle2">Visitor Date</Typography>
                      </CardContent>
                      <CardContent
                        sx={{
                          flex: 2,
                          textAlign: "center",
                          borderRight: "1px solid white",
                        }}
                      >
                        <Typography variant="subtitle2">
                          Professional Name
                        </Typography>
                      </CardContent>
                      <CardContent
                        sx={{
                          flex: 2,
                          textAlign: "center",
                          borderRight: "1px solid white",
                        }}
                      >
                        <Typography variant="subtitle2">
                          Professional Number
                        </Typography>
                      </CardContent>
                      <CardContent
                        sx={{
                          flex: 2,
                          textAlign: "center",
                          borderRight: "1px solid white",
                        }}
                      >
                        <Typography variant="subtitle2">Patient Name</Typography>
                      </CardContent>
                      <CardContent
                        sx={{
                          flex: 2,
                          textAlign: "center",
                          borderRight: "1px solid white",
                        }}
                      >
                        <Typography variant="subtitle2">
                          Patient Number
                        </Typography>
                      </CardContent>

                      {/* <CardContent
                      sx={{
                        flex: 2,
                        textAlign: "center",
                        borderRight: "1px solid white",
                      }}
                    >
                      <Typography variant="subtitle2">Remark</Typography>
                    </CardContent> */}

                      <CardContent sx={{ flex: 2, textAlign: "center" }}>
                        <Typography variant="subtitle2">Actions</Typography>
                      </CardContent>
                    </InsuranceCard>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((row, index) => (
                  <TableRow key={row.pk_id} sx={{ "& td": { border: 0 }, p: 0 }}>
                    <TableCell colSpan={5} sx={{ p: 0 }}>
                      <InsuranceCard
                        style={{
                          height: "3rem",
                          background: "white",
                          borderRadius: "8px",
                          alignItems: "center",
                        }}
                      >
                        <CardContent sx={{ flex: 0.5, textAlign: "center" }}>
                          <Typography variant="body2">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </Typography>
                        </CardContent>
                        <CardContent sx={{ flex: 2, textAlign: "center" }}>
                          {new Date(row.added_date).toLocaleDateString()}
                        </CardContent>
                        <CardContent sx={{ flex: 2, textAlign: "center" }}>
                          <Typography variant="body2">
                            {row.prof_name || "N/A"}
                          </Typography>
                        </CardContent>
                        <CardContent sx={{ flex: 2, textAlign: "center" }}>
                          <Typography variant="body2">
                            {row.prof_number || "N/A"}
                          </Typography>
                        </CardContent>
                        <CardContent sx={{ flex: 2, textAlign: "center" }}>
                          <Typography variant="body2">{row.ptn_name}</Typography>
                        </CardContent>
                        <CardContent sx={{ flex: 2, textAlign: "center" }}>
                          <Typography variant="body2">
                            {row.ptn_number || "Not Assigned"}
                          </Typography>
                        </CardContent>

                        <CardContent
                          sx={{
                            flex: 2,
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            onClick={() => handleViewClick(row.pk_id)}
                            size="small"
                            color="black"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="black"
                            onClick={() => handleEditClick(row.pk_id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </CardContent>

                        <Dialog
                          open={openModal}
                          onClose={() => setOpenModal(false)}
                          maxWidth="sm"
                          fullWidth
                        >
                          <AppBar
                            position="static"
                            elevation={0}
                            sx={{
                              background:
                                "linear-gradient(45deg, #1FD0C4 38.02%, #328EDF 100%)",
                              height: "3rem",
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              px: 2,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 16,
                                color: "white",
                                fontWeight: 600,
                              }}
                            >
                              Quality Audit
                            </Typography>
                            <IconButton
                              onClick={() => setOpenModal(false)}
                              size="small"
                              sx={{ color: "white" }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </AppBar>
                          {/* {selectedRowData && ( */}
                          <MilestoneForm
                            formData={formData}
                            isEditMode={isEditMode}
                            isViewMode={isViewMode}
                            
                            selectedPatient={selectedPatient}
                            selectedPatientID={formData?.patient_name}
                            selectedProfessional={{
                              srv_prof_id: formData?.prof_id,
                              prof_fullname: formData?.prof_name,
                            }}
                            patientName={formData?.ptn_name}
                            selectedId={selectedId}
                            onClose={() => setOpenModal(false)}
                          />

                          {/* )} */}
                        </Dialog>
                      </InsuranceCard>
                      <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={3000}
                        onClose={() => setSnackbarOpen(false)}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                      >
                        <Alert
                          onClose={() => setSnackbarOpen(false)}
                          severity={snackbarSeverity}
                          sx={{ width: "100%" }}
                        >
                          {snackbarText}
                        </Alert>
                      </Snackbar>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={tableData.length} // should be total dataset length, not paginatedData
                rowsPerPage={itemsPerPage}
                page={currentPage - 1}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </Table>
          </TableContainer>
        </Box>
        <Footer />
      </Box>
    </div>
  );
};

export default PhysioMiles;
