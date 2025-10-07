import { useEffect, useState } from "react";
import HRNavbar from "../../HR/HRNavbar";
import { styled } from "@mui/system";
import Card from "@mui/material/Card";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Box from "@mui/material/Box";
import Footer from "../../../Footer";
import { Snackbar, Alert } from "@mui/material";
import {
  Button,
  CardContent,
  IconButton,
  InputBase,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Modal,
  CircularProgress,
  TableCell,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Stack } from "@mui/system";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";

const EmployeeCard = styled(Card)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "10px",
  marginRight: "10px",
  backgroundColor: "white",
  boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
  height: "43px",
  borderRadius: "10px",
  transition: "0.5s ease-in-out",
  "&:hover": {
    backgroundColor: "#F7F7F7",
    cursor: "pointer",
  },
  fontWeight: "200",
});

const Patientblacklist = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [value, setValue] = useState("1");
  const [remark, setRemark] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const filteredEmployees = employees.filter(
  (emp) =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.hhc_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.phone_no?.toString().toLowerCase().includes(searchTerm.toLowerCase())
);
  const fetchEmployees = async () => {
    setLoading(true);

    let url = `${port}/hhc_admin/get_patient_list/`;
    if (value === "2") {
      url = `${port}/hhc_admin/patient_blacklist_api/1/`;
    } else if (value === "3") {
      url = `${port}/hhc_admin/patient_blacklist_api/2/`;
    }

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [accessToken, port, value]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  useEffect(() => {
    setPage(0); // Reset to first page on new search term
  }, [searchTerm]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //   const handleConfirm = async () => {
  //     if (!selectedEmployee) return;

  //     const payload = {
  //       employee_id: selectedEmployee.id,
  //       is_blacklisted: !selectedEmployee.is_blacklisted,
  //       remark: remark,
  //     };

  //     try {
  //       const response = await fetch(`${port}/hhc_admin/patient_blacklist_api/`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       });

  //       if (response.ok) {
  //         console.log("Updated successfully");
  //       } else {
  //         console.error("API error");
  //       }
  //     } catch (error) {
  //       console.error("Network error", error);
  //     }

  //     setOpenModal(false);
  //     setRemark("");
  //   };

  const handleConfirm = async () => {
    if (!selectedEmployee) return;

    const isBlacklisted = selectedEmployee.is_blacklisted === 1;
    const url = `${port}/hhc_admin/${
      isBlacklisted ? "patient_whitelist_api" : "patient_blacklist_api"
    }/`;

    const payload = {
      agg_sp_pt_id: selectedEmployee.agg_sp_pt_id,
      [isBlacklisted ? "whitelist_remark" : "blacklist_remark"]: remark,
      is_blocklisted: isBlacklisted ? 2 : 1,
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const successMsg = isBlacklisted
        ? "Patient moved to whitelist successfully."
        : "Patient moved to blacklist successfully.";

      if (res.ok) {
        setSnackbarMsg(successMsg);
        setSnackbarSeverity("success");
        fetchEmployees(); // Refresh data
      } else {
        throw new Error("Failed to update patient status.");
      }
    } catch (err) {
      console.error("Error:", err);
      setSnackbarMsg(err.message || "Network error. Please try again.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
      setOpenModal(false);
      setRemark("");
    }
  };

  return (
    <div>
      <HRNavbar />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>

      <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mt: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              marginTop: "20px",
              marginLeft: "10px",
            }}
            color="text.secondary"
            gutterBottom
          >
            Patient Blacklist
          </Typography>
          <Box
            component="form"
            sx={{
              marginLeft: "2rem",
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: "250px",
              height: "2.5rem",
              backgroundColor: "#ffffff",
              boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
              borderRadius: "10px",
              border: "1px solid #C9C9C9",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Patient |"
              inputProps={{ "aria-label": "search patient" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton type="button" sx={{ p: "10px" }}>
              <SearchIcon style={{ color: "#7AB7EE" }} />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              typography: "body1",
              background: "#FFFFFF",
              borderRadius: "10px",
              width: "18rem",
              height: "2.8rem",
              display: "flex",
              justifyContent: "center",
              marginLeft: "8px",
              marginRight: "8px",
            }}
          >
            <TabContext value={value}>
              <TabList
                className="tab-root"
                onChange={handleChange}
                textColor="#51DDD4"
                sx={{ position: "relative" }}
                TabIndicatorProps={{
                  style: {
                    background: "#69A5EB",
                    height: "36px",
                    marginBottom: "8px",
                    borderRadius: "10px",
                  },
                }}
              >
                <Tab
                  label={
                    <span
                      style={{
                        fontSize: "15px",
                        textTransform: "capitalize",
                        color: value === "1" ? "#ffffff" : "black",
                      }}
                    >
                      All
                    </span>
                  }
                  value="1"
                  sx={{ position: "relative", zIndex: 1 }}
                />
                <Tab
                  label={
                    <span
                      style={{
                        fontSize: "15px",
                        textTransform: "capitalize",
                        color: value === "2" ? "#ffffff" : "black",
                      }}
                    >
                      Blacklist
                    </span>
                  }
                  value="2"
                  sx={{ position: "relative", zIndex: 1 }}
                />
                <Tab
                  label={
                    <span
                      style={{
                        fontSize: "15px",
                        textTransform: "capitalize",
                        color: value === "3" ? "#ffffff" : "black",
                      }}
                    >
                      Whitelist
                    </span>
                  }
                  value="3"
                  sx={{ position: "relative", zIndex: 1 }}
                />
              </TabList>
            </TabContext>
          </Box>
        </Stack>

        <TableContainer sx={{ height: "67vh" }}>
          <Table>
            <TableHead>
              <TableRow>
                <EmployeeCard
                  style={{
                    background: "#69A5EB",
                    color: "#FFFFFF",
                    borderRadius: "8px 10px 0 0",
                    height: "3rem",
                  }}
                >
                  <CardContent
                    style={{ flex: 0.8, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Sr No</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">HHC Code</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 4, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Patient Name</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Gender</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Patient Email</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Patient Number</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Action</Typography>
                  </CardContent>
                </EmployeeCard>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ py: 2 }}
                    >
                      No Patient Data Found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                (rowsPerPage > 0
                  ? filteredEmployees.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredEmployees
                ).map((employee, index) => (
                  <TableRow key={employee.id}>
                    <EmployeeCard
                      style={{
                        mb: 5,
                        background: "white",
                        color: "rgba(0, 0, 0, 0.87)",
                        fontWeight: "100",
                        borderRadius: "8px 10px 8px 8px",
                      }}
                    >
                      <CardContent
                        style={{ flex: 0.8, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2">
                          {index + 1 + page * rowsPerPage}
                        </Typography>
                      </CardContent>
                      <CardContent
                        style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2">
                          {employee.hhc_code}
                        </Typography>
                      </CardContent>
                      <CardContent
                        style={{ flex: 4, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2">
                          {employee.name}
                        </Typography>
                      </CardContent>
                      <CardContent
                        style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2">
                          {employee.gender_id === 1
                            ? "Male"
                            : employee.gender_id === 2
                            ? "Female"
                            : ""}
                        </Typography>
                      </CardContent>
                      <CardContent
                        style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2">
                          {employee.patient_email_id || "-"}
                        </Typography>
                      </CardContent>
                      <CardContent
                        style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2">
                          {employee.phone_no || "-"}
                        </Typography>
                      </CardContent>
                      <CardContent
                        style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}
                      >
                        <Typography variant="subtitle2" sx={{ mt: "10px" }}>
                          {employee.is_blacklisted === 1 ? (
                            <HighlightOffIcon
                              style={{ color: "red", cursor: "pointer" }}
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setRemark("");
                                setOpenModal(true);
                                console.log("employeeemployee:", employee);
                              }}
                            />
                          ) : (
                            <CheckCircleIcon
                              style={{ color: "green", cursor: "pointer" }}
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setOpenModal(true);
                                console.log("employeeemployee:", employee);
                              }}
                            />
                          )}
                        </Typography>
                      </CardContent>
                    </EmployeeCard>
                  </TableRow>
                ))
              )}
            </TableBody>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 30, 50]}
              component="div"
              count={filteredEmployees.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Table>
        </TableContainer>
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {selectedEmployee?.is_blacklisted === 1
              ? "Are you sure you want to whitelist this patient?"
              : "Are you sure you want to blacklist this patient?"}
          </Typography>

          <TextField
            fullWidth
            label="Remark"
            variant="outlined"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
            <Button
              onClick={() => setOpenModal(false)}
              variant="outlined"
              color="error"
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Footer />
    </div>
  );
};

export default Patientblacklist;
